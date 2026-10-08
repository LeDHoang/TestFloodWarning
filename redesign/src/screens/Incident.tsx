import { CctvFrame } from '../ui/CctvFrame';
import { Figure } from '../ui/primitives';
import { WaterLine } from '../ui/charts';

const STEPS = [
  { t: '17:30', k: 'Phát hiện', d: 'AI: BLOCKED 0.88' },
  { t: '17:31', k: 'Cảnh báo', d: 'Mức 4/4' },
  { t: '17:34', k: 'Điều đội', d: 'Đội 2 nhận phiếu' },
  { t: '17:46', k: 'Xử lý', d: 'Vớt rác, thông lưới' },
  { t: '17:52', k: 'Nghiệm thu', d: 'AI: CLEAR 0.94' },
];

const LOG = [
  ['17:30:08', 'AI', 'Miệng cống C‑01 chuyển từ PARTIAL_BLOCKED sang BLOCKED (0.88).'],
  ['17:30:09', 'Bộ luật', 'Mưa 55 mm/h > 50 và BLOCKED ≥ 0.80 → RULE_HIGH_RISK_01.'],
  ['17:31:02', 'Hệ thống', 'Tạo phiếu #0002, đính kèm ảnh ROI lúc 17:30.'],
  ['17:34:40', 'Điều phối', 'Giao cho Đội 2 (Nguyễn Văn H.). Ước tính đến 12 phút.'],
  ['17:46:15', 'Đội 2', 'Có mặt. Vớt 2 túi nilon và lá cây trên lưới thu.'],
  ['17:51:58', 'AI', 'Kiểm tra lại: CLEAR 0.94 ≥ 0.80.'],
  ['17:52:03', 'Hệ thống', 'Phiếu đóng. Thời gian xử lý 22 phút.'],
];

const WITH = [1, 1, 2, 3, 6, 11, 19, 24, 21, 14, 8, 5];
const WITHOUT = [1, 1, 2, 3, 6, 11, 19, 28, 37, 44, 47, 46];

export function Incident() {
  return (
    <div className="pt-7">
      <div className="flex items-end justify-between">
        <div>
          <span className="label">Phiếu sự cố #0002 · <span className="text-ok">Đã đóng</span></span>
          <h2 className="font-serif text-[38px] leading-tight tracking-tight mt-1">Miệng cống C‑01 bị rác che kín</h2>
        </div>
        <dl className="flex gap-10 pb-1 text-right">
          {[
            ['Mở', '17:30'],
            ['Đóng', '17:52'],
            ['Xử lý', '22 phút'],
            ['Đội', 'Đội 2'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="font-serif text-[26px] leading-none mt-1 num">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ol className="grid grid-cols-5 mt-7">
        {STEPS.map((s, i) => (
          <li key={s.k} className="relative pt-5">
            <span className="absolute top-[5px] left-0 right-0 h-[2px] bg-ink" style={{ right: i === STEPS.length - 1 ? '100%' : 0 }} />
            <span className="absolute top-0 left-0 w-3 h-3 bg-ink" style={{ background: i === STEPS.length - 1 ? 'var(--color-ok)' : undefined }} />
            <div className="font-mono text-[11px] text-ink-3 num">{s.t}</div>
            <div className="text-[14px] font-medium mt-0.5">{s.k}</div>
            <div className="text-[12px] text-ink-2">{s.d}</div>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-12 gap-x-10 mt-8">
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-5">
            <Figure n="TRƯỚC · 17:30" caption="Lưới thu bị che bởi túi nilon và lá cây. Nước bắt đầu dâng dọc mép vỉa.">
              <CctvFrame state="BLOCKED" water={0.4} rain={0.6} confidence={0.88} time="2026-10-08 17:30:08" className="w-full aspect-video block" />
            </Figure>
            <Figure n="SAU · 17:52" caption="Lưới thu thông thoáng. AI xác nhận CLEAR trước khi phiếu được đóng.">
              <CctvFrame state="CLEAR" water={0.12} rain={0.35} confidence={0.94} time="2026-10-08 17:51:58" className="w-full aspect-video block" />
            </Figure>
          </div>
          <div className="mt-7 border-t border-ink pt-3">
            <div className="flex items-baseline justify-between">
              <span className="label !text-ink">Mực nước tại C‑01 · cm</span>
              <span className="flex gap-5 text-[12px] text-ink-2">
                <span className="flex items-center gap-2"><span className="w-5 h-[2px] bg-water" /> Thực tế</span>
                <span className="flex items-center gap-2"><span className="w-5 border-t-[1.5px] border-dashed border-signal" /> Ước tính nếu không dọn</span>
              </span>
            </div>
            <WaterLine data={WITH} compare={WITHOUT} height={170} width={900} />
          </div>
        </div>

        <aside className="col-span-4">
          <div className="border-t border-ink pt-3">
            <span className="label !text-ink">Nhật ký</span>
            <ol className="mt-3">
              {LOG.map(([t, who, what]) => (
                <li key={t} className="grid grid-cols-[68px_1fr] gap-3 py-2.5 border-t border-rule first:border-t-0">
                  <span className="font-mono text-[11px] text-ink-3 num pt-0.5">{t}</span>
                  <div>
                    <div className="text-[11px] font-mono text-ink-2 uppercase tracking-wide">{who}</div>
                    <p className="text-[13px] leading-snug">{what}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
