import { Fragment } from 'react';
import { CctvFrame, type DrainState } from '../ui/CctvFrame';
import { CLASSES, CONFUSION, TRAIN_COUNT } from '../data';

const SHORT = ['CLEAR', 'TRASH', 'PARTIAL', 'BLOCKED'];

const EXAMPLES: { truth: DrainState; pred: DrainState; p: number }[] = [
  { truth: 'CLEAR', pred: 'CLEAR', p: 0.96 },
  { truth: 'TRASH_NEARBY', pred: 'TRASH_NEARBY', p: 0.84 },
  { truth: 'BLOCKED', pred: 'BLOCKED', p: 0.93 },
  { truth: 'PARTIAL_BLOCKED', pred: 'PARTIAL_BLOCKED', p: 0.81 },
  { truth: 'PARTIAL_BLOCKED', pred: 'BLOCKED', p: 0.62 },
  { truth: 'CLEAR', pred: 'TRASH_NEARBY', p: 0.58 },
];

export function Model() {
  const total = CONFUSION.flat().reduce((a, b) => a + b, 0);
  const correct = CONFUSION.reduce((a, r, i) => a + r[i], 0);
  const metrics = CLASSES.map((_, i) => {
    const tp = CONFUSION[i][i];
    const rowSum = CONFUSION[i].reduce((a, b) => a + b, 0);
    const colSum = CONFUSION.reduce((a, r) => a + r[i], 0);
    const p = tp / colSum, r = tp / rowSum;
    return { p, r, f: (2 * p * r) / (p + r) };
  });

  return (
    <div className="pt-7">
      <div className="flex items-end justify-between">
        <div>
          <span className="label">Mô hình · Teachable Machine · MobileNet · phiên bản 3</span>
          <h2 className="font-serif text-[38px] leading-tight tracking-tight mt-1">Mô hình nhìn thấy gì, và sai ở đâu</h2>
        </div>
        <span className="font-mono text-[11px] text-ink-3 border border-dashed border-ink-3 px-3 py-1.5 mb-1">
          SỐ LIỆU MẪU — THAY BẰNG KẾT QUẢ KIỂM THỬ CỦA ĐỘI
        </span>
      </div>

      <div className="grid grid-cols-12 gap-x-10 mt-7">
        <div className="col-span-3">
          <div className="border-t border-ink pt-3">
            <span className="label !text-ink">Độ chính xác</span>
            <div className="font-serif text-[104px] leading-[0.9] tracking-tight num mt-3">
              {Math.round((correct / total) * 100)}
              <span className="text-[40px]">%</span>
            </div>
            <p className="text-[13px] text-ink-2 mt-3 leading-snug">
              {correct} / {total} ảnh kiểm thử đúng. Các ảnh này <em>không</em> được dùng khi huấn luyện.
            </p>
          </div>

          <div className="border-t border-ink pt-3 mt-8">
            <span className="label !text-ink">Dữ liệu huấn luyện · {TRAIN_COUNT.reduce((a, b) => a + b, 0)} ảnh</span>
            <div className="mt-3 space-y-2.5">
              {CLASSES.map((c, i) => (
                <div key={c} className="grid grid-cols-[1fr_40px] gap-3 items-center">
                  <div>
                    <div className="font-mono text-[11px]">{c}</div>
                    <div className="h-[4px] bg-rule-2 mt-1">
                      <div className="h-full bg-ink" style={{ width: `${(TRAIN_COUNT[i] / 150) * 100}%` }} />
                    </div>
                  </div>
                  <span className="font-mono text-[12px] text-right num">{TRAIN_COUNT[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-ink pt-3 mt-8">
            <span className="label !text-ink">Cắt ROI so với cả khung hình</span>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <div className="font-serif text-[34px] leading-none num text-ink-3">71%</div>
                <div className="text-[12px] text-ink-2 mt-1">cả khung hình</div>
              </div>
              <div>
                <div className="font-serif text-[34px] leading-none num">88%</div>
                <div className="text-[12px] text-ink-2 mt-1">chỉ vùng ROI</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5">
          <div className="border-t border-ink pt-3">
            <div className="flex justify-between">
              <span className="label !text-ink">Ma trận nhầm lẫn</span>
              <span className="label">hàng: thực tế · cột: dự đoán</span>
            </div>
            <div className="grid grid-cols-[76px_repeat(4,1fr)] gap-[3px] mt-4">
              <span />
              {SHORT.map((s) => (
                <span key={s} className="font-mono text-[10.5px] text-ink-3 text-center pb-1">{s}</span>
              ))}
              {CONFUSION.map((row, i) => (
                <Fragment key={i}>
                  <span className="font-mono text-[10.5px] text-ink-3 self-center">{SHORT[i]}</span>
                  {row.map((v, j) => {
                    const diag = i === j;
                    const a = v / 30;
                    return (
                      <span
                        key={`${i}${j}`}
                        className="aspect-[1.5] grid place-items-center font-mono text-[18px] num"
                        style={{
                          background: diag ? `rgba(20,20,19,${0.12 + a * 0.85})` : v ? `rgba(200,55,29,${0.1 + a * 2.2})` : 'var(--color-sheet)',
                          color: diag && a > 0.5 ? 'var(--color-sheet)' : 'var(--color-ink)',
                        }}
                      >
                        {v}
                      </span>
                    );
                  })}
                </Fragment>
              ))}
            </div>
            <table className="w-full mt-6 text-[13px]">
              <thead>
                <tr className="label text-left">
                  <th className="font-normal py-2">Lớp</th>
                  <th className="font-normal py-2 text-right">Precision</th>
                  <th className="font-normal py-2 text-right">Recall</th>
                  <th className="font-normal py-2 text-right">F1</th>
                </tr>
              </thead>
              <tbody>
                {CLASSES.map((c, i) => (
                  <tr key={c} className="border-t border-rule">
                    <td className="py-2 font-mono text-[11.5px]">{c}</td>
                    {[metrics[i].p, metrics[i].r, metrics[i].f].map((v, k) => (
                      <td key={k} className="py-2 text-right font-mono text-[12px] num">{v.toFixed(2)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[13px] text-ink-2 leading-snug mt-4">
              Lỗi thường gặp nhất là nhầm giữa <span className="font-mono text-[12px]">PARTIAL</span> và{' '}
              <span className="font-mono text-[12px]">BLOCKED</span>, hai trạng thái liền kề. Hướng cải thiện: thêm ảnh lúc mưa to và ban đêm.
            </p>
          </div>
        </div>

        <div className="col-span-4">
          <div className="border-t border-ink pt-3">
            <div className="flex justify-between">
              <span className="label !text-ink">Ví dụ từ tập kiểm thử</span>
              <span className="label">gồm cả ca sai</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 mt-4">
              {EXAMPLES.map((e, i) => {
                const ok = e.truth === e.pred;
                return (
                  <div key={i}>
                    <div className={ok ? '' : 'outline-2 outline-signal outline-offset-2'}>
                      <CctvFrame state={e.truth} roiOnly seed={i + 11} className="w-full aspect-[4/3] block" />
                    </div>
                    <div className="flex justify-between mt-2 font-mono text-[11px]">
                      <span>{e.pred}</span>
                      <span className="num">{e.p.toFixed(2)}</span>
                    </div>
                    <div className={`text-[12px] ${ok ? 'text-ink-3' : 'text-signal'}`}>{ok ? 'Đúng' : `Sai · thực tế ${e.truth}`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
