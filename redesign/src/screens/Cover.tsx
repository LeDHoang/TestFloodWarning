import { CctvFrame } from '../ui/CctvFrame';
import { Button, Figure, Stat } from '../ui/primitives';

const LOOP = [
  { t: 'Quan sát', d: 'Camera đường phố có sẵn hướng vào miệng cống.' },
  { t: 'Nhận diện', d: 'AI phân loại vùng miệng cống thành 4 trạng thái.' },
  { t: 'Quyết định', d: 'Kết hợp với lượng mưa và mực nước theo luật rõ ràng.' },
  { t: 'Điều phối', d: 'Tạo phiếu sự cố kèm ảnh cho đội thoát nước.' },
  { t: 'Nghiệm thu', d: 'Camera xác nhận cống đã sạch thì mới đóng phiếu.' },
];

export function Cover() {
  return (
    <div className="grid grid-cols-12 gap-x-12 pt-12">
      <div className="col-span-6 flex flex-col">
        <span className="label">Dự án Khoa học Kỹ thuật · Trường THCS &amp; THPT Newton · 2026</span>
        <h1 className="font-serif text-[88px] leading-[0.95] tracking-[-0.025em] mt-6">
          Cống tắc trước,
          <br />
          <span className="italic">đường ngập sau.</span>
        </h1>
        <p className="mt-7 text-[17px] leading-[1.6] text-ink-2 max-w-[540px]">
          Nhiều điểm ngập cục bộ ở Hà Nội bắt đầu từ một miệng cống bị rác che kín. Anti‑Flood dùng camera có sẵn để nhìn vào miệng cống,
          nhận ra rác bằng AI và báo cho đội thoát nước <em className="text-ink not-italic font-medium">trước</em> khi nước kịp dâng.
        </p>
        <div className="mt-8 flex gap-3">
          <Button>Xem trực tiếp camera C‑01 →</Button>
          <Button kind="ghost">Hệ thống hoạt động thế nào</Button>
        </div>

        <ol className="mt-auto grid grid-cols-5 gap-5 pt-12">
          {LOOP.map((s, i) => (
            <li key={s.t} className="border-t border-ink pt-3">
              <div className="font-serif text-[30px] leading-none num text-ink-3">{String(i + 1).padStart(2, '0')}</div>
              <div className="mt-3 text-[14px] font-medium">{s.t}</div>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-2">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="col-span-6">
        <Figure
          n="HÌNH 1"
          caption={
            <>
              Camera C‑01, ngã tư Cầu Giấy, 17:34. Khung góc là vùng quan sát (ROI): phần duy nhất của ảnh được đưa vào mô hình, để xe cộ và
              người đi đường không làm AI phân tâm.
            </>
          }
        >
          <CctvFrame state="BLOCKED" water={0.5} rain={0.7} confidence={0.91} className="w-full aspect-video block" />
        </Figure>
        <div className="grid grid-cols-3 gap-8 mt-10 border-t border-rule pt-6">
          <Stat value="4" label="trạng thái miệng cống mà AI phân biệt được" />
          <Stat value="224" unit="px" label="cạnh vùng ROI được cắt ra và đưa vào mô hình" />
          <Stat value="0" unit="máy chủ" label="mô hình chạy ngay trên trình duyệt của trạm" />
        </div>
      </div>
    </div>
  );
}
