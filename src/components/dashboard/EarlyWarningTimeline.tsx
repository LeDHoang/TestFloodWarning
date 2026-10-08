/**
 * @license
 * SMART ANTI-FLOOD AI - Early Warning Timeline
 * Side-by-side story: how a flood unfolds today vs. with the system in place.
 * The "with system" lane highlights the stage the live system is currently at.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CloudRain, Trash2, Waves, Phone, Truck, Camera, ScanEye, BellRing, Wrench, CheckCircle2 } from 'lucide-react';

interface Stage {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const TODAY: Stage[] = [
  { icon: CloudRain, title: 'Mưa lớn', desc: 'Lượng mưa vượt khả năng tiêu thoát' },
  { icon: Trash2, title: 'Rác bịt miệng cống', desc: 'Không ai biết cống đang tắc' },
  { icon: Waves, title: 'Nước dâng', desc: 'Đường ngập 30–50 cm' },
  { icon: Phone, title: 'Người dân phản ánh', desc: 'Gọi điện báo đường ngập' },
  { icon: Truck, title: 'Đội thoát nước đến', desc: 'Xử lý khi đã ngập' },
];

const WITH_SYSTEM: Stage[] = [
  { icon: Camera, title: 'Camera quan sát', desc: 'ROI tập trung vào miệng cống' },
  { icon: ScanEye, title: 'AI phát hiện rác', desc: 'TRASH / PARTIAL / BLOCKED' },
  { icon: BellRing, title: 'Cảnh báo + Ticket', desc: 'Rule Engine kết hợp mưa & nước' },
  { icon: Wrench, title: 'Công nhân dọn cống', desc: 'Trước khi nước kịp dâng' },
  { icon: CheckCircle2, title: 'AI nghiệm thu', desc: 'CLEAR ≥ ngưỡng → RESOLVED' },
];

export const EarlyWarningTimeline: React.FC = () => {
  const { aiPrediction, ruleResult, tickets } = useApp();

  // Which stage of the "with system" lane are we at right now?
  const hasOpenTicket = tickets.some((t) => t.status !== 'RESOLVED');
  let current = 0;
  if (aiPrediction.topClass !== 'CLEAR') current = 1;
  if (ruleResult.riskLevel === 'WARNING' || ruleResult.riskLevel === 'HIGH') current = 2;
  if (hasOpenTicket && current >= 2) current = 3;
  if (aiPrediction.topClass === 'CLEAR' && tickets.some((t) => t.status === 'RESOLVED')) current = 4;

  const Lane: React.FC<{ stages: Stage[]; tone: 'bad' | 'good'; active?: number }> = ({ stages, tone, active }) => (
    <ol className="grid grid-cols-1 sm:grid-cols-5 gap-2">
      {stages.map((s, i) => {
        const Icon = s.icon;
        const isActive = active === i;
        const isPast = active !== undefined && i < active;
        const base =
          tone === 'bad'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : isActive
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.03]'
              : isPast
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-white border-slate-200 text-slate-700';
        return (
          <li key={i} className={`relative rounded-xl border p-3 transition-all ${base}`}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold opacity-60">{i + 1}</span>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold leading-tight">{s.title}</span>
            </div>
            <p className={`text-[11px] mt-1 leading-snug ${isActive ? 'text-emerald-50' : 'opacity-75'}`}>{s.desc}</p>
            {isActive && (
              <span className="absolute -top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-white text-emerald-700 px-1.5 py-0.5 rounded shadow">
                Đang ở đây
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900">Vì sao cần cảnh báo SỚM?</h3>
        <p className="text-xs text-slate-500">
          Cùng một trận mưa, hai cách phản ứng khác nhau. Hệ thống chuyển việc xử lý từ <strong>sau khi ngập</strong> sang <strong>trước khi ngập</strong>.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Hiện nay – phản ứng bị động</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Xử lý SAU khi ngập</span>
        </div>
        <Lane stages={TODAY} tone="bad" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Với SMART ANTI-FLOOD AI – chủ động</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Hành động TRƯỚC khi ngập</span>
        </div>
        <Lane stages={WITH_SYSTEM} tone="good" active={current} />
      </div>
    </section>
  );
};
