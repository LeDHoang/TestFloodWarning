/**
 * @license
 * SMART ANTI-FLOOD AI - Settings View (Section 23 & 24)
 * Multi-tab configuration for Teachable Machine, Camera, Environmental thresholds, Location & Media
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { missingClasses } from '../../services/teachableMachine';
import {
  Settings,
  Brain,
  Camera,
  CloudRain,
  Droplets,
  MapPin,
  Film,
  RotateCcw,
  Check,
  AlertTriangle,
  ExternalLink,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const AISettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetAllData,
    isModelConnected,
    modelSession,
    modelLoading,
    modelError,
    connectModel,
    disconnectModel,
    resetROI,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ai' | 'camera' | 'rain' | 'water' | 'location' | 'media'>('ai');
  const [modelUrlInput, setModelUrlInput] = useState<string>(settings.teachableMachineUrl);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Form states for thresholds
  const [rainWatch, setRainWatch] = useState(settings.rainThresholdWatch);
  const [rainHigh, setRainHigh] = useState(settings.rainThresholdHigh);
  const [waterLow, setWaterLow] = useState(settings.waterThresholdLow);
  const [waterMed, setWaterMed] = useState(settings.waterThresholdMedium);
  const [locName, setLocName] = useState(settings.locationName);
  const [locCoord, setLocCoord] = useState(settings.locationCoordinates);
  const [videoUrl, setVideoUrl] = useState(settings.videoUrl);
  const [heroUrl, setHeroUrl] = useState(settings.heroImageUrl);

  const showSaveSuccess = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleConnectModel = async () => {
    setTestResult(null);
    await connectModel(modelUrlInput);
  };

  const handleTestModel = () => {
    if (!isModelConnected || !modelSession) {
      setTestResult('Vui lòng kết nối model trước khi kiểm tra.');
      return;
    }
    setTestResult(`Model kết nối thành công! Đã nhận diện ${modelSession.totalClasses} classes: [${modelSession.classNames.join(', ')}]`);
  };

  const handleSaveAll = () => {
    updateSettings({
      teachableMachineUrl: modelUrlInput,
      rainThresholdWatch: rainWatch,
      rainThresholdHigh: rainHigh,
      waterThresholdLow: waterLow,
      waterThresholdMedium: waterMed,
      locationName: locName,
      locationCoordinates: locCoord,
      videoUrl: videoUrl,
      heroImageUrl: heroUrl,
    });
    showSaveSuccess();
  };

  const handleResetData = () => {
    if (window.confirm('CẢNH BÁO: Bạn có chắc muốn khôi phục toàn bộ cấu hình và dữ liệu demo về mặc định?')) {
      resetAllData();
      setModelUrlInput('');
      setRainWatch(20);
      setRainHigh(50);
      setWaterLow(35);
      setWaterMed(70);
      setLocName('Ngã tư Cầu Giấy – Hà Nội');
      showSaveSuccess();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ⚙️ CẤU HÌNH HỆ THỐNG & AI MODEL
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              Settings Panel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Không hard-code model URL hay ngưỡng cảnh báo – Tùy chỉnh trực tiếp trên giao diện trình diễn
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              ✓ Đã lưu vào localStorage
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>LƯU CẤU HÌNH</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>AI MODEL</span>
        </button>

        <button
          onClick={() => setActiveTab('camera')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'camera' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>CAMERA & ROI</span>
        </button>

        <button
          onClick={() => setActiveTab('rain')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'rain' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CloudRain className="w-4 h-4" />
          <span>MƯA (RAIN)</span>
        </button>

        <button
          onClick={() => setActiveTab('water')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'water' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>MỰC NƯỚC (WATER)</span>
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'location' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>VỊ TRÍ (LOCATION)</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'media' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>MEDIA & VIDEO</span>
        </button>
      </div>

      {/* Tab Content Panes */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* Tab 1: AI Model Configuration per Section 6 & 9 */}
        {activeTab === 'ai' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                TEACHABLE MACHINE MODEL CONFIGURATION
              </h3>
              <p className="text-xs text-slate-500">
                Nhập đường link model đã export trên Google Teachable Machine. Hệ thống sẽ tự động tải model.json và metadata.json.
              </p>
            </div>

            {/* Model Connection Status Indicator */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    isModelConnected ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-red-500'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    AI MODEL STATUS
                  </span>
                  <span
                    className={`text-sm font-extrabold ${
                      isModelConnected ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {isModelConnected ? '🟢 CONNECTED' : '🔴 NOT CONNECTED (Đang dùng Mock AI)'}
                  </span>
                </div>
              </div>

              {modelSession && (
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    {modelSession.totalClasses} Classes được nạp
                  </span>
                </div>
              )}
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Teachable Machine Model URL:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://teachablemachine.withgoogle.com/models/xxxxx/"
                  value={modelUrlInput}
                  onChange={(e) => setModelUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConnectModel}
                    disabled={modelLoading}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all disabled:opacity-50 whitespace-nowrap shadow"
                  >
                    {modelLoading ? 'ĐANG KẾT NỐI...' : 'KẾT NỐI MODEL'}
                  </button>
                  <button
                    onClick={handleTestModel}
                    disabled={!isModelConnected}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all disabled:opacity-40 whitespace-nowrap"
                  >
                    KIỂM TRA MODEL
                  </button>
                  {isModelConnected && (
                    <button
                      onClick={disconnectModel}
                      className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-all whitespace-nowrap"
                    >
                      XÓA MODEL
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Ví dụ: <code>https://teachablemachine.withgoogle.com/models/bXyZ123/</code>
              </p>
            </div>

            {/* Error or Test message */}
            {modelError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                ⚠️ {modelError}
              </div>
            )}
            {testResult && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                ✓ {testResult}
              </div>
            )}

            {/* Classes inspection if connected */}
            {modelSession && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide block">
                  Tên Các Class Lấy Trực Tiếp Từ Model Metadata:
                </span>
                <div className="flex flex-wrap gap-2">
                  {modelSession.classNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs font-mono font-bold shadow-xs"
                    >
                      {name}
                    </span>
                  ))}
                </div>
                {missingClasses(modelSession.classNames).length > 0 && (
                  <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    ⚠️ Model thiếu class: {missingClasses(modelSession.classNames).join(', ')}. Rule Engine chỉ hiểu 4 nhãn
                    CLEAR, TRASH_NEARBY, PARTIAL_BLOCKED, BLOCKED – hãy đặt tên class trong Teachable Machine đúng như vậy,
                    nếu không cảnh báo sẽ không được kích hoạt.
                  </p>
                )}
              </div>
            )}

            {/* Section 9: Confidence Threshold Slider */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Ngưỡng AI Cảnh Báo (Confidence Threshold):
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Chỉ khi xác suất vượt qua ngưỡng này mới kích hoạt cảnh báo nguy cơ cống tắc
                  </p>
                </div>
                <span className="text-lg font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                  {settings.confidenceThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="100"
                value={settings.confidenceThreshold}
                onChange={(e) => updateSettings({ confidenceThreshold: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>50%</span>
                <span>Mặc định: 80%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Camera & ROI */}
        {activeTab === 'camera' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                CẤU HÌNH CAMERA & VÙNG MIỆNG CỐNG (ROI)
              </h3>
              <p className="text-xs text-slate-500">
                Tọa độ khung chữ nhật quan sát mặc định khi khởi động ứng dụng
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Tọa độ ROI hiện tại:</span>
                <span className="font-mono text-indigo-600 font-bold">
                  X: {settings.savedROI.x}%, Y: {settings.savedROI.y}%, W: {settings.savedROI.width}%, H: {settings.savedROI.height}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetROI}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300"
                >
                  Khôi Phục ROI Chuẩn (20, 25, 60, 50)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rain Thresholds */}
        {activeTab === 'rain' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                NGƯỠNG CẢNH BÁO LƯỢNG MƯA
              </h3>
              <p className="text-xs text-slate-500">
                Phân loại cấp độ mưa ảnh hưởng trực tiếp đến thuật toán Rule Engine
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <label className="text-xs font-bold text-amber-900 uppercase">
                  Ngưỡng Sẵn Sàng (Threshold 1):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={rainWatch}
                    onChange={(e) => setRainWatch(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-white border border-amber-300 text-sm font-mono font-bold"
                  />
                  <span className="text-xs font-bold text-amber-900">mm/h (Mặc định 20)</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Từ mức này hệ thống bắt đầu giám sát hiện tượng cuốn rác trôi dạt.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <label className="text-xs font-bold text-red-900 uppercase">
                  Ngưỡng Mưa Lớn (Threshold 2):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={rainHigh}
                    onChange={(e) => setRainHigh(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-white border border-red-300 text-sm font-mono font-bold"
                  />
                  <span className="text-xs font-bold text-red-900">mm/h (Mặc định 50)</span>
                </div>
                <p className="text-[11px] text-red-800">
                  Mưa vượt ngưỡng này kích hoạt cảnh báo nguy cơ ngập cấp 2.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Water Thresholds */}
        {activeTab === 'water' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                NGƯỠNG ĐÁNH GIÁ MỰC NƯỚC (WATER LEVEL)
              </h3>
              <p className="text-xs text-slate-500">
                Mức phần trăm dâng nước để phân chia thành LOW, MEDIUM, HIGH
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <label className="text-xs font-bold text-sky-900 uppercase">
                  Ngưỡng LOW (Dưới mức này):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={waterLow}
                    onChange={(e) => setWaterLow(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-white border border-sky-300 text-sm font-mono font-bold"
                  />
                  <span className="text-xs font-bold text-sky-900">% (Mặc định 35%)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <label className="text-xs font-bold text-indigo-900 uppercase">
                  Ngưỡng MEDIUM (Từ LOW đến mức này):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={waterMed}
                    onChange={(e) => setWaterMed(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-white border border-indigo-300 text-sm font-mono font-bold"
                  />
                  <span className="text-xs font-bold text-indigo-900">% (Mặc định 70%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Location Configuration */}
        {activeTab === 'location' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                ĐỊA ĐIỂM GIÁM SÁT THỰC ĐỊA
              </h3>
              <p className="text-xs text-slate-500">
                Tên điểm thoát nước mô phỏng gắn vào Header, Cảnh báo và Ticket
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tên điểm demo:
                </label>
                <input
                  type="text"
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tọa độ địa lý (Latitude / Longitude tùy chọn):
                </label>
                <input
                  type="text"
                  value={locCoord}
                  onChange={(e) => setLocCoord(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Media & Video */}
        {activeTab === 'media' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                CẤU HÌNH MEDIA & VIDEO HÀ NỘI MÙA MƯA
              </h3>
              <p className="text-xs text-slate-500">
                Tùy chỉnh link ảnh hero và luồng video mà không cần sửa mã nguồn
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hero Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={heroUrl}
                  onChange={(e) => setHeroUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Video URL / YouTube Embed URL:
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar: Reset Data per Section 24 */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>[RESET DEMO DATA] (Khôi phục dữ liệu ban đầu)</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20"
          >
            LƯU TẤT CẢ CẤU HÌNH
          </button>
        </div>
      </div>
    </div>
  );
};
