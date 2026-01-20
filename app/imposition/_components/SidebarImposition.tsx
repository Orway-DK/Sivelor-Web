// @/app/imposition/_components/SidebarImposition.tsx
import React from 'react'
import { PAPER_PRESETS, MACHINE_LIMITS } from '@/lib/constants'
import { FaArrowsAltH, FaArrowsAltV, FaCut, FaRedo } from 'react-icons/fa'

export default function SidebarImposition ({
  specs,
  setSpecs,
  activePaper,
  setActivePaper,
  workOrientation,
  setWorkOrientation,
  onExport
}: any) {
  const update = (key: string, val: any) =>
    setSpecs((p: any) => ({ ...p, [key]: val }))

  return (
    <aside className='w-full md:w-[320px] bg-black border-r border-white/5 flex flex-col p-6 text-neutral-300 space-y-8 overflow-y-auto z-20'>
      <section>
        <h3 className='text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4 text-blue-500'>
          1. Tabaka Ayarı
        </h3>
        <select
          value={activePaper.id}
          onChange={e =>
            setActivePaper(PAPER_PRESETS.find(p => p.id === e.target.value))
          }
          className='w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-sm text-white outline-none mb-4'
        >
          {PAPER_PRESETS.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Kutuları Çevirme Butonları */}
        <h4 className='text-[9px] text-neutral-600 font-bold uppercase mb-2 tracking-widest'>
          Çalışma Yönü (Kutular)
        </h4>
        <div className='flex bg-neutral-900 rounded-lg p-1 border border-white/5'>
          <button
            onClick={() => setWorkOrientation('portrait')}
            className={`flex-1 py-2 text-[10px] uppercase rounded-md transition-all flex items-center justify-center gap-2 ${
              workOrientation === 'portrait'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-500'
            }`}
          >
            <FaArrowsAltV /> Düz
          </button>
          <button
            onClick={() => setWorkOrientation('landscape')}
            className={`flex-1 py-2 text-[10px] uppercase rounded-md transition-all flex items-center justify-center gap-2 ${
              workOrientation === 'landscape'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-500'
            }`}
          >
            <FaRedo className='text-[10px]' /> Çevir
          </button>
        </div>
      </section>

      <section className='space-y-6'>
        <h3 className='text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] text-blue-500'>
          2. Çalışma Ölçüleri
        </h3>
        <div className='space-y-3'>
          <label className='text-[9px] uppercase text-neutral-600 block font-bold tracking-widest'>
            Kenar Payı (Margin): {specs.margin}mm
          </label>
          <input
            type='range'
            min='0'
            max='50'
            value={specs.margin}
            onChange={e => update('margin', +e.target.value)}
            className='w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600'
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <input
            type='number'
            placeholder='W'
            value={specs.width}
            onChange={e => update('width', +e.target.value)}
            className='bg-neutral-900 border border-white/10 p-2 rounded text-sm text-white outline-none'
          />
          <input
            type='number'
            placeholder='H'
            value={specs.height}
            onChange={e => update('height', +e.target.value)}
            className='bg-neutral-900 border border-white/10 p-2 rounded text-sm text-white outline-none'
          />
        </div>
        <div className='grid grid-cols-2 gap-4 pt-4 border-t border-white/5'>
          <input
            type='number'
            placeholder='Gap X'
            value={specs.gapX}
            onChange={e => update('gapX', +e.target.value)}
            className='bg-neutral-900 border border-white/10 p-2 rounded text-sm text-white outline-none'
          />
          <input
            type='number'
            placeholder='Gap Y'
            value={specs.gapY}
            onChange={e => update('gapY', +e.target.value)}
            className='bg-neutral-900 border border-white/10 p-2 rounded text-sm text-white outline-none'
          />
        </div>
      </section>

      <section className='space-y-4 pt-6 border-t border-white/5'>
        <h3 className='text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] text-blue-500'>
          3. Bıçak Şablonu
        </h3>
        <div className='grid grid-cols-3 gap-2'>
          {['none', 'summa', 'plotter'].map(m => (
            <button
              key={m}
              onClick={() => update('templateMode', m)}
              className={`text-[9px] uppercase py-2 rounded border transition-all ${
                specs.templateMode === m
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-neutral-900 border-white/5 text-neutral-500'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={onExport}
          className='w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2'
        >
          <FaCut className='text-red-500' /> Akıllı Bıçak PDF
        </button>
      </section>
    </aside>
  )
}
