/**
 * Stylised CCTV still: a camera on a pole looking down at a street corner with a
 * storm-drain inlet by the curb. Pure SVG, no assets. Everything is drawn on a
 * ground plane (u = across the street 0..1, v = distance from camera 0..1) and
 * projected into perspective.
 */
import { useId, useMemo } from 'react';

export type DrainState = 'CLEAR' | 'TRASH_NEARBY' | 'PARTIAL_BLOCKED' | 'BLOCKED';

interface Props {
  state: DrainState;
  /** 0..1, how far standing water spreads from the curb */
  water?: number;
  /** 0..1 rain intensity */
  rain?: number;
  /** show HUD (camera id, timestamp, ROI brackets) */
  hud?: boolean;
  time?: string;
  camera?: string;
  confidence?: number;
  /** crop to ROI only (what the model sees) */
  roiOnly?: boolean;
  seed?: number;
  className?: string;
}

const W = 1600;
const H = 900;

function project(u: number, v: number): [number, number] {
  const a = 2.4;
  const f = (1 - 1 / (1 + a * v)) / (1 - 1 / (1 + a));
  const y = H + 30 - f * (H + 90);
  const L = -520 + (400 + 520) * f;
  const R = 2120 + (1480 - 2120) * f;
  return [L + (R - L) * u, y];
}
const scaleAt = (v: number) => {
  const [l] = project(0, v);
  const [r] = project(1, v);
  return (r - l) / 2640;
};
const poly = (pts: [number, number][]) => pts.map(([u, v]) => project(u, v).join(',')).join(' ');

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Drain inlet position on the ground plane
const G = { u0: 0.535, u1: 0.652, v0: 0.13, v1: 0.27 };
const CURB = 0.66;

type Piece = { kind: 'leaf' | 'bag' | 'bottle' | 'cup'; u: number; v: number; rot: number; tint: number; size: number };

function trashFor(state: DrainState, seed: number): Piece[] {
  const r = rng(seed);
  const leaves = (n: number, u0: number, u1: number, v0: number, v1: number): Piece[] =>
    Array.from({ length: n }, () => ({
      kind: 'leaf' as const,
      u: u0 + r() * (u1 - u0),
      v: v0 + r() * (v1 - v0),
      rot: r() * 180,
      tint: r(),
      size: 0.8 + r() * 0.6,
    }));
  switch (state) {
    case 'CLEAR':
      return [...leaves(4, 0.72, 0.95, 0.4, 0.8)];
    case 'TRASH_NEARBY':
      return [
        ...leaves(12, 0.47, 0.53, 0.12, 0.3),
        ...leaves(5, 0.4, 0.47, 0.16, 0.34),
        { kind: 'bag', u: 0.505, v: 0.2, rot: -12, tint: 0, size: 1 },
        { kind: 'bottle', u: 0.44, v: 0.15, rot: 38, tint: 0, size: 1 },
        { kind: 'cup', u: 0.5, v: 0.31, rot: 0, tint: 0, size: 1 },
      ];
    case 'PARTIAL_BLOCKED':
      return [
        ...leaves(22, G.u0 - 0.02, G.u0 + 0.05, G.v0, G.v1 + 0.03),
        ...leaves(8, 0.44, 0.52, 0.16, 0.3),
        { kind: 'bag', u: G.u0 + 0.02, v: G.v0 + 0.06, rot: 20, tint: 0, size: 1.05 },
        { kind: 'bottle', u: 0.47, v: 0.24, rot: -24, tint: 0, size: 1 },
      ];
    case 'BLOCKED':
      return [
        ...leaves(46, G.u0 - 0.025, G.u1 + 0.005, G.v0 - 0.02, G.v1 + 0.03),
        ...leaves(10, 0.46, 0.53, 0.14, 0.32),
        { kind: 'bag', u: G.u0 + 0.025, v: G.v0 + 0.04, rot: 10, tint: 0, size: 1.2 },
        { kind: 'bag', u: G.u1 - 0.02, v: G.v1 - 0.02, rot: -30, tint: 0.5, size: 1.1 },
        { kind: 'bottle', u: G.u0 + 0.05, v: G.v1 - 0.01, rot: 70, tint: 0, size: 1 },
        { kind: 'cup', u: 0.5, v: 0.2, rot: 0, tint: 0, size: 1 },
      ];
  }
}

