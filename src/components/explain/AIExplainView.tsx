/**
 * @license
 * SMART ANTI-FLOOD AI - AI Explanation View (Section 21 & 22)
 * Designed for middle school students and judges to explain how Computer Vision AI & ROI work
 */

import React from 'react';
import {
  Brain,
  Camera,
  Tag,
  Cpu,
  FlaskConical,
  Globe,
  Maximize2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

export const AIExplainView: React.FC = () => {
  const steps = [
    {
      num: 'BƯỚC 1',
      title: '📷 THU THẬP ẢNH',
      desc: 'Chụp hàng trăm góc ảnh khác nhau của các miệng cống ngầm: lúc trời nắng, trời mưa, cống sạch, cống ngập lá, rác thải...',
      badge: 'Data Collection',
      icon: Camera,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      iconColor: 'bg-blue-600 text-white',
    },
    {
      num: 'BƯỚC 2',
      title: '🏷️ GẮN NHÃN (LABELING)',
      desc: 'Phân loại các ảnh thành 4 nhóm rõ ràng: CLEAR (Cống sạch), TRASH_NEARBY (Có rác gần), PARTIAL_BLOCKED (Bị che một phần), BLOCKED (Bị che nhiều).',
      badge: 'Supervised Learning',
      icon: Tag,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      iconColor: 'bg-amber-600 text-white',
    },
    {
      num: 'BƯỚC 3',
      title: '🧠 TRAIN TEACHABLE MACHINE',
      desc: 'Mạng nơ-ron tích chập (Convolutional Neural Network - MobileNet) học các đặc trưng như màu sắc, viền nan sắt cống, hình dáng túi nilon...',
      badge: 'Model Training',
      icon: Brain,
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      iconColor: 'bg-purple-600 text-white',
    },
    {
      num: 'BƯỚC 4',
      title: '🧪 KIỂM THỬ (TEST)',
      desc: 'Dùng camera hoặc hình ảnh mới tinh chưa từng học để kiểm tra độ tin cậy và tinh chỉnh lại các bức ảnh bị nhận diện sai.',
      badge: 'Validation',
      icon: FlaskConical,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      iconColor: 'bg-emerald-600 text-white',
    },
    {
      num: 'BƯỚC 5',
      title: '🌐 ĐƯA MODEL VÀO WEB APP',
      desc: 'Export model dạng TensorFlow.js, upload lên cloud hoặc Teachable Machine CDN để ứng dụng web tải về chạy trực tiếp trên máy client.',
      badge: 'Deployment',
      icon: Globe,
      color: 'bg-sky-50 border-sky-200 text-sky-900',
      iconColor: 'bg-sky-600 text-white',
    },
    {
      num: 'BƯỚC 6',
      title: '📷 CAMERA → ROI → AI',
      desc: 'Camera liên tục lấy khung hình, cắt đúng khu vực miệng cống (ROI) và nạp vào mô hình để dự đoán xác suất theo thời gian thực.',
      badge: 'Live Inference',
      icon: Cpu,
      color: 'bg-red-50 border-red-200 text-red-900',
      iconColor: 'bg-red-600 text-white',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            🧠 AI HOẠT ĐỘNG THẾ NÀO?
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
            Kiến Thức Khoa Học
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Học phần trực quan dành cho học sinh cấp 2 và Ban Giám Khảo để hiểu toàn bộ quy trình AI thị giác
        </p>
      </div>

      {/* 6 Step Pipeline Cards per Section 21 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.num}
              className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between space-y-3 ${st.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider opacity-75">
                  {st.num}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-xs">
                  {st.badge}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${st.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold tracking-tight">
                    {st.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {st.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 flex items-center gap-1.5 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hoàn tất trong dự án NEWTON AI</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* GIẢI THÍCH ROI (Section 22) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Kỹ thuật Xử Lý Ảnh Trọng Tâm</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            TẠI SAO CẦN VÙNG QUAN SÁT (ROI - REGION OF INTEREST)?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Nếu đưa toàn bộ bức ảnh camera đường phố vào mô hình, AI sẽ bị phân tâm bởi xe cộ, người đi bộ, bóng râm, cây cối...
          </p>
        </div>

        {/* Visual ROI Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
          {/* Node 1 */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="w-12 h-12 rounded-xl bg-white/10 mx-auto flex items-center justify-center text-slate-300">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold">1. CAMERA TOÀN CẢNH</div>
            <p className="text-[11px] text-slate-400">Hình ảnh góc rộng 1920x1080</p>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Node 2 */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-200/80 mx-auto flex items-center justify-center text-amber-800">
              <Maximize2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold">2. KHUNG ĐỎ BAO MIỆNG CỐNG</div>
            <p className="text-[11px] text-amber-800">Khoanh vùng hố ga 224x224</p>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Node 3 */}
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-300 text-sky-950 space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sky-200/80 mx-auto flex items-center justify-center text-sky-800">
              <Brain className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold">3. TEACHABLE MACHINE</div>
            <p className="text-[11px] text-sky-800">Dự đoán xác suất chính xác 91%</p>
          </div>
        </div>

        {/* Section 22 Callout Quote */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 text-slate-800">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm text-amber-950 block">
                Kết luận khoa học quan trọng:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-medium leading-relaxed">
                “<strong>ROI (Region of Interest)</strong> giúp AI tập trung 100% tài nguyên xử lý vào đúng
                khu vực miệng cống thu nước thay vì toàn bộ con đường, giúp giảm thiểu báo động giả do người hoặc xe cộ đi ngang qua.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 29 Terminology Matrix */}
      <section className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          BẢNG PHÂN BIỆT THUẬT NGỮ CHÍNH XÁC (SECTION 29)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-indigo-700 block">1. Teachable Machine</span>
            <p className="text-slate-600">Là <strong>AI phân loại hình ảnh</strong> (Computer Vision).</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-amber-700 block">2. ROI (Region of Interest)</span>
            <p className="text-slate-600">Là <strong>thuật toán xử lý ảnh</strong> (Image Processing).</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-blue-700 block">3. Lượng mưa & Mực nước</span>
            <p className="text-slate-600">Là <strong>dữ liệu đo lường môi trường</strong> từ cảm biến.</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-emerald-700 block">4. Rule Engine</span>
            <p className="text-slate-600">Là <strong>thuật toán ra quyết định</strong> (Deterministic Rules).</p>
          </div>
        </div>
      </section>
    </div>
  );
};
