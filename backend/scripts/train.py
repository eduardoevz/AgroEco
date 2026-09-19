"""
Script de entrenamiento de red neuronal convolucional (MobileNetV3) para clasificación
de 20 enfermedades fitosanitarias en 6 cultivos agrícolas con PyTorch y Transfer Learning.
"""

import os
import sys
import json
import time
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from torchvision.models import MobileNet_V3_Small_Weights

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
TRAIN_DIR = DATA_DIR / "train"
VAL_DIR = DATA_DIR / "val"
WEIGHTS_DIR = BASE_DIR / "app" / "services" / "ai" / "weights"
MODEL_PATH = WEIGHTS_DIR / "crop_disease_mobilenet.pt"
CLASSES_MAP_PATH = WEIGHTS_DIR / "class_indices.json"

def main():
    print("=" * 65)
    print("  AGROECO AI: ENTRENAMIENTO DE RED NEURONAL FITOSANITARIA")
    print("=" * 65)

    WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[ENTORNO] Dispositivo de ejecucion: {device}")
    if device.type == "cpu":
        torch.set_num_threads(os.cpu_count() or 4)
        print(f"[ENTORNO] Hilos CPU configurados: {torch.get_num_threads()}")

    # 1. Transformaciones de Imagen (Normalización ImageNet)
    train_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    val_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # 2. Cargar Datasets
    print("\n[DATOS] Cargando conjuntos de entrenamiento y validacion...")
    train_dataset = datasets.ImageFolder(str(TRAIN_DIR), transform=train_transforms)
    val_dataset = datasets.ImageFolder(str(VAL_DIR), transform=val_transforms)

    classes = train_dataset.classes
    num_classes = len(classes)
    print(f"[DATOS] Clases detectadas: {num_classes}")
    print(f"[DATOS] Muestras de entrenamiento: {len(train_dataset)}")
    print(f"[DATOS] Muestras de validacion:    {len(val_dataset)}")

    # Guardar mapeo de clases
    class_to_idx = train_dataset.class_to_idx
    idx_to_class = {v: k for k, v in class_to_idx.items()}
    with open(CLASSES_MAP_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "idx_to_class": idx_to_class,
            "class_to_idx": class_to_idx,
            "classes": classes,
            "num_classes": num_classes,
        }, f, indent=2, ensure_ascii=False)
    print(f"[INFO] Mapeo de indices guardado en: {CLASSES_MAP_PATH.name}")

    batch_size = 32
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    # 3. Cargar Modelo Pre-entrenado MobileNetV3-Small
    print("\n[MODELO] Inicializando MobileNetV3-Small con pesos preentrenados ImageNet...")
    weights = MobileNet_V3_Small_Weights.DEFAULT
    model = models.mobilenet_v3_small(weights=weights)

    # Congelar capas convolucionales iniciales para preservar filtros visuales
    for param in model.features[:-3].parameters():
        param.requires_grad = False

    # Modificar cabezal de clasificación para nuestras 20 clases
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Dropout(p=0.2),
        nn.Linear(in_features, num_classes)
    )
    model = model.to(device)

    # 4. Optimizador, Criterio y Scheduler
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3, weight_decay=1e-4)
    epochs = 10
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    best_val_acc = 0.0
    start_time = time.time()

    print(f"\n[ENTRENAMIENTO] Iniciando ciclo de {epochs} epocas...")
    print("-" * 65)

    for epoch in range(1, epochs + 1):
        epoch_start = time.time()
        
        # Modo Entrenamiento
        model.train()
        train_loss = 0.0
        train_correct = 0
        total_train = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            train_correct += torch.sum(preds == labels.data).item()
            total_train += labels.size(0)

        scheduler.step()
        train_loss = train_loss / total_train
        train_acc = (train_correct / total_train) * 100.0

        # Modo Validación
        model.eval()
        val_loss = 0.0
        val_correct = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                val_correct += torch.sum(preds == labels.data).item()
                total_val += labels.size(0)

        val_loss = val_loss / total_val
        val_acc = (val_correct / total_val) * 100.0
        epoch_time = time.time() - epoch_start

        is_best = val_acc > best_val_acc
        if is_best:
            best_val_acc = val_acc
            torch.save(model, MODEL_PATH)

        status_flag = "[NUEVO MEJOR]" if is_best else ""
        print(f"  Epoca {epoch:02d}/{epochs:02d} [{epoch_time:.1f}s] - Train Loss: {train_loss:.4f} | Acc: {train_acc:.1f}% || Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.1f}% {status_flag}")

    total_time = time.time() - start_time
    print("-" * 65)
    print(f"\n[EXITO] Entrenamiento completado en {total_time:.1f} segundos.")
    print(f"[RESULTADO] Mejor Precision de Validacion (Accuracy): {best_val_acc:.2f}%")
    print(f"[GUARDADO] Modelo guardado en: {MODEL_PATH}")
    print(f"[TAMANO]   Tamano del archivo de pesos: {MODEL_PATH.stat().st_size / (1024 * 1024):.2f} MB")

if __name__ == "__main__":
    main()
