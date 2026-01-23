// @/app/imposition/_components/SidebarImposition.tsx
import React from 'react'
import { PAPER_PRESETS } from '@/lib/constants'
import {
  FaArrowsAltV,
  FaRedo,
  FaCut,
  FaChevronDown,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'

export default function SidebarImposition ({
  specs,
  setSpecs,
  activePaper,
  setActivePaper,
  workOrientation,
  setWorkOrientation,
  labelSize,
  setLabelSize,
  showSafeArea,
  setShowSafeArea,
  onExport
}: any) {
  const update = (key: string, val: number | string) => {
    let safeVal = val
    if (key === 'width' || key === 'height') {
      safeVal = Math.max(1, Number(val))
    }
    setSpecs((p: any) => ({ ...p, [key]: safeVal }))
    
    // Şablon modu değiştiğinde safe area'yı otomatik göster
    if (key === 'templateMode' && val !== 'none') {
      setShowSafeArea(true)
    }
  }

  const inputStyle =
    'w-full admin-input rounded-lg p-2.5 text-xs outline-none focus:border-white/20 transition-all'
  const labelStyle =
    'text-[9px] font-bold admin-text-tertiary uppercase tracking-[0.2em] mb-2 block'

  return (
    <aside className='w-full flex flex-col p-6 space-y-8 admin-sidebar h-full overflow-x-hidden scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent'>
      <section>
        <div className='flex justify-between items-center mb-5'>
          <h3 className='text-[10px] font-bold admin-text-tertiary uppercase tracking-[0.3em]'>
            1. Tabaka Ayarı
          </h3>
          {/* GÜVENLİ ALAN TOGGLE BUTONU */}
          <button
            onClick={() => setShowSafeArea(!showSafeArea)}
            title="Güvenli Alan Overlay'ini Aç/Kapat"
            className={`flex items-center gap-2 text-[9px] px-3 py-1 rounded-full border transition-all uppercase font-bold ${
              showSafeArea
                ? 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                : 'admin-bg-secondary border-admin-border-primary admin-text-tertiary'
            }`}
          >
            {showSafeArea ? (
              <>
                <FaEye /> Rehber Açık
              </>
            ) : (
              <>
                <FaEyeSlash /> Rehber Kapalı
              </>
            )}
          </button>
        </div>

        <div className='relative group'>
          <select
            // activePaper gelene kadar veya bozuksa boş string göstererek crash'i önle
            value={activePaper?.id || ''}
            onChange={e => {
              const found = PAPER_PRESETS.find(p => p.id === e.target.value)
              // Sadece geçerli bir kağıt bulunduysa state'i güncelle
              if (found) {
                setActivePaper(found)
              }
            }}
            className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
          >
            {PAPER_PRESETS.map(p => (
              <option key={p.id} value={p.id} className='admin-bg-tertiary admin-text-primary'>
                {p.name}
              </option>
            ))}
          </select>
          <FaChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 admin-text-tertiary pointer-events-none group-hover:admin-text-primary transition-colors' />
        </div>

        <div className='mt-6 flex admin-bg-secondary rounded-xl p-1 border border-admin-border-primary'>
          <button
            onClick={() => setWorkOrientation('portrait')}
            className={`flex-1 py-2 text-[9px] uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              workOrientation === 'portrait'
                ? 'admin-bg-tertiary admin-text-primary shadow-lg'
                : 'admin-text-tertiary hover:admin-text-primary'
            }`}
          >
            <FaArrowsAltV /> Dikey
          </button>
          <button
            onClick={() => setWorkOrientation('landscape')}
            className={`flex-1 py-2 text-[9px] uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              workOrientation === 'landscape'
                ? 'admin-bg-tertiary admin-text-primary shadow-lg'
                : 'admin-text-tertiary hover:admin-text-primary'
            }`}
          >
            <FaRedo className='text-[8px]' /> Yatay
          </button>
        </div>
      </section>

      <section className='space-y-6'>
        <h3 className='text-[10px] font-bold admin-text-tertiary uppercase tracking-[0.3em]'>
          2. Çalışma Ölçüleri
        </h3>

        <div
          className={`space-y-3 transition-all duration-300 ${
            specs.templateMode !== 'none'
              ? 'opacity-20 pointer-events-none'
              : 'opacity-100'
          }`}
        >
          <div className='flex justify-between items-center'>
            <label className={labelStyle + ' mb-0'}>Kenar Boşluğu</label>
            <span className='text-[10px] text-blue-400 font-bold'>
              {specs.margin}mm
            </span>
          </div>
          <input
            type='range'
            min='0'
            max='50'
            value={specs.margin}
            onChange={e => update('margin', +e.target.value)}
            className='w-full h-1 admin-bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-500'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className={labelStyle}>Gen (W)</label>
            <input
              type='number'
              min='1'
              value={specs.width}
              onChange={e => update('width', +e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Yük (H)</label>
            <input
              type='number'
              min='1'
              value={specs.height}
              onChange={e => update('height', +e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>
      </section>

      <section className='space-y-5 pt-6 border-t border-admin-border-primary'>
        <h3 className='text-[10px] font-bold admin-text-tertiary uppercase tracking-[0.3em]'>
          3. Şablon
        </h3>
        <div className='grid grid-cols-3 gap-2'>
          <button
            onClick={() => update('templateMode', 'none')}
            className={`text-[9px] uppercase py-2.5 rounded-lg border font-bold transition-all ${
              specs.templateMode === 'none'
                ? 'admin-bg-tertiary border-admin-border-primary admin-text-primary shadow-lg'
                : 'admin-bg-secondary border-admin-border-primary admin-text-tertiary hover:admin-text-primary'
            }`}
          >
            Yok
          </button>
          <button
            onClick={() => update('templateMode', 'summa')}
            className={`text-[9px] uppercase py-2.5 rounded-lg border font-bold transition-all ${
              specs.templateMode === 'summa'
                ? 'admin-bg-tertiary border-admin-border-primary admin-text-primary shadow-lg'
                : 'admin-bg-secondary border-admin-border-primary admin-text-tertiary hover:admin-text-primary'
            }`}
          >
            Summa
          </button>
          <button
            onClick={() => update('templateMode', 'plotter')}
            className={`text-[9px] uppercase py-2.5 rounded-lg border font-bold transition-all ${
              specs.templateMode === 'plotter'
                ? 'admin-bg-tertiary border-admin-border-primary admin-text-primary shadow-lg'
                : 'admin-bg-secondary border-admin-border-primary admin-text-tertiary hover:admin-text-primary'
            }`}
          >
            Plotter
          </button>
        </div>
        <button
          type="button"
          onClick={onExport}
          className='w-full py-4 admin-bg-secondary hover:admin-bg-tertiary border border-admin-border-primary rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 admin-text-primary group mt-4'
        >
          <FaCut className='text-red-500 group-hover:scale-110 transition-transform' />{' '}
          Akıllı Bıçak PDF
        </button>
      </section>
    </aside>
  )
}
