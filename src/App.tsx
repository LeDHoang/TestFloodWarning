/**
 * @license
 * SMART ANTI-FLOOD AI - Root Application
 * Designed by Team NEWTON AI
 * "PHÁT HIỆN SỚM – CẢNH BÁO SỚM – HÀNH ĐỘNG SỚM"
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoModeBar } from './components/demo/DemoModeBar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CameraView } from './components/camera/CameraView';
import { RainSimulator } from './components/rain/RainSimulator';
import { AlertPanel } from './components/alerts/AlertPanel';
import { TicketManager } from './components/tickets/TicketManager';
import { HistoryView } from './components/history/HistoryView';
import { HanoiFloodMedia } from './components/media/HanoiFloodMedia';
import { AIExplainView } from './components/explain/AIExplainView';
import { AISettings } from './components/settings/AISettings';
import { ProjectInfo } from './components/about/ProjectInfo';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard />;
      case 'camera':
        return <CameraView />;
      case 'rain':
        return <RainSimulator />;
      case 'alerts':
        return <AlertPanel />;
      case 'tickets':
        return <TicketManager />;
      case 'history':
        return <HistoryView />;
      case 'hanoi-media':
        return <HanoiFloodMedia />;
      case 'ai-explain':
        return <AIExplainView />;
      case 'settings':
        return <AISettings />;
      case 'about':
        return <ProjectInfo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Top Header */}
      <Header />

      {/* Guided Tour Banner for Judges / Stage Presentation (Section 20) */}
      <DemoModeBar />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Main View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/60">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
