/**
 * @license
 * SMART ANTI-FLOOD AI - ImageUploader Component (Section 4, 5 & 19)
 * Drag & Drop uploader, file validation (JPG/PNG/WEBP <= 10MB) and 4 Demo Sample Cards
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_SAMPLE_IMAGES } from '../../services/sampleImages';
import { UploadedImageInfo, SampleImage } from '../../types';
import {
  UploadCloud,
  ImageIcon,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  FolderOpen,
  X,
  FileCheck,
} from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (info: UploadedImageInfo) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const { setMockClass } = useApp();

  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validation 1: Allowed extensions / types (Section 5)
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidType =
      validExtensions.includes(ext) ||
      file.type.startsWith('image/jpeg') ||
      file.type.startsWith('image/png') ||
      file.type.startsWith('image/webp');

    if (!isValidType) {
      setErrorMessage('⚠️ FILE KHÔNG HỢP LỆ: Vui lòng chọn hình ảnh JPG, PNG hoặc WEBP.');
      return;
    }

    // Validation 2: Max 10MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('⚠️ ẢNH QUÁ LỚN: Vui lòng chọn ảnh nhỏ hơn 10 MB.');
      return;
    }

    // Read file via FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const info: UploadedImageInfo = {
          id: `img-${Date.now()}`,
          name: file.name,
          sizeBytes: file.size,
          sizeFormatted: formatFileSize(file.size),
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          dataUrl,
        };
        onImageSelected(info);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSelectSample = (sample: SampleImage) => {
    setErrorMessage(null);
    setMockClass(sample.classLabel);

    const img = new Image();
    img.onload = () => {
      const info: UploadedImageInfo = {
        id: `sample-${sample.id}-${Date.now()}`,
        name: `${sample.classLabel.toLowerCase()}_demo.png`,
        sizeBytes: 154000,
        sizeFormatted: '154 KB',
        width: 640,
        height: 480,
        dataUrl: sample.url,
      };
      onImageSelected(info);
    };
    img.src = sample.url;
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Upload Zone per Section 4 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-sky-500 bg-sky-50/70 scale-[0.99] shadow-inner ring-4 ring-sky-200'
            : 'border-slate-300 hover:border-sky-400 bg-white hover:bg-slate-50 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
          KÉO THẢ ẢNH VÀO ĐÂY
        </h3>
        <p className="text-xs text-slate-500 mb-4">hoặc nhấn để duyệt file từ máy tính</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 transition-all"
        >
          <FolderOpen className="w-4 h-4" />
          <span>CHỌN ẢNH TỪ MÁY</span>
        </button>

        <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-400 font-medium">
          Hỗ trợ: <strong>JPG • JPEG • PNG • WEBP</strong> (Tối đa 10 MB)
        </div>
      </div>

      {/* Error alert if validation fails */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-semibold">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Section 19: ẢNH DEMO (Sample Images) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ẢNH DEMO MẪU CHO BUỔI THUYẾT TRÌNH (SECTION 19)</span>
          </div>
          <span className="text-[11px] text-slate-500">Nhấn để nạp ảnh ngay lập tức</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEFAULT_SAMPLE_IMAGES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="bg-white rounded-2xl border border-slate-200 p-3 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 mb-2 relative">
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white uppercase">
                    {sample.classLabel}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {sample.description}
                </p>
              </div>

              <button
                type="button"
                className="mt-3 w-full py-1.5 px-2 rounded-lg bg-slate-100 group-hover:bg-sky-50 group-hover:text-sky-700 text-slate-700 font-bold text-[11px] transition-colors"
              >
                Nạp Ảnh Này ➔
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
