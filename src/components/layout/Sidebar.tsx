/**
 * @license
 * SMART ANTI-FLOOD AI - Sidebar Component
 * Left navigation panel tailored for presentation with clear active states and badges
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  Home,
  Camera,
  CloudRain,
  AlertTriangle,
  Ticket as TicketIcon,
  History,
  Film,
  Brain,
  Settings,
  Info,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, ruleResult, tickets } = useApp();

  const openTicketsCount = tickets.filter((t) => t.status === 'NEW' || t.status === 'ASSIGNED').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Tổng quan', icon: Home },
    { id: 'camera', label: 'Camera AI', icon: Camera },
    { id: 'rain', label: 'Mô phỏng mưa', icon: CloudRain },
    {
      id: 'alerts',
      label: 'Cảnh báo',
      icon: AlertTriangle,
      badge: ruleResult.isHighRisk ? 'NGUY CƠ' : undefined,
      badgeColor: 'bg-red-500 text-white animate-pulse',
    },
    {
      id: 'tickets',
      label: 'Ticket xử lý',
      icon: TicketIcon,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeColor: 'bg-sky-500 text-white',
    },
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'hanoi-media', label: 'Hà Nội mùa mưa', icon: Film },
    { id: 'ai-explain', label: 'AI hoạt động thế nào?', icon: Brain },
    { id: 'settings', label: 'Cấu hình AI', icon: Settings },
    { id: 'about', label: 'Giới thiệu dự án', icon: Info },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 select-none">
      {/* Navigation List */}
      <nav className="p-2 md:p-3 flex md:flex-col gap-1.5 md:flex-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-xl text-sm font-semibold transition-all text-left whitespace-nowrap ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Team Newton Footer Tag */}
      <div className="hidden md:block p-4 border-t border-slate-100 bg-slate-50/60 text-center">
        <div className="text-xs font-bold text-slate-800 tracking-wider">
          ĐỘI THI NEWTON AI
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          Sản phẩm demo NCKH Trẻ
        </div>
      </div>
    </aside>
  );
};
