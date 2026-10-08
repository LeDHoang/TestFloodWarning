/**
 * @license
 * SMART ANTI-FLOOD AI - Ticket Manager & Feedback Loop
 * Lifecycle management: NEW -> ASSIGNED -> IN_PROGRESS -> RE-CHECK -> RESOLVED
 * Features before/after ROI snapshot comparison and automated AI resolution verification
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, TicketStatus } from '../../types';
import {
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TicketManager: React.FC = () => {
  const {
    tickets,
    createTicket,
    updateTicketStatus,
    aiPrediction,
    setMockClass,
    settings,
    lastSnapshotDataUrl,
    setActiveTab,
  } = useApp();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    tickets[0]?.id || null
  );
  const [recheckModalTicket, setRecheckModalTicket] = useState<Ticket | null>(null);
  const [recheckSuccess, setRecheckSuccess] = useState<boolean | null>(null);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  const thresholdPercent = settings.confidenceThreshold;

  // Handle Resolution Feedback Loop
  const handleInitiateCompletion = (ticket: Ticket) => {
    setRecheckModalTicket(ticket);
    setRecheckSuccess(null);
  };

  const handleRunRecheckVerification = () => {
    if (!recheckModalTicket) return;

    // Check if current AI status is CLEAR with sufficient confidence
    const isClear = aiPrediction.topClass === 'CLEAR';
    const confidencePct = Math.round(aiPrediction.confidence * 100);
    const passed = isClear && confidencePct >= thresholdPercent;

    if (passed) {
      setRecheckSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      updateTicketStatus(
        recheckModalTicket.id,
        'RESOLVED',
        'Nghiệm thu AI: Miệng cống thông thoáng (CLEAR ' + confidencePct + '%)',
        lastSnapshotDataUrl || undefined
      );
    } else {
      setRecheckSuccess(false);
    }
  };

  const handleSimulateCleanAndResolve = () => {
    // Quick helper for demo presentation: simulate that worker swept the leaves!
    setMockClass('CLEAR');
    setTimeout(() => {
      setRecheckSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      if (recheckModalTicket) {
        updateTicketStatus(
          recheckModalTicket.id,
          'RESOLVED',
          'Nghiệm thu thực địa: Công nhân đã vớt sạch rác. Camera AI xác nhận CLEAR 96%',
          lastSnapshotDataUrl || undefined
        );
      }
    }, 400);
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'NEW':
        return {
          label: '🔴 MỚI TẠO (NEW)',
          bg: 'bg-red-100 text-red-800 border-red-200',
        };
      case 'ASSIGNED':
        return {
          label: '🟡 ĐÃ TIẾP NHẬN',
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'IN_PROGRESS':
        return {
          label: '🟠 ĐANG XỬ LÝ',
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'RESOLVED':
        return {
          label: '🟢 ĐÃ HOÀN THÀNH (RESOLVED)',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              🎫 QUẢN LÝ TICKET & VÒNG LẶP PHẢN HỒI (FEEDBACK LOOP)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
              Điều Phối Xử Lý
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quy trình điều động công nhân nạo vét và bắt buộc camera AI nghiệm thu trước khi đóng sự cố
          </p>
        </div>

        <button
          onClick={() => {
            const t = createTicket();
            setSelectedTicketId(t.id);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <TicketIcon className="w-4 h-4" />
          <span>+ TẠO TICKET MỚI</span>
        </button>
      </div>

      {/* Main Grid: Ticket List (Left) + Detail View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Ticket Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>DANH SÁCH TICKET SỰ CỐ ({tickets.length})</span>
            <span className="text-slate-400">Chọn để xem chi tiết</span>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
              Chưa có ticket nào được tạo. Nhấn nút "+ TẠO TICKET MỚI" ở trên.
            </div>
          ) : (
            tickets.map((t) => {
              const statusInfo = getStatusBadge(t.status);
              const isSelected = selectedTicket?.id === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-400/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-extrabold font-mono text-slate-900">
                      {t.ticketNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-blue-600 font-bold">Mưa: {t.rainMmPerHour} mm/h</span>
                    <span className="text-indigo-600 font-bold">AI: {t.aiClass}</span>
                    <span className="text-sky-600 font-bold">Nước: {t.waterLevel}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Ticket Detail & Action Controls (7 cols) */}
        {selectedTicket && (
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black font-mono text-slate-900">
                    TICKET {selectedTicket.ticketNumber}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 font-bold">
                    MỨC ƯU TIÊN: {selectedTicket.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedTicket.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedTicket.createdAt}</span>
                </p>
              </div>

              <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${getStatusBadge(selectedTicket.status).bg}`}>
                {getStatusBadge(selectedTicket.status).label}
              </div>
            </div>

            {/* Metrics Snapshot Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">LƯỢNG MƯA</span>
                <span className="text-lg font-extrabold text-blue-600 font-mono">
                  {selectedTicket.rainMmPerHour} mm/h
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">THỊ GIÁC AI</span>
                <span className="text-sm font-extrabold text-indigo-700 block truncate">
                  {selectedTicket.aiClass}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Tin cậy {Math.round(selectedTicket.aiConfidence * 100)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">MỰC NƯỚC</span>
                <span className="text-lg font-extrabold text-sky-600 font-mono">
                  {selectedTicket.waterLevel}
                </span>
              </div>
            </div>

            {/* Before / After Snapshot Images per Section 14 & 15 */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Ảnh Chụp ROI Đối Chứng Thực Địa (Section 15):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Image */}
                <div className="rounded-xl border border-red-200 p-3 bg-red-50/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-red-800">
                    <span>1. ẢNH TRƯỚC XỬ LÝ (SỰ CỐ)</span>
                    <span className="text-[10px] font-mono text-red-600">Lúc cảnh báo</span>
                  </div>

                  <div className="w-full h-36 rounded-lg bg-slate-900 border border-red-300 flex items-center justify-center overflow-hidden text-slate-400 text-xs">
                    {selectedTicket.initialSnapshotUrl ? (
                      <img
                        src={selectedTicket.initialSnapshotUrl}
                        alt="Snapshot ROI Trước xử lý"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                        <span>Ảnh ROI Cống Bị Tắc</span>
                        <div className="text-[10px] text-amber-400 mt-1 font-mono">
                          {selectedTicket.aiClass} ({Math.round(selectedTicket.aiConfidence * 100)}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* After Image */}
                <div className={`rounded-xl border p-3 space-y-2 ${
                  selectedTicket.status === 'RESOLVED'
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>2. ẢNH SAU XỬ LÝ (NGHIỆM THU)</span>
                    <span className="text-[10px] font-mono">
                      {selectedTicket.resolvedAt || 'Chưa đóng ticket'}
                    </span>
                  </div>

                  <div className="w-full h-36 rounded-lg bg-slate-900 border flex items-center justify-center overflow-hidden text-slate-400 text-xs">
                    {selectedTicket.resolvedSnapshotUrl ? (
                      <img
                        src={selectedTicket.resolvedSnapshotUrl}
                        alt="Snapshot ROI Sau xử lý"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <ShieldCheck className={`w-8 h-8 mx-auto mb-1 ${
                          selectedTicket.status === 'RESOLVED' ? 'text-emerald-500' : 'text-slate-600'
                        }`} />
                        <span>
                          {selectedTicket.status === 'RESOLVED'
                            ? '✅ ĐÃ THÔNG THOÁNG (CLEAR)'
                            : 'Đang chờ công nhân hoàn thành...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes log */}
            {selectedTicket.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">Nhật ký xử lý:</span>
                <p className="whitespace-pre-line font-mono text-[11px]">{selectedTicket.notes}</p>
              </div>
            )}

            {/* Workflow Action Buttons per Section 14 */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => updateTicketStatus(selectedTicket.id, 'ASSIGNED', 'Đội công nhân số 3 đã tiếp nhận lệnh.')}
                disabled={selectedTicket.status !== 'NEW'}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 disabled:pointer-events-none bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-600"
              >
                <Check className="w-4 h-4" />
                <span>[TIẾP NHẬN]</span>
              </button>

              <button
                onClick={() => updateTicketStatus(selectedTicket.id, 'IN_PROGRESS', 'Công nhân đang dọn lá và bùn đất tại miệng cống.')}
                disabled={selectedTicket.status === 'IN_PROGRESS' || selectedTicket.status === 'RESOLVED'}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 disabled:pointer-events-none bg-sky-600 hover:bg-sky-500 text-white border-sky-700"
              >
                <Play className="w-4 h-4" />
                <span>[ĐANG XỬ LÝ]</span>
              </button>

              <button
                onClick={() => handleInitiateCompletion(selectedTicket)}
                disabled={selectedTicket.status === 'RESOLVED'}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 disabled:pointer-events-none bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700 shadow-md shadow-emerald-600/20 ml-auto"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>[HOÀN THÀNH - NGHIỆM THU AI]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recheck Verification Modal per Section 15 */}
      {recheckModalTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    VÒNG LẶP PHẢN HỒI (FEEDBACK LOOP)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Nghiệm thu Ticket {recheckModalTicket.ticketNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setRecheckModalTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <p className="font-bold text-slate-900">
                “Vui lòng kiểm tra lại miệng cống trước khi đóng ticket.”
              </p>
              <p className="text-slate-600">
                Hệ thống yêu cầu camera quét lại vùng ROI. Chỉ khi mô hình nhận diện{' '}
                <strong className="text-emerald-700 font-mono">CLEAR ≥ {thresholdPercent}%</strong>,
                ticket mới được đánh dấu là <strong>RESOLVED</strong>.
              </p>
            </div>

            {/* Current Realtime Status */}
            <div className="p-3 rounded-xl bg-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600">Trạng thái AI hiện tại:</span>
              <span className={`font-bold ${
                aiPrediction.topClass === 'CLEAR' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {aiPrediction.topClass} ({Math.round(aiPrediction.confidence * 100)}%)
              </span>
            </div>

            {/* Verification Result Feedback */}
            {recheckSuccess === true && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 space-y-2 animate-bounce">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>✅ MIỆNG CỐNG ĐÃ THÔNG THOÁNG</span>
                </div>
                <p className="text-xs text-emerald-800">
                  AI xác nhận cống sạch. Ticket đã được chuyển sang trạng thái <strong>RESOLVED</strong>!
                </p>
              </div>
            )}

            {recheckSuccess === false && (
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>❌ CHƯA THÔNG THOÁNG ({aiPrediction.topClass})</span>
                </div>
                <p className="text-xs text-red-800">
                  Camera vẫn nhận diện rác thải hoặc vật che chắn ({Math.round(aiPrediction.confidence * 100)}%).
                  Vui lòng dọn sạch hoàn toàn trước khi nghiệm thu!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={handleRunRecheckVerification}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow"
              >
                QUÉT CAMERA NGHIỆM THU
              </button>

              <button
                onClick={handleSimulateCleanAndResolve}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all whitespace-nowrap shadow"
                title="Dành cho học sinh demo nhanh trước Ban giám khảo"
              >
                🎓 Mô phỏng đã dọn cống (CLEAR 96%)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
