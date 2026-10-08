/**
 * @license
 * SMART ANTI-FLOOD AI - Sample Images for Demonstration
 * High-fidelity, self-contained SVG DataURIs for 4 core classes:
 * CLEAR, TRASH_NEARBY, PARTIAL_BLOCKED, BLOCKED
 */

import { SampleImage } from '../types';

function createDrainSvgDataUrl(type: 'CLEAR' | 'TRASH_NEARBY' | 'PARTIAL_BLOCKED' | 'BLOCKED'): string {
  let debrisSvg = '';

  if (type === 'CLEAR') {
    // Pure clean drain: flowing water streaks, no trash
    debrisSvg = `
      <!-- Flowing clean rainwater lines -->
      <path d="M 120 180 Q 240 220 360 210" stroke="#38bdf8" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 160 300 Q 280 320 440 290" stroke="#38bdf8" stroke-width="2.5" fill="none" opacity="0.5"/>
      <text x="320" y="440" font-family="sans-serif" font-size="16" font-weight="bold" fill="#10b981" text-anchor="middle">MIỆNG CỐNG THÔNG THOÁNG (CLEAR)</text>
    `;
  } else if (type === 'TRASH_NEARBY') {
    // Trash lying nearby on asphalt curb (left/top), outside grate
    debrisSvg = `
      <!-- Trash on the road surface away from grate -->
      <g transform="translate(60, 100)">
        <!-- Plastic bottle -->
        <rect x="0" y="0" width="36" height="18" rx="6" fill="#38bdf8" opacity="0.85" transform="rotate(-15)"/>
        <rect x="36" y="4" width="8" height="10" rx="2" fill="#0284c7" transform="rotate(-15)"/>
        <!-- Discarded paper cup -->
        <polygon points="50,40 70,40 66,70 54,70" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Plastic bag nearby -->
        <path d="M 80 20 Q 110 10 120 35 Q 130 60 105 70 Q 80 80 85 50 Z" fill="#fbbf24" opacity="0.8"/>
      </g>
      <text x="130" y="210" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f59e0b">RÁC NGOÀI MIỆNG CỐNG (Cách 40cm)</text>
      <text x="320" y="440" font-family="sans-serif" font-size="16" font-weight="bold" fill="#f59e0b" text-anchor="middle">CÓ RÁC GẦN CỐNG (TRASH_NEARBY)</text>
    `;
  } else if (type === 'PARTIAL_BLOCKED') {
    // Trash and wet leaves covering about 30-40% of the grate opening
    debrisSvg = `
      <!-- Debris on corner of grate -->
      <g transform="translate(200, 160)">
        <path d="M 0 0 Q 60 -20 100 15 Q 120 60 70 80 Q 20 90 0 40 Z" fill="#d97706" opacity="0.9"/>
        <!-- Leaf cluster -->
        <path d="M 30 10 Q 50 35 40 60 Q 15 50 30 10 Z" fill="#65a30d"/>
        <path d="M 70 30 Q 90 60 75 80 Q 50 70 70 30 Z" fill="#84cc16"/>
        <!-- Crushed can -->
        <ellipse cx="80" cy="90" rx="24" ry="14" fill="#dc2626" opacity="0.85" transform="rotate(25)"/>
        <!-- Plastic snack wrapper -->
        <rect x="10" y="60" width="40" height="24" rx="3" fill="#ec4899" opacity="0.85" transform="rotate(-10)"/>
      </g>
      <text x="320" y="440" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ea580c" text-anchor="middle">RÁC CHE MỘT PHẦN (PARTIAL_BLOCKED)</text>
    `;
  } else {
    // BLOCKED: Heavy accumulation completely blanketing the grate
    debrisSvg = `
      <!-- Heavy debris mat completely covering grate bars -->
      <g transform="translate(180, 140)">
        <!-- Plastic shopping bags -->
        <path d="M 20 10 Q 140 -30 240 20 Q 300 90 260 170 Q 180 230 60 200 Q -20 140 20 10 Z" fill="#b45309" opacity="0.9"/>
        <path d="M 40 30 Q 120 10 180 50 Q 230 110 170 170 Q 90 190 30 140 Z" fill="#1e293b" opacity="0.95"/>
        <path d="M 80 40 Q 160 50 200 100 Q 160 160 80 130 Z" fill="#0284c7" opacity="0.85"/>
        <path d="M 120 80 Q 190 90 220 150 Q 160 190 110 160 Z" fill="#e11d48" opacity="0.9"/>
        <!-- Fallen wet tree branches -->
        <line x1="-10" y1="60" x2="280" y2="160" stroke="#78350f" stroke-width="12" stroke-linecap="round"/>
        <line x1="20" y1="180" x2="240" y2="40" stroke="#451a03" stroke-width="9" stroke-linecap="round"/>
        <!-- Dense leaf pack -->
        <ellipse cx="90" cy="110" rx="35" ry="20" fill="#4d7c0f"/>
        <ellipse cx="170" cy="120" rx="40" ry="25" fill="#3f6212"/>
        <ellipse cx="140" cy="70" rx="30" ry="18" fill="#166534"/>
      </g>
      <!-- Stagnant pooling water ring -->
      <ellipse cx="320" cy="240" rx="190" ry="120" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="10 6" opacity="0.7"/>
      <text x="320" y="440" font-family="sans-serif" font-size="16" font-weight="black" fill="#dc2626" text-anchor="middle">CỐNG BỊ TẮC NGHẼN NẶNG (BLOCKED)</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480">
    <defs>
      <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="curbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#64748b" />
        <stop offset="100%" stop-color="#475569" />
      </linearGradient>
      <linearGradient id="gratePit" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#020617" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>

    <!-- Asphalt pavement background -->
    <rect x="0" y="0" width="640" height="480" fill="url(#roadGrad)"/>
    
    <!-- Curb stone along top -->
    <rect x="0" y="0" width="640" height="70" fill="url(#curbGrad)"/>
    <line x1="0" y1="70" x2="640" y2="70" stroke="#94a3b8" stroke-width="4"/>

    <!-- Drain Iron Frame Basin -->
    <rect x="180" y="130" width="280" height="210" rx="12" fill="#0f172a" stroke="#475569" stroke-width="8"/>
    <!-- Drain inner cavity -->
    <rect x="190" y="140" width="260" height="190" rx="6" fill="url(#gratePit)"/>

    <!-- Iron Grate Slotted Bars -->
    <g stroke="#94a3b8" stroke-width="9" stroke-linecap="round">
      <line x1="215" y1="150" x2="215" y2="320"/>
      <line x1="240" y1="150" x2="240" y2="320"/>
      <line x1="265" y1="150" x2="265" y2="320"/>
      <line x1="290" y1="150" x2="290" y2="320"/>
      <line x1="315" y1="150" x2="315" y2="320"/>
      <line x1="340" y1="150" x2="340" y2="320"/>
      <line x1="365" y1="150" x2="365" y2="320"/>
      <line x1="390" y1="150" x2="390" y2="320"/>
      <line x1="415" y1="150" x2="415" y2="320"/>
    </g>

    <!-- Horizontal support beam -->
    <line x1="190" y1="235" x2="450" y2="235" stroke="#64748b" stroke-width="6"/>

    <!-- Type Specific Debris Overlay -->
    ${debrisSvg}

    <!-- Water droplets / ripples -->
    <circle cx="140" cy="220" r="16" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.4"/>
    <circle cx="500" cy="260" r="22" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.3"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEFAULT_SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-clear',
    title: '🟢 Cống Sạch (CLEAR)',
    classLabel: 'CLEAR',
    url: createDrainSvgDataUrl('CLEAR'),
    description: 'Miệng cống thông thoáng hoàn toàn, các khe sắt không có rác, nước thoát 100%.',
  },
  {
    id: 'sample-trash-nearby',
    title: '🟡 Rác Gần Cống (TRASH_NEARBY)',
    classLabel: 'TRASH_NEARBY',
    url: createDrainSvgDataUrl('TRASH_NEARBY'),
    description: 'Có chai nhựa, túi bóng trên vỉa hè cách cống 40cm, dễ bị dòng nước cuốn vào cống.',
  },
  {
    id: 'sample-partial-blocked',
    title: '🟠 Rác Che Một Phần (PARTIAL_BLOCKED)',
    classLabel: 'PARTIAL_BLOCKED',
    url: createDrainSvgDataUrl('PARTIAL_BLOCKED'),
    description: 'Rác và cành lá che lấp khoảng 30-50% diện tích các khe thoát nước.',
  },
  {
    id: 'sample-blocked',
    title: '🔴 Cống Tắc Nghẽn (BLOCKED)',
    classLabel: 'BLOCKED',
    url: createDrainSvgDataUrl('BLOCKED'),
    description: 'Túi nilon, cành cây và rác thải bít kín toàn bộ miệng cống, nguy cơ ngập tức thì.',
  },
];
