export type UserRole = 'productor' | 'administrador';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type AreaUnit = 'ha' | 'm2' | 'mz';

export interface Farm {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  department: string;
  municipality: string;
  area: number;
  areaUnit: AreaUnit;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plot {
  id: string;
  farmId: string;
  ownerId: string;
  name: string;
  description: string;
  cropId: string;
  area: number;
  areaUnit: AreaUnit;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Crop {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  image?: string;
  active: boolean;
}

export type DiseaseType = 'fungal' | 'bacterial' | 'viral' | 'pest' | 'abiotic';
export type PlantPart = 'leaf' | 'stem' | 'fruit';
export type SeverityLevel = 'low' | 'moderate' | 'high' | 'severe';
export type DiagnosisStatus = 'detected' | 'monitoring' | 'treated' | 'controlled';

export interface Disease {
  id: string;
  cropId: string;
  name: string;
  scientificName: string;
  type: DiseaseType;
  description: string;
  symptoms: string[];
  recommendations: string[];
  affectedParts: PlantPart[];
  image?: string;
  active: boolean;
}

export interface Diagnosis {
  id: string;
  userId: string;
  farmId: string;
  plotId: string;
  cropId: string;
  plantPart: PlantPart;
  imageUrl: string;
  predictedDiseaseId: string;
  predictedDiseaseName: string;
  confidence: number; // 0.0 - 1.0
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  gpsAccuracy: number;
  status: DiagnosisStatus;
  aiModelVersion: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  diagnosisId: string;
  userId: string;
  status: DiagnosisStatus;
  notes: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalAnalyses: number;
  detectedCount: number;
  monitoringCount: number;
  treatedCount: number;
  controlledCount: number;
  farmsCount: number;
  plotsCount: number;
  mostFrequentDisease?: string;
}
