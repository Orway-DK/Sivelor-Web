// app\color\_components\Sidebar.tsx
import React from "react";
import { Channel, CMYK, VariationMode } from "@/lib/constants";

interface SidebarProps {
  baseCmyk: CMYK;
  setBaseCmyk: React.Dispatch<React.SetStateAction<CMYK>>;
  settings: any;
  setSettings: any;
  variationMode: VariationMode;
}

const Sidebar: React.FC<SidebarProps> = ({
  baseCmyk,
  setBaseCmyk,
  settings,
  setSettings,
  variationMode,
}) => {
  // Input değişikliklerini güvenli bir şekilde işleyen yardımcı fonksiyon
  const handleInputChange = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <aside className="w-full md:w-[360px] flex flex-col admin-sidebar border-r border-admin-border-primary shadow-xl z-20 shrink-0 h-full admin-text-primary">
      {/* Header */}
      <div className="px-5 pt-[19px] pb-4 border-b border-admin-border-primary admin-bg-primary">
        <h1 className="text-lg font-bold admin-text-primary">
          Renk & Grid Ayarları
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 md:space-y-8">
        {/* 1. ANA RENK (Merkez) */}
        <section>
          <h3 className="text-xs font-bold admin-text-primary border-b border-admin-border-primary pb-2 mb-3 uppercase tracking-wider">
            Merkez Renk (Ana)
          </h3>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {(["c", "m", "y", "k"] as Channel[]).map((key) => (
              <div
                key={key}
                className="admin-bg-secondary p-2 rounded border border-admin-border-primary"
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold admin-text-tertiary uppercase">
                    {key.toUpperCase()}
                  </label>
                  <span className="text-[10px] font-mono font-bold admin-text-primary">
                    {baseCmyk[key].toFixed(2)}
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.01"
                  value={baseCmyk[key]}
                  onChange={(e) =>
                    setBaseCmyk((s) => ({
                      ...s,
                      [key]: parseFloat(e.target.value),
                    }))
                  }
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer mb-2
                    ${
                      key === "c"
                        ? "bg-cyan-200 accent-cyan-600"
                        : key === "m"
                        ? "bg-pink-200 accent-pink-600"
                        : key === "y"
                        ? "bg-yellow-200 accent-yellow-500"
                        : "bg-gray-300 accent-gray-800"
                    }`}
                />

                {/* Number Input */}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={baseCmyk[key]}
                  onChange={(e) =>
                    setBaseCmyk((s) => ({
                      ...s,
                      [key]: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full text-xs admin-input rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 2. VARYASYON YÖNLERİ */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-admin-border-primary pb-2 mb-3 gap-2">
            <h3 className="text-xs font-bold admin-text-primary uppercase tracking-wider">
              Yön & İşlem
            </h3>

            {/* Ekle / Çıkar Butonları */}
            <div className="flex admin-bg-tertiary rounded p-0.5 self-start">
              <button
                onClick={() => handleInputChange("operation", "add")}
                className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded transition-colors
                      ${
                        settings.operation === "add"
                          ? "bg-green-600 admin-text-primary shadow-sm"
                          : "admin-text-tertiary hover:admin-bg-secondary"
                      }`}
              >
                EKLE (+)
              </button>
              <button
                onClick={() => handleInputChange("operation", "subtract")}
                className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded transition-colors
                      ${
                        settings.operation === "subtract"
                          ? "bg-red-600 admin-text-primary shadow-sm"
                          : "admin-text-tertiary hover:admin-bg-secondary"
                      }`}
              >
                ÇIKAR (-)
              </button>
            </div>
          </div>

          {/* Mod Kontrolü */}
          {variationMode === "4-way" ? (
            <div className="space-y-3 admin-bg-secondary p-3 rounded border border-admin-border-primary">
              {/* YUKARI */}
              <div className="flex justify-center">
                <div className="text-center w-20 md:w-28">
                  <label className="text-[9px] font-bold admin-text-tertiary block mb-1">
                    YUKARI (Artar)
                  </label>
                  <select
                    value={settings.topChannel}
                    onChange={(e) =>
                      handleInputChange("topChannel", e.target.value)
                    }
                    className="w-full admin-input rounded px-2 py-1.5 text-xs text-center focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="c">Cyan (Mavi)</option>
                    <option value="m">Magenta (Kırmızı)</option>
                    <option value="y">Yellow (Sarı)</option>
                    <option value="k">Black (Siyah)</option>
                  </select>
                </div>
              </div>

              {/* SOL - ORTA - SAĞ */}
              <div className="flex justify-between items-center px-1 gap-2">
                <div className="w-20 md:w-28">
                  <label className="text-[9px] font-bold admin-text-tertiary block mb-1">
                    SOL (Artar)
                  </label>
                  <select
                    value={settings.leftChannel}
                    onChange={(e) =>
                      handleInputChange("leftChannel", e.target.value)
                    }
                    className="w-full admin-input rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="c">Cyan</option>
                    <option value="m">Magenta</option>
                    <option value="y">Yellow</option>
                    <option value="k">Black</option>
                  </select>
                </div>

                {/* Görsel İkon */}
                <div className="text-2xl font-bold admin-text-tertiary select-none">
                  +
                </div>

                <div className="w-20 md:w-28 text-right">
                  <label className="text-[9px] font-bold admin-text-tertiary block mb-1">
                    SAĞ (Artar)
                  </label>
                  <select
                    value={settings.rightChannel}
                    onChange={(e) =>
                      handleInputChange("rightChannel", e.target.value)
                    }
                    className="w-full admin-input rounded px-2 py-1.5 text-xs text-right focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="c">Cyan</option>
                    <option value="m">Magenta</option>
                    <option value="y">Yellow</option>
                    <option value="k">Black</option>
                  </select>
                </div>
              </div>

              {/* AŞAĞI */}
              <div className="flex justify-center">
                <div className="text-center w-20 md:w-28">
                  <label className="text-[9px] font-bold admin-text-tertiary block mb-1">
                    AŞAĞI (Artar)
                  </label>
                  <select
                    value={settings.bottomChannel}
                    onChange={(e) =>
                      handleInputChange("bottomChannel", e.target.value)
                    }
                    className="w-full admin-input rounded px-2 py-1.5 text-xs text-center focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="c">Cyan</option>
                    <option value="m">Magenta</option>
                    <option value="y">Yellow</option>
                    <option value="k">Black</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            // 2-EKSEN MODU AKTİFSE
            <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded text-center">
              <p className="text-xs text-blue-300 font-semibold">
                2-Eksen Modu Aktif
              </p>
              <p className="text-[10px] text-blue-400 mt-1">
                X ve Y eksenlerini üst menüden seçebilirsiniz.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                <div>
                  <label className="text-[9px] font-bold admin-text-tertiary block">
                    X EKSENİ
                  </label>
                  <select
                    value={settings.xAxisChannel}
                    onChange={(e) =>
                      handleInputChange("xAxisChannel", e.target.value)
                    }
                    className="w-full admin-input rounded px-1 py-1 text-xs"
                  >
                    <option value="c">Cyan</option>
                    <option value="m">Magenta</option>
                    <option value="y">Yellow</option>
                    <option value="k">Black</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold admin-text-tertiary block">
                    Y EKSENİ
                  </label>
                  <select
                    value={settings.yAxisChannel}
                    onChange={(e) =>
                      handleInputChange("yAxisChannel", e.target.value)
                    }
                    className="w-full admin-input rounded px-1 py-1 text-xs"
                  >
                    <option value="c">Cyan</option>
                    <option value="m">Magenta</option>
                    <option value="y">Yellow</option>
                    <option value="k">Black</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. GRID & BOYUT AYARLARI */}
        <section>
          <h3 className="text-xs font-bold admin-text-primary border-b border-admin-border-primary pb-2 mb-3 uppercase tracking-wider">
            Kutu & Yerleşim
          </h3>

          <div className="flex items-center justify-between bg-blue-900/20 p-3 rounded border border-blue-500/20 mb-4">
            <div>
              <span className="text-xs font-bold text-blue-300 block">
                Otomatik Sığdır
              </span>
              <span className="text-[10px] text-blue-400">
                Sayfayı dolduracak kadar
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.isAutoFit}
              onChange={(e) => handleInputChange("isAutoFit", e.target.checked)}
              className="w-5 h-5 text-blue-500 rounded border-admin-border-primary focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="text-[10px] font-bold admin-text-tertiary block mb-1">
                Kutu Boyutu (mm)
              </label>
              <input
                type="number"
                min="5"
                value={settings.patchSizeMm}
                onChange={(e) =>
                  handleInputChange("patchSizeMm", Number(e.target.value))
                }
                className="w-full admin-input rounded p-2 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold admin-text-tertiary block mb-1">
                Boşluk (mm)
              </label>
              <input
                type="number"
                min="0"
                value={settings.gapMm}
                onChange={(e) =>
                  handleInputChange("gapMm", Number(e.target.value))
                }
                className="w-full admin-input rounded p-2 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-[10px] font-bold admin-text-tertiary block mb-1">
              Değişim Miktarı (Step %)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.01"
                max="50"
                step="0.01"
                value={settings.stepValue}
                onChange={(e) =>
                  handleInputChange("stepValue", parseFloat(e.target.value))
                }
                className="flex-1 h-2 admin-bg-tertiary rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                min="0.01"
                max="50"
                step="0.01"
                value={settings.stepValue}
                onChange={(e) =>
                  handleInputChange("stepValue", parseFloat(e.target.value) || 0.01)
                }
                className="w-20 text-center admin-input rounded p-1 text-xs font-bold"
              />
            </div>
          </div>

          {/* Manuel Grid Ayarları (Sadece Auto kapalıysa) */}
          {!settings.isAutoFit && (
            <div className="mt-4 pt-4 border-t border-admin-border-primary grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 animate-in fade-in">
              <div>
                <label className="text-[10px] font-bold admin-text-tertiary block mb-1">
                  Satır Sayısı
                </label>
                <input
                  type="number"
                  value={settings.manualRows}
                  onChange={(e) =>
                    handleInputChange("manualRows", Number(e.target.value))
                  }
                  className="w-full admin-input rounded p-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold admin-text-tertiary block mb-1">
                  Sütun Sayısı
                </label>
                <input
                  type="number"
                  value={settings.manualCols}
                  onChange={(e) =>
                    handleInputChange("manualCols", Number(e.target.value))
                  }
                  className="w-full admin-input rounded p-2 text-xs"
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
};

export default Sidebar;
