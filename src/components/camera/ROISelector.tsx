/**
 * @license
 * SMART ANTI-FLOOD AI - ROI (Region of Interest) Selector
 * Interactive draggable and resizable rectangle overlay on video frame
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ROIBounds } from '../../types';
import { Maximize2, Move, RotateCcw, Check } from 'lucide-react';

interface ROISelectorProps {
  roi: ROIBounds;
  onChange: (bounds: ROIBounds) => void;
  onSave: (bounds: ROIBounds) => void;
  onReset: () => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ROISelector: React.FC<ROISelectorProps> = ({
  roi,
  onChange,
  onSave,
  onReset,
  isEditing,
  setIsEditing,
  containerRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialROI, setInitialROI] = useState<ROIBounds>(roi);

  const handleMouseDownMove = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialROI({ ...roi });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialROI({ ...roi });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dxPercent = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dyPercent = ((e.clientY - dragStart.y) / rect.height) * 100;

    if (isDragging) {
      const newX = Math.max(0, Math.min(100 - initialROI.width, initialROI.x + dxPercent));
      const newY = Math.max(0, Math.min(100 - initialROI.height, initialROI.y + dyPercent));
      onChange({
        ...initialROI,
        x: Math.round(newX),
        y: Math.round(newY),
      });
    } else if (isResizing) {
      const newW = Math.max(15, Math.min(100 - initialROI.x, initialROI.width + dxPercent));
      const newH = Math.max(15, Math.min(100 - initialROI.y, initialROI.height + dyPercent));
      onChange({
        ...initialROI,
        width: Math.round(newW),
        height: Math.round(newH),
      });
    }
  }, [containerRef, dragStart, initialROI, isDragging, isResizing, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* The ROI Frame */}
      <div
        style={{
          left: `${roi.x}%`,
          top: `${roi.y}%`,
          width: `${roi.width}%`,
          height: `${roi.height}%`,
        }}
        className={`absolute border-2 transition-shadow select-none ${
          isEditing
            ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/50 cursor-move shadow-xl'
            : 'border-red-500 bg-red-500/10'
        }`}
        onMouseDown={handleMouseDownMove}
      >
        {/* Label on top */}
        <div className="absolute -top-7 left-0 bg-red-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>VÙNG AI ĐANG QUAN SÁT (ROI)</span>
        </div>

        {/* Center crosshair for alignment */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-6 h-0.5 bg-white" />
          <div className="h-6 w-0.5 bg-white absolute" />
        </div>

        {/* Corner Coordinates */}
        <div className="absolute bottom-1 right-2 text-[10px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded pointer-events-none">
          {roi.width}% × {roi.height}%
        </div>

        {/* Resize Handle at Bottom-Right */}
        {isEditing && (
          <div
            onMouseDown={handleMouseDownResize}
            className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 cursor-nwse-resize flex items-center justify-center text-slate-900 shadow-md hover:scale-125 transition-transform"
            title="Kéo để thay đổi kích thước"
          >
            <Maximize2 className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* ROI Toolbar below/overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white text-xs">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Move className="w-3.5 h-3.5 animate-bounce" />
              Kéo di chuyển hoặc co giãn khung
            </span>
          ) : (
            <span className="text-slate-300">
              Đang cố định khung miệng cống
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  onSave(roi);
                  setIsEditing(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>LƯU ROI</span>
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
                title="Đặt lại kích thước mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>CHỌN VÙNG MIỆNG CỐNG</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
