export type Screen = 'cover' | 'live' | 'network' | 'incident' | 'model';

const NAV: { id: Screen; label: string }[] = [
  { id: 'cover', label: 'Tổng quan' },
  { id: 'live', label: 'Trực tiếp' },
  { id: 'network', label: 'Mạng lưới' },
  { id: 'incident', label: 'Sự cố' },
  { id: 'model', label: 'Mô hình' },
];

export function Masthead({ active }: { active: Screen }) {
  return (
    <header className="h-14 px-10 flex items-center justify-between border-b border-rule bg-paper">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-[24px] leading-none tracking-tight">
          Anti<span className="italic">‑</span>Flood
        </span>
        <span className="label">Newton AI · Hà Nội</span>
      </div>
      <nav className="flex items-center gap-8 h-full">
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className={`h-full flex items-center text-[13.5px] border-b-2 ${active === n.id ? 'border-ink text-ink font-medium' : 'border-transparent text-ink-2'}`}
          >
            {n.label}
            {n.id === 'live' && <span className="ml-2 w-[6px] h-[6px] bg-signal" />}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-5">
        <span className="font-mono text-[11.5px] text-ink-2 num">T5 08.10.2026 · 17:34:12</span>
        <span className="font-mono text-[11px] text-ink-3 border border-rule px-2 py-1">DỮ LIỆU MÔ PHỎNG</span>
      </div>
    </header>
  );
}