const LEAF_COLORS = ['#6b5a2e', '#7c6631', '#4f5a2a', '#8a6a35', '#5c4a26', '#6f7333'];

function PieceShape({ p }: { p: Piece }) {
  const [x, y] = project(p.u, p.v);
  const s = scaleAt(p.v) * p.size * 1.45;
  const t = `translate(${x} ${y}) scale(${s}) rotate(${p.rot})`;
  if (p.kind === 'leaf') {
    const c = LEAF_COLORS[Math.floor(p.tint * LEAF_COLORS.length)];
    return (
      <g transform={t}>
        <path d="M-22 0 C-12 -11 10 -11 22 0 C10 11 -12 11 -22 0Z" fill={c} opacity="0.95" />
        <path d="M-22 0 L22 0" stroke="#2b2412" strokeWidth="1.2" opacity="0.5" />
      </g>
    );
  }
  if (p.kind === 'bag') {
    return (
      <g transform={t}>
        <ellipse cx="4" cy="10" rx="46" ry="16" fill="#000" opacity="0.28" />
        <path d="M-44 6 C-40 -22 -12 -30 4 -24 C26 -32 46 -16 42 4 C38 22 -30 26 -44 6Z" fill={p.tint ? '#b9c2c7' : '#dcdad3'} />
        <path d="M-30 -6 C-14 -14 8 -12 26 -4" stroke="#9e9b92" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M-18 8 C-4 2 14 4 30 10" stroke="#a7a49b" strokeWidth="1.6" fill="none" opacity="0.6" />
      </g>
    );
  }
  if (p.kind === 'bottle') {
    return (
      <g transform={t}>
        <rect x="-30" y="-9" width="50" height="18" rx="8" fill="#9fb8c4" opacity="0.85" />
        <rect x="18" y="-5" width="14" height="10" rx="2" fill="#3e6d86" />
        <rect x="-24" y="-6" width="34" height="4" rx="2" fill="#e6eef2" opacity="0.6" />
      </g>
    );
  }
  return (
    <g transform={t}>
      <path d="M-12 -14 L12 -14 L9 14 L-9 14Z" fill="#e7e3da" />
      <rect x="-12" y="-6" width="24" height="7" fill="#b2321f" />
    </g>
  );
}

