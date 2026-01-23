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

  // --- STATE YÖNETİMİ ---
  const [activePaper, setActivePaper] = useState<PaperSize>(PAPER_PRESETS[2]) // Default 35x50
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

  // --- LOCALSTORAGE SENKRONİZASYONU ---
  useEffect(() => {
    const saved = localStorage.getItem('sivelor_dizgi_v26')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.specs) setSpecs(data.specs)
        if (data.activePaper) setActivePaper(data.activePaper)
        if (data.workOrientation) setWorkOrientation(data.workOrientation)
        if (data.labelSize) setLabelSize(data.labelSize)
        if (data.showSafeArea !== undefined) setShowSafeArea(data.showSafeArea)
      } catch (e) {
        console.error('Veri yüklenemedi:', e)
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
    const doc = new jsPDF({
      orientation: activePaper.h > activePaper.w ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [activePaper.w, activePaper.h]
    })

    const paperW = activePaper.w
    const paperH = activePaper.h
    const isL = workOrientation === 'landscape'
    const itemW = isL ? specs.height : specs.width
    const itemH = isL ? specs.width : specs.height

    let sX = 0,
      sY = 0,
      sW = 0,
      sH = 0
    let summaCfg = null

    // --- KONUMLANDIRMA ---
    if (specs.templateMode === 'summa') {
      summaCfg = SUMMA_CONFIGS[activePaper.id] || SUMMA_CONFIGS['default']

      sW = summaCfg.safeAreaW
      sH = summaCfg.safeAreaH

      // Yatay: Ortala
      sX = (paperW - sW) / 2

      // Dikey: Alt Marker + 2mm
      const bottomReference =
        paperH - summaCfg.staticBottom - summaCfg.markerSize
      const safetyGap = 2
      sY = bottomReference - safetyGap - sH
    } else if (specs.templateMode === 'plotter') {
      const plt = MACHINE_LIMITS.plotter
      const m = Math.max(specs.margin, plt.centerOffset + plt.markerRadius + 2)
      sW = paperW - m * 2
      sH = paperH - m * 2
      sX = m
      sY = m
    } else {
      sW = paperW - specs.margin * 2
      sH = paperH - specs.margin * 2
      sX = specs.margin
      sY = specs.margin
    }

    // Grid İçerik
    const cols = Math.max(
      0,
      Math.floor((sW + specs.gapX) / (itemW + specs.gapX))
    )
    const rows = Math.max(
      0,
      Math.floor((sH + specs.gapY) / (itemH + specs.gapY))
    )

    const totalContentW = cols * itemW + (cols - 1) * specs.gapX
    const totalContentH = rows * itemH + (rows - 1) * specs.gapY

    const startX = sX + (sW - totalContentW) / 2
    const startY = sY + (sH - totalContentH) / 2

    // 1. BIÇAK ÇİZİMİ (DIE CUT OPTIMIZED)
    doc.setLineWidth(0.1)
    doc.setDrawColor(0, 0, 0)

    if (cols > 0 && rows > 0) {
      const isZeroGap = specs.gapX === 0 && specs.gapY === 0

      if (isZeroGap) {
        // Ortak Çizgi
        doc.rect(startX, startY, totalContentW, totalContentH)
        for (let c = 1; c < cols; c++) {
          const x = startX + c * itemW
          doc.line(x, startY, x, startY + totalContentH)
        }
        for (let r = 1; r < rows; r++) {
          const y = startY + r * itemH
          doc.line(startX, y, startX + totalContentW, y)
        }
      } else {
        // Ayrık Kesim
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * (itemW + specs.gapX)
            const y = startY + r * (itemH + specs.gapY)
            doc.rect(x, y, itemW, itemH)
          }
        }
      }
    }

    // 2. MARKERLAR
    if (specs.templateMode === 'summa' && summaCfg) {
      const mSize = summaCfg.markerSize
      const barH = summaCfg.barHeight
      const barGap = summaCfg.barGap || 0

      doc.setFillColor(0, 0, 0)

      const leftX = summaCfg.staticSide
      const rightX = paperW - summaCfg.staticSide - mSize
      const topY = summaCfg.staticTop
      const bottomY = paperH - summaCfg.staticBottom - mSize
      const midY = topY + (bottomY - topY) / 2

      // Köşeler
      doc.rect(leftX, topY, mSize, mSize, 'F')
      doc.rect(rightX, topY, mSize, mSize, 'F')
      doc.rect(leftX, midY, mSize, mSize, 'F')
      doc.rect(rightX, midY, mSize, mSize, 'F')
      doc.rect(leftX, bottomY, mSize, mSize, 'F')
      doc.rect(rightX, bottomY, mSize, mSize, 'F')

      // Alt Bar
      const barStartX = leftX + mSize + barGap
      const barEndX = rightX - barGap
      const barY = bottomY + (mSize - barH) / 2
      doc.rect(barStartX, barY, barEndX - barStartX, barH, 'F')
    } else if (specs.templateMode === 'plotter') {
      const plt = MACHINE_LIMITS.plotter
      const r = plt.markerRadius
      const offset = plt.centerOffset
      const points = [
        { x: sX + offset, y: sY + offset },
        { x: sX + sW - offset, y: sY + offset },
        { x: sX + offset, y: sY + sH - offset },
        { x: sX + sW - offset, y: sY + sH - offset }
      ]
      doc.setFillColor(0, 0, 0)
      points.forEach(p => doc.circle(p.x, p.y, r, 'F'))
    }

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Sivelor - ${activePaper.name} - ${cols * rows} Adet`, 5, 5)

    doc.save(`sivelor_bicak_${specs.templateMode}.pdf`)
  }

  if (!isLoaded) return <div className='bg-[#121212] h-full w-full' />

  return (
    <div className='flex h-full w-full overflow-hidden bg-[#121212] font-sans text-white'>
      {/* SOL PANEL: Dizgi Ayarları */}
      <div className='border-r border-[#2C2C2C] bg-[#1A1A1A] w-80 shrink-0 h-full overflow-y-auto hidden md:block'>
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

      {/* ANA PANEL: Canvas ve Üst Bar */}
      <main className='flex-1 flex flex-col h-full bg-[#121212] relative overflow-hidden'>
        {/* ÜST BAR (Navbar) */}
        <div className='h-16 border-b border-[#2C2C2C] flex items-center justify-between px-8 bg-[#0D0D0D] z-30'>
          <div className='flex flex-col'>
            <span className='text-[9px] text-[#4A4A4A] uppercase tracking-[0.3em] font-bold italic leading-none'>
              Sivelor Prepress
            </span>
            <span className='text-[8px] text-[#222] uppercase tracking-[0.2em] mt-1'>
              Intelligence & Automation
            </span>
          </div>

          <div className='flex items-center gap-4 bg-[#1A1A1A] px-6 py-2 rounded-full border border-white/5 shadow-inner'>
            <span className='text-[10px] text-blue-400 uppercase font-bold tracking-widest'>
              Toplam:
            </span>
            <span className='text-2xl font-black italic text-white leading-none'>
              {totalCount || 0}
            </span>
            <span className='text-[10px] text-[#4A4A4A] uppercase font-bold'>
              adet
            </span>
          </div>

          <div className='flex gap-4 items-center'>
            <button
              onClick={() => canvasRef.current?.resetView()}
              className='text-[9px] px-5 py-2.5 bg-[#1A1A1A] border border-white/5 rounded-full hover:bg-[#222] hover:text-white uppercase tracking-widest transition-all'
            >
              Reset View
            </button>
          </div>
        </div>

        {/* ÇALIŞMA ALANI (Canvas) */}
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
