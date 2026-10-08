import type { ReactNode } from 'react';
import { RISK_COLOR, RISK_LABEL, type Risk } from '../data';

export function Section({ n, title, aside, children, className = '' }: { n?: string; title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`border-t border-ink pt-3 ${className}`}>
      <header className="flex items-baseline justify-between mb-4">
        <h3 className="label !text-ink">
          {n && <span className="text-ink-3 mr-3">{n}</span>}
          {title}
        </h3>
        {aside && <div className="label">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

export function RiskMark({ risk, size = 'md' }: { risk: Risk; size?: 'md' | 'lg' }) {
  const c = RISK_COLOR[risk];
  return (
    <span className={`inline-flex items-center gap-2 ${size === 'lg' ? 'text-[15px]' : 'text-[13px]'} font-medium`} style={{ color: c }}>
      <span className="inline-block" style={{ width: size === 'lg' ? 10 : 8, height: size === 'lg' ? 10 : 8, background: c }} />
      {RISK_LABEL[risk]}
    </span>
  );
}

/** 4-step risk scale, filled up to current level */
export function RiskScale({ level }: { level: number }) {
  const cols = ['var(--color-ok)', 'var(--color-watch)', 'var(--color-warn)', 'var(--color-signal)'];
  return (
    <div className="flex gap-[3px]">
      {cols.map((c, i) => (
        <span key={i} className="h-[6px] flex-1" style={{ background: i < level ? c : 'var(--color-rule-2)' }} />
      ))}
    </div>
  );
}

export function Figure({ children, caption, n }: { children: ReactNode; caption: ReactNode; n?: string }) {
  return (
    <figure>
      {children}
      <figcaption className="mt-2 text-[12.5px] leading-snug text-ink-2">
        {n && <span className="font-mono text-[11px] text-ink-3 mr-2">{n}</span>}
        {caption}
      </figcaption>
    </figure>
  );
}

export function Stat({ value, unit, label, tone }: { value: ReactNode; unit?: string; label: ReactNode; tone?: string }) {
  return (
    <div>
      <div className="font-serif text-[44px] leading-none num tracking-tight" style={{ color: tone }}>
        {value}
        {unit && <span className="font-sans text-[14px] text-ink-3 ml-1.5 tracking-normal">{unit}</span>}
      </div>
      <div className="mt-2 text-[12.5px] text-ink-2 leading-snug">{label}</div>
    </div>
  );
}

export function Button({ children, kind = 'primary' }: { children: ReactNode; kind?: 'primary' | 'ghost' | 'signal' }) {
  const cls =
    kind === 'primary'
      ? 'bg-ink text-sheet'
      : kind === 'signal'
        ? 'bg-signal text-sheet'
        : 'bg-transparent text-ink border border-ink';
  return <span className={`inline-flex items-center justify-center gap-2 h-10 px-4 text-[13px] font-medium ${cls}`}>{children}</span>;
}
