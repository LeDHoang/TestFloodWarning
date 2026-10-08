/**
 * @license
 * SMART ANTI-FLOOD AI - Header Component
 * Strict single-row top bar with system status, Demo mode CTA, and school team mark
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldAlert, Cpu, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    isModelConnected,
    settings,
    demoModeActive,
    setDemoModeActive,
    ruleResult,
    setActiveTab,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 truncate">
                <span className="hidden sm:inline">SMART </span>ANTI-FLOOD AI
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800 tracking-wide">
                NEWTON AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{settings.locationName}</span>
              <span aria-hidden="true">·</span>
              <span className="italic">“PHÁT HIỆN SỚM – CẢNH BÁO SỚM – HÀNH ĐỘNG SỚM”</span>
            </p>
          </div>
        </div>

        {/* Status & Actions Zone */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          {/* AI Connection Status Indicator */}
          <div
            onClick={() => setActiveTab('settings')}
            className={`cursor-pointer flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isModelConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
            title="Nhấn để mở Cấu hình AI"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                isModelConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="hidden sm:inline">
              {isModelConnected ? '🟢 HỆ THỐNG HOẠT ĐỘNG' : '🟡 DÙNG MÔ HÌNH MÔ PHỎNG'}
            </span>

          </div>

          {/* High Risk Alert Ping if active */}
          {ruleResult.isHighRisk && (
            <button
              onClick={() => setActiveTab('alerts')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold animate-bounce shadow-md shadow-red-500/30 hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">🚨 NGUY CƠ CAO</span>
            </button>
          )}

          {/* Demo Mode Button per Section 20 */}
          <button
            onClick={() => setDemoModeActive(!demoModeActive)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              demoModeActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="hidden sm:inline">🎓 DEMO MODE</span>
            <span className="sm:hidden">DEMO</span>
            {demoModeActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
