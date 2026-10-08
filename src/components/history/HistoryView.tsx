/**
 * @license
 * SMART ANTI-FLOOD AI - Event History View
 * Filterable log of recorded sensor snapshots, AI detections, risk levels and linked tickets
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskLevel } from '../../types';
import { History, Filter, Download, Trash2, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, clearHistory, setActiveTab } = useApp();

  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | 'all'>('today');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');

  const filteredHistory = history.filter((record) => {
    if (riskFilter !== 'ALL' && record.riskLevel !== riskFilter) {
      return false;
    }
    // Time filter mockup: all existing records are for 'today' or '7days'
    return true;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-bold">🔴 HIGH RISK</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold">🟠 WARNING</span>;
      case 'WATCH':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">🟡 WATCH</span>;
      case 'NORMAL':
      default:
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">🟢 NORMAL</span>;
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = 'Thời gian,Vị trí,Lượng mưa (mm/h),AI Class,Độ tin cậy AI,Mực nước,Mức nguy cơ,Ticket ID\n';
    const rows = history
      .map(
        (h) =>
          `"${h.timestamp}","${h.location}",${h.rainMmPerHour},"${h.aiClass}",${Math.round(h.aiConfidence * 100)}%,"${h.waterLevel}","${h.riskLevel}","${h.ticketId || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `smart_anti_flood_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              📊 LỊCH SỬ ĐO LƯỜNG & SỰ CỐ
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {filteredHistory.length} bản ghi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Nhật ký lưu trữ các mốc thời gian cảnh báo nguy cơ ngập và liên kết ticket xử lý
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn xóa sạch toàn bộ lịch sử đo lường?')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-medium text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa Lịch Sử</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs per Section 19 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Time filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeFilter === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setTimeFilter('7days')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeFilter === '7days' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
        </div>

        {/* Risk filter selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Lọc mức nguy cơ:
          </span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="bg-slate-100 border border-slate-300 text-slate-800 rounded-xl px-3 py-1.5 font-bold"
          >
            <option value="ALL">Tất cả các mức</option>
            <option value="NORMAL">🟢 NORMAL</option>
            <option value="WATCH">🟡 WATCH</option>
            <option value="WARNING">🟠 WARNING</option>
            <option value="HIGH">🔴 HIGH RISK</option>
          </select>
        </div>
      </div>

      {/* History Data Table per Section 19 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4">Vị trí</th>
                <th className="py-3.5 px-4 text-center">Lượng Mưa</th>
                <th className="py-3.5 px-4">Nhận diện AI</th>
                <th className="py-3.5 px-4 text-center">Mực Nước</th>
                <th className="py-3.5 px-4 text-center">Mức Nguy Cơ</th>
                <th className="py-3.5 px-4 text-center">Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không có bản ghi nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-medium max-w-xs truncate">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600 whitespace-nowrap">
                      {item.rainMmPerHour} mm/h
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-indigo-900 mr-1.5">{item.aiClass}</span>
                      <span className="font-mono text-slate-500">
                        ({Math.round(item.aiConfidence * 100)}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-600 whitespace-nowrap">
                      {item.waterLevel}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getRiskBadge(item.riskLevel)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {item.ticketId ? (
                        <button
                          onClick={() => setActiveTab('tickets')}
                          className="font-mono font-bold text-sky-600 hover:underline"
                        >
                          {item.ticketId}
                        </button>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
