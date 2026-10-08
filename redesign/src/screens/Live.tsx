import { CctvFrame } from '../ui/CctvFrame';
import { Button, RiskMark, RiskScale } from '../ui/primitives';
import { ProbBars, RainBars, WaterLine } from '../ui/charts';
import { DRAIN_LABEL, FRAMES, RAIN, TIMES, WATER_CM } from '../data';

const CONDITIONS = [
  { k: 'Lượng mưa', v: '55 mm/h', t: '> 50 mm/h' },
  { k: 'Miệng cống (AI)', v: 'BLOCKED · 0.91', t: '≥ 0.80' },
  { k: 'Mực nước', v: '39 cm', t: '≥ mức cao' },
];

export function Live() {
  return (
    <div className="pt-7">
      <div className="flex items-end justify-between">
        <div>
          <span className="label">Trực tiếp · Camera C‑01 · Quận Cầu Giấy</span>
          <h2 className="font-serif text-[38px] leading-tight tracking-tight mt-1">Ngã tư Cầu Giấy – Xuân Thủy</h2>
        </div>
        <div className="flex items-center gap-6 pb-2">
          <span className="font-mono text-[11.5px] text-ink-3">khung hình mới nhất · 2 giây trước</span>
          <RiskMark risk="HIGH" size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-10 mt-5">
        <div className="col-span-8">
          <CctvFrame state="BLOCKED" water={0.55} rain={0.75} confidence={0.91} className="w-full aspect-video block" />
          <div className="mt-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="label !text-ink">Diễn biến miệng cống · 30 phút</span>
              <span className="label">vùng ROI · mỗi 5 phút</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {FRAMES.map((f, i) => (
                <div key={f.t}>
                  <div className={`relative ${i === FRAMES.length - 1 ? 'outline-2 outline-ink outline-offset-2' : ''}`}>
                    <CctvFrame state={f.state} roiOnly seed={i + 3} className="w-full aspect-square block" />
                  </div>
                  <div className="mt-1.5 flex justify-between font-mono text-[10.5px]">
                    <span className="text-ink-3">{f.t}</span>
                    <span className="num">{f.p.toFixed(2)}</span>
                  </div>
                  <div className="text-[11.5px] text-ink-2">{DRAIN_LABEL[f.state]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="col-span-4">
          <div className="border-t-2 border-signal pt-4">
            <span className="label">Kết luận của bộ luật</span>
            <div className="font-serif text-[42px] leading-[1.05] tracking-tight text-signal mt-2">Nguy cơ ngập cao</div>
            <div className="mt-4">
              <RiskScale level={4} />
              <div className="flex justify-between font-mono text-[10.5px] text-ink-3 mt-1.5">
                <span>MỨC 4/4</span>
                <span>RULE_HIGH_RISK_01</span>
              </div>
            </div>

            <table className="w-full mt-5 text-[13px]">
              <tbody>
                {CONDITIONS.map((c) => (
                  <tr key={c.k} className="border-t border-rule">
                    <td className="py-2.5 text-ink-2">{c.k}</td>
                    <td className="py-2.5 font-mono text-[12px] num">{c.v}</td>
                    <td className="py-2.5 font-mono text-[11px] text-ink-3">{c.t}</td>
                    <td className="py-2.5 text-right text-signal">●</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[13px] leading-relaxed text-ink-2 border-t border-rule pt-3">
              Cả ba điều kiện cùng đạt. Nước sẽ tràn mặt đường nếu miệng cống không được dọn trong khoảng 10–15 phút tới.
            </p>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <Button kind="signal">Điều đội thoát nước</Button>
              <Button kind="ghost">Xem lại ảnh</Button>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-baseline justify-between mb-3">
              <span className="label !text-ink">Đầu ra mô hình</span>
              <span className="label">vạch đỏ = ngưỡng 0.80</span>
            </div>
            <ProbBars
              rows={[
                { name: 'BLOCKED', p: 0.91, hi: true },
                { name: 'PARTIAL_BLOCKED', p: 0.05 },
                { name: 'TRASH_NEARBY', p: 0.03 },
                { name: 'CLEAR', p: 0.01 },
              ]}
            />
          </div>

          <div className="mt-7 grid grid-cols-2 gap-5">
            <div>
              <span className="label !text-ink">Mưa · mm/h</span>
              <div className="font-serif text-[26px] num leading-none mt-1">55</div>
              <RainBars data={RAIN} labels={TIMES} threshold={50} now={7} height={96} width={200} />
            </div>
            <div>
              <span className="label !text-ink">Nước · cm</span>
              <div className="font-serif text-[26px] num leading-none mt-1 text-water">39</div>
              <WaterLine data={WATER_CM} height={96} width={200} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
