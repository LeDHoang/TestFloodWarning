/**
 * @license
 * SMART ANTI-FLOOD AI - Hanoi Monsoon Media & Storytelling View
 * Authentic Hanoi monsoon documentation, configurable media gallery, video player, and problem-solution pipeline
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import {
  Film,
  Image as ImageIcon,
  Plus,
  Play,
  ArrowDown,
  CloudRain,
  Trash2,
  AlertTriangle,
  Camera,
  Brain,
  Droplets,
  Ticket as TicketIcon,
  CheckCircle2,
  ExternalLink,
  X,
} from 'lucide-react';

export const HanoiFloodMedia: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);

  // New Image form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newSource, setNewSource] = useState('Đội thi NEWTON AI');

  const videoList = [
    {
      id: 'v1',
      title: 'Mưa lớn tại Hà Nội',
      desc: 'Cảnh quay mưa trắng trời trên các tuyến phố Cầu Giấy và Ba Đình',
      duration: '02:15',
    },
    {
      id: 'v2',
      title: 'Giao thông khi đường ngập',
      desc: 'Tình trạng phương tiện dắt bộ qua các điểm ngập cục bộ',
      duration: '01:45',
    },
    {
      id: 'v3',
      title: 'Hoạt động xử lý điểm ngập',
      desc: 'Công nhân thoát nước khơi thông rác bám trên miệng cống',
      duration: '03:10',
    },
  ];

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      title: newTitle,
      url: newUrl,
      caption: newCaption || 'Ghi nhận thực tế',
      source: newSource || 'Admin',
      category: 'flood',
    };

    updateSettings({
      galleryImages: [newItem, ...settings.galleryImages],
    });

    setNewTitle('');
    setNewUrl('');
    setNewCaption('');
    setShowAddImageModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section per Section 16 */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl min-h-[320px] flex items-end p-6 sm:p-10 border border-slate-800">
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />

        {/* Hero Background image with CSS fallback */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 select-none"
          style={{
            backgroundImage: `url('${settings.heroImageUrl || 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&auto=format&fit=crop&q=80'}')`,
          }}
        />

        <div className="relative z-20 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-sky-300 border border-white/20">
            <Film className="w-3.5 h-3.5" />
            <span>Phóng Sự Thực Tế Đô Thị</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            🎬 HÀ NỘI MÙA MƯA
          </h2>

          <p className="text-base sm:text-xl font-medium text-sky-100">
            “Tại sao SMART ANTI-FLOOD AI được tạo ra?”
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Mỗi mùa mưa bão, hàng triệu người dân Hà Nội đối mặt với cảnh tắc đường, ngập sâu.
            Nhưng nguyên nhân hàng đầu không chỉ là hệ thống thoát nước thiếu hụt, mà chính là
            rác thải sinh hoạt và cành lá bít kín các miệng hố ga thu nước.
          </p>
        </div>
      </section>

      {/* Gallery: HÌNH ẢNH THỰC TẾ per Section 16 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-sky-600" />
              <span>HÌNH ẢNH THỰC TẾ</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ảnh minh họa tình trạng mưa ngập và thoát nước đô thị
            </p>
          </div>

          <button
            onClick={() => setShowAddImageModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>THÊM HÌNH ẢNH</span>
          </button>
        </div>

        {/* Gallery Grid with Fallback Containers (Zero-Broken-Image Policy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {settings.galleryImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Image Frame with graceful CSS/SVG fallback */}
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                {/* Offline placeholder sitting behind the photo (shown if it fails to load) */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br ${
                    {
                      rain: 'from-slate-800 to-sky-900',
                      flood: 'from-sky-900 to-blue-950',
                      traffic: 'from-slate-800 to-amber-900',
                      drain: 'from-slate-800 to-slate-950',
                      trash: 'from-lime-950 to-amber-950',
                    }[img.category]
                  }`}
                  aria-hidden="true"
                >
                  <span className="text-4xl mb-2">
                    {{ rain: '🌧️', flood: '🌊', traffic: '🛵', drain: '🕳️', trash: '🗑️' }[img.category]}
                  </span>
                  <span className="text-sm font-bold text-white/90">{img.title}</span>
                  <span className="text-[10px] text-white/50 mt-1">Ảnh chưa tải được (ngoại tuyến)</span>
                </div>
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="relative w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Reveal the placeholder behind
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                  {img.category}
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {img.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {img.caption}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">Nguồn: {img.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Player: # VIDEO THỰC TẾ per Section 17 */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-600" />
            <span>VIDEO THỰC TẾ</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Không tự động phát – Nhấn nút Play để xem phóng sự điều tra của nhóm
          </p>
        </div>

        {/* Large Video Screen */}
        <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
          {!isPlaying ? (
            /* Poster & Play Button */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950 text-white">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all mb-4 group"
              >
                <Play className="w-8 h-8 ml-1 fill-current" />
              </button>
              <h4 className="text-lg font-bold text-white mb-1">
                {videoList[activeVideoIndex].title}
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                {videoList[activeVideoIndex].desc}
              </p>
            </div>
          ) : (
            /* Simulated Video Player */
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-sky-400 border-t-transparent animate-spin mb-4" />
              <p className="text-sm font-semibold">
                Đang phát luồng video mô phỏng phóng sự: “{videoList[activeVideoIndex].title}”
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                (Âm thanh tắt mặc định theo quy chuẩn thuyết trình Section 17)
              </p>
              <button
                onClick={() => setIsPlaying(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Dừng video
              </button>
            </div>
          )}
        </div>

        {/* Video Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {videoList.map((vid, idx) => (
            <div
              key={vid.id}
              onClick={() => {
                setActiveVideoIndex(idx);
                setIsPlaying(false);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeVideoIndex === idx
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className={activeVideoIndex === idx ? 'text-indigo-900' : 'text-slate-700'}>
                  {vid.title}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{vid.duration}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{vid.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Storytelling Section per Section 18 */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-10">
        {/* Part 1: VẤN ĐỀ CHÚNG EM NHÌN THẤY */}
        <div className="space-y-4">
          <div className="border-b border-white/15 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
              Phần 1: Thực Trạng
            </span>
            <h3 className="text-2xl font-black text-white">
              VẤN ĐỀ CHÚNG EM NHÌN THẤY
            </h3>
          </div>

          {/* 6 Step Problem Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <CloudRain className="w-6 h-6 text-blue-400 mx-auto" />
              <div className="text-xs font-bold text-white">MƯA LỚN</div>
              <span className="text-[10px] text-slate-300 block">Lượng mưa &gt; 50mm/h</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <Droplets className="w-6 h-6 text-sky-400 mx-auto" />
              <div className="text-xs font-bold text-white">NƯỚC CUỐN RÁC</div>
              <span className="text-[10px] text-slate-300 block">Dòng chảy bề mặt</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <Trash2 className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-xs font-bold text-white">RÁC BÁM MIỆNG CỐNG</div>
              <span className="text-[10px] text-slate-300 block">Túi nilon, cành lá</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <AlertTriangle className="w-6 h-6 text-orange-400 mx-auto" />
              <div className="text-xs font-bold text-white">THOÁT NƯỚC GIẢM</div>
              <span className="text-[10px] text-slate-300 block">Diện tích thu giảm 90%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <Droplets className="w-6 h-6 text-cyan-400 mx-auto" />
              <div className="text-xs font-bold text-white">NƯỚC CÓ THỂ DÂNG</div>
              <span className="text-[10px] text-slate-300 block">Mực nước đạt HIGH</span>
            </div>

            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 space-y-2">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
              <div className="text-xs font-bold text-red-300">NGUY CƠ NGẬP</div>
              <span className="text-[10px] text-red-200 block">Giao thông tê liệt</span>
            </div>
          </div>
        </div>

        {/* Part 2: GIẢI PHÁP CỦA NEWTON AI */}
        <div className="space-y-4">
          <div className="border-b border-white/15 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Phần 2: Ứng Dụng Công Nghệ
            </span>
            <h3 className="text-2xl font-black text-white">
              GIẢI PHÁP CỦA NEWTON AI
            </h3>
          </div>

          {/* 7 Step Solution Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Camera className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">CAMERA</div>
              <span className="text-[10px] text-emerald-300">Thu hình ảnh</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs font-mono font-bold text-amber-300 block mb-1">ROI</span>
              <div className="text-xs font-bold text-white">CẮT ROI</div>
              <span className="text-[10px] text-emerald-300">Tập trung miệng cống</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Brain className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">TEACHABLE MACHINE</div>
              <span className="text-[10px] text-emerald-300">Nhận diện mẫu rác</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">PHÁT HIỆN TÌNH TRẠNG</div>
              <span className="text-[10px] text-emerald-300">CLEAR / BLOCKED</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <CloudRain className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">LƯỢNG MƯA + NƯỚC</div>
              <span className="text-[10px] text-emerald-300">Dữ liệu môi trường</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">CẢNH BÁO</div>
              <span className="text-[10px] text-emerald-300">Rule Engine đánh giá</span>
            </div>

            <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-400/40">
              <TicketIcon className="w-5 h-5 text-sky-300 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">TICKET XỬ LÝ</div>
              <span className="text-[10px] text-sky-200">Điều phối thực tế</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal: Thêm Hình Ảnh */}
      {showAddImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddImage}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                THÊM HÌNH ẢNH MỚI VÀO GALLERY
              </h3>
              <button
                type="button"
                onClick={() => setShowAddImageModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tiêu đề ảnh:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Điểm ngập ngã tư Cầu Giấy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  URL Hình ảnh (Image URL):
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Chú thích (Caption):
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả hoàn cảnh và vị trí cống..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nguồn ảnh (Source):
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
              >
                LƯU ẢNH VÀO GALLERY
              </button>
              <button
                type="button"
                onClick={() => setShowAddImageModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                HỦY
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
