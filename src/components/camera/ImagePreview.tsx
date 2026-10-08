/**
 * @license
 * SMART ANTI-FLOOD AI - ImagePreview Component (Section 6, 7, 8, 9, 11 & 14)
 * Large image preview, metadata tags, interactive ROI overlay, whole-image toggle, and AI analysis trigger
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UploadedImageInfo, ROIBounds } from '../../types';
import { ROISelector } from './ROISelector';
import { cropToROI, predictWithTeachableMachine, generateMockPrediction } from '../../services/teachableMachine';
import {
  Maximize2,
  Brain,
  RotateCcw,
  Sparkles,
  FileText,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ImagePreviewProps {
  imageInfo: UploadedImageInfo;
  onClearImage: () => void;
  onAnalysisComplete: (croppedDataUrl: string) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageInfo,
  onClearImage,
  onAnalysisComplete,
}) => {
  const {
    roi,
    setROI,
    saveROI,
    resetROI,
    isModelConnected,
    setAIPrediction,
    mockClass,
    analyzeFullImage,
    setAnalyzeFullImage,
    isAnalyzingImage,
    setIsAnalyzingImage,
    setCroppedImageDataUrl,
    setLastSnapshotDataUrl,
    setUploadedImage,
  } = useApp();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const [isROISetting, setIsROISetting] = useState<boolean>(false);

  // Perform Crop and AI Prediction on uploaded photo
  const handleAnalyze = async () => {
    if (!imageElementRef.current) return;
    setIsAnalyzingImage(true);

    try {
      // 1. Crop to ROI (Section 9) or full image (Section 14)
      const croppedCanvas = cropToROI(
        imageElementRef.current,
        roi,
        224,
        224,
        analyzeFullImage
      );
      const croppedDataUrl = croppedCanvas.toDataURL('image/jpeg', 0.9);
      setCroppedImageDataUrl(croppedDataUrl);
      setLastSnapshotDataUrl(croppedDataUrl);
      onAnalysisComplete(croppedDataUrl);

      // Brief animation pause for dramatic presentation feedback
      await new Promise((r) => setTimeout(r, 450));

      // 2. Predict with Teachable Machine (or Mock)
      if (isModelConnected) {
        const pred = await predictWithTeachableMachine(croppedCanvas);
        setAIPrediction(pred);
      } else {
        const mockPred = generateMockPrediction(mockClass);
        setAIPrediction(mockPred);
      }
    } catch (err) {
      console.error('Error during image analysis:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Run crop on mount or ROI change so preview is ready
  useEffect(() => {
    if (!imageElementRef.current) return;
    const croppedCanvas = cropToROI(imageElementRef.current, roi, 224, 224, analyzeFullImage);
    const croppedDataUrl = croppedCanvas.toDataURL('image/jpeg', 0.85);
    setCroppedImageDataUrl(croppedDataUrl);
  }, [roi, analyzeFullImage]);

  return (
    <div className="space-y-4">
      {/* Image Stage Container */}
      <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-800 relative">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center select-none"
        >
          {/* Main Original Image */}
          <img
            ref={imageElementRef}
            src={imageInfo.dataUrl}
            alt={imageInfo.name}
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
          />

          {/* Scanning line animation during AI analysis */}
          {isAnalyzingImage && (
            <div className="absolute inset-0 z-30 bg-sky-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
              <div className="w-14 h-14 rounded-2xl bg-sky-600/90 flex items-center justify-center shadow-lg animate-pulse mb-3">
                <Brain className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="text-sm font-extrabold tracking-wider animate-pulse">
                AI ĐANG PHÂN TÍCH MIỆNG CỐNG...
              </div>
              <div className="text-xs text-sky-200 mt-1 font-mono">
                {analyzeFullImage ? 'Toàn bộ hình ảnh' : `ROI: ${roi.width}% × ${roi.height}%`}
              </div>
            </div>
          )}

          {/* ROI Overlay - Active only if NOT in analyzeFullImage mode */}
          {!analyzeFullImage && (
            <ROISelector
              roi={roi}
              onChange={setROI}
              onSave={saveROI}
              onReset={resetROI}
              isEditing={isROISetting}
              setIsEditing={setIsROISetting}
              containerRef={containerRef}
            />
          )}

          {analyzeFullImage && (
            <div className="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm border border-indigo-400">
              Đang chọn: PHÂN TÍCH TOÀN BỘ ẢNH (Bỏ qua ROI)
            </div>
          )}
        </div>

        {/* Section 6: Image Metadata Information Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white max-w-[200px] truncate" title={imageInfo.name}>
              {imageInfo.name}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-400">
              {imageInfo.width} × {imageInfo.height} px
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-400">{imageInfo.sizeFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearImage}
              className="flex items-center gap-1 text-slate-400 hover:text-red-400 font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa / Thay ảnh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Buttons & Section 14 Toggle */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* ROI Control Buttons (Section 7 & 8) */}
          <div className="flex flex-wrap items-center gap-2">
            {!analyzeFullImage && (
              <>
                <button
                  type="button"
                  onClick={() => setIsROISetting(!isROISetting)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isROISetting
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isROISetting ? 'XONG KÉO ROI' : '🎯 CHỌN VÙNG MIỆNG CỐNG'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetROI();
                    setIsROISetting(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  title="Đặt lại khung về giữa ảnh"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET ROI</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClearImage}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>THAY ẢNH KHÁC</span>
            </button>
          </div>

          {/* Big Trigger Analysis Button (Section 10) */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzingImage}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            <Brain className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzingImage ? 'ĐANG PHÂN TÍCH...' : '🧠 PHÂN TÍCH BẰNG AI'}</span>
          </button>
        </div>

        {/* Section 11: So Sánh 2 Chế Độ (Checkbox Phân Tích Toàn Bộ Ảnh vs Dùng ROI) */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={analyzeFullImage}
                onChange={(e) => setAnalyzeFullImage(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
              <span>PHÂN TÍCH TOÀN BỘ ẢNH (BỎ QUA ROI)</span>
            </label>

            {analyzeFullImage ? (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>⚠️ Cảnh báo: AI có thể nhận diện sai vì có quá nhiều vật thể xung quanh.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Đang dùng chế độ chuẩn: Cắt đúng ROI miệng cống để đạt độ chính xác cao nhất</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 14: Quick Sample Switcher directly inside preview */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Đổi nhanh sang 4 kịch bản mẫu (Section 14):
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'clear', label: '🟢 Cống sạch', cls: 'CLEAR', name: 'clear_sample.png' },
              { id: 'trash', label: '🟡 Có rác gần cống', cls: 'TRASH_NEARBY', name: 'trash_nearby_sample.png' },
              { id: 'partial', label: '🟠 Cống tắc một phần', cls: 'PARTIAL_BLOCKED', name: 'partial_blocked_sample.png' },
              { id: 'blocked', label: '🔴 Cống tắc hoàn toàn', cls: 'BLOCKED', name: 'blocked_sample.png' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={async () => {
                  const sampleObj = (await import('../../services/sampleImages')).DEFAULT_SAMPLE_IMAGES.find(
                    (s) => s.classLabel === item.cls
                  );
                  if (sampleObj) {
                    const img = new Image();
                    img.onload = () => {
                      const newInfo = {
                        id: `sample-${Date.now()}`,
                        name: item.name,
                        sizeBytes: 154000,
                        sizeFormatted: '154 KB',
                        width: 640,
                        height: 480,
                        dataUrl: sampleObj.url,
                      };
                      // reset ROI to default center
                      resetROI();
                      // update app context
                      setUploadedImage(newInfo);
                    };
                    img.src = sampleObj.url;
                  }
                }}
                className="py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-slate-800 text-[11px] font-bold text-center transition-all truncate"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
