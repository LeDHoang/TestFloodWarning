/**
 * @license
 * SMART ANTI-FLOOD AI - Live Street Scene
 * Animated cross-section of a Hanoi street drain driven by the live system state:
 * rain intensity, drain condition seen by the camera (ROI), water on the road and
 * how fast water can still flow into the sewer pipe.
 */

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AIClassType, RiskLevel } from '../../types';
import { CloudRain, Camera, Droplets, Ticket as TicketIcon } from 'lucide-react';

// How much of the drain's capacity is still available for each AI class (illustrative)
const DRAIN_CAPACITY: Record<AIClassType, number> = {
  CLEAR: 1,
  TRASH_NEARBY: 0.85,
  PARTIAL_BLOCKED: 0.4,
  BLOCKED: 0.08,
};

const AI_LABEL_VI: Record<AIClassType, string> = {
  CLEAR: 'Cống thông thoáng',
  TRASH_NEARBY: 'Có rác gần cống',
  PARTIAL_BLOCKED: 'Rác che một phần',
  BLOCKED: 'Rác che kín cống',
};

export const RISK_STYLE: Record<RiskLevel, { label: string; fill: string; text: string; chip: string }> = {
  NORMAL: { label: 'AN TOÀN', fill: '#10b981', text: 'text-emerald-300', chip: 'bg-emerald-500' },
  WATCH: { label: 'THEO DÕI', fill: '#f59e0b', text: 'text-amber-300', chip: 'bg-amber-500' },
  WARNING: { label: 'CẢNH BÁO', fill: '#f97316', text: 'text-orange-300', chip: 'bg-orange-500' },
  HIGH: { label: 'NGUY CƠ NGẬP CAO', fill: '#dc2626', text: 'text-red-300', chip: 'bg-red-600' },
};

const W = 800;
const GROUND_Y = 236;
const GRATE_X = 430;
const GRATE_W = 110;

// Deterministic pseudo-random so drops don't jump around between renders
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function isKnownClass(c: string): c is AIClassType {
  return c === 'CLEAR' || c === 'TRASH_NEARBY' || c === 'PARTIAL_BLOCKED' || c === 'BLOCKED';
}

/** Small trash pieces drawn as simple shapes (bag, bottle, leaves) */
const Trash: React.FC<{ x: number; y: number; kind: number; rot: number }> = ({ x, y, kind, rot }) => {
  const t = `translate(${x} ${y}) rotate(${rot})`;
  if (kind === 0) {
    // plastic bag
    return <path transform={t} d="M-14 0 Q-12 -14 0 -12 Q12 -14 14 0 Q0 6 -14 0Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" opacity="0.95" />;
  }
  if (kind === 1) {
    // bottle
    return (
      <g transform={t}>
        <rect x="-12" y="-5" width="20" height="10" rx="3" fill="#38bdf8" opacity="0.85" />
        <rect x="8" y="-2.5" width="6" height="5" rx="1" fill="#0284c7" />
      </g>
    );
  }
  // leaf
  return <path transform={t} d="M-10 0 Q0 -9 10 0 Q0 9 -10 0Z" fill={kind === 2 ? '#65a30d' : '#a16207'} />;
};

