/**
 * @license
 * SMART ANTI-FLOOD AI - Rain & Water Environmental Simulator
 * Real-time controls with rain particle physics and animated water level reservoir
 */

import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { WaterLevelCategory } from '../../types';
import { CloudRain, Droplets, Gauge, Info, Sparkles, Wind, Waves } from 'lucide-react';

export const RainSimulator: React.FC = () => {
  const {
    rainMmPerHour,
    setRainMmPerHour,
    waterPercentage,
    waterLevel,
    setWaterPercentage,
    setWaterLevel,
    settings,
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Raindrops Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    // Number of drops proportional to rain intensity
    const dropCount = Math.max(5, Math.floor((rainMmPerHour / 100) * 80));
    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 4 + Math.random() * 8 + (rainMmPerHour / 100) * 10,
      length: 10 + Math.random() * 15 + (rainMmPerHour / 100) * 15,
      opacity: 0.2 + (rainMmPerHour / 100) * 0.6,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw raindrops
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;

      for (const drop of drops) {
        ctx.beginPath();
        ctx.globalAlpha = drop.opacity;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 1, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rainMmPerHour]);

  // Rain classification per Section 10
  const getRainCategory = (val: number) => {
    if (val < settings.rainThresholdWatch) {
      return {
        label: '🟢 BÌNH THƯỜNG',
        desc: 'Lượng mưa dưới ngưỡng cảnh báo (0 - <20 mm/h). Khả năng tiêu thoát tự nhiên ổn định.',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
    if (val <= settings.rainThresholdHigh) {
      return {
        label: '🟡 SẴN SÀNG CẢNH BÁO',
        desc: 'Lượng mưa trung bình (20 - 50 mm/h). Cần theo dõi rác trôi dạt tại các miệng cống trũng.',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    }
    return {
      label: '🔴 MƯA LỚN – CẢNH BÁO CẤP 2',
      desc: 'Mưa lớn xối xả (> 50 mm/h). Nguy cơ ngập cục bộ rất cao nếu miệng cống bị che chắn!',
      badge: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
    };
  };

  const rainInfo = getRainCategory(rainMmPerHour);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            🌧 MÔ PHỎNG DỮ LIỆU MƯA & MỰC NƯỚC MÔI TRƯỜNG
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
            Environmental Simulator
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kéo thanh trượt để thử nghiệm các tình huống thời tiết cực đoan và phản ứng của hệ thống cảnh báo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Rain Slider & Live Rain Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    THANH TRƯỢT LƯỢNG MƯA
                  </h3>
                  <span className="text-xs text-slate-500">Đơn vị đo lường khí tượng tiêu chuẩn</span>
                </div>
              </div>

              {/* Rain Status Badge */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${rainInfo.badge}`}>
                {rainInfo.label}
              </div>
            </div>

            {/* Big Rain Display */}
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 text-white overflow-hidden shadow-inner">
              {/* Rain Animation Canvas Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
              />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
                    Cường Độ Đo Lường Realtime
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight tabular-nums">
                      {rainMmPerHour}
                    </span>
                    <span className="text-xl font-bold text-sky-300">mm/h</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-sky-200 font-medium">Tương đương:</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {rainMmPerHour < 20
                      ? 'Mưa nhỏ rải rác'
                      : rainMmPerHour <= 50
                      ? 'Mưa rào diện rộng'
                      : 'Mưa giông ngập úng cấp bách'}
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Control per Section 10 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>0 mm/h (Tạnh mưa)</span>
                <span className="text-indigo-600 font-bold">20 mm/h (Ngưỡng 1)</span>
                <span className="text-red-600 font-bold">50 mm/h (Ngưỡng 2)</span>
                <span>100 mm/h (Bão cực đoan)</span>
              </div>

              {/* Big Slider */}
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={rainMmPerHour}
                onChange={(e) => setRainMmPerHour(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
              />

              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                {rainInfo.desc}
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Thiết lập mẫu nhanh cho buổi thuyết trình:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setRainMmPerHour(10)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    rainMmPerHour === 10
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div>10 mm/h</div>
                  <div className="text-[10px] font-normal opacity-80">Mưa nhỏ</div>
                </button>

                <button
                  onClick={() => setRainMmPerHour(30)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    rainMmPerHour === 30
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div>30 mm/h</div>
                  <div className="text-[10px] font-normal opacity-80">Sẵn sàng</div>
                </button>

                <button
                  onClick={() => setRainMmPerHour(55)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    rainMmPerHour === 55
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div>55 mm/h ⭐</div>
                  <div className="text-[10px] font-normal opacity-80">Demo Mưa lớn</div>
                </button>

                <button
                  onClick={() => setRainMmPerHour(85)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    rainMmPerHour === 85
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div>85 mm/h</div>
                  <div className="text-[10px] font-normal opacity-80">Mưa bão lớn</div>
                </button>
              </div>
            </div>

            {/* Section 10 Mandatory Note */}
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-2.5 text-xs text-sky-900">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p>
                <strong>Ghi chú kỹ thuật:</strong> “Dữ liệu lượng mưa hiện tại đang được mô phỏng.
                Trong phiên bản thực tế có thể thay thế bằng dữ liệu trạm đo mưa / cảm biến IoT chuyên dụng.”
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Water Level Simulator (Section 11) (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    MÔ PHỎNG MỰC NƯỚC
                  </h3>
                  <span className="text-xs text-slate-500">Mực nước ứ đọng tại lòng đường / hố ga</span>
                </div>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  waterLevel === 'LOW'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : waterLevel === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-red-50 text-red-800 border-red-300 animate-pulse'
                }`}
              >
                {waterLevel} ({waterPercentage}%)
              </div>
            </div>

            {/* Animated Water Basin Tank */}
            <div className="relative h-64 rounded-2xl bg-slate-950 border-4 border-slate-800 overflow-hidden flex flex-col justify-end p-4">
              {/* Measurement Ticks on side */}
              <div className="absolute right-2 inset-y-4 flex flex-col justify-between text-[10px] font-mono text-slate-400 pointer-events-none select-none z-20">
                <span className="text-red-400 font-bold">100% - HIGH</span>
                <span className="text-amber-400 font-bold">70% - MED</span>
                <span className="text-emerald-400 font-bold">35% - LOW</span>
                <span>0% - KHÔ</span>
              </div>

              {/* Water Volume with dynamic height */}
              <div
                style={{ height: `${Math.max(5, waterPercentage)}%` }}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-700 via-sky-600 to-cyan-400 transition-all duration-500 ease-out z-10"
              >
                {/* Wave surface line */}
                <div className="absolute top-0 inset-x-0 h-2 bg-white/40 animate-pulse" />

                {/* Internal water bubbles */}
                <div className="absolute bottom-2 left-1/4 w-3 h-3 rounded-full bg-white/30 animate-bounce" />
                <div className="absolute bottom-6 right-1/3 w-2 h-2 rounded-full bg-white/40 animate-bounce" />
              </div>

              {/* Floating Status Text inside Basin */}
              <div className="relative z-20 text-white drop-shadow-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 block">
                  MỰC NƯỚC MÔ PHỎNG
                </span>
                <div className="text-3xl font-black font-mono">
                  {waterLevel} · {waterPercentage}%
                </div>
              </div>
            </div>

            {/* Slider to adjust water percentage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>0% (Khô ráo)</span>
                <span className="text-amber-600 font-bold">50% (Dâng vừa)</span>
                <span className="text-red-600 font-bold">100% (Ngập sâu)</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={waterPercentage}
                onChange={(e) => setWaterPercentage(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* 3 Level Preset Buttons per Section 11 */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setWaterLevel('LOW')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  waterLevel === 'LOW'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                🟢 LOW (20%)
              </button>

              <button
                onClick={() => setWaterLevel('MEDIUM')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  waterLevel === 'MEDIUM'
                    ? 'bg-amber-600 text-white border-amber-600 shadow'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                🟡 MEDIUM (55%)
              </button>

              <button
                onClick={() => setWaterLevel('HIGH')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  waterLevel === 'HIGH'
                    ? 'bg-red-600 text-white border-red-600 shadow'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                🔴 HIGH (85%)
              </button>
            </div>

            {/* Architectural readiness note */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
              <Waves className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p>
                <strong>Kiến trúc mở rộng:</strong> Sau này có thể thay thế nguồn dữ liệu mô phỏng này bằng cảm biến
                siêu âm đo mực nước hoặc phao nổi truyền tín hiệu qua vi điều khiển ESP32 / Arduino.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
