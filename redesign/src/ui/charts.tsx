// Minimal hand-drawn SVG charts: hairline axes, tabular mono labels, one accent.

export function RainBars({ data, labels, threshold, now, height = 120, width = 420 }: { data: number[]; labels: string[]; threshold: number; now: number; height?: number; width?: number }) {
  const W = width, H = height, pad = { l: 26, r: 4, t: 8, b: 18 };
  const max = 70;
  const bw = (W - pad.l - pad.r) / data.length;
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 25, 50].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--color-rule-2)" />
          <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-3)" fontFamily="var(--font-mono)">{v}</text>
        </g>
      ))}
      {data.map((v, i) => (
        <rect key={i} x={pad.l + i * bw + 2} width={bw - 4} y={y(v)} height={y(0) - y(v)} fill={i > now ? 'var(--color-rule)' : v > threshold ? 'var(--color-ink)' : 'var(--color-ink-3)'} opacity={i > now ? 0.6 : 1} />
      ))}
      <line x1={pad.l} x2={W - pad.r} y1={y(threshold)} y2={y(threshold)} stroke="var(--color-signal)" strokeDasharray="3 3" />
      <text x={W - pad.r} y={y(threshold) - 4} textAnchor="end" fontSize="9" fill="var(--color-signal)" fontFamily="var(--font-mono)">{threshold}</text>
      {labels.map((l, i) => i % (W < 300 ? 6 : 3) === 0 && (
        <text key={l} x={pad.l + i * bw + bw / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--color-ink-3)" fontFamily="var(--font-mono)">{l}</text>
      ))}
    </svg>
  );
}

export function WaterLine({ data, height = 120, compare, width = 420 }: { data: number[]; height?: number; compare?: number[]; width?: number }) {
  const W = width, H = height, pad = { l: 26, r: 4, t: 8, b: 18 };
  const max = 50, n = 12;
  const x = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const path = (d: number[]) => d.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <rect x={pad.l} width={W - pad.l - pad.r} y={y(max)} height={y(35) - y(max)} fill="var(--color-signal)" opacity="0.06" />
      {[0, 20, 40].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--color-rule-2)" />
          <text x={pad.l - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="var(--color-ink-3)" fontFamily="var(--font-mono)">{v}</text>
        </g>
      ))}
      {compare && <path d={path(compare)} fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="4 3" />}
      <path d={`${path(data)} L${x(data.length - 1)} ${y(0)} L${x(0)} ${y(0)}Z`} fill="var(--color-water)" opacity="0.12" />
      <path d={path(data)} fill="none" stroke="var(--color-water)" strokeWidth="2" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="3.5" fill="var(--color-water)" />
      {(W < 300 ? ['17:00', '17:30'] : ['17:00', '17:15', '17:30', '17:45']).map((l, i) => (
        <text key={l} x={x(i * (W < 300 ? 6 : 3))} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--color-ink-3)" fontFamily="var(--font-mono)">{l}</text>
      ))}
    </svg>
  );
}

export function ProbBars({ rows }: { rows: { name: string; p: number; hi?: boolean }[] }) {
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-[120px_1fr_44px] items-center gap-3">
          <span className={`font-mono text-[11px] ${r.hi ? 'text-ink' : 'text-ink-3'}`}>{r.name}</span>
          <span className="h-[5px] bg-rule-2 relative">
            <span className="absolute inset-y-0 left-0" style={{ width: `${r.p * 100}%`, background: r.hi ? 'var(--color-ink)' : 'var(--color-ink-3)' }} />
            <span className="absolute -top-1 -bottom-1 w-px bg-signal" style={{ left: '80%' }} />
          </span>
          <span className={`font-mono text-[12px] text-right num ${r.hi ? 'text-ink' : 'text-ink-3'}`}>{r.p.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
