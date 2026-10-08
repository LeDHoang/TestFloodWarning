/**
 * @license
 * SMART ANTI-FLOOD AI - Teachable Machine & Vision Service
 * Supports dynamic Teachable Machine Image models, ROI frame extraction, and Mock AI
 */

import { AIClassInfo, AIClassType, AIPredictionResult, ROIBounds } from '../types';

declare global {
  interface Window {
    tmImage?: {
      load: (modelURL: string, metadataURL: string) => Promise<any>;
    };
    tf?: any;
  }
}

export interface TMModelSession {
  url: string;
  model: any;
  classNames: string[];
  totalClasses: number;
}

let activeModelSession: TMModelSession | null = null;

/**
 * Normalizes user-entered Teachable Machine URL
 */
export function normalizeTeachableMachineUrl(inputUrl: string): { modelURL: string; metadataURL: string } {
  let cleanUrl = inputUrl.trim();
  if (cleanUrl.endsWith('/model.json')) {
    cleanUrl = cleanUrl.replace('/model.json', '');
  }
  if (!cleanUrl.endsWith('/')) {
    cleanUrl += '/';
  }
  return {
    modelURL: `${cleanUrl}model.json`,
    metadataURL: `${cleanUrl}metadata.json`,
  };
}

/**
 * Connect and load Teachable Machine model
 */
export async function loadTeachableMachineModel(rawUrl: string): Promise<TMModelSession> {
  if (!rawUrl || rawUrl.trim() === '') {
    throw new Error('Vui lòng nhập đường dẫn Teachable Machine Model URL.');
  }

  // Ensure tmImage script is loaded
  if (!window.tmImage) {
    // Wait briefly or check
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!window.tmImage) {
      throw new Error('Thư viện Teachable Machine chưa sẵn sàng trên trình duyệt. Vui lòng tải lại trang.');
    }
  }

  const { modelURL, metadataURL } = normalizeTeachableMachineUrl(rawUrl);

  try {
    const loadedModel = await window.tmImage.load(modelURL, metadataURL);
    const totalClasses = loadedModel.getTotalClasses();
    const classNames: string[] = [];

    for (let i = 0; i < totalClasses; i++) {
      classNames.push(loadedModel.getClassLabels ? loadedModel.getClassLabels()[i] : `Class ${i + 1}`);
    }

    const session: TMModelSession = {
      url: rawUrl,
      model: loadedModel,
      classNames,
      totalClasses,
    };

    activeModelSession = session;
    return session;
  } catch (error: any) {
    console.error('Failed to load Teachable Machine model:', error);
    throw new Error(`Không thể kết nối model từ URL đã nhập (${error?.message || 'Lỗi mạng hoặc CORS'}). Hãy kiểm tra xem link đã publish public chưa.`);
  }
}

export function getActiveModelSession(): TMModelSession | null {
  return activeModelSession;
}

export function disconnectTeachableMachineModel(): void {
  activeModelSession = null;
}

/**
 * Helper to load an HTMLImageElement asynchronously from URL or DataURI
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Không thể tải hình ảnh: ' + e));
    img.src = url;
  });
}

/**
 * Crop source video, image or canvas to ROI region
 * Returns an HTMLCanvasElement containing only the cropped drain mouth
 */
