/**
 * @license
 * SMART ANTI-FLOOD AI - Dashboard View
 * Primary presentation dashboard with system diagram and 4 live status cards
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CloudRain,
  Camera,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Brain,
  Ticket as TicketIcon,
  ShieldAlert,
  CheckCircle,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    rainMmPerHour,
    waterLevel,
    waterPercentage,
    aiPrediction,
    ruleResult,
    setActiveTab,
    createTicket,
    setDemoModeActive,
  } = useApp();

  // Status card styling based on conditions
  const getRainStatus = () => {
    if (rainMmPerHour < 20) {
      return { label: 'BÌNH THƯỜNG', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
    }
    if (rainMmPerHour <= 50) {
      return { label: 'SẴN SÀNG CẢNH BÁO', color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
    }
    return { label: 'MƯA LỚN (CẤP 2)', color: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-500' };
  };

  const getAIStatusColor = () => {
    switch (aiPrediction.topClass) {
      case 'CLEAR':
        return { text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', label: 'CỐNG THÔNG THOÁNG' };
      case 'TRASH_NEARBY':
        return { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'CÓ RÁC GẦN CỐNG' };
      case 'PARTIAL_BLOCKED':
        return { text: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', label: 'BỊ CHE MỘT PHẦN' };
      case 'BLOCKED':
      default:
        return { text: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'CỐNG BỊ RÁC CHE NHIỀU' };
    }
  };

  const getWaterStatusColor = () => {
    switch (waterLevel) {
      case 'LOW':
        return { text: 'text-sky-700', bg: 'bg-sky-50 border-sky-200', label: 'MỨC THẤP (AN TOÀN)' };
      case 'MEDIUM':
        return { text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'MỨC TRUNG BÌNH' };
      case 'HIGH':
      default:
        return { text: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'MỨC CAO (Ứ ĐỌNG)' };
    }
  };

  const getRiskStatusCard = () => {
    switch (ruleResult.riskLevel) {
      case 'NORMAL':
        return {
          title: 'AN TOÀN',
          desc: '🟢 BÌNH THƯỜNG',
          bg: 'bg-emerald-500 text-white',
          badge: 'bg-emerald-600 text-white',
          border: 'border-emerald-600',
        };
      case 'WATCH':
        return {
          title: 'THEO DÕI',
          desc: '🟡 SẴN SÀNG',
          bg: 'bg-amber-500 text-white',
          badge: 'bg-amber-600 text-white',
          border: 'border-amber-600',
        };
      case 'WARNING':
        return {
          title: 'NGUY CƠ',
          desc: '🟠 CẦN CHÚ Ý',
          bg: 'bg-orange-500 text-white',
          badge: 'bg-orange-600 text-white',
          border: 'border-orange-600',
        };
      case 'HIGH':
      default:
        return {
          title: 'NGUY CƠ NGẬP CAO',
          desc: '🔴 CẢNH BÁO CẤP CAO',
          bg: 'bg-red-600 text-white animate-pulse',
          badge: 'bg-red-700 text-white',
          border: 'border-red-700',
        };
    }
  };

  const rainStatus = getRainStatus();
  const aiStatus = getAIStatusColor();
  const waterStatus = getWaterStatusColor();
  const riskStatus = getRiskStatusCard();
  const confidencePercent = Math.round(aiPrediction.confidence * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-sky-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Dự án Sáng Tạo Trẻ – Đội NEWTON AI</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              SMART ANTI-FLOOD AI
            </h2>

            <p className="text-sm sm:text-base text-sky-100 font-medium mb-3">
              “Hệ thống AI hỗ trợ phát hiện cống bị tắc và cảnh báo sớm nguy cơ ngập.”
            </p>

            <div className="inline-block px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-400/30 text-xs font-bold text-sky-200 tracking-wider">
              “PHÁT HIỆN SỚM – CẢNH BÁO SỚM – HÀNH ĐỘNG SỚM”
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('camera')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/30 transition-all active:scale-95 whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              <span>Mở Camera AI</span>
            </button>
            <button
              onClick={() => setDemoModeActive(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Bật Kịch Bản Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Sơ đồ Hệ thống (Architecture Pipeline Diagram per Section 3) */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Sơ đồ Vận hành Luồng Dữ liệu Toàn Hệ thống
            </h3>
            <p className="text-xs text-slate-500">
              Dữ liệu cảm biến và hình ảnh camera được Rule Engine tổng hợp tức thì để ra quyết định
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
            Realtime Pipeline
          </span>
        </div>

        {/* Diagram Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          {/* Input Block: Rain + Camera + Water */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>1. Dữ liệu Thu thập</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div
              onClick={() => setActiveTab('rain')}
              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:border-sky-400 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                <span>🌧 LƯỢNG MƯA</span>
              </div>
              <span className="font-mono font-bold text-blue-600">{rainMmPerHour} mm/h</span>
            </div>

            <div
              onClick={() => setActiveTab('camera')}
              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:border-sky-400 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Camera className="w-3.5 h-3.5 text-indigo-500" />
                <span>📷 CAMERA AI</span>
              </div>
              <span className="font-mono font-bold text-indigo-600">{aiPrediction.topClass} ({confidencePercent}%)</span>
            </div>

            <div
              onClick={() => setActiveTab('rain')}
              className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:border-sky-400 transition-colors"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>💧 MỰC NƯỚC</span>
              </div>
              <span className="font-mono font-bold text-sky-600">{waterLevel} ({waterPercentage}%)</span>
            </div>
          </div>

          {/* Node 2: Rule Engine */}
          <div className="relative">
            <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div
              onClick={() => setActiveTab('alerts')}
              className="bg-indigo-50/80 border-2 border-indigo-200 hover:border-indigo-400 rounded-xl p-4 cursor-pointer transition-all text-center space-y-1.5"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                2. RULE ENGINE
              </div>
              <div className="text-[11px] text-indigo-700 font-medium">
                Thuật toán kết hợp đa điều kiện
              </div>
              <span className="inline-block text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-800">
                {ruleResult.matchedRules[0] ? ruleResult.matchedRules[0].split(':')[0] : 'RULE_EVAL'}
              </span>
            </div>
          </div>

          {/* Node 3: Alert */}
          <div className="relative">
            <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div
              onClick={() => setActiveTab('alerts')}
              className={`rounded-xl p-4 border-2 cursor-pointer transition-all text-center space-y-1.5 ${
                ruleResult.isHighRisk
                  ? 'bg-red-50 border-red-300 text-red-900 shadow-md shadow-red-500/10'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-white shadow-md ${
                  ruleResult.isHighRisk ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider">
                3. CẢNH BÁO
              </div>
              <div className="text-[11px] font-bold truncate">
                {ruleResult.riskLevel === 'HIGH' ? '🚨 NGUY CƠ CAO' : '🟢 AN TOÀN'}
              </div>
              <span className="inline-block text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded">
                Mức {ruleResult.priorityScore}/4
              </span>
            </div>
          </div>

          {/* Node 4: Ticket */}
          <div className="relative">
            <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div
              onClick={() => setActiveTab('tickets')}
              className="bg-sky-50/80 border-2 border-sky-200 hover:border-sky-400 rounded-xl p-4 cursor-pointer transition-all text-center space-y-1.5"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <TicketIcon className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                4. TICKET XỬ LÝ
              </div>
              <div className="text-[11px] text-sky-700 font-medium">
                Điều phối đội công nhân
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  createTicket();
                  setActiveTab('tickets');
                }}
                className="inline-block text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 rounded transition-colors shadow-sm"
              >
                + Tạo Ticket Ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Status Cards per Section 3 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 🌧 LƯỢNG MƯA */}
        <div
          onClick={() => setActiveTab('rain')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-3">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-500" />
              LƯỢNG MƯA
            </span>
            <span className="text-[11px] font-medium text-slate-400 group-hover:text-blue-500 transition-colors">
              Chỉnh ➔
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {rainMmPerHour}
            </span>
            <span className="text-sm font-semibold text-slate-500">mm/h</span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${rainStatus.color}`}>
            <span className={`w-2 h-2 rounded-full ${rainStatus.dot}`} />
            <span>{rainStatus.label}</span>
          </div>
        </div>

        {/* Card 2: 📷 CAMERA AI */}
        <div
          onClick={() => setActiveTab('camera')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-indigo-400 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-3">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-500" />
              CAMERA AI
            </span>
            <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">
              Xem ➔
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {aiPrediction.topClass}
            </span>
            <span className="text-lg font-bold text-indigo-600 font-mono tabular-nums">
              {confidencePercent}%
            </span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${aiStatus.bg} ${aiStatus.text}`}>
            <span>{aiStatus.label}</span>
          </div>
        </div>

        {/* Card 3: 💧 MỰC NƯỚC */}
        <div
          onClick={() => setActiveTab('rain')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-sky-400 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-3">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              MỰC NƯỚC
            </span>
            <span className="text-[11px] font-medium text-slate-400 group-hover:text-sky-500 transition-colors">
              Mô phỏng ➔
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {waterLevel}
            </span>
            <span className="text-sm font-semibold text-slate-500 font-mono tabular-nums">
              ({waterPercentage}%)
            </span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${waterStatus.bg} ${waterStatus.text}`}>
            <span>{waterStatus.label}</span>
          </div>
        </div>

        {/* Card 4: 🚨 NGUY CƠ (Card cuối đổi màu theo trạng thái) */}
        <div
          onClick={() => setActiveTab('alerts')}
          className={`rounded-2xl p-5 shadow-md border transition-all cursor-pointer relative overflow-hidden ${riskStatus.bg} ${riskStatus.border}`}
        >
          <div className="flex items-center justify-between text-white/90 text-xs font-semibold mb-3">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-white" />
              NGUY CƠ NGẬP
            </span>
            <span className="text-[11px] font-bold underline underline-offset-2">
              Chi tiết ➔
            </span>
          </div>

          <div className="text-2xl font-extrabold text-white tracking-tight mb-2">
            {riskStatus.title}
          </div>

          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${riskStatus.badge}`}>
            <span>{riskStatus.desc}</span>
          </div>
        </div>
      </section>

      {/* Quick Action Banner */}
      <section className="bg-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-sm shrink-0">
            <Sliders className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              Kiểm thử Kịch bản Nhanh cho Ban Giám Khảo
            </div>
            <div className="text-xs text-slate-500">
              Chọn nhanh trạng thái cống và lượng mưa để quan sát hệ thống phản ứng tức thì
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('camera')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-sm transition-all"
          >
            Chỉnh ROI & Camera
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-sm transition-all"
          >
            Kéo Slider Mưa & Nước
          </button>
          <button
            onClick={() => {
              createTicket();
              setActiveTab('tickets');
            }}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all"
          >
            + Tạo Ticket Cấp Bách
          </button>
        </div>
      </section>
    </div>
  );
};
