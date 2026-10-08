import { Fragment } from 'react';
import { CctvFrame } from '../ui/CctvFrame';
import { Button, RiskMark } from '../ui/primitives';
import { CAMERAS, DRAIN_LABEL, RISK_COLOR } from '../data';

function DistrictMap() {
  const roads: { d: string; w: number; name?: string; at?: [number, number, number] }[] = [
    { d: 'M0 250 L1000 250', w: 26, name: 'Xuân Thủy', at: [440, 254, 0] },
    { d: 'M0 470 L1000 470', w: 22, name: 'Trần Thái Tông', at: [440, 474, 0] },
    { d: 'M300 0 L300 850', w: 30, name: 'Cầu Giấy', at: [304, 760, -90] },
    { d: 'M610 0 L610 850', w: 18, name: 'Nguyễn Phong Sắc', at: [614, 120, -90] },
    { d: 'M140 0 L140 850', w: 14, name: 'Hồ Tùng Mậu', at: [144, 760, -90] },
    { d: 'M850 0 L850 850', w: 14, name: 'Tôn Thất Thuyết', at: [854, 120, -90] },
    { d: 'M300 360 C420 340 500 380 610 360', w: 8 },
    { d: 'M610 600 C700 580 760 620 850 600', w: 8 },
  ];
  return (
    <svg viewBox="0 0 1000 850" preserveAspectRatio="xMidYMid slice" className="w-full h-full block bg-sheet">
      <defs>
        <pattern id="park" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-ok)" strokeOpacity="0.35" />
        </pattern>
      </defs>
      <rect width="1000" height="850" fill="#ebe8e0" />
      <rect x="330" y="280" width="250" height="160" fill="url(#park)" />
      <text x="455" y="425" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="14" fill="var(--color-ok)">Công viên Cầu Giấy</text>
      <path d="M660 520 C700 505 760 515 800 540 C780 570 700 580 665 560Z" fill="#cfdbe2" />
      {roads.map((r, i) => (
        <g key={i}>
          <path d={r.d} stroke="#c9c4b8" strokeWidth={r.w + 2} fill="none" />
          <path d={r.d} stroke="#faf9f6" strokeWidth={r.w} fill="none" />
        </g>
      ))}
      {roads.filter((r) => r.name).map((r) => (
        <text key={r.name} x={r.at![0]} y={r.at![1]} transform={`rotate(${r.at![2]} ${r.at![0]} ${r.at![1]})`} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="13" fill="var(--color-ink-2)">
          {r.name}
        </text>
      ))}
      {CAMERAS.map((c) => {
        const col = RISK_COLOR[c.risk];
        return (
          <g key={c.id} transform={`translate(${c.x} ${c.y})`}>
            {c.risk === 'HIGH' && (
              <>
                <circle r="34" fill={col} opacity="0.08" />
                <circle r="22" fill="none" stroke={col} strokeOpacity="0.5" />
              </>
            )}
            <rect x="-7" y="-7" width="14" height="14" fill={col} stroke="#faf9f6" strokeWidth="2" />
            <text x="12" y="-10" fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-ink)">{c.id}</text>
          </g>
        );
      })}
      {/* callout for C-01 */}
      <path d="M300 250 L300 160 L330 160" stroke="var(--color-ink)" fill="none" />
      <g transform="translate(330 130)">
        <rect width="220" height="56" fill="var(--color-ink)" />
        <text x="12" y="22" fontFamily="var(--font-mono)" fontSize="11" fill="#faf9f6">C‑01 · BLOCKED 0.91</text>
        <text x="12" y="42" fontFamily="var(--font-sans)" fontSize="12" fill="#c9c4b8">Mưa 55 mm/h · nước 39 cm</text>
      </g>
      {/* scale + north */}
      <g transform="translate(40 810)" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-ink-2)">
        <rect width="50" height="4" fill="var(--color-ink)" />
        <rect x="50" width="50" height="4" fill="none" stroke="var(--color-ink)" />
        <text y="18">0</text>
        <text x="100" y="18" textAnchor="middle">200 m</text>
      </g>
      <g transform="translate(950 50)" fontFamily="var(--font-serif)" fontSize="14" fill="var(--color-ink)">
        <path d="M0 -18 L7 6 L0 1 L-7 6Z" fill="var(--color-ink)" />
        <text y="24" textAnchor="middle">B</text>
      </g>
    </svg>
  );
}

