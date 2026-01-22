// @/app/admin/dizgi/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  PaperSize,
  PAPER_PRESETS,
  SUMMA_CONFIGS,
  MACHINE_LIMITS
} from '@/lib/constants'
import SidebarImposition from './_components/SidebarImposition'
import CanvasImposition from './_components/CanvasImposition'
import jsPDF from 'jspdf'

export default function AdminDizgiPage () {
  const [isLoaded, setIsLoaded] = useState(false)

  // DÜZELTME: PAPER_PRESETS[0] güvenli bir başlangıç noktasıdır.
  const [activePaper, setActivePaper] = useState<PaperSize>(PAPER_PRESETS[0])
  const [workOrientation, setWorkOrientation] = useState<
    'portrait' | 'landscape'
  >('portrait')
  const [zoomLevel, setZoomLevel] = useState(0.4)
  const [totalCount, setTotalCount] = useState(0)
  const [labelSize, setLabelSize] = useState(5)
  const [showSafeArea, setShowSafeArea] = useState(true)

  const [specs, setSpecs] = useState({
    width: 30,
    height: 100,
    gapX: 0,
    gapY: 0,
    margin: 10,
    templateMode: 'summa' as 'none' | 'summa' | 'plotter'
  })

  const canvasRef = useRef<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('sivelor_dizgi_v26')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.specs) setSpecs(data.specs)
        // GÜVENLİK KONTROLÜ: Gelen veri constants ile eşleşiyor mu?
        if (
          data.activePaper &&
          PAPER_PRESETS.some(p => p.id === data.activePaper.id)
        ) {
          setActivePaper(data.activePaper)
        }
        if (data.workOrientation) setWorkOrientation(data.workOrientation)
        if (data.labelSize) setLabelSize(data.labelSize)
        if (data.showSafeArea !== undefined) setShowSafeArea(data.showSafeArea)
      } catch (e) {
        console.error(e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        'sivelor_dizgi_v26',
        JSON.stringify({
          specs,
          activePaper,
          workOrientation,
          labelSize,
          showSafeArea
        })
      )
    }
  }, [specs, activePaper, workOrientation, labelSize, showSafeArea, isLoaded])

  const exportBicakPDF = () => {
    /* ... PDF KODUN ... */
  }

  if (!isLoaded)
    return (
      <div className='bg-[#121212] h-full w-full flex items-center justify-center text-white/20 uppercase tracking-[0.5em] text-xs'>
        Sivelor Loading...
      </div>
    )

  return (
    <div className='flex h-full w-full overflow-hidden admin-container font-sans admin-text-primary'>
      <div className='border-r border-admin-border-primary admin-bg-secondary w-80 shrink-0 h-full overflow-y-auto hidden md:block'>
        <SidebarImposition
          specs={specs}
          setSpecs={setSpecs}
          activePaper={activePaper}
          setActivePaper={setActivePaper}
          workOrientation={workOrientation}
          setWorkOrientation={setWorkOrientation}
          labelSize={labelSize}
          setLabelSize={setLabelSize}
          showSafeArea={showSafeArea}
          setShowSafeArea={setShowSafeArea}
          onExport={exportBicakPDF}
        />
      </div>

      <main className='flex-1 flex flex-col h-full admin-container relative overflow-hidden'>
        <div className='h-16 border-b border-admin-border-primary flex items-center justify-between px-8 admin-bg-primary z-30'>
          <div className='flex flex-col'>
            <span className='text-[9px] admin-text-tertiary uppercase tracking-[0.3em] font-bold italic leading-none'>
              Sivelor Prepress
            </span>
          </div>
          <div className='flex items-center gap-4 admin-bg-secondary px-6 py-2 rounded-full border border-admin-border-primary'>
            <span className='text-[10px] text-blue-400 uppercase font-bold tracking-widest'>
              Toplam:
            </span>
            <span className='text-xl font-black italic admin-text-primary leading-none'>
              {totalCount || 0}
            </span>
          </div>
          <button
            onClick={() => canvasRef.current?.resetView()}
            className='text-[9px] px-5 py-2.5 admin-button-secondary rounded-full uppercase tracking-widest transition-all'
          >
            Reset View
          </button>
        </div>
        <div className='flex-1 relative'>
          <CanvasImposition
            ref={canvasRef}
            specs={specs}
            activePaper={activePaper}
            workOrientation={workOrientation}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            labelSize={labelSize}
            onCountChange={setTotalCount}
            showSafeArea={showSafeArea}
          />
        </div>
      </main>
    </div>
  )
}