export const FloodScene: React.FC = () => {
  const {
    rainMmPerHour,
    setRainMmPerHour,
    waterPercentage,
    waterLevel,
    setWaterLevel,
    aiPrediction,
    mockClass,
    setMockClass,
    isModelConnected,
    ruleResult,
    createTicket,
    setActiveTab,
  } = useApp();

  const aiClass: AIClassType = isKnownClass(aiPrediction.topClass) ? aiPrediction.topClass : 'CLEAR';
  const capacity = DRAIN_CAPACITY[aiClass];
  const risk = RISK_STYLE[ruleResult.riskLevel];
  const confidencePct = Math.round(aiPrediction.confidence * 100);

  // Rain drops: count + speed scale with intensity
  const dropCount = Math.min(140, Math.round(rainMmPerHour * 1.6));
  const dropDuration = Math.max(0.35, 1.3 - rainMmPerHour / 90);
  const drops = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        x: rand(i, 1) * W,
        delay: rand(i, 2) * 1.4,
        len: 10 + rand(i, 3) * 10,
      })),
    []
  );

  // Water on the road surface (0-100% -> 0-84px)
  const waterDepth = (waterPercentage / 100) * 84;
  const waterTop = GROUND_Y - waterDepth;
  const depthCm = Math.round((waterPercentage / 100) * 50);

  // Trash layout per class
  const trashItems = useMemo(() => {
    const items: { x: number; y: number; kind: number; rot: number }[] = [];
    if (aiClass === 'TRASH_NEARBY') {
      items.push({ x: GRATE_X - 70, y: GROUND_Y - 6, kind: 0, rot: -8 }, { x: GRATE_X - 40, y: GROUND_Y - 4, kind: 2, rot: 20 }, { x: GRATE_X + GRATE_W + 40, y: GROUND_Y - 5, kind: 1, rot: 10 });
    } else if (aiClass === 'PARTIAL_BLOCKED') {
      items.push({ x: GRATE_X + 18, y: GROUND_Y - 4, kind: 0, rot: 4 }, { x: GRATE_X + 45, y: GROUND_Y - 3, kind: 2, rot: -25 }, { x: GRATE_X - 30, y: GROUND_Y - 5, kind: 1, rot: -6 }, { x: GRATE_X + 60, y: GROUND_Y - 2, kind: 3, rot: 40 });
    } else if (aiClass === 'BLOCKED') {
      for (let i = 0; i < 9; i++) {
        items.push({ x: GRATE_X + 8 + i * 12, y: GROUND_Y - 3 - (i % 3) * 3, kind: i % 4, rot: (i * 37) % 60 - 30 });
      }
    }
    return items;
  }, [aiClass]);

  // Flow particles inside the sewer pipe; speed tied to drain capacity
  const flowDuration = 3.5 / Math.max(0.1, capacity);
  const flowCount = Math.max(1, Math.round(capacity * 10));

  // Live cause -> effect sentence
  const story = (() => {
    const rainTxt =
      rainMmPerHour < 20 ? `Mưa nhỏ ${rainMmPerHour} mm/h` : rainMmPerHour <= 50 ? `Mưa vừa ${rainMmPerHour} mm/h` : `Mưa lớn ${rainMmPerHour} mm/h`;
    const drainTxt =
      aiClass === 'CLEAR'
        ? 'miệng cống thông thoáng, nước thoát tốt'
        : aiClass === 'TRASH_NEARBY'
          ? 'rác nằm gần cống, có thể bị nước cuốn vào'
          : aiClass === 'PARTIAL_BLOCKED'
            ? 'rác che một phần cống, nước thoát chậm lại'
            : 'rác che kín cống, nước gần như không thoát được';
    return `${rainTxt} · ${drainTxt}`;
  })();

  const rainPresets = [
    { v: 5, label: 'Tạnh' },
    { v: 30, label: 'Vừa' },
    { v: 55, label: 'Lớn' },
    { v: 85, label: 'Bão' },
  ];
  const drainPresets: AIClassType[] = ['CLEAR', 'TRASH_NEARBY', 'PARTIAL_BLOCKED', 'BLOCKED'];

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
        <svg viewBox={`0 0 ${W} 340`} className="w-full h-auto block" role="img" aria-label={`Mô phỏng đường phố: ${story}. Mức nguy cơ ${risk.label}`}>
          <defs>
            <linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rainMmPerHour > 50 ? '#020617' : rainMmPerHour >= 20 ? '#0f172a' : '#0c4a6e'} />
              <stop offset="100%" stopColor={rainMmPerHour > 50 ? '#1e293b' : rainMmPerHour >= 20 ? '#334155' : '#38bdf8'} />
            </linearGradient>
            <linearGradient id="fs-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
            </linearGradient>
            <clipPath id="fs-pipe">
              <rect x={GRATE_X + 20} y="276" width={W - GRATE_X - 20} height="34" rx="17" />
            </clipPath>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width={W} height={GROUND_Y} fill="url(#fs-sky)" style={{ transition: 'fill 0.6s' }} />

          {/* Buildings silhouette */}
          <g fill="#0b1220" opacity="0.85">
            <rect x="0" y="120" width="70" height={GROUND_Y - 120} />
            <rect x="75" y="90" width="55" height={GROUND_Y - 90} />
            <rect x="590" y="105" width="60" height={GROUND_Y - 105} />
            <rect x="655" y="70" width="75" height={GROUND_Y - 70} />
            <rect x="735" y="130" width="65" height={GROUND_Y - 130} />
          </g>
          <g fill="#fbbf24" opacity="0.35">
            {[0, 1, 2, 3].map((r) => [0, 1].map((c) => <rect key={`w${r}${c}`} x={668 + c * 28} y={86 + r * 26} width="12" height="10" />))}
            {[0, 1, 2].map((r) => <rect key={`v${r}`} x={88} y={104 + r * 28} width="10" height="9" />)}
          </g>

          {/* Rain */}
          <g stroke="#bae6fd" strokeWidth="1.4" strokeLinecap="round" opacity={0.25 + Math.min(0.55, rainMmPerHour / 120)}>
            {drops.slice(0, dropCount).map((d, i) => (
              <line
                key={i}
                x1={d.x}
                y1={-20}
                x2={d.x - 3}
                y2={-20 + d.len}
                className="fs-drop"
                style={{ animationDuration: `${dropDuration}s`, animationDelay: `${d.delay}s` }}
              />
            ))}
          </g>

          {/* Camera pole + camera + field of view */}
          <rect x="196" y="70" width="6" height={GROUND_Y - 70} fill="#475569" />
          <rect x="196" y="70" width="70" height="5" fill="#475569" />
          <g transform="translate(258 72)">
            <rect x="0" y="0" width="34" height="18" rx="4" fill="#e2e8f0" />
            <rect x="30" y="4" width="10" height="10" rx="2" fill="#334155" />
            <circle cx="35" cy="9" r="3" fill="#ef4444" className="fs-blink" />
          </g>
          <path
            d={`M296 86 L${GRATE_X - 16} ${GROUND_Y - 30} L${GRATE_X + GRATE_W + 16} ${GROUND_Y - 30} Z`}
            fill="#38bdf8"
            opacity="0.08"
          />
          <line x1="296" y1="86" x2={GRATE_X - 16} y2={GROUND_Y - 30} stroke="#38bdf8" strokeOpacity="0.35" strokeDasharray="4 4" />
          <line x1="296" y1="86" x2={GRATE_X + GRATE_W + 16} y2={GROUND_Y - 30} stroke="#38bdf8" strokeOpacity="0.35" strokeDasharray="4 4" />

          {/* Sidewalk (right) and road */}
          <rect x="0" y={GROUND_Y} width={W} height={340 - GROUND_Y} fill="#1f2937" />
          <rect x="0" y={GROUND_Y} width={W} height="6" fill="#4b5563" />
          {[40, 140, 240, 600, 700].map((x) => (
            <rect key={x} x={x} y={GROUND_Y + 14} width="50" height="4" fill="#9ca3af" opacity="0.5" />
          ))}

          {/* Water standing on the road */}
          {waterDepth > 1 && (
            <g style={{ transition: 'all 0.6s' }}>
              <rect x="0" y={waterTop} width={W} height={waterDepth} fill="url(#fs-water)" />
              <path
                className="fs-wave"
                d={`M0 ${waterTop} q25 -5 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V${waterTop + 6} H0Z`}
                fill="#7dd3fc"
                opacity="0.6"
              />
            </g>
          )}

          {/* Drain grate */}
          <rect x={GRATE_X} y={GROUND_Y - 2} width={GRATE_W} height="12" rx="2" fill="#111827" stroke="#6b7280" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={GRATE_X + 6 + i * 11.5} y={GROUND_Y} width="5" height="8" fill="#374151" />
          ))}

          {/* Flow arrows into the drain (only when it can drain) */}
          {capacity > 0.3 && rainMmPerHour > 0 && (
            <g fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" className="fs-flow-in" opacity={capacity}>
              <path d={`M${GRATE_X - 50} ${GROUND_Y - 8} q30 0 45 12`} />
              <path d={`M${GRATE_X + GRATE_W + 50} ${GROUND_Y - 8} q-30 0 -45 12`} />
            </g>
          )}

          {/* Trash */}
          {trashItems.map((t, i) => (
            <Trash key={i} {...t} />
          ))}

          {/* Blocked marker */}
          {aiClass === 'BLOCKED' && (
            <g transform={`translate(${GRATE_X + GRATE_W / 2} ${GROUND_Y + 24})`}>
              <circle r="11" fill="#dc2626" />
              <path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* ROI box seen by the camera */}
          <rect
            x={GRATE_X - 22}
            y={GROUND_Y - 30}
            width={GRATE_W + 44}
            height="48"
            fill="none"
            stroke={risk.fill}
            strokeWidth="2"
            strokeDasharray="6 4"
            className="fs-roi"
            rx="4"
          />
          <g transform={`translate(${GRATE_X - 22} ${GROUND_Y - 48})`}>
            <rect width={Math.max(GRATE_W + 44, (`ROI · ${aiClass} ${confidencePct}%`.length) * 6.4 + 12)} height="16" rx="3" fill={risk.fill} />
            <text x="6" y="11.5" fontSize="10" fontWeight="700" fill="white" fontFamily="JetBrains Mono, monospace">
              ROI · {aiClass} {confidencePct}%
            </text>
          </g>

          {/* Underground: drop shaft + sewer pipe with flow particles */}
          <rect x={GRATE_X + 30} y={GROUND_Y + 10} width="40" height="44" fill="#0f172a" />
          <rect x={GRATE_X + 20} y="276" width={W - GRATE_X - 20} height="34" rx="17" fill="#0f172a" stroke="#334155" />
          <g clipPath="url(#fs-pipe)">
            {Array.from({ length: flowCount }, (_, i) => (
              <circle
                key={`${aiClass}-${i}`}
                cx={GRATE_X + 40}
                cy={293 + ((i % 3) - 1) * 6}
                r="3.5"
                fill="#38bdf8"
                className="fs-flow"
                style={{ animationDuration: `${flowDuration}s`, animationDelay: `${(i / flowCount) * flowDuration}s` }}
              />
            ))}
          </g>
          <text x={W - 16} y="330" textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="JetBrains Mono, monospace">
            Ống thoát nước · lưu lượng ~{Math.round(capacity * 100)}%
          </text>

          {/* Depth ruler */}
          <g transform={`translate(${W - 40} ${GROUND_Y - 84})`}>
            <rect x="0" y="0" width="6" height="84" fill="#e2e8f0" opacity="0.25" />
            {[0, 21, 42, 63, 84].map((y) => (
              <rect key={y} x="0" y={y} width="12" height="1.5" fill="#e2e8f0" opacity="0.6" />
            ))}
            <text x="-6" y={Math.max(10, 84 - waterDepth + 4)} textAnchor="end" fontSize="11" fontWeight="700" fill="#e0f2fe" fontFamily="JetBrains Mono, monospace">
              ~{depthCm} cm
            </text>
          </g>
        </svg>

        {/* HUD overlay */}
        <div className="absolute top-2 sm:top-3 left-3 right-2 sm:right-3 flex flex-wrap items-start justify-end sm:justify-between gap-2 pointer-events-none">
          <div className="hidden sm:flex flex-wrap gap-1.5 text-[11px] font-bold">
            <span className="px-2 py-1 rounded-md bg-black/50 text-sky-100 backdrop-blur-sm flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5" /> {rainMmPerHour} mm/h
            </span>
            <span className="px-2 py-1 rounded-md bg-black/50 text-sky-100 backdrop-blur-sm flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> {waterLevel} · {waterPercentage}%
            </span>
            <span className="px-2 py-1 rounded-md bg-black/50 text-sky-100 backdrop-blur-sm flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" /> {isModelConnected ? 'AI thật' : 'AI mô phỏng'}
            </span>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-black text-white shadow-lg ${risk.chip} ${ruleResult.riskLevel === 'HIGH' ? 'animate-pulse' : ''}`}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Cause -> effect narration */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <p className="text-sm text-sky-100">
          <span className="text-sky-300 font-semibold">{story}</span>
          <span className="text-slate-400"> → Rule Engine: </span>
          <span className={`font-black ${risk.text}`}>{risk.label}</span>
          <span className="block text-xs text-slate-400 mt-0.5">{ruleResult.actionRecommendation}</span>
        </p>
        {(ruleResult.riskLevel === 'HIGH' || ruleResult.riskLevel === 'WARNING') && (
          <button
            onClick={() => {
              createTicket();
              setActiveTab('tickets');
            }}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            <TicketIcon className="w-4 h-4" />
            Gửi đội thoát nước (Tạo Ticket)
          </button>
        )}
      </div>

      {/* Try-it controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">1 · Trời mưa</div>
          <div className="grid grid-cols-4 gap-1.5">
            {rainPresets.map((p) => (
              <button
                key={p.v}
                onClick={() => setRainMmPerHour(p.v)}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${rainMmPerHour === p.v ? 'bg-sky-500 text-slate-950' : 'bg-white/10 text-sky-100 hover:bg-white/20'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex justify-between">
            <span>2 · Camera thấy miệng cống</span>
            {isModelConnected && <span className="text-emerald-300 normal-case">do AI thật quyết định</span>}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {drainPresets.map((c) => (
              <button
                key={c}
                disabled={isModelConnected}
                onClick={() => setMockClass(c)}
                title={AI_LABEL_VI[c]}
                className={`py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-40 ${mockClass === c && !isModelConnected ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-sky-100 hover:bg-white/20'}`}
              >
                {c === 'CLEAR' ? 'Sạch' : c === 'TRASH_NEARBY' ? 'Rác gần' : c === 'PARTIAL_BLOCKED' ? 'Che 1 phần' : 'Tắc'}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">3 · Nước trên mặt đường</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['LOW', 'MEDIUM', 'HIGH'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setWaterLevel(l)}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${waterLevel === l ? 'bg-sky-500 text-slate-950' : 'bg-white/10 text-sky-100 hover:bg-white/20'}`}
              >
                {l === 'LOW' ? 'Thấp' : l === 'MEDIUM' ? 'Dâng vừa' : 'Ngập'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-500">
        Hình minh họa mô phỏng. Độ sâu (cm) và lưu lượng ống là giá trị ước lượng để trực quan hóa, không phải số đo thực tế.
      </p>
    </div>
  );
};
