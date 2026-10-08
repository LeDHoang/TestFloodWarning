/**
 * @license
 * SMART ANTI-FLOOD AI - Storage Service
 * LocalStorage state persistence with robust defaults
 */

import { AppSettings, Ticket, HistoryRecord, MediaItem } from '../types';

export const DEFAULT_GALLERY: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Mưa lớn tại Hà Nội',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    caption: 'Đợt mưa rào xối xả giờ tan tầm khiến nhiều tuyến đường Hà Nội quá tải thoát nước',
    source: 'Ảnh minh họa – Unsplash',
    category: 'rain',
  },
  {
    id: 'media-2',
    title: 'Đường ngập cục bộ',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    caption: 'Nước dâng nhanh trên mặt đường nhựa do các cửa xả cống bị bồi lắng rác thải',
    source: 'Ảnh minh họa – Unsplash',
    category: 'flood',
  },
  {
    id: 'media-3',
    title: 'Giao thông khó khăn',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=800&auto=format&fit=crop&q=80',
    caption: 'Xe máy và ô tô di chuyển chậm qua các đoạn trũng thấp trong giờ cao điểm',
    source: 'Ảnh minh họa – Unsplash',
    category: 'traffic',
  },
  {
    id: 'media-4',
    title: 'Hệ thống thoát nước đô thị',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&auto=format&fit=crop&q=80',
    caption: 'Miệng cống ga thu nước đóng vai trò then chốt trong việc tiêu thoát nhanh',
    source: 'Ảnh minh họa – Unsplash',
    category: 'drain',
  },
  {
    id: 'media-5',
    title: 'Rác tại khu vực thoát nước',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
    caption: 'Túi nilon, cành lá mục và vỏ chai che chắn các nan sắt ngăn dòng chảy vào cống',
    source: 'Ảnh minh họa – Unsplash',
    category: 'trash',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  teachableMachineUrl: '', // Allow user to connect real model
  confidenceThreshold: 80, // Default 80% per Section 9
  useMockWhenDisconnected: true,
  rainThresholdWatch: 20,
  rainThresholdHigh: 50,
  waterThresholdLow: 35,
  waterThresholdMedium: 70,
  locationName: 'Ngã tư Cầu Giấy – Hà Nội',
  locationCoordinates: '21.0333° N, 105.7994° E',
  videoUrl: '',
  youtubeId: '', // set to the team's own report video ID
  heroImageUrl: '',
  galleryImages: DEFAULT_GALLERY,
  savedROI: {
    x: 20,
    y: 25,
    width: 60,
    height: 50,
  },
};

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'ticket-0001',
    ticketNumber: '#0001',
    createdAt: '17:05 Hôm nay',
    status: 'NEW',
    priority: 'HIGH',
    location: 'Ngã tư Cầu Giấy – Hà Nội',
    rainMmPerHour: 55,
    waterLevel: 'HIGH',
    waterPercentage: 85,
    aiClass: 'BLOCKED',
    aiConfidence: 0.91,
    notes: 'Phát hiện tự động bởi Rule Engine: Mưa lớn 55mm/h kết hợp cống bị rác che 91%',
  },
];

export const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'hist-1',
    timestamp: '17:05:12',
    location: 'Ngã tư Cầu Giấy – Hà Nội',
    rainMmPerHour: 55,
    waterLevel: 'HIGH',
    waterPercentage: 85,
    aiClass: 'BLOCKED',
    aiConfidence: 0.91,
    riskLevel: 'HIGH',
    ticketId: '#0001',
  },
  {
    id: 'hist-2',
    timestamp: '16:45:30',
    location: 'Ngã tư Cầu Giấy – Hà Nội',
    rainMmPerHour: 38,
    waterLevel: 'MEDIUM',
    waterPercentage: 55,
    aiClass: 'PARTIAL_BLOCKED',
    aiConfidence: 0.78,
    riskLevel: 'WARNING',
  },
  {
    id: 'hist-3',
    timestamp: '16:20:10',
    location: 'Ngã tư Cầu Giấy – Hà Nội',
    rainMmPerHour: 22,
    waterLevel: 'LOW',
    waterPercentage: 25,
    aiClass: 'TRASH_NEARBY',
    aiConfidence: 0.84,
    riskLevel: 'WATCH',
  },
  {
    id: 'hist-4',
    timestamp: '15:50:00',
    location: 'Ngã tư Cầu Giấy – Hà Nội',
    rainMmPerHour: 10,
    waterLevel: 'LOW',
    waterPercentage: 15,
    aiClass: 'CLEAR',
    aiConfidence: 0.95,
    riskLevel: 'NORMAL',
  },
];

const STORAGE_KEYS = {
  SETTINGS: 'smart_anti_flood_settings_v1',
  TICKETS: 'smart_anti_flood_tickets_v1',
  HISTORY: 'smart_anti_flood_history_v1',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading settings from localStorage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

export function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!raw) return INITIAL_TICKETS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading tickets', e);
    return INITIAL_TICKETS;
  }
}

export function saveTickets(tickets: Ticket[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving tickets', e);
  }
}

export function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return INITIAL_HISTORY;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading history', e);
    return INITIAL_HISTORY;
  }
}

export function saveHistory(history: HistoryRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history', e);
  }
}

export function resetAllStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Error resetting storage', e);
  }
}
