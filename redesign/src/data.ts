// Mock data for the design-only frontend. Illustrative values, not measurements.
import type { DrainState } from './ui/CctvFrame';

export type Risk = 'NORMAL' | 'WATCH' | 'WARNING' | 'HIGH';

export const RISK_LABEL: Record<Risk, string> = {
  NORMAL: 'Bình thường',
  WATCH: 'Theo dõi',
  WARNING: 'Cảnh báo',
  HIGH: 'Nguy cơ ngập cao',
};
export const RISK_COLOR: Record<Risk, string> = {
  NORMAL: 'var(--color-ok)',
  WATCH: 'var(--color-watch)',
  WARNING: 'var(--color-warn)',
  HIGH: 'var(--color-signal)',
};
export const DRAIN_LABEL: Record<DrainState, string> = {
  CLEAR: 'Thông thoáng',
  TRASH_NEARBY: 'Rác gần cống',
  PARTIAL_BLOCKED: 'Che một phần',
  BLOCKED: 'Bị che kín',
};

// 5-minute buckets from 17:00
export const RAIN = [6, 9, 14, 22, 31, 42, 55, 61, 58, 47, 33, 21];
export const WATER_CM = [1, 1, 2, 3, 6, 11, 19, 28, 39];
export const TIMES = ['17:00', '17:05', '17:10', '17:15', '17:20', '17:25', '17:30', '17:35', '17:40', '17:45', '17:50', '17:55'];

export const FRAMES: { t: string; state: DrainState; p: number }[] = [
  { t: '17:05', state: 'CLEAR', p: 0.96 },
  { t: '17:10', state: 'CLEAR', p: 0.93 },
  { t: '17:15', state: 'TRASH_NEARBY', p: 0.84 },
  { t: '17:20', state: 'TRASH_NEARBY', p: 0.81 },
  { t: '17:25', state: 'PARTIAL_BLOCKED', p: 0.78 },
  { t: '17:30', state: 'BLOCKED', p: 0.88 },
  { t: '17:34', state: 'BLOCKED', p: 0.91 },
];

export const CAMERAS: { id: string; place: string; state: DrainState; p: number; rain: number; water: number; risk: Risk; x: number; y: number; note: string }[] = [
  { id: 'C-01', place: 'Ngã tư Cầu Giấy – Xuân Thủy', state: 'BLOCKED', p: 0.91, rain: 55, water: 39, risk: 'HIGH', x: 300, y: 250, note: 'Chưa có đội nhận' },
  { id: 'C-04', place: 'Trần Thái Tông – Dịch Vọng Hậu', state: 'BLOCKED', p: 0.87, rain: 55, water: 31, risk: 'HIGH', x: 610, y: 470, note: 'Đội 3 · đến sau 6 phút' },
  { id: 'C-02', place: 'Xuân Thủy – Hồ Tùng Mậu', state: 'PARTIAL_BLOCKED', p: 0.82, rain: 52, water: 18, risk: 'WARNING', x: 140, y: 250, note: 'Đề xuất điều đội' },
  { id: 'C-03', place: 'Xuân Thủy – Nguyễn Phong Sắc', state: 'TRASH_NEARBY', p: 0.84, rain: 54, water: 9, risk: 'WATCH', x: 610, y: 250, note: 'Tiếp tục quan sát' },
  { id: 'C-08', place: 'Trần Thái Tông – Tôn Thất Thuyết', state: 'TRASH_NEARBY', p: 0.79, rain: 48, water: 7, risk: 'WATCH', x: 850, y: 470, note: 'Tiếp tục quan sát' },
  { id: 'C-05', place: 'Xuân Thủy – Phạm Hùng', state: 'CLEAR', p: 0.95, rain: 50, water: 4, risk: 'WATCH', x: 850, y: 250, note: '—' },
  { id: 'C-06', place: 'Cầu Giấy – Trần Quốc Hoàn', state: 'CLEAR', p: 0.97, rain: 18, water: 2, risk: 'NORMAL', x: 300, y: 470, note: '—' },
  { id: 'C-07', place: 'Hồ Tùng Mậu – Trần Quốc Hoàn', state: 'CLEAR', p: 0.94, rain: 16, water: 2, risk: 'NORMAL', x: 140, y: 470, note: '—' },
];

export const CLASSES = ['CLEAR', 'TRASH_NEARBY', 'PARTIAL_BLOCKED', 'BLOCKED'] as const;
export const TRAIN_COUNT = [150, 120, 110, 140];
// rows = truth, cols = predicted (sample numbers)
export const CONFUSION = [
  [28, 2, 0, 0],
  [3, 25, 2, 0],
  [0, 3, 24, 3],
  [0, 0, 1, 29],
];