export function cropToROI(
  source: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
  roi: ROIBounds,
  targetWidth: number = 224,
  targetHeight: number = 224,
  analyzeFullImage: boolean = false
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  let sourceWidth = 640;
  let sourceHeight = 480;

  if ('videoWidth' in source && source.videoWidth) {
    sourceWidth = source.videoWidth;
    sourceHeight = source.videoHeight;
  } else if ('naturalWidth' in source && source.naturalWidth) {
    sourceWidth = source.naturalWidth;
    sourceHeight = source.naturalHeight;
  } else if ('width' in source && source.width) {
    sourceWidth = source.width;
    sourceHeight = source.height;
  }

  if (analyzeFullImage) {
    // Whole image mode per Section 14
    ctx.drawImage(source, 0, 0, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    return canvas;
  }

  // Convert percentages to pixel bounding box
  const sx = Math.max(0, (roi.x / 100) * sourceWidth);
  const sy = Math.max(0, (roi.y / 100) * sourceHeight);
  const sw = Math.max(10, Math.min(sourceWidth - sx, (roi.width / 100) * sourceWidth));
  const sh = Math.max(10, Math.min(sourceHeight - sy, (roi.height / 100) * sourceHeight));

  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  return canvas;
}

/**
 * Predict on element using real Teachable Machine model
 */
export async function predictWithTeachableMachine(
  element: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement
): Promise<AIPredictionResult> {
  if (!activeModelSession || !activeModelSession.model) {
    throw new Error('Chưa kết nối Teachable Machine model');
  }

  const predictions = await activeModelSession.model.predict(element);

  // Parse prediction results
  const classes: AIClassInfo[] = predictions.map((p: any) => ({
    name: p.className,
    probability: Math.max(0, Math.min(1, p.probability)),
  }));

  // Sort descending
  classes.sort((a, b) => b.probability - a.probability);

  const top = classes[0] || { name: 'CLEAR', probability: 0 };

  return {
    topClass: top.name,
    confidence: top.probability,
    classes,
    timestamp: Date.now(),
    isMock: false,
  };
}

/**
 * Generates realistic Mock AI predictions for school presentation/testing
 */
export function generateMockPrediction(selectedClass: AIClassType): AIPredictionResult {
  const jitter = () => (Math.random() - 0.5) * 0.04; // ±2% slight realistic live jitter

  let baseProbs: Record<AIClassType, number>;

  switch (selectedClass) {
    case 'CLEAR':
      baseProbs = {
        CLEAR: 0.93 + jitter(),
        TRASH_NEARBY: 0.04 + jitter() * 0.5,
        PARTIAL_BLOCKED: 0.02 + jitter() * 0.3,
        BLOCKED: 0.01 + jitter() * 0.2,
      };
      break;
    case 'TRASH_NEARBY':
      baseProbs = {
        CLEAR: 0.08 + jitter() * 0.4,
        TRASH_NEARBY: 0.86 + jitter(),
        PARTIAL_BLOCKED: 0.04 + jitter() * 0.4,
        BLOCKED: 0.02 + jitter() * 0.3,
      };
      break;
    case 'PARTIAL_BLOCKED':
      baseProbs = {
        CLEAR: 0.03 + jitter() * 0.3,
        TRASH_NEARBY: 0.09 + jitter() * 0.4,
        PARTIAL_BLOCKED: 0.81 + jitter(),
        BLOCKED: 0.07 + jitter() * 0.4,
      };
      break;
    case 'BLOCKED':
    default:
      baseProbs = {
        CLEAR: 0.01 + jitter() * 0.2,
        TRASH_NEARBY: 0.03 + jitter() * 0.3,
        PARTIAL_BLOCKED: 0.05 + jitter() * 0.4,
        BLOCKED: 0.91 + jitter(),
      };
      break;
  }

  // Normalize so sum is exactly 1.0
  const sum = Object.values(baseProbs).reduce((acc, v) => acc + Math.max(0.005, v), 0);
  const classes: AIClassInfo[] = (['CLEAR', 'TRASH_NEARBY', 'PARTIAL_BLOCKED', 'BLOCKED'] as AIClassType[]).map((name) => ({
    name,
    probability: Math.max(0.005, Math.min(0.995, Math.max(0.005, baseProbs[name]) / sum)),
  }));

  classes.sort((a, b) => b.probability - a.probability);

  return {
    topClass: classes[0].name,
    confidence: classes[0].probability,
    classes,
    timestamp: Date.now(),
    isMock: true,
  };
}
