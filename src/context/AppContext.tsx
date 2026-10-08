/**
 * @license
 * SMART ANTI-FLOOD AI - App Context
 * Central application state with real-time reactive sync across all modules
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ActiveTab,
  AIClassType,
  AIPredictionResult,
  AppSettings,
  DatasetTestItem,
  DemoStep,
  HistoryRecord,
  ImageSourceType,
  RiskLevel,
  ROIBounds,
  Ticket,
  TicketSource,
  TicketStatus,
  UploadedImageInfo,
  WaterLevelCategory,
} from '../types';
import {
  DEFAULT_SETTINGS,
  loadHistory,
  loadSettings,
  loadTickets,
  resetAllStorage,
  saveHistory,
  saveSettings,
  saveTickets,
} from '../services/storage';
import {
  cropToROI,
  disconnectTeachableMachineModel,
  getActiveModelSession,
  loadImageFromUrl,
  loadTeachableMachineModel,
  predictWithTeachableMachine,
  TMModelSession,
  generateMockPrediction,
} from '../services/teachableMachine';
import { evaluateRiskRules, RuleEvaluationResult } from '../services/ruleEngine';

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Bước 1: Mô phỏng lượng mưa lớn',
    instruction: 'Kéo lượng mưa lên 55 mm/h để mô phỏng cơn mưa lớn tại Hà Nội.',
    targetRain: 55,
    targetWater: 'LOW',
    targetAI: 'CLEAR',
    expectedRisk: 'NORMAL',
    actionText: 'Áp dụng Mưa 55 mm/h',
    systemHint: 'Khi cống vẫn CLEAR, hệ thống chỉ báo MƯA LỚN nhưng chưa kích hoạt cảnh báo nguy cơ ngập!',
  },
  {
    step: 2,
    title: 'Bước 2: Camera quan sát miệng cống sạch',
    instruction: 'Cho camera quan sát mô hình cống sạch, không có vật cản.',
    targetRain: 55,
    targetWater: 'LOW',
    targetAI: 'CLEAR',
    expectedRisk: 'NORMAL',
    actionText: 'Chọn Cống Sạch (CLEAR 94%)',
    systemHint: 'AI nhận diện CLEAR > 90%. Nước vẫn thoát bình thường.',
  },
  {
    step: 3,
    title: 'Bước 3: Rác ở gần nhưng chưa che cống',
    instruction: 'Đặt rác/lá cây ở gần miệng cống nhưng chưa lọt vào lưới thu.',
    targetRain: 55,
    targetWater: 'MEDIUM',
    targetAI: 'TRASH_NEARBY',
    expectedRisk: 'WATCH',
    actionText: 'Chọn Rác gần cống (TRASH_NEARBY)',
    systemHint: 'Hệ thống chuyển sang trạng thái THEO DÕI vì có nguy cơ rác bị cuốn vào cống.',
  },
  {
    step: 4,
    title: 'Bước 4: Rác che kín miệng cống',
    instruction: 'Đặt rác/lá cây mô phỏng che phủ kín bề mặt miệng cống.',
    targetRain: 55,
    targetWater: 'HIGH',
    targetAI: 'BLOCKED',
    expectedRisk: 'HIGH',
    actionText: 'Chọn Cống Bị Tắc (BLOCKED 91%)',
    systemHint: 'AI nhận diện BLOCKED với độ tin cậy 91% vượt ngưỡng 80%!',
  },
  {
    step: 5,
    title: 'Bước 5: Kích hoạt Cảnh Báo Nguy Cơ Ngập Cao',
    instruction: 'Kết hợp: Rain 55 mm/h + AI BLOCKED 91% + Mực nước HIGH.',
    targetRain: 55,
    targetWater: 'HIGH',
    targetAI: 'BLOCKED',
    expectedRisk: 'HIGH',
    actionText: 'Kiểm tra Cảnh Báo 🚨',
    systemHint: 'Rule Engine kích hoạt mức 🔴 NGUY CƠ NGẬP CAO và hiển thị khuyến nghị hành động.',
  },
  {
    step: 6,
    title: 'Bước 6: Tạo Ticket Xử Lý Sự Cố',
    instruction: 'Bấm nút [TẠO TICKET XỬ LÝ] để gửi lệnh cho đội công nhân thoát nước.',
    actionText: 'Xem Ticket #0001',
    systemHint: 'Ticket lưu trữ ảnh chụp ROI tại thời điểm cảnh báo và thông số đo lường.',
  },
  {
    step: 7,
    title: 'Bước 7: Dọn rác & Nghiệm thu thông cống',
    instruction: 'Dọn sạch rác mô phỏng. Camera kiểm tra lại: CLEAR >= 80% -> RESOLVED!',
    targetRain: 25,
    targetWater: 'LOW',
    targetAI: 'CLEAR',
    expectedRisk: 'NORMAL',
    actionText: 'Nghiệm thu cống sạch (CLEAR 96%)',
    systemHint: 'Vòng lặp phản hồi (Feedback loop) hoàn thành. Ticket chuyển trạng thái RESOLVED!',
  },
];

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetAllData: () => void;

  // Rain Simulator
  rainMmPerHour: number;
  setRainMmPerHour: (val: number) => void;

  // Water Simulator
  waterPercentage: number;
  waterLevel: WaterLevelCategory;
  setWaterPercentage: (pct: number) => void;
  setWaterLevel: (lvl: WaterLevelCategory) => void;

  // Vision & AI
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
  roi: ROIBounds;
  setROI: (bounds: ROIBounds) => void;
  saveROI: (bounds: ROIBounds) => void;
  resetROI: () => void;

  isModelConnected: boolean;
  modelSession: TMModelSession | null;
  modelLoading: boolean;
  modelError: string | null;
  connectModel: (url: string) => Promise<void>;
  disconnectModel: () => void;

  mockClass: AIClassType;
  setMockClass: (cls: AIClassType) => void;
  aiPrediction: AIPredictionResult;
  setAIPrediction: (pred: AIPredictionResult) => void;

  // Rule Engine
  ruleResult: RuleEvaluationResult;

  // Tickets
  tickets: Ticket[];
  createTicket: (
    notes?: string,
    snapshotUrl?: string,
    source?: TicketSource,
    originalImageUrl?: string
  ) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus, notes?: string, resolvedSnapshotUrl?: string) => void;

  // History
  history: HistoryRecord[];
  addHistoryRecord: (record?: Partial<HistoryRecord>) => void;
  clearHistory: () => void;

  // Demo Mode
  demoModeActive: boolean;
  setDemoModeActive: (active: boolean) => void;
  currentDemoStep: number;
  setCurrentDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  applyDemoStepPreset: (stepIndex: number) => void;

  // Helper
  lastSnapshotDataUrl: string | null;
  setLastSnapshotDataUrl: (dataUrl: string | null) => void;

  // Image Source & Upload Mode (Section 1 & 2)
  imageSource: ImageSourceType;
  setImageSource: (src: ImageSourceType) => void;
  uploadedImage: UploadedImageInfo | null;
  setUploadedImage: (img: UploadedImageInfo | null) => void;
  isAnalyzingImage: boolean;
  setIsAnalyzingImage: (analyzing: boolean) => void;
  analyzeFullImage: boolean;
  setAnalyzeFullImage: (full: boolean) => void;
  croppedImageDataUrl: string | null;
  setCroppedImageDataUrl: (url: string | null) => void;

  // Test Dataset (Section 18)
  datasetTestItems: DatasetTestItem[];
  setDatasetTestItems: React.Dispatch<React.SetStateAction<DatasetTestItem[]>>;
  addDatasetTestItems: (items: DatasetTestItem[]) => void;
  clearDatasetTestItems: () => void;
  runDatasetTestItem: (itemId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [settings, setSettingsState] = useState<AppSettings>(() => loadSettings());
  const [tickets, setTicketsState] = useState<Ticket[]>(() => loadTickets());
  const [history, setHistoryState] = useState<HistoryRecord[]>(() => loadHistory());

  // Environmental inputs (default per spec: 55 mm/h for demo presentation readiness)
  const [rainMmPerHour, setRainMmPerHour] = useState<number>(55);
  const [waterPercentage, setWaterPercentageState] = useState<number>(85);

  // Vision state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [roi, setROISetting] = useState<ROIBounds>(settings.savedROI || DEFAULT_SETTINGS.savedROI);
  const [lastSnapshotDataUrl, setLastSnapshotDataUrl] = useState<string | null>(null);

  // Teachable Machine state
  const [isModelConnected, setIsModelConnected] = useState<boolean>(false);
  const [modelSession, setModelSession] = useState<TMModelSession | null>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Mock AI class selector
  const [mockClass, setMockClass] = useState<AIClassType>('BLOCKED');
  const [aiPrediction, setAIPrediction] = useState<AIPredictionResult>(() => generateMockPrediction('BLOCKED'));

  // Demo mode
  const [demoModeActive, setDemoModeActive] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(0);

  // Image Source & Upload State (Section 1 & 2)
  const [imageSource, setImageSource] = useState<ImageSourceType>('CAMERA');
  const [uploadedImage, setUploadedImage] = useState<UploadedImageInfo | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [analyzeFullImage, setAnalyzeFullImage] = useState<boolean>(false);
  const [croppedImageDataUrl, setCroppedImageDataUrl] = useState<string | null>(null);

  // Test Dataset State (Section 18)
  const [datasetTestItems, setDatasetTestItems] = useState<DatasetTestItem[]>([]);

  const addDatasetTestItems = useCallback((items: DatasetTestItem[]) => {
    setDatasetTestItems((prev) => [...prev, ...items]);
  }, []);

  const clearDatasetTestItems = useCallback(() => {
    setDatasetTestItems([]);
  }, []);

  const runDatasetTestItem = useCallback(async (itemId: string) => {
    setDatasetTestItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: 'ANALYZING' } : item))
    );

    const targetItem = datasetTestItems.find((it) => it.id === itemId);
    if (!targetItem) return;

    try {
      if (isModelConnected) {
        const img = await loadImageFromUrl(targetItem.dataUrl);
        const cropped = cropToROI(img, roi, 224, 224, analyzeFullImage);
        const pred = await predictWithTeachableMachine(cropped);
        const predictedClass = pred.topClass;
        const confidence = pred.confidence;
        const isCorrect = predictedClass === targetItem.expectedClass;

        setDatasetTestItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  predictedClass,
                  confidence,
                  isCorrect,
                  status: 'DONE',
                }
              : item
          )
        );
      } else {
        // Mock prediction for presentation
        const mockPred = generateMockPrediction(targetItem.expectedClass);
        const predictedClass = mockPred.topClass;
        const confidence = mockPred.confidence;
        const isCorrect = predictedClass === targetItem.expectedClass;

        setDatasetTestItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  predictedClass,
                  confidence,
                  isCorrect,
                  status: 'DONE',
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Error testing dataset item:', err);
      setDatasetTestItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                predictedClass: 'ERROR',
                confidence: 0,
                isCorrect: false,
                status: 'DONE',
              }
            : item
        )
      );
    }
  }, [datasetTestItems, isModelConnected, roi, analyzeFullImage]);

  // Calculate water category from percentage
  const waterLevel = useMemo<WaterLevelCategory>(() => {
    if (waterPercentage < settings.waterThresholdLow) return 'LOW';
    if (waterPercentage < settings.waterThresholdMedium) return 'MEDIUM';
    return 'HIGH';
  }, [waterPercentage, settings.waterThresholdLow, settings.waterThresholdMedium]);

  const setWaterLevel = useCallback((lvl: WaterLevelCategory) => {
    if (lvl === 'LOW') setWaterPercentageState(20);
    else if (lvl === 'MEDIUM') setWaterPercentageState(55);
    else setWaterPercentageState(85);
  }, []);

  const setWaterPercentage = useCallback((pct: number) => {
    setWaterPercentageState(Math.max(0, Math.min(100, Math.round(pct))));
  }, []);

  // Sync settings updates to localStorage
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // ROI management
  const setROI = useCallback((bounds: ROIBounds) => {
    setROISetting(bounds);
  }, []);

  const saveROI = useCallback((bounds: ROIBounds) => {
    setROISetting(bounds);
    updateSettings({ savedROI: bounds });
  }, [updateSettings]);

  const resetROI = useCallback(() => {
    const defaultBounds = DEFAULT_SETTINGS.savedROI;
    setROISetting(defaultBounds);
    updateSettings({ savedROI: defaultBounds });
  }, [updateSettings]);

  // Connect real Teachable Machine Model
  const connectModel = useCallback(async (url: string) => {
    if (!url || !url.trim()) {
      setModelError('Vui lòng nhập đường dẫn Teachable Machine hợp lệ');
      return;
    }
    setModelLoading(true);
    setModelError(null);
    try {
      const session = await loadTeachableMachineModel(url);
      setModelSession(session);
      setIsModelConnected(true);
      updateSettings({ teachableMachineUrl: url });
    } catch (e: any) {
      setModelError(e.message || 'Lỗi kết nối model');
      setIsModelConnected(false);
      setModelSession(null);
    } finally {
      setModelLoading(false);
    }
  }, [updateSettings]);

  const disconnectModel = useCallback(() => {
    disconnectTeachableMachineModel();
    setModelSession(null);
    setIsModelConnected(false);
    updateSettings({ teachableMachineUrl: '' });
  }, [updateSettings]);

  // Try auto-reconnect if URL was saved in settings
  useEffect(() => {
    if (settings.teachableMachineUrl && !isModelConnected) {
      connectModel(settings.teachableMachineUrl).catch(() => {
        // silently fallback to mock if saved URL fails
      });
    }
  }, [settings.teachableMachineUrl, connectModel, isModelConnected]);

  // Update mock prediction whenever mockClass changes (when no real model is connected)
  useEffect(() => {
    if (!isModelConnected) {
      const pred = generateMockPrediction(mockClass);
      setAIPrediction(pred);
    }
  }, [mockClass, isModelConnected]);

  // Evaluate Rule Engine whenever any input changes
  const ruleResult = useMemo<RuleEvaluationResult>(() => {
    return evaluateRiskRules({
      rainMmPerHour,
      waterLevel,
      waterPercentage,
      aiClass: aiPrediction.topClass,
      aiConfidence: aiPrediction.confidence,
      confidenceThreshold: settings.confidenceThreshold,
      rainThresholdWatch: settings.rainThresholdWatch,
      rainThresholdHigh: settings.rainThresholdHigh,
    });
  }, [
    rainMmPerHour,
    waterLevel,
    waterPercentage,
    aiPrediction.topClass,
    aiPrediction.confidence,
    settings.confidenceThreshold,
    settings.rainThresholdWatch,
    settings.rainThresholdHigh,
  ]);

  // Tickets management
  const createTicket = useCallback((
    notes?: string,
    snapshotUrl?: string,
    source?: TicketSource,
    originalImageUrl?: string
  ): Ticket => {
    const nextNum = tickets.length + 1;
    const ticketNumber = `#${String(nextNum).padStart(4, '0')}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} Hôm nay`;

    const ticketSource: TicketSource = source || (imageSource === 'UPLOAD' ? 'UPLOADED_IMAGE' : 'LIVE_CAMERA');

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      ticketNumber,
      createdAt: timeStr,
      status: 'NEW',
      priority: ruleResult.isHighRisk ? 'HIGH' : 'MEDIUM',
      source: ticketSource,
      location: settings.locationName,
      rainMmPerHour,
      waterLevel,
      waterPercentage,
      aiClass: aiPrediction.topClass,
      aiConfidence: aiPrediction.confidence,
      originalImageUrl: originalImageUrl || (uploadedImage?.dataUrl) || undefined,
      initialSnapshotUrl: snapshotUrl || croppedImageDataUrl || lastSnapshotDataUrl || undefined,
      notes: notes || `Tự động tạo bởi Cảnh báo (${ticketSource === 'UPLOADED_IMAGE' ? 'Từ Ảnh Tải Lên' : 'Từ Camera Live'}): ${ruleResult.reasons.join(' | ')}`,
    };

    const updated = [newTicket, ...tickets];
    setTicketsState(updated);
    saveTickets(updated);

    // Also record in history
    const historyItem: HistoryRecord = {
      id: `hist-${Date.now()}`,
      timestamp: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
      location: settings.locationName,
      rainMmPerHour,
      waterLevel,
      waterPercentage,
      aiClass: aiPrediction.topClass,
      aiConfidence: aiPrediction.confidence,
      riskLevel: ruleResult.riskLevel,
      ticketId: ticketNumber,
    };
    const updatedHistory = [historyItem, ...history];
    setHistoryState(updatedHistory);
    saveHistory(updatedHistory);

    return newTicket;
  }, [
    tickets,
    ruleResult.isHighRisk,
    ruleResult.reasons,
    ruleResult.riskLevel,
    settings.locationName,
    rainMmPerHour,
    waterLevel,
    waterPercentage,
    aiPrediction.topClass,
    aiPrediction.confidence,
    imageSource,
    uploadedImage,
    croppedImageDataUrl,
    lastSnapshotDataUrl,
    history,
  ]);

  const updateTicketStatus = useCallback((id: string, status: TicketStatus, notes?: string, resolvedSnapshotUrl?: string) => {
    setTicketsState((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          return {
            ...t,
            status,
            notes: notes ? `${t.notes || ''}\n[${timeStr}] ${notes}` : t.notes,
            resolvedAt: status === 'RESOLVED' ? `${timeStr} Hôm nay` : t.resolvedAt,
            resolvedSnapshotUrl: resolvedSnapshotUrl || t.resolvedSnapshotUrl,
          };
        }
        return t;
      });
      saveTickets(updated);
      return updated;
    });
  }, []);

  // History management
  const addHistoryRecord = useCallback((record?: Partial<HistoryRecord>) => {
    const now = new Date();
    const historyItem: HistoryRecord = {
      id: `hist-${Date.now()}`,
      timestamp: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
      location: settings.locationName,
      rainMmPerHour,
      waterLevel,
      waterPercentage,
      aiClass: aiPrediction.topClass,
      aiConfidence: aiPrediction.confidence,
      riskLevel: ruleResult.riskLevel,
      ...record,
    };
    const updated = [historyItem, ...history];
    setHistoryState(updated);
    saveHistory(updated);
  }, [settings.locationName, rainMmPerHour, waterLevel, waterPercentage, aiPrediction, ruleResult.riskLevel, history]);

  const clearHistory = useCallback(() => {
    setHistoryState([]);
    saveHistory([]);
  }, []);

  const resetAllData = useCallback(() => {
    resetAllStorage();
    setSettingsState(DEFAULT_SETTINGS);
    setTicketsState([]);
    setHistoryState([]);
    setRainMmPerHour(15);
    setWaterPercentageState(20);
    setMockClass('CLEAR');
    setAIPrediction(generateMockPrediction('CLEAR'));
  }, []);

  // Demo step presets
  const applyDemoStepPreset = useCallback((stepIndex: number) => {
    const step = DEMO_STEPS[stepIndex];
    if (!step) return;

    if (step.targetRain !== undefined) {
      setRainMmPerHour(step.targetRain);
    }
    if (step.targetWater !== undefined) {
      setWaterLevel(step.targetWater);
    }
    if (step.targetAI !== undefined) {
      setMockClass(step.targetAI);
      setAIPrediction(generateMockPrediction(step.targetAI));
    }
  }, [setWaterLevel]);

  const nextDemoStep = useCallback(() => {
    setCurrentDemoStep((prev) => {
      const next = Math.min(DEMO_STEPS.length - 1, prev + 1);
      applyDemoStepPreset(next);
      return next;
    });
  }, [applyDemoStepPreset]);

  const prevDemoStep = useCallback(() => {
    setCurrentDemoStep((prev) => {
      const next = Math.max(0, prev - 1);
      applyDemoStepPreset(next);
      return next;
    });
  }, [applyDemoStepPreset]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        settings,
        updateSettings,
        resetAllData,
        rainMmPerHour,
        setRainMmPerHour,
        waterPercentage,
        waterLevel,
        setWaterPercentage,
        setWaterLevel,
        isCameraActive,
        setIsCameraActive,
        roi,
        setROI,
        saveROI,
        resetROI,
        isModelConnected,
        modelSession,
        modelLoading,
        modelError,
        connectModel,
        disconnectModel,
        mockClass,
        setMockClass,
        aiPrediction,
        setAIPrediction,
        ruleResult,
        tickets,
        createTicket,
        updateTicketStatus,
        history,
        addHistoryRecord,
        clearHistory,
        demoModeActive,
        setDemoModeActive,
        currentDemoStep,
        setCurrentDemoStep,
        nextDemoStep,
        prevDemoStep,
        applyDemoStepPreset,
        lastSnapshotDataUrl,
        setLastSnapshotDataUrl,
        imageSource,
        setImageSource,
        uploadedImage,
        setUploadedImage,
        isAnalyzingImage,
        setIsAnalyzingImage,
        analyzeFullImage,
        setAnalyzeFullImage,
        croppedImageDataUrl,
        setCroppedImageDataUrl,
        datasetTestItems,
        setDatasetTestItems,
        addDatasetTestItems,
        clearDatasetTestItems,
        runDatasetTestItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
