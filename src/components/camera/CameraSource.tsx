/**
 * @license
 * SMART ANTI-FLOOD AI - CameraSource Component
 * Live webcam feed with device selection, ROI overlay and real-time capture
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ROISelector } from './ROISelector';
import { Camera, CameraOff, VideoOff, ImageIcon, RefreshCw } from 'lucide-react';

interface CameraSourceProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onSnapshot: () => void;
}

export const CameraSource: React.FC<CameraSourceProps> = ({
  containerRef,
  videoRef,
  onSnapshot,
}) => {
  const {
    isCameraActive,
    setIsCameraActive,
    roi,
    setROI,
    saveROI,
    resetROI,
    mockClass,
  } = useApp();

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isROISetting, setIsROISetting] = useState<boolean>(false);
  const [flashSnapshot, setFlashSnapshot] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Enumerate cameras
  const getCameraDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevs);
      if (videoDevs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevs[0].deviceId);
      }
    } catch (err) {
      console.warn('Could not enumerate media devices:', err);
    }
  }, [selectedDeviceId]);

  // Start webcam
  const startCamera = async (deviceId?: string) => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      getCameraDevices();
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Không thể mở camera. Vui lòng cấp quyền truy cập webcam trong trình duyệt.');
      setIsCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleTakeSnapshot = () => {
    setFlashSnapshot(true);
    setTimeout(() => setFlashSnapshot(false), 200);
    onSnapshot();
  };

  return (
    <div className="space-y-4">
      {/* Top Status Bar per Section 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              isCameraActive ? 'bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider">
            {isCameraActive ? '🟢 CAMERA ĐANG HOẠT ĐỘNG' : '🔴 CAMERA CHƯA BẬT'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              onClick={() => startCamera(selectedDeviceId)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow transition-all active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>BẬT CAMERA</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-all"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>TẮT CAMERA</span>
            </button>
          )}

          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                if (isCameraActive) startCamera(e.target.value);
              }}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-1.5 font-medium"
            >
              {devices.map((d, idx) => (
                <option key={d.deviceId || idx} value={d.deviceId}>
                  {d.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleTakeSnapshot}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            title="Chụp ảnh khung hình hiện tại"
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-300" />
            <span>CHỤP ẢNH</span>
          </button>
        </div>
      </div>

      {/* Main Video Screen with ROI Overlay */}
      <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-800 relative">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center select-none"
        >
          {/* Flash animation */}
          {flashSnapshot && (
            <div className="absolute inset-0 bg-white z-30 transition-opacity" />
          )}

          {/* Video Stream */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : 'block'}`}
          />

          {/* Fallback mock feed when webcam is off */}
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <VideoOff className="w-8 h-8 text-slate-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">
                Camera Đang Tắt (Đang dùng Khung Mô Phỏng)
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                Nhấn [BẬT CAMERA] ở trên để cấp quyền webcam, hoặc chuyển sang tab [🖼️ TẢI ẢNH TỪ MÁY] để chọn ảnh cống có sẵn.
              </p>
              <button
                onClick={() => startCamera(selectedDeviceId)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow"
              >
                BẬT CAMERA NGAY
              </button>

              <div className="mt-4 p-2 rounded-lg bg-black/40 border border-white/10 text-[11px] text-slate-300 font-mono">
                Mô phỏng camera thực địa: Cống ngầm ({mockClass})
              </div>
            </div>
          )}

          {/* Scanning line animation */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-75 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />

          {/* ROI Overlay */}
          <ROISelector
            roi={roi}
            onChange={setROI}
            onSave={saveROI}
            onReset={resetROI}
            isEditing={isROISetting}
            setIsEditing={setIsROISetting}
            containerRef={containerRef}
          />
        </div>

        {cameraError && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {cameraError}
          </div>
        )}
      </div>
    </div>
  );
};
