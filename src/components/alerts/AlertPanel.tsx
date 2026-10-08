/**
 * @license
 * SMART ANTI-FLOOD AI - Alert & Rule Engine Screen
 * Clear evaluation of multi-sensor conditions, cause breakdown, and ticket creation
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ShieldAlert,
  Brain,
  CheckCircle2,
  Ticket as TicketIcon,
  Check,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const AlertPanel: React.FC = () => {
  const {
    ruleResult,
    rainMmPerHour,
    waterLevel,
    aiPrediction,
    settings,
    createTicket,
    setActiveTab,
  } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const confidencePercent = Math.round(aiPrediction.confidence * 100);

  const handleCreateTicket = () => {
    const t = createTicket();
    setCreatedTicketId(t.ticketNumber);
  };

  const getRiskHeader = () => {
    switch (ruleResult.riskLevel) {
      case 'HIGH':
        return {
          bg: 'bg-red-600',
          border: 'border-red-500',
          badge: '🔴 MỨC CẢNH BÁO CAO NHẤT',
          title: '🚨 NGUY CƠ NGẬP CAO',
          desc: 'Tình trạng khẩn cấp: Miệng cống bị tắc nghẽn nặng nề trong khi lượng mưa lớn kéo dài!',
          icon: ShieldAlert,
        };
      case 'WARNING':
        return {
          bg: 'bg-orange-500',
          border: 'border-orange-400',
          badge: '🟠 MỨC CẢNH BÁO TRUNG BÌNH',
          title: '⚠️ NGUY CƠ NGẬP CỤC BỘ',
          desc: 'Miệng cống bị rác cản trở một phần hoặc mực nước tại hố ga đang dâng cao.',
          icon: AlertTriangle,
        };
      case 'WATCH':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-400',
          badge: '🟡 MỨC THEO DÕI',
          title: '👀 THEO DÕI MIỆNG CỐNG',
          desc: 'Có rác thải gần miệng cống hoặc trời bắt đầu có mưa rào.',
          icon: AlertTriangle,
        };
      case 'NORMAL':
      default:
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-500',
          badge: '🟢 MỨC AN TOÀN',
          title: '✅ BÌNH THƯỜNG – HỆ THỐNG AN TOÀN',
          desc: 'Miệng cống thông thoáng, khả năng tiêu thoát nước vận hành ở trạng thái tối ưu.',
          icon: CheckCircle2,
        };
    }
  };

  const header = getRiskHeader();
  const Icon = header.icon;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              🚨 MÀN HÌNH CẢNH BÁO & RULE ENGINE
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
              Quyết định theo Luật
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Không phải AI phỏng đoán cảm tính – Thuật toán Rule Engine kiểm tra chính xác các mệnh đề logic
          </p>
        </div>

        {/* Chime Toggle (Non-annoying per Section 13) */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            soundEnabled
              ? 'bg-sky-50 border-sky-300 text-sky-800'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
          title="Bật/Tắt âm báo nhẹ khi có nguy cơ cao"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>{soundEnabled ? 'Âm thông báo: BẬT' : 'Âm thông báo: TẮT'}</span>
        </button>
      </div>

      {/* Main Alert Card per Section 13 */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all relative overflow-hidden ${header.bg} ${
          ruleResult.isHighRisk ? 'ring-4 ring-red-400/50' : ''
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
              {header.badge}
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                {header.title}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-white/90 font-medium">
              {header.desc}
            </p>

            {/* Causes Breakdown Checklist per Section 13 */}
            <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 block mb-1">
                Các Nguyên Nhân Trực Tiếp Kích Hoạt Cảnh Báo:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    Mưa lớn:{' '}
                    <strong className="font-mono text-amber-200">
                      {rainMmPerHour} mm/h
                    </strong>
                  </span>
                </div>

                <div className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    AI phát hiện:{' '}
                    <strong className="font-mono text-amber-200">
                      {aiPrediction.topClass} ({confidencePercent}%)
                    </strong>
                  </span>
                </div>

                <div className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    Mực nước:{' '}
                    <strong className="font-mono text-amber-200">{waterLevel}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: [ TẠO TICKET XỬ LÝ ] */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <button
              onClick={handleCreateTicket}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-xl transition-all active:scale-95 whitespace-nowrap"
            >
              <TicketIcon className="w-5 h-5 text-sky-600" />
              <span>TẠO TICKET XỬ LÝ</span>
            </button>

            {createdTicketId && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Đã tạo {createdTicketId}!</span>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className="underline ml-1 hover:text-amber-200"
                >
                  Xem ngay ➔
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transparent Logic Inspection: The Rule Engine Table (Section 12 & 29) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bảng Quyết Định Logic Của Rule Engine
              </h3>
              <p className="text-xs text-slate-500">
                Giải thích minh bạch cách thuật toán tính toán mức độ rủi ro từ các thông số đầu vào
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-mono">
            {ruleResult.matchedRules[0] || 'RULE_EVAL'}
          </span>
        </div>

        {/* Rule Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mức Cảnh Báo</th>
                <th className="py-3 px-4">Điều Kiện Lượng Mưa</th>
                <th className="py-3 px-4">Điều Kiện Camera AI</th>
                <th className="py-3 px-4">Độ Tin Cậy AI</th>
                <th className="py-3 px-4">Mực Nước</th>
                <th className="py-3 px-4 text-center">Trạng Thái Khớp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Row 1: High Risk */}
              <tr
                className={`transition-colors ${
                  ruleResult.riskLevel === 'HIGH' ? 'bg-red-50/80 font-bold' : ''
                }`}
              >
                <td className="py-3 px-4 text-red-600">🔴 HIGH RISK (CẤP CAO)</td>
                <td className="py-3 px-4 font-mono">&gt; 50 mm/h</td>
                <td className="py-3 px-4 font-mono">BLOCKED</td>
                <td className="py-3 px-4 font-mono">&ge; {settings.confidenceThreshold}%</td>
                <td className="py-3 px-4 font-mono">HIGH (Ưu tiên tăng)</td>
                <td className="py-3 px-4 text-center">
                  {ruleResult.riskLevel === 'HIGH' ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px]">
                      KÍCH HOẠT
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>

              {/* Row 2: Warning */}
              <tr
                className={`transition-colors ${
                  ruleResult.riskLevel === 'WARNING' ? 'bg-orange-50/80 font-bold' : ''
                }`}
              >
                <td className="py-3 px-4 text-orange-600">🟠 WARNING (NGUY CƠ)</td>
                <td className="py-3 px-4 font-mono">&gt; 50 mm/h</td>
                <td className="py-3 px-4 font-mono">PARTIAL_BLOCKED</td>
                <td className="py-3 px-4 font-mono">Bất kỳ</td>
                <td className="py-3 px-4 font-mono">MEDIUM hoặc HIGH</td>
                <td className="py-3 px-4 text-center">
                  {ruleResult.riskLevel === 'WARNING' ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-bold text-[10px]">
                      KÍCH HOẠT
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>

              {/* Row 3: Watch */}
              <tr
                className={`transition-colors ${
                  ruleResult.riskLevel === 'WATCH' ? 'bg-amber-50/80 font-bold' : ''
                }`}
              >
                <td className="py-3 px-4 text-amber-600">🟡 WATCH (THEO DÕI)</td>
                <td className="py-3 px-4 font-mono">&ge; 20 mm/h</td>
                <td className="py-3 px-4 font-mono">TRASH_NEARBY</td>
                <td className="py-3 px-4 font-mono">Bất kỳ</td>
                <td className="py-3 px-4 font-mono">LOW / MEDIUM</td>
                <td className="py-3 px-4 text-center">
                  {ruleResult.riskLevel === 'WATCH' ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px]">
                      KÍCH HOẠT
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>

              {/* Row 4: Normal */}
              <tr
                className={`transition-colors ${
                  ruleResult.riskLevel === 'NORMAL' ? 'bg-emerald-50/80 font-bold' : ''
                }`}
              >
                <td className="py-3 px-4 text-emerald-600">🟢 NORMAL (BÌNH THƯỜNG)</td>
                <td className="py-3 px-4 font-mono">&lt; 20 mm/h</td>
                <td className="py-3 px-4 font-mono">CLEAR</td>
                <td className="py-3 px-4 font-mono">Bất kỳ</td>
                <td className="py-3 px-4 font-mono">LOW</td>
                <td className="py-3 px-4 text-center">
                  {ruleResult.riskLevel === 'NORMAL' ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      KÍCH HOẠT
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Recommendation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Khuyến Nghị Xử Lý Hiện Thời:
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              {ruleResult.actionRecommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
