/**
 * @license
 * SMART ANTI-FLOOD AI - Demo Mode Assistant Bar
 * Guided interactive tour for students presenting to Judges without memorization stress
 */

import React from 'react';
import { useApp, DEMO_STEPS } from '../../context/AppContext';
import { Sparkles, ChevronRight, ChevronLeft, CheckCircle2, PlayCircle, X, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DemoModeBar: React.FC = () => {
  const {
    demoModeActive,
    setDemoModeActive,
    currentDemoStep,
    setCurrentDemoStep,
    nextDemoStep,
    prevDemoStep,
    applyDemoStepPreset,
    setActiveTab,
    createTicket,
  } = useApp();

  if (!demoModeActive) return null;

  const currentStep = DEMO_STEPS[currentDemoStep];
  const isFirst = currentDemoStep === 0;
  const isLast = currentDemoStep === DEMO_STEPS.length - 1;

  const handleApplyCurrent = () => {
    applyDemoStepPreset(currentDemoStep);

    // If step 6, take user to tickets or create ticket
    if (currentDemoStep === 5) {
      createTicket('Tạo trong phiên Demo Mode trình bày Ban giám khảo');
      setActiveTab('tickets');
    } else if (currentDemoStep === 4) {
      setActiveTab('alerts');
    } else if (currentDemoStep === 6) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setActiveTab('tickets');
    } else {
      setActiveTab('overview');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white border-b border-indigo-700/50 shadow-lg px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Step Indicator & Header */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300 font-bold shrink-0">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Kịch bản Demo Trình Diễn
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-700/80 text-white font-mono">
                Bước {currentDemoStep + 1}/{DEMO_STEPS.length}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {currentStep.title}
            </h3>
          </div>
        </div>

        {/* Instruction & Script for Student */}
        <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/15 text-xs text-indigo-100 flex items-center gap-2.5 max-w-xl w-full">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold text-white">{currentStep.instruction}</span>
            <span className="text-indigo-200 block truncate">👉 Lời thoại: {currentStep.systemHint}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleApplyCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition-all whitespace-nowrap active:scale-95"
            title="Tự động nạp kịch bản này"
          >
            <PlayCircle className="w-4 h-4" />
            <span>{currentStep.actionText}</span>
          </button>

          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            <button
              onClick={prevDemoStep}
              disabled={isFirst}
              className="p-1.5 rounded text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Bước trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextDemoStep}
              disabled={isLast}
              className="p-1.5 rounded text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Bước tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setDemoModeActive(false)}
            className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
