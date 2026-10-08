/**
 * @license
 * SMART ANTI-FLOOD AI - Camera AI & Vùng Quan Sát (ROI) Module
 * Supports dual image inputs:
 * 1. LIVE CAMERA (Webcam with device enumeration and live ROI cropping)
 * 2. UPLOADED IMAGE (Drag & Drop, file check <= 10MB, interactive ROI, whole-image compare, and 4 quick sample cards)
 * Shared pipeline: IMAGE -> CHỌN ROI -> CROP ROI -> TEACHABLE MACHINE -> PREDICTION -> RULE ENGINE -> CẢNH BÁO -> TICKET
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { CameraSource } from './CameraSource';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { AIAnalysis } from './AIAnalysis';
import { cropToROI, predictWithTeachableMachine } from '../../services/teachableMachine';
import { UploadedImageInfo } from '../../types';
import {
  Camera,
  Upload,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Ticket as TicketIcon,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const CameraView: React.FC = () => {
  const {
    imageSource,
    setImageSource,
    uploadedImage,
    setUploadedImage,
    isCameraActive,
    roi,
    isModelConnected,
    modelSession,
    settings,
    aiPrediction,
    setAIPrediction,
    mockClass,
    rainMmPerHour,
    waterLevel,
    ruleResult,
    createTicket,
    setActiveTab,
    analyzeFullImage,
    lastSnapshotDataUrl,
    setLastSnapshotDataUrl,
    croppedImageDataUrl,
    setCroppedImageDataUrl,
  } = useApp();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasCropPreviewRef = useRef<HTMLCanvasElement | null>(null);

  const [ticketCreatedId, setTicketCreatedId] = useState<string | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(true);
  const [isProcessingCameraFrame, setIsProcessingCameraFrame] = useState<boolean>(false);

  // Periodic frame processing for live camera feed
  const processLiveCamera = useCallback(async () => {
    if (imageSource !== 'CAMERA' || isProcessingCameraFrame) return;

    let sourceEl: HTMLVideoElement | HTMLCanvasElement | null = null;
    if (isCameraActive && videoRef.current && videoRef.current.readyState >= 2) {
      sourceEl = videoRef.current;
    } else if (!isCameraActive) {
      // Draw simulation canvas for presentation demo if camera is turned off
      const simCanvas = document.createElement('canvas');
      simCanvas.width = 640;
      simCanvas.height = 480;
      const ctx = simCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(160, 120, 320, 240); // drain opening
        // grating
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 8;
        for (let x = 180; x < 460; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 120);
          ctx.lineTo(x, 360);
          ctx.stroke();
        }
        if (mockClass === 'BLOCKED' || mockClass === 'PARTIAL_BLOCKED') {
          ctx.fillStyle = '#854d0e';
          ctx.beginPath();
          ctx.arc(320, 240, 85, 0, Math.PI * 2);
          ctx.fill();
        } else if (mockClass === 'TRASH_NEARBY') {
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.arc(120, 340, 35, 0, Math.PI * 2);
          ctx.fill();
        }
        sourceEl = simCanvas;
      }
    }

    if (!sourceEl) return;

    try {
      setIsProcessingCameraFrame(true);
      const croppedCanvas = cropToROI(sourceEl, roi, 224, 224, analyzeFullImage);
      const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.85);
      setCroppedImageDataUrl(dataUrl);

      // Render to crop preview canvas
      if (canvasCropPreviewRef.current) {
        const pCtx = canvasCropPreviewRef.current.getContext('2d');
        if (pCtx) {
          pCtx.drawImage(croppedCanvas, 0, 0, 140, 140);
        }
      }

      if (isModelConnected) {
        const pred = await predictWithTeachableMachine(croppedCanvas);
        setAIPrediction(pred);
      }
    } catch (err) {
      console.warn('Camera frame processing error:', err);
    } finally {
      setIsProcessingCameraFrame(false);
    }
  }, [
    imageSource,
    isProcessingCameraFrame,
    isCameraActive,
    mockClass,
    roi,
    analyzeFullImage,
    isModelConnected,
    setAIPrediction,
    setCroppedImageDataUrl,
  ]);

  // Periodic frame loop when in camera mode
  useEffect(() => {
    if (imageSource !== 'CAMERA') return;
    const timer = setInterval(() => {
      processLiveCamera();
    }, 600);
    return () => clearInterval(timer);
  }, [imageSource, processLiveCamera]);

  // Handle Snapshot from Live Camera
  const handleLiveCameraSnapshot = () => {
    if (croppedImageDataUrl) {
      setLastSnapshotDataUrl(croppedImageDataUrl);
    }
  };

  // Handle Image Upload selection
  const handleImageSelected = (info: UploadedImageInfo) => {
    setUploadedImage(info);
    setTicketCreatedId(null);
  };

  // Handle Clearing uploaded image
  const handleClearUploadedImage = () => {
    setUploadedImage(null);
    setCroppedImageDataUrl(null);
    setTicketCreatedId(null);
  };

  // Handle Create Ticket for Blocked condition (Section 13)
  const handleCreateBlockedTicket = () => {
    const isBlocked = aiPrediction.topClass === 'BLOCKED';
    const noteText = isBlocked
      ? `Phát hiện cống bị rác phủ kín hoàn toàn (BLOCKED, độ tin cậy ${Math.round(aiPrediction.confidence * 100)}%). Cần cử công nhân xử lý khẩn cấp.`
      : `Phát hiện rác che một phần miệng cống (PARTIAL_BLOCKED, độ tin cậy ${Math.round(aiPrediction.confidence * 100)}%). Cần kiểm tra khơi thông.`;

    const newTicket = createTicket(
      noteText,
      croppedImageDataUrl || undefined,
      imageSource === 'UPLOAD' ? 'UPLOADED_IMAGE' : 'LIVE_CAMERA',
      uploadedImage?.dataUrl || undefined
    );

    setTicketCreatedId(newTicket.ticketNumber);
  };

  const isBlockedOrPartial =
    aiPrediction.topClass === 'BLOCKED' || aiPrediction.topClass === 'PARTIAL_BLOCKED';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header & Image Source Selector (Section 2) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                📷 CAMERA AI & VÙNG QUAN SÁT (ROI)
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                Thị giác máy tính
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Thuật toán tự động cắt đúng khu vực miệng cống (ROI) trước khi gửi vào Teachable Machine
            </p>
          </div>

          {/* Connected Model Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isModelConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isModelConnected ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'
                }`}
              />
              <span>{isModelConnected ? 'MODEL CONNECTED' : 'MOCK AI MODE'}</span>
            </span>
          </div>
        </div>

        {/* Section 2: Prominent Image Source Tab Bar */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            NGUỒN HÌNH ẢNH:
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {/* Tab 1: Live Camera */}
            <button
              type="button"
              onClick={() => setImageSource('CAMERA')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                imageSource === 'CAMERA'
                  ? 'bg-sky-600 text-white shadow-sky-600/30 ring-2 ring-sky-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>📷 CAMERA TRỰC TIẾP</span>
            </button>

            {/* Tab 2: Upload Image */}
            <button
              type="button"
              onClick={() => setImageSource('UPLOAD')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                imageSource === 'UPLOAD'
                  ? 'bg-sky-600 text-white shadow-sky-600/30 ring-2 ring-sky-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>🖼️ TẢI ẢNH TỪ MÁY</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Feed + ROI Selection & Pipeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Image Source Content */}
          {imageSource === 'CAMERA' ? (
            <CameraSource
              containerRef={containerRef}
              videoRef={videoRef}
              onSnapshot={handleLiveCameraSnapshot}
            />
          ) : (
            <div>
              {!uploadedImage ? (
                <ImageUploader onImageSelected={handleImageSelected} />
              ) : (
                <ImagePreview
                  imageInfo={uploadedImage}
                  onClearImage={handleClearUploadedImage}
                  onAnalysisComplete={(croppedDataUrl) => {
                    setCroppedImageDataUrl(croppedDataUrl);
                  }}
                />
              )}
            </div>
          )}

          {/* Section 8 & 9: ROI Processing Pipeline Visual Flowchart */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quy Trình Cắt ROI & Đưa Vào AI (Section 8 & 9)
                </h4>
                <p className="text-xs text-slate-400">
                  {analyzeFullImage
                    ? 'Chế độ: Đang phân tích toàn bộ ảnh (không dùng ROI)'
                    : 'Chế độ chuẩn: Cắt đúng vùng miệng cống (ROI 224×224 px)'}
                </p>
              </div>

              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pipeline Hoạt Động
              </span>
            </div>

            {/* Pipeline Step Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              {/* Step 1: Original Image */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                <div>
                  <div className="w-full h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-2 overflow-hidden">
                    {imageSource === 'CAMERA' ? (
                      <Camera className="w-6 h-6 text-sky-400" />
                    ) : (
                      <Upload className="w-6 h-6 text-sky-400" />
                    )}
                  </div>
                  <span className="font-bold text-slate-800 block">1. ẢNH GỐC</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Toàn cảnh đường phố</span>
              </div>

              {/* Step 2: Cắt ROI */}
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs flex flex-col justify-between">
                <div>
                  <div className="w-full h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 mb-2 font-mono text-[11px] font-bold">
                    {analyzeFullImage ? 'Toàn Ảnh' : `${roi.width}% × ${roi.height}%`}
                  </div>
                  <span className="font-bold text-indigo-950 block">2. CẮT ROI</span>
                </div>
                <span className="text-[10px] text-indigo-600 mt-1">Loại bỏ ngoại cảnh</span>
              </div>

              {/* Step 3: Vùng Miệng Cống Crop (Section 9) */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex flex-col justify-between">
                <div>
                  <div className="w-full h-16 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden mb-2 border border-emerald-300">
                    {croppedImageDataUrl ? (
                      <img
                        src={croppedImageDataUrl}
                        alt="Crop Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <canvas
                        ref={canvasCropPreviewRef}
                        width={140}
                        height={140}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="font-bold text-emerald-950 block leading-tight">
                    3. VÙNG MIỆNG CỐNG
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 mt-1 font-medium">
                  Chuẩn 224 × 224 px
                </span>
              </div>

              {/* Step 4: Teachable Machine */}
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs flex flex-col justify-between">
                <div>
                  <div className="w-full h-16 rounded-xl bg-sky-600 text-white flex flex-col items-center justify-center mb-2 font-bold shadow-sm">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span className="text-[10px] mt-0.5">PREDICT</span>
                  </div>
                  <span className="font-bold text-sky-950 block leading-tight">
                    4. TEACHABLE MACHINE
                  </span>
                </div>
                <span className="text-[10px] text-sky-700 mt-1 font-mono font-bold">
                  {aiPrediction.topClass}
                </span>
              </div>
            </div>

            {/* Educational Banner for Students/Judges (Section 8) */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <span className="text-base shrink-0">💡</span>
              <div>
                <strong className="font-bold">Tại sao phải crop ROI?</strong>
                <p className="mt-0.5 text-amber-800">
                  “Để AI chỉ tập trung vào miệng cống, không bị phân tâm bởi xe cộ, người đi đường hoặc cây cối xung quanh.”
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis, Ticket Trigger & Technical Debug (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Analysis Panel */}
          <AIAnalysis />

          {/* Section 13: Tạo Ticket Khi Phát Hiện Cống Tắc */}
          {isBlockedOrPartial && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-5 border-2 border-red-300 shadow-md space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-red-800 font-extrabold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                  <span>PHÁT HIỆN TẮC CỐNG TỪ {imageSource === 'UPLOAD' ? 'ẢNH TẢI LÊN' : 'CAMERA'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-900 font-mono font-bold text-xs">
                  {aiPrediction.topClass} ({Math.round(aiPrediction.confidence * 100)}%)
                </span>
              </div>

              <p className="text-xs text-red-900">
                Hệ thống nhận diện miệng cống đang bị rác che chắn. Cần khởi tạo Ticket điều phối công nhân đến khơi thông ngay trước khi mưa lớn gây ngập.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateBlockedTicket}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all active:scale-95"
                >
                  <TicketIcon className="w-4 h-4" />
                  <span>🎫 TẠO TICKET XỬ LÝ</span>
                </button>

                {ticketCreatedId && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('tickets')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs transition-all"
                  >
                    <span>Xem Ticket {ticketCreatedId}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {ticketCreatedId && (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Đã tạo thành công ticket <strong>{ticketCreatedId}</strong>! Đã đính kèm ảnh gốc và ảnh crop ROI.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Section 15: Log & Thông Tin Kỹ Thuật Debug Cho Giám Khảo */}
          <div className="bg-slate-900 text-slate-200 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowDebugPanel(!showDebugPanel)}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  THÔNG TIN KỸ THUẬT & DEBUG CHO GIÁM KHẢO (Section 15)
                </h4>
              </div>
              <button className="text-slate-400 hover:text-white">
                {showDebugPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showDebugPanel && (
              <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">imageSource:</span>
                  <span className="font-bold text-sky-400">{imageSource}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">originalImage:</span>
                  <span className="truncate max-w-[180px] text-right text-slate-200">
                    {imageSource === 'UPLOAD'
                      ? uploadedImage?.name || 'Chưa tải ảnh'
                      : isCameraActive
                      ? 'Live Webcam Stream (Environment)'
                      : 'Simulated Urban Road Feed'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">roi:</span>
                  <span className="text-amber-400">
                    {`{ x: ${roi.x}%, y: ${roi.y}%, w: ${roi.width}%, h: ${roi.height}% }`}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">croppedImage:</span>
                  <span className="text-emerald-400">
                    {analyzeFullImage ? 'Toàn ảnh (Bỏ qua ROI)' : '224 × 224 px (RGB Canvas)'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">topClass & confidence:</span>
                  <span className="font-bold text-white">
                    {aiPrediction.topClass} ({Math.round(aiPrediction.confidence * 100)}%)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">rain & water level:</span>
                  <span className="text-slate-200">
                    {rainMmPerHour} mm/h · Mực nước: {waterLevel}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">riskLevel (Rule Engine):</span>
                  <span
                    className={`font-bold ${
                      ruleResult.isHighRisk
                        ? 'text-red-400'
                        : ruleResult.riskLevel === 'WARNING'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {ruleResult.riskLevel}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Teachable Machine Model:</span>
                  <span className="text-slate-400 truncate max-w-[180px]">
                    {isModelConnected ? settings.teachableMachineUrl : 'Mock Prediction Session'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
