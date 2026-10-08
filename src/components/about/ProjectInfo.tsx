/**
 * @license
 * SMART ANTI-FLOOD AI - Project & Team Information (Section 1 & 31)
 * Introduces team NEWTON AI, school, mission and development journey
 */

import React from 'react';
import { Award, Users, Target, ShieldCheck, Heart, Sparkles, GraduationCap } from 'lucide-react';

export const ProjectInfo: React.FC = () => {
  const members = [
    {
      name: 'Cao Nam Khánh',
      role: 'Đội trưởng / Kiến trúc sư Dự án',
      task: 'Thiết kế thuật toán Rule Engine, tích hợp Teachable Machine và quy trình xử lý ROI',
      avatarBg: 'bg-blue-600',
    },
    {
      name: 'Vũ Nguyễn Minh Nhật',
      role: 'Thành viên / Xử lý Thị giác Máy tính',
      task: 'Thu thập tập dữ liệu ảnh cống ngầm, huấn luyện 4 phân lớp trên Teachable Machine',
      avatarBg: 'bg-indigo-600',
    },
    {
      name: 'Đặng Việt Anh',
      role: 'Thành viên / Mô phỏng & Truyền thông',
      task: 'Xây dựng mô hình mô phỏng môi trường mưa - nước, kịch bản thuyết trình và phóng sự',
      avatarBg: 'bg-sky-600',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
            <GraduationCap className="w-4 h-4" />
            <span>Sản phẩm Tham dự Cuộc thi Sáng Tạo Khoa Học Kỹ Thuật</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            NEWTON AI
          </h2>

          <h3 className="text-xl sm:text-2xl font-extrabold text-sky-300">
            SMART ANTI-FLOOD AI
          </h3>

          <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed">
            “Hệ thống AI hỗ trợ phát hiện cống bị tắc và cảnh báo sớm nguy cơ ngập.”
          </p>

          {/* Slogan Banner */}
          <div className="pt-4">
            <div className="inline-block p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300 block mb-1">
                KHẨU HIỆU DỰ ÁN
              </span>
              <div className="text-lg sm:text-2xl font-black text-amber-300 tracking-wide">
                “PHÁT HIỆN SỚM – CẢNH BÁO SỚM – HÀNH ĐỘNG SỚM”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section per Section 31 */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Users className="w-4 h-4 text-sky-600" />
            <span>THÀNH VIÊN ĐỘI THI</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            NHÓM HỌC SINH THỰC HIỆN DỰ ÁN
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {members.map((m, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl ${m.avatarBg} text-white flex items-center justify-center font-black text-xl shadow-md mb-4`}>
                  {m.name.charAt(0)}
                </div>

                <h4 className="text-lg font-bold text-slate-900">
                  {m.name}
                </h4>

                <div className="text-xs font-bold text-sky-700 bg-sky-50 inline-block px-2.5 py-1 rounded-lg mt-1 mb-3">
                  {m.role}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {m.task}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Trường THCS & THPT Newton</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <span>MỤC TIÊU & Ý NGHĨA XÃ HỘI</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">1. Chủ Động Thay Vì Ứng Phó Thụ Động</span>
            <p>
              Thông thường, đội thoát nước chỉ biết đường ngập khi người dân gọi điện phản ánh hoặc nước đã ngập sâu 30-50cm.
              Hệ thống của chúng em giúp phát hiện cống bị rác nghẽn <strong>trước khi nước kịp dâng</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">2. Chi Phí Thấp – Dễ Triển Khai</span>
            <p>
              Tận dụng camera an ninh sẵn có trên đường phố kết hợp mô hình AI thị giác máy tính chạy trực tiếp tại biên
              (Edge AI / Client Web), không tốn chi phí máy chủ đắt đỏ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
