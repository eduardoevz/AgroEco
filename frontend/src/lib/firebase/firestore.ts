import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, isDemoMode } from './config';
import {
  Farm,
  Plot,
  Crop,
  Disease,
  Diagnosis,
  FollowUp,
  DiagnosisStatus,
  DashboardMetrics,
} from '@/types';
import {
  INITIAL_CROPS,
  INITIAL_DISEASES,
  INITIAL_FARMS,
  INITIAL_PLOTS,
  INITIAL_DIAGNOSES,
  INITIAL_FOLLOWUPS,
} from '@/demo/mockData';

// Claves de almacenamiento local para modo offline / demo
const LS_FARMS = 'agroeco_farms';
const LS_PLOTS = 'agroeco_plots';
const LS_CROPS = 'agroeco_crops';
const LS_DISEASES = 'agroeco_diseases';
const LS_DIAGNOSES = 'agroeco_diagnoses';
const LS_FOLLOWUPS = 'agroeco_followups';

function getLocalData<T>(key: string, initial: T[]): T[] {
  if (typeof window === 'undefined') return initial;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initial;
  }
}

function setLocalData<T>(key: string, data: T[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// ==================== FINCAS (FARMS) ====================

export async function getFarms(ownerId: string): Promise<Farm[]> {
  if (isDemoMode || !db) {
    const list = getLocalData<Farm>(LS_FARMS, INITIAL_FARMS);
    return list.filter((f) => f.ownerId === ownerId || f.ownerId === 'demo-producer-1');
  }

  const q = query(
    collection(db, 'farms'),
    where('ownerId', '==', ownerId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Farm))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function getFarmById(farmId: string): Promise<Farm | null> {
  if (isDemoMode || !db) {
    const list = getLocalData<Farm>(LS_FARMS, INITIAL_FARMS);
    return list.find((f) => f.id === farmId) || null;
  }

  const snap = await getDoc(doc(db, 'farms', farmId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Farm) : null;
}

export async function createFarm(data: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm> {
  const now = new Date().toISOString();
  const id = 'farm-' + Date.now();
  const newFarm: Farm = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  if (isDemoMode || !db) {
    const list = getLocalData<Farm>(LS_FARMS, INITIAL_FARMS);
    list.unshift(newFarm);
    setLocalData(LS_FARMS, list);
    return newFarm;
  }

  await setDoc(doc(db, 'farms', id), newFarm);
  return newFarm;
}

export async function updateFarm(farmId: string, data: Partial<Farm>): Promise<void> {
  const updatedAt = new Date().toISOString();

  if (isDemoMode || !db) {
    const list = getLocalData<Farm>(LS_FARMS, INITIAL_FARMS);
    const idx = list.findIndex((f) => f.id === farmId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedAt };
      setLocalData(LS_FARMS, list);
    }
    return;
  }

  await updateDoc(doc(db, 'farms', farmId), { ...data, updatedAt });
}

export async function deleteFarm(farmId: string): Promise<void> {
  if (isDemoMode || !db) {
    let list = getLocalData<Farm>(LS_FARMS, INITIAL_FARMS);
    list = list.filter((f) => f.id !== farmId);
    setLocalData(LS_FARMS, list);
    return;
  }

  await deleteDoc(doc(db, 'farms', farmId));
}

// ==================== PARCELAS (PLOTS) ====================

export async function getPlotsByFarm(farmId: string): Promise<Plot[]> {
  if (isDemoMode || !db) {
    const list = getLocalData<Plot>(LS_PLOTS, INITIAL_PLOTS);
    return list.filter((p) => p.farmId === farmId);
  }

  const q = query(
    collection(db, 'plots'),
    where('farmId', '==', farmId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Plot))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function getPlotsByOwner(ownerId: string): Promise<Plot[]> {
  if (isDemoMode || !db) {
    const list = getLocalData<Plot>(LS_PLOTS, INITIAL_PLOTS);
    return list.filter((p) => p.ownerId === ownerId || p.ownerId === 'demo-producer-1');
  }

  const q = query(collection(db, 'plots'), where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Plot))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

export async function createPlot(data: Omit<Plot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plot> {
  const now = new Date().toISOString();
  const id = 'plot-' + Date.now();
  const newPlot: Plot = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  if (isDemoMode || !db) {
    const list = getLocalData<Plot>(LS_PLOTS, INITIAL_PLOTS);
    list.unshift(newPlot);
    setLocalData(LS_PLOTS, list);
    return newPlot;
  }

  await setDoc(doc(db, 'plots', id), newPlot);
  return newPlot;
}

export async function updatePlot(plotId: string, data: Partial<Plot>): Promise<void> {
  const updatedAt = new Date().toISOString();

  if (isDemoMode || !db) {
    const list = getLocalData<Plot>(LS_PLOTS, INITIAL_PLOTS);
    const idx = list.findIndex((p) => p.id === plotId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedAt };
      setLocalData(LS_PLOTS, list);
    }
    return;
  }

  await updateDoc(doc(db, 'plots', plotId), { ...data, updatedAt });
}

export async function deletePlot(plotId: string): Promise<void> {
  if (isDemoMode || !db) {
    let list = getLocalData<Plot>(LS_PLOTS, INITIAL_PLOTS);
    list = list.filter((p) => p.id !== plotId);
    setLocalData(LS_PLOTS, list);
    return;
  }

  await deleteDoc(doc(db, 'plots', plotId));
}

// ==================== CULTIVOS Y ENFERMEDADES (CROPS & DISEASES) ====================

export async function getCrops(): Promise<Crop[]> {
  if (isDemoMode || !db) {
    return getLocalData<Crop>(LS_CROPS, INITIAL_CROPS);
  }

  const snap = await getDocs(collection(db, 'crops'));
  if (snap.empty) {
    return INITIAL_CROPS;
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Crop));
}

export async function getCropById(cropId: string): Promise<Crop | null> {
  const crops = await getCrops();
  return crops.find((c) => c.id === cropId) || null;
}

export async function getDiseases(cropId?: string): Promise<Disease[]> {
  if (isDemoMode || !db) {
    const list = getLocalData<Disease>(LS_DISEASES, INITIAL_DISEASES);
    return cropId ? list.filter((d) => d.cropId === cropId) : list;
  }

  let q = query(collection(db, 'diseases'));
  if (cropId) {
    q = query(collection(db, 'diseases'), where('cropId', '==', cropId));
  }
  const snap = await getDocs(q);
  if (snap.empty) {
    return cropId
      ? INITIAL_DISEASES.filter((d) => d.cropId === cropId)
      : INITIAL_DISEASES;
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Disease));
}

export async function getDiseaseById(diseaseId: string): Promise<Disease | null> {
  const diseases = await getDiseases();
  return diseases.find((d) => d.id === diseaseId) || null;
}

export async function seedMasterCatalogToFirestore(): Promise<{ cropsCount: number; diseasesCount: number }> {
  if (!db) {
    throw new Error('Firestore no está inicializado.');
  }

  // Insertar o actualizar los 6 cultivos
  for (const crop of INITIAL_CROPS) {
    await setDoc(doc(db, 'crops', crop.id), crop, { merge: true });
  }

  // Insertar o actualizar las 20 enfermedades
  for (const disease of INITIAL_DISEASES) {
    await setDoc(doc(db, 'diseases', disease.id), disease, { merge: true });
  }

  return {
    cropsCount: INITIAL_CROPS.length,
    diseasesCount: INITIAL_DISEASES.length,
  };
}

// ==================== DIAGNÓSTICOS (DIAGNOSES) ====================

export interface DiagnosisFilters {
  farmId?: string;
  plotId?: string;
  cropId?: string;
  status?: DiagnosisStatus;
  startDate?: string;
  endDate?: string;
}

export async function getDiagnoses(
  userId: string,
  filters?: DiagnosisFilters
): Promise<Diagnosis[]> {
  let list: Diagnosis[] = [];

  if (isDemoMode || !db) {
    list = getLocalData<Diagnosis>(LS_DIAGNOSES, INITIAL_DIAGNOSES);
    list = list.filter((d) => d.userId === userId || d.userId === 'demo-producer-1');
  } else {
    const q = query(
      collection(db, 'diagnoses'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    list = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Diagnosis))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  if (!filters) return list;

  return list.filter((d) => {
    if (filters.farmId && d.farmId !== filters.farmId) return false;
    if (filters.plotId && d.plotId !== filters.plotId) return false;
    if (filters.cropId && d.cropId !== filters.cropId) return false;
    if (filters.status && d.status !== filters.status) return false;
    if (filters.startDate && new Date(d.createdAt) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(d.createdAt) > new Date(filters.endDate)) return false;
    return true;
  });
}

export async function getDiagnosisById(diagnosisId: string): Promise<Diagnosis | null> {
  if (isDemoMode || !db) {
    const list = getLocalData<Diagnosis>(LS_DIAGNOSES, INITIAL_DIAGNOSES);
    return list.find((d) => d.id === diagnosisId) || null;
  }

  const snap = await getDoc(doc(db, 'diagnoses', diagnosisId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Diagnosis) : null;
}

export async function saveDiagnosis(
  data: Omit<Diagnosis, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Diagnosis> {
  const now = new Date().toISOString();
  const id = 'diag-' + Date.now();
  const newDiagnosis: Diagnosis = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  if (isDemoMode || !db) {
    const list = getLocalData<Diagnosis>(LS_DIAGNOSES, INITIAL_DIAGNOSES);
    list.unshift(newDiagnosis);
    setLocalData(LS_DIAGNOSES, list);

    // Crear el seguimiento inicial automáticamente
    const initialFollowUp: FollowUp = {
      id: 'fol-' + Date.now(),
      diagnosisId: id,
      userId: data.userId,
      status: data.status,
      notes: 'Diagnóstico preliminar asistido por IA guardado en sistema.',
      createdAt: now,
    };
    const folList = getLocalData<FollowUp>(LS_FOLLOWUPS, INITIAL_FOLLOWUPS);
    folList.push(initialFollowUp);
    setLocalData(LS_FOLLOWUPS, folList);

    return newDiagnosis;
  }

  await setDoc(doc(db, 'diagnoses', id), newDiagnosis);

  // Crear seguimiento inicial en Firestore
  const folId = 'fol-' + Date.now();
  await setDoc(doc(db, 'followUps', folId), {
    id: folId,
    diagnosisId: id,
    userId: data.userId,
    status: data.status,
    notes: 'Diagnóstico preliminar asistido por IA registrado.',
    createdAt: now,
  });

  return newDiagnosis;
}

export async function updateDiagnosisStatus(
  diagnosisId: string,
  status: DiagnosisStatus
): Promise<void> {
  const updatedAt = new Date().toISOString();

  if (isDemoMode || !db) {
    const list = getLocalData<Diagnosis>(LS_DIAGNOSES, INITIAL_DIAGNOSES);
    const idx = list.findIndex((d) => d.id === diagnosisId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], status, updatedAt };
      setLocalData(LS_DIAGNOSES, list);
    }
    return;
  }

  await updateDoc(doc(db, 'diagnoses', diagnosisId), { status, updatedAt });
}

// ==================== SEGUIMIENTOS (FOLLOW-UPS) ====================

export async function getFollowUps(diagnosisId: string): Promise<FollowUp[]> {
  if (isDemoMode || !db) {
    const list = getLocalData<FollowUp>(LS_FOLLOWUPS, INITIAL_FOLLOWUPS);
    return list
      .filter((f) => f.diagnosisId === diagnosisId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  const q = query(
    collection(db, 'followUps'),
    where('diagnosisId', '==', diagnosisId)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as FollowUp))
    .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
}

export async function addFollowUp(
  data: Omit<FollowUp, 'id' | 'createdAt'>
): Promise<FollowUp> {
  const now = new Date().toISOString();
  const id = 'fol-' + Date.now();
  const newFollowUp: FollowUp = {
    ...data,
    id,
    createdAt: now,
  };

  if (isDemoMode || !db) {
    const list = getLocalData<FollowUp>(LS_FOLLOWUPS, INITIAL_FOLLOWUPS);
    list.push(newFollowUp);
    setLocalData(LS_FOLLOWUPS, list);

    // Actualizar también el status general del diagnóstico
    await updateDiagnosisStatus(data.diagnosisId, data.status);
    return newFollowUp;
  }

  await setDoc(doc(db, 'followUps', id), newFollowUp);
  await updateDiagnosisStatus(data.diagnosisId, data.status);
  return newFollowUp;
}

// ==================== MÉTRICAS DEL DASHBOARD ====================

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const [diagnoses, farms, plots] = await Promise.all([
    getDiagnoses(userId),
    getFarms(userId),
    getPlotsByOwner(userId),
  ]);

  const totalAnalyses = diagnoses.length;
  let detectedCount = 0;
  let monitoringCount = 0;
  let treatedCount = 0;
  let controlledCount = 0;

  const diseaseCounts: Record<string, number> = {};

  diagnoses.forEach((d) => {
    if (d.status === 'detected') detectedCount++;
    else if (d.status === 'monitoring') monitoringCount++;
    else if (d.status === 'treated') treatedCount++;
    else if (d.status === 'controlled') controlledCount++;

    diseaseCounts[d.predictedDiseaseName] = (diseaseCounts[d.predictedDiseaseName] || 0) + 1;
  });

  let mostFrequentDisease = 'Ninguna registrada';
  let maxFreq = 0;
  for (const [disease, count] of Object.entries(diseaseCounts)) {
    if (count > maxFreq) {
      maxFreq = count;
      mostFrequentDisease = disease;
    }
  }

  return {
    totalAnalyses,
    detectedCount,
    monitoringCount,
    treatedCount,
    controlledCount,
    farmsCount: farms.length,
    plotsCount: plots.length,
    mostFrequentDisease: totalAnalyses > 0 ? mostFrequentDisease : undefined,
  };
}
