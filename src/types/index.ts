/**
 * @license
 * SMART ANTI-FLOOD AI - NEWTON AI
 * Core TypeScript definitions and schemas
 */

export type AIClassType = 'CLEAR' | 'TRASH_NEARBY' | 'PARTIAL_BLOCKED' | 'BLOCKED';

export interface AIClassInfo {
  name: string;
  probability: number;
}

export interface AIPredictionResult {
  topClass: AIClassType | string;
  confidence: number; // 0 to 1
  classes: AIClassInfo[];
  timestamp: number;
  isMock: boolean;
}

export type ImageSourceType = 'CAMERA' | 'UPLOAD' | 'DATASET_TEST';

export interface UploadedImageInfo {
  id: string;
  name: string;
  sizeBytes: number;
  sizeFormatted: string;
  width: number;
  height: number;
  dataUrl: string;
}

export interface SampleImage {
  id: string;
  title: string;
  classLabel: AIClassType;
  url: string;
  description: string;
}

export interface DatasetTestItem {
  id: string;
  imageName: string;
  dataUrl: string;
  expectedClass: AIClassType;
  predictedClass?: string;
  confidence?: number;
  isCorrect?: boolean;
  status: 'PENDING' | 'ANALYZING' | 'DONE';
}

export type WaterLevelCategory = 'LOW' | 'MEDIUM' | 'HIGH';

export type RiskLevel = 'NORMAL' | 'WATCH' | 'WARNING' | 'HIGH';

export interface ROIBounds {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export type TicketStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketSource = 'LIVE_CAMERA' | 'UPLOADED_IMAGE';

export interface Ticket {
  id: string;
  ticketNumber: string;
  createdAt: string;
  resolvedAt?: string;
  status: TicketStatus;
  priority: TicketPriority;
  source?: TicketSource;
  location: string;
  rainMmPerHour: number;
  waterLevel: WaterLevelCategory;
  waterPercentage: number;
  aiClass: AIClassType | string;
  aiConfidence: number;
  originalImageUrl?: string;
  initialSnapshotUrl?: string;
  resolvedSnapshotUrl?: string;
  notes?: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  location: string;
  rainMmPerHour: number;
  waterLevel: WaterLevelCategory;
  waterPercentage: number;
  aiClass: AIClassType | string;
  aiConfidence: number;
  riskLevel: RiskLevel;
  ticketId?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  caption: string;
  source: string;
  category: 'rain' | 'flood' | 'traffic' | 'drain' | 'trash';
}

export interface AppSettings {
  // AI
  teachableMachineUrl: string;
  confidenceThreshold: number; // 50 to 100, default 80
  useMockWhenDisconnected: boolean;
  
  // Rain
  rainThresholdWatch: number; // default 20
  rainThresholdHigh: number; // default 50
  
  // Water
  waterThresholdLow: number; // default 35
  waterThresholdMedium: number; // default 70
  
  // Location
  locationName: string;
  locationCoordinates: string;
  
  // Media
  videoUrl: string;
  youtubeId: string;
  heroImageUrl: string;
  galleryImages: MediaItem[];
  sampleImages?: SampleImage[];

  // Camera ROI
  savedROI: ROIBounds;
  analyzeFullImage?: boolean;
}

export type ActiveTab = 
  | 'overview' 
  | 'camera' 
  | 'rain' 
  | 'alerts' 
  | 'tickets' 
  | 'history' 
  | 'hanoi-media' 
  | 'ai-explain'
  | 'settings' 
  | 'about';

export interface DemoStep {
  step: number;
  title: string;
  instruction: string;
  targetRain?: number;
  targetWater?: WaterLevelCategory;
  targetAI?: AIClassType;
  expectedRisk?: RiskLevel;
  actionText: string;
  systemHint: string;
}
