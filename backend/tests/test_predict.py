import io
from PIL import Image
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def create_dummy_image(color="green", size=(100, 100), fmt="JPEG") -> bytes:
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=fmt)
    return buf.getvalue()

def test_predict_success():
    img_bytes = create_dummy_image(color="green")
    response = client.post(
        "/api/v1/predict",
        data={"cropId": "platano", "plantPart": "leaf"},
        files={"image": ("test_leaf.jpg", img_bytes, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "prediction" in data
    assert "model" in data
    
    pred = data["prediction"]
    assert "diseaseId" in pred
    assert "diseaseName" in pred
    assert 0.0 <= pred["confidence"] <= 1.0
    assert pred["severity"] in ["low", "moderate", "high", "severe"]

    model = data["model"]
    assert model["mode"] in ["mock", "model", "gemini", "hybrid"]
    assert "disclaimer" in model
    assert "no sustituye la evaluación de un profesional agrícola" in model["disclaimer"]

def test_predict_coffee_stem():
    img_bytes = create_dummy_image(color="brown")
    response = client.post(
        "/api/v1/predict",
        data={"cropId": "cafe", "plantPart": "stem"},
        files={"image": ("test_stem.jpg", img_bytes, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"]["diseaseId"] in ["antracnosis_cafe", "roya_cafe", "ojo_de_gallo_cafe"]

def test_predict_invalid_plant_part():
    img_bytes = create_dummy_image()
    response = client.post(
        "/api/v1/predict",
        data={"cropId": "platano", "plantPart": "raiz_invalida"},
        files={"image": ("test.jpg", img_bytes, "image/jpeg")}
    )
    assert response.status_code == 422

def test_predict_invalid_mime():
    response = client.post(
        "/api/v1/predict",
        data={"cropId": "platano", "plantPart": "leaf"},
        files={"image": ("test.txt", b"not an image", "text/plain")}
    )
    assert response.status_code == 400
    assert "Formato no permitido" in response.json()["detail"]

def test_predict_empty_file():
    response = client.post(
        "/api/v1/predict",
        data={"cropId": "platano", "plantPart": "leaf"},
        files={"image": ("test.jpg", b"", "image/jpeg")}
    )
    assert response.status_code == 400
    assert "vacío" in response.json()["detail"]
