/**
 * @license
 * SMART ANTI-FLOOD AI - AI Analysis Component
 * Pedagogically precise Teachable Machine inference display with threshold evaluation
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AIClassType } from '../../types';
import { Brain, CheckCircle2, AlertTriangle, Settings, HelpCircle, Sparkles } from 'lucide-react';

export const AIAnalysis: React.FC = () => {
  const {
    isModelConnected,
    modelSession,
    aiPrediction,
    mockClass,
    setMockClass,
    settings,
    updateSettings,
    setActiveTab,
  } = useApp();

  const thresholdPercent = settings.confidenceThreshold;
  const topConfidencePercent = Math.round(aiPrediction.confidence * 100);
  const isConfidenceSufficient = topConfidencePercent >= thresholdPercent;

  // Metadata for the 4 core classes
  const classDescriptions: Record<string, { label: string; desc: string; color: string; barColor: string }> = {
    CLEAR: {
      label: 'CLEAR',
      desc: '🟢 Cống thông thoáng, thu nước tốt',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      barColor: 'bg-emerald-500',
    },
    TRASH_NEARBY: {
      label: 'TRASH_NEARBY',
      desc: '🟡 Có rác gần cống nhưng chưa che cống',
      color: 'text-amber-700 bg-amber-50 border-amber-300',
      barColor: 'bg-amber-500',
    },
    PARTIAL_BLOCKED: {
      label: 'PARTIAL_BLOCKED',
      desc: '🟠 Rác che một phần miệng cống',
      color: 'text-orange-700 bg-orange-50 border-orange-300',
      barColor: 'bg-orange-500',
    },
    BLOCKED: {
      label: 'BLOCKED',
      desc: '🔴 Cống có dấu hiệu bị rác che nhiều',
      color: 'text-red-700 bg-red-50 border-red-300',
      barColor: 'bg-red-500',
    },
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
      {/* Header & Model Connectivity */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                AI ANALYSIS
              </h3>
              <p className="text-[11px] text-slate-500">
                Thị giác máy tính (Teachable Machine Model)
              </p>
            </div>
          </div>

          {/* Connection Pill */}
          <div
            onClick={() => setActiveTab('settings')}
            className={`cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              isModelConnected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
            title="Bấm để cấu hình URL Teachable Machine"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isModelConnected ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            />
            <span>{isModelConnected ? 'MODEL CONNECTED' : 'MOCK AI SẴN SÀNG'}</span>
          </div>
        </div>

        {/* Warning if model is not yet connected */}
        {!isModelConnected && (
          <div className="mb-4 bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">⚠️ Chưa kết nối URL Teachable Machine.</span>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Hệ thống đang chạy chế độ mô phỏng (Mock AI) cho buổi thuyết trình.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] whitespace-nowrap shadow-sm"
              >
                CẤU HÌNH NGAY
              </button>
            </div>

            {/* Quick Mock AI Class Selector for Students */}
            <div className="mt-3 pt-2.5 border-t border-amber-200/60">
              <span className="text-[11px] font-bold text-amber-900 block mb-1.5">
                Mô phỏng nhanh tình trạng camera:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['CLEAR', 'TRASH_NEARBY', 'PARTIAL_BLOCKED', 'BLOCKED'] as AIClassType[]).map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setMockClass(cls)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${
                      mockClass === cls
                        ? 'bg-amber-700 text-white shadow-sm ring-1 ring-amber-800'
                        : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Highlighted Top Class Result */}
        <div
          className={`p-4 rounded-xl border-2 mb-4 transition-all ${
            classDescriptions[aiPrediction.topClass]?.color || 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Kết Quả Nhận Diện Chính
            </span>
            <span className="text-xs font-mono font-bold">
              Độ tin cậy: {topConfidencePercent}%
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-black tracking-tight mb-1">
            {aiPrediction.topClass}
          </div>

          <p className="text-xs font-medium">
            {classDescriptions[aiPrediction.topClass]?.desc || 'Phân loại hình ảnh từ model'}
          </p>

          {/* Section 8 & 29 Mandatory Phrasing */}
          <div className="mt-3 pt-2.5 border-t border-black/10 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              “AI nhận diện <strong>{aiPrediction.topClass}</strong> với độ tin cậy{' '}
              <strong>{topConfidencePercent}%</strong>.”
            </span>
          </div>
        </div>

        {/* Probability Breakdown Bar List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>XÁC SUẤT CÁC PHÂN LỚP (CLASSES)</span>
            <span className="text-[11px] font-normal text-slate-400">Softmax Output</span>
          </div>

          {aiPrediction.classes.map((cls) => {
            const pct = Math.round(cls.probability * 100);
            const isWinner = cls.name === aiPrediction.topClass;
            const desc = classDescriptions[cls.name];

            return (
              <div
                key={cls.name}
                className={`p-2.5 rounded-xl border transition-all ${
                  isWinner
                    ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-100 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isWinner ? 'text-indigo-950' : 'text-slate-700'}`}>
                      {cls.name}
                    </span>
                    {desc && (
                      <span className="text-[11px] text-slate-500 hidden sm:inline truncate">
                        ({desc.desc.slice(3)})
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {pct}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(2, pct)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      desc?.barColor || (isWinner ? 'bg-indigo-600' : 'bg-slate-400')
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confidence Threshold Section per Section 9 */}
      <div className="pt-3 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Ngưỡng Cảnh Báo (Confidence Threshold):
            </span>
            <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {thresholdPercent}%
            </span>
          </div>

          {/* Slider to adjust threshold (50% - 100%) */}
          <input
            type="range"
            min="50"
            max="100"
            value={thresholdPercent}
            onChange={(e) => updateSettings({ confidenceThreshold: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>50% (Nhạy hơn)</span>
            <span>Mặc định: 80%</span>
            <span>100% (Nghiêm ngặt)</span>
          </div>

          {/* Verification comparison */}
          <div
            className={`mt-2 p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              isConfidenceSufficient
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isConfidenceSufficient ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Độ tin cậy {topConfidencePercent}% ≥ {thresholdPercent}%: Đủ điều kiện kích hoạt Rule Engine.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Độ tin cậy {topConfidencePercent}% &lt; {thresholdPercent}%: Chưa đủ độ tin cậy để cảnh báo.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Pedagogical Note per Section 8 & 29 */}
        <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Lưu ý khoa học:</strong> Độ tin cậy (Confidence) là xác suất thống kê mô hình AI nhận diện,
            hoàn toàn không phải là phần trăm diện tích cống bị che phủ.
          </p>
        </div>
      </div>
    </div>
  );
};