export function Network() {
  return (
    <div className="pt-7">
      <div className="flex items-end justify-between">
        <div>
          <span className="label">Mạng lưới · Quận Cầu Giấy · 8 camera</span>
          <h2 className="font-serif text-[38px] leading-tight tracking-tight mt-1">Từ một miệng cống đến cả khu phố</h2>
        </div>
        <div className="flex gap-10 pb-1">
          {[
            ['2', 'nguy cơ cao', 'var(--color-signal)'],
            ['1', 'cảnh báo', 'var(--color-warn)'],
            ['3', 'theo dõi', 'var(--color-watch)'],
            ['1', 'đội đang xử lý', 'var(--color-ink)'],
          ].map(([n, l, c]) => (
            <div key={l} className="text-right">
              <div className="font-serif text-[34px] leading-none num" style={{ color: c }}>{n}</div>
              <div className="text-[12px] text-ink-2 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-10 mt-6">
        <div className="col-span-7 h-[660px] border border-rule">
          <DistrictMap />
        </div>
        <div className="col-span-5">
          <div className="flex items-baseline justify-between border-t border-ink pt-3 mb-1">
            <span className="label !text-ink">Thứ tự xử lý</span>
            <span className="label">theo mức nguy cơ, rồi mực nước</span>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="label text-left">
                <th className="py-2 font-normal">Camera</th>
                <th className="py-2 font-normal">Miệng cống</th>
                <th className="py-2 font-normal text-right">Mưa</th>
                <th className="py-2 font-normal text-right">Nước</th>
                <th className="py-2 font-normal pl-5">Mức</th>
              </tr>
            </thead>
            <tbody>
              {CAMERAS.map((c, i) => (
                <Fragment key={c.id}>
                  <tr className={`border-t border-rule ${i === 0 ? 'bg-sheet' : ''}`}>
                    <td className="py-2.5 pr-2">
                      <div className="font-mono text-[12px]">{c.id}</div>
                      <div className="text-[12px] text-ink-2 leading-tight">{c.place}</div>
                    </td>
                    <td className="py-2.5">
                      <div>{DRAIN_LABEL[c.state]}</div>
                      <div className="font-mono text-[11px] text-ink-3 num">{c.p.toFixed(2)}</div>
                    </td>
                    <td className="py-2.5 text-right font-mono text-[12px] num">{c.rain}</td>
                    <td className="py-2.5 text-right font-mono text-[12px] num">{c.water}</td>
                    <td className="py-2.5 pl-5 whitespace-nowrap"><RiskMark risk={c.risk} /></td>
                  </tr>
                  {i === 0 && (
                    <tr className="bg-sheet">
                      <td colSpan={5} className="pb-4">
                        <div className="grid grid-cols-[180px_1fr] gap-4 items-end">
                          <CctvFrame state="BLOCKED" water={0.5} rain={0.6} hud={false} className="w-full aspect-video block" />
                          <div>
                            <p className="text-[12.5px] text-ink-2 leading-snug">{c.note}. Đội gần nhất: Đội 2, cách 1,2 km.</p>
                            <div className="mt-3 flex gap-2">
                              <Button kind="signal">Điều Đội 2</Button>
                              <Button kind="ghost">Mở camera</Button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-mono text-[10.5px] text-ink-3">Bản đồ và số liệu minh họa cho phần trình bày.</p>
        </div>
      </div>
    </div>
  );
}