export function CctvFrame({
  state,
  water = 0,
  rain = 0,
  hud = true,
  time = '2026-10-08 17:34:12',
  camera = 'C-01 · NGÃ TƯ CẦU GIẤY',
  confidence,
  roiOnly = false,
  seed = 7,
  className,
}: Props) {
  const id = useId().replace(/:/g, '');
  const pieces = useMemo(() => trashFor(state, seed), [state, seed]);
  const drops = useMemo(() => {
    const r = rng(seed + 99);
    return Array.from({ length: Math.round(rain * 260) }, () => ({ x: r() * W, y: r() * H, l: 18 + r() * 34, o: 0.12 + r() * 0.22 }));
  }, [rain, seed]);
  const ripples = useMemo(() => {
    const r = rng(seed + 7);
    return Array.from({ length: Math.round(rain * 40 * Math.min(1, water * 2 + 0.2)) }, () => ({ u: CURB - r() * Math.max(0.05, water) * 0.9, v: 0.05 + r() * 0.85, k: r() }));
  }, [rain, water, seed]);

  // ROI rectangle in screen space around the inlet
  const roi = useMemo(() => {
    const pts = [project(G.u0 - 0.03, G.v0 - 0.03), project(G.u1 + 0.02, G.v0 - 0.03), project(G.u1 + 0.02, G.v1 + 0.04), project(G.u0 - 0.03, G.v1 + 0.04)];
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  }, []);

  const viewBox = roiOnly
    ? (() => {
        const side = Math.max(roi.w, roi.h);
        return `${roi.x + roi.w / 2 - side / 2} ${roi.y + roi.h / 2 - side / 2} ${side} ${side}`;
      })()
    : `0 0 ${W} ${H}`;

  const waterU = Math.max(0, CURB - water * 0.95);
  const stateColor = state === 'BLOCKED' ? '#e0492f' : state === 'PARTIAL_BLOCKED' ? '#e08a2a' : state === 'TRASH_NEARBY' ? '#d8b23a' : '#5fbf8f';

  return (
    <svg viewBox={viewBox} className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Ảnh camera, trạng thái ${state}`}>
      <defs>
        <linearGradient id={`asph${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d3f" />
          <stop offset="1" stopColor="#25282a" />
        </linearGradient>
        <linearGradient id={`walk${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e6c66" />
          <stop offset="1" stopColor="#57554f" />
        </linearGradient>
        <linearGradient id={`water${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d7785" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#3f5b69" stopOpacity="0.7" />
          <stop offset="1" stopColor="#6f8a96" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={`vig${id}`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id={`glare${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#dfe8ee" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`tex${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.22" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`grain${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed={seed + 3} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.12" />
          </feComponentTransfer>
        </filter>
        <filter id={`soft${id}`}>
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Road surface */}
      <polygon points={poly([[-0.2, -0.05], [CURB, -0.05], [CURB, 1.05], [-0.2, 1.05]])} fill={`url(#asph${id})`} />
      <polygon points={poly([[-0.2, -0.05], [CURB, -0.05], [CURB, 1.05], [-0.2, 1.05]])} fill="#000" filter={`url(#tex${id})`} />

      {/* Lane line + crosswalk */}
      {Array.from({ length: 9 }, (_, i) => (
        <polygon key={`d${i}`} points={poly([[0.24, i * 0.12], [0.252, i * 0.12], [0.252, i * 0.12 + 0.06], [0.24, i * 0.12 + 0.06]])} fill="#cfcabd" opacity="0.55" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <polygon key={`z${i}`} points={poly([[0.02 + i * 0.058, 0.74], [0.05 + i * 0.058, 0.74], [0.05 + i * 0.058, 0.86], [0.02 + i * 0.058, 0.86]])} fill="#d9d4c7" opacity="0.5" />
      ))}

      {/* Wet glare streak */}
      <polygon points={poly([[0.05, 0.1], [0.3, 0.1], [0.36, 1], [0.12, 1]])} fill={`url(#glare${id})`} filter={`url(#soft${id})`} />

      {/* Gutter shadow + curb + sidewalk */}
      <polygon points={poly([[CURB - 0.02, -0.05], [CURB, -0.05], [CURB, 1.05], [CURB - 0.02, 1.05]])} fill="#1b1d1e" opacity="0.6" />
      <polygon points={poly([[CURB, -0.05], [CURB + 0.016, -0.05], [CURB + 0.016, 1.05], [CURB, 1.05]])} fill="#9a978f" />
      <polygon points={poly([[CURB + 0.016, -0.05], [1.3, -0.05], [1.3, 1.05], [CURB + 0.016, 1.05]])} fill={`url(#walk${id})`} />
      <polygon points={poly([[CURB + 0.016, -0.05], [1.3, -0.05], [1.3, 1.05], [CURB + 0.016, 1.05]])} fill="#000" filter={`url(#tex${id})`} />
      <g stroke="#45433e" strokeWidth="2" opacity="0.6">
        {Array.from({ length: 9 }, (_, i) => {
          const u = CURB + 0.016 + i * 0.045;
          const [x1, y1] = project(u, -0.05);
          const [x2, y2] = project(u, 1.05);
          return <line key={`tu${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {Array.from({ length: 18 }, (_, i) => {
          const v = i * 0.06;
          const [x1, y1] = project(CURB + 0.016, v);
          const [x2, y2] = project(1.3, v);
          return <line key={`tv${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Standing water spreading from the curb */}
      {water > 0.01 && (
        <g>
          <polygon points={poly([[waterU, -0.05], [CURB, -0.05], [CURB, 1.05], [waterU + 0.02, 1.05]])} fill={`url(#water${id})`} />
          <polygon points={poly([[waterU, -0.05], [waterU + 0.03, -0.05], [waterU + 0.05, 1.05], [waterU + 0.02, 1.05]])} fill="#a9bcc5" opacity="0.18" filter={`url(#soft${id})`} />
          {ripples.map((r, i) => {
            const [x, y] = project(r.u, r.v);
            const s = scaleAt(r.v);
            return <ellipse key={i} cx={x} cy={y} rx={(10 + r.k * 22) * s * 2} ry={(3 + r.k * 6) * s * 2} fill="none" stroke="#d6e1e6" strokeOpacity={0.25 + r.k * 0.2} strokeWidth="1.4" />;
          })}
        </g>
      )}

      {/* Drain inlet: frame, dark void, grate bars */}
      <polygon points={poly([[G.u0 - 0.008, G.v0 - 0.01], [G.u1 + 0.008, G.v0 - 0.01], [G.u1 + 0.008, G.v1 + 0.01], [G.u0 - 0.008, G.v1 + 0.01]])} fill="#585a58" />
      <polygon points={poly([[G.u0, G.v0], [G.u1, G.v0], [G.u1, G.v1], [G.u0, G.v1]])} fill="#0b0c0c" />
      {Array.from({ length: 8 }, (_, i) => {
        const u = G.u0 + 0.006 + (i * (G.u1 - G.u0 - 0.012)) / 7;
        return <polygon key={`g${i}`} points={poly([[u - 0.0035, G.v0], [u + 0.0035, G.v0], [u + 0.0035, G.v1], [u - 0.0035, G.v1]])} fill="#4a4c4b" />;
      })}
      <polygon points={poly([[G.u0, (G.v0 + G.v1) / 2 - 0.004], [G.u1, (G.v0 + G.v1) / 2 - 0.004], [G.u1, (G.v0 + G.v1) / 2 + 0.004], [G.u0, (G.v0 + G.v1) / 2 + 0.004]])} fill="#4a4c4b" />
      {/* curb opening */}
      <polygon points={poly([[CURB, G.v0], [CURB + 0.012, G.v0], [CURB + 0.012, G.v1], [CURB, G.v1]])} fill="#0b0c0c" />

      {/* Debris */}
      {pieces.map((p, i) => (
        <PieceShape key={i} p={p} />
      ))}

      {/* Rain streaks */}
      <g stroke="#e3e9ec" strokeLinecap="round">
        {drops.map((d, i) => (
          <line key={i} x1={d.x} y1={d.y} x2={d.x - d.l * 0.18} y2={d.y + d.l} strokeOpacity={d.o} strokeWidth="1.6" />
        ))}
      </g>

      {/* Camera grade */}
      <rect x="-200" y="-200" width={W + 400} height={H + 400} fill="#1e3640" opacity="0.14" style={{ mixBlendMode: 'multiply' }} />
      <rect x="-200" y="-200" width={W + 400} height={H + 400} filter={`url(#grain${id})`} />
      {!roiOnly && <rect x="0" y="0" width={W} height={H} fill={`url(#vig${id})`} />}

      {/* HUD */}
      {hud && !roiOnly && (
        <g fontFamily="JetBrains Mono, monospace" fill="#f2f0ea">
          <text x="40" y="62" fontSize="26" fontWeight="500" opacity="0.92">{camera}</text>
          <text x="40" y="96" fontSize="18" opacity="0.6">1920×1080 · 25 FPS · H.265</text>
          <text x={W - 40} y="62" fontSize="26" textAnchor="end" opacity="0.92">{time}</text>
          <circle cx="50" cy={H - 48} r="8" fill="#e0492f" />
          <text x="68" y={H - 40} fontSize="20" opacity="0.8">REC</text>

          {/* ROI brackets */}
          <g stroke={stateColor} strokeWidth="4" fill="none">
            {(() => {
              const { x, y, w, h } = roi;
              const c = 34;
              return (
                <>
                  <path d={`M${x} ${y + c} V${y} H${x + c}`} />
                  <path d={`M${x + w - c} ${y} H${x + w} V${y + c}`} />
                  <path d={`M${x + w} ${y + h - c} V${y + h} H${x + w - c}`} />
                  <path d={`M${x + c} ${y + h} H${x} V${y + h - c}`} />
                </>
              );
            })()}
          </g>
          <g transform={`translate(${roi.x} ${roi.y - 14})`}>
            <rect x="0" y="-34" width={confidence !== undefined ? 380 : 210} height="40" fill="#0d0e0e" opacity="0.82" />
            <rect x="12" y="-22" width="16" height="16" fill={stateColor} />
            <text x="40" y="-7" fontSize="21" fill="#f2f0ea">
              ROI{confidence !== undefined ? ` · ${state} ${confidence.toFixed(2)}` : ' 224×224'}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
