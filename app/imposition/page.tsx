// @/app/imposition/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PaperSize, PAPER_PRESETS, MACHINE_LIMITS } from '@/lib/constants'
import SidebarImposition from './_components/SidebarImposition'
import CanvasImposition from './_components/CanvasImposition'
import jsPDF from 'jspdf'

export default function ImpositionPage () {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activePaper, setActivePaper] = useState<PaperSize>(PAPER_PRESETS[0])
  const [workOrientation, setWorkOrientation] = useState<
    'portrait' | 'landscape'
  >('portrait')
  const [zoomLevel, setZoomLevel] = useState(0.4)
  const [totalCount, setTotalCount] = useState(0)

  const [specs, setSpecs] = useState({
    width: 30,
    height: 100,
    gapX: 0,
    gapY: 0,
    margin: 10,
    templateMode: 'none' as 'none' | 'summa' | 'plotter'
  })

  const canvasRef = useRef<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('sivelor_imp_v11')
    if (saved) {
      const data = JSON.parse(saved)
      if (data.specs) setSpecs(data.specs)
      if (data.activePaper) setActivePaper(data.activePaper)
      if (data.workOrientation) setWorkOrientation(data.workOrientation)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        'sivelor_imp_v11',
        JSON.stringify({ specs, activePaper, workOrientation })
      )
    }
  }, [specs, activePaper, workOrientation, isLoaded])

  const exportBicakPDF = () => {
    // KAĞIT HER ZAMAN SABİT (DÖNMÜYOR)
    const paperW = activePaper.w
    const paperH = activePaper.h

    // ETİKET YÖNÜ
    const isLandscapeWork = workOrientation === 'landscape'
    const itemW = isLandscapeWork ? specs.height : specs.width
    const itemH = isLandscapeWork ? specs.width : specs.height

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [paperW, paperH]
    })

    // --- ALAN HESABI ---
    let safeTop = specs.margin
    let safeBottom = specs.margin
    let safeSide = specs.margin

    if (specs.templateMode === 'summa') {
      // Summa: Statik değerler constants.ts'den gelir
      const sum = MACHINE_LIMITS.summa
      safeTop = Math.max(specs.margin, (sum?.staticTop || 10) + 10)
      safeBottom = Math.max(specs.margin, (sum?.staticBottom || 5) + 10)
      safeSide = Math.max(specs.margin, (sum?.staticSide || 10) + 5)
    } else if (specs.templateMode === 'plotter') {
      // Plotter: Merkez(10) + Yarıçap(5) + 2mm pay = 17mm
      const plt = MACHINE_LIMITS.plotter
      const safeZone = (plt?.centerOffset || 10) + (plt?.markerRadius || 5) + 2
      safeTop = Math.max(specs.margin, safeZone)
      safeBottom = Math.max(specs.margin, safeZone)
      safeSide = Math.max(specs.margin, safeZone)
    }

    const availW = paperW - safeSide * 2
    const availH = paperH - (safeTop + safeBottom)

    const cols = Math.floor((availW + specs.gapX) / (itemW + specs.gapX))
    const rows = Math.floor((availH + specs.gapY) / (itemH + specs.gapY))

    const totalGridW = cols > 0 ? cols * itemW + (cols - 1) * specs.gapX : 0
    const totalGridH = rows > 0 ? rows * itemH + (rows - 1) * specs.gapY : 0

    const startX = (paperW - totalGridW) / 2
    const startY = safeTop + (availH - totalGridH) / 2

    // --- STATİK MARKÖRLER (SİYAH) ---
    if (specs.templateMode !== 'none') {
      doc.setFillColor(0, 0, 0)

      if (specs.templateMode === 'summa') {
        const sum = MACHINE_LIMITS.summa
        const s = sum.markerSize
        const side = sum.staticSide
        const top = sum.staticTop
        const bot = sum.staticBottom

        // 1. Kareler (Sol/Sağ)
        const yPositions = [top, paperH / 2 - s / 2, paperH - bot - 10 - s]
        yPositions.forEach(y => {
          doc.rect(side, y, s, s, 'F')
          doc.rect(paperW - side - s, y, s, s, 'F')
        })

        // 2. Alt Çizgi
        const barY = paperH - bot - sum.lineThickness
        const barW = paperW - side * 2 - s * 2 - 4
        doc.rect(side + s + 2, barY, barW, sum.lineThickness, 'F')
      } else if (specs.templateMode === 'plotter') {
        const plt = MACHINE_LIMITS.plotter
        const r = plt.markerRadius
        const c = plt.centerOffset

        // 4 Köşe Daire
        doc.circle(c, c, r, 'F') // Sol Üst
        doc.circle(paperW - c, c, r, 'F') // Sağ Üst
        doc.circle(c, paperH - c, r, 'F') // Sol Alt
        doc.circle(paperW - c, paperH - c, r, 'F') // Sağ Alt
      }
    }

    // --- BIÇAK ÇİZGİLERİ (KIRMIZI) ---
    doc.setDrawColor(255, 0, 0)
    doc.setLineWidth(0.1)

    if (cols > 0 && rows > 0) {
      if (specs.gapX === 0 && specs.gapY === 0) {
        // Common Cut
        for (let i = 0; i <= rows; i++) {
          const y = startY + i * itemH
          doc.line(startX, y, startX + totalGridW, y)
        }
        for (let j = 0; j <= cols; j++) {
          const x = startX + j * itemW
          doc.line(x, startY, x, startY + totalGridH)
        }
      } else {
        // Ayrı Kutular
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            doc.rect(
              startX + c * (itemW + specs.gapX),
              startY + r * (itemH + specs.gapY),
              itemW,
              itemH
            )
          }
        }
      }
    }
    doc.save(`Sivelor_Bicak_${specs.templateMode}.pdf`)
  }

  if (!isLoaded) return <div className='bg-[#0a0a0a] h-screen w-screen' />

  return (
    <div className='flex-1 flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#0a0a0a] font-sans text-white'>
      <SidebarImposition
        specs={specs}
        setSpecs={setSpecs}
        activePaper={activePaper}
        setActivePaper={setActivePaper}
        workOrientation={workOrientation}
        setWorkOrientation={setWorkOrientation}
        onExport={exportBicakPDF}
      />
      <main className='flex-1 flex flex-col h-full bg-[#111] relative overflow-hidden'>
        <div className='h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/60 z-30 shadow-xl'>
          <div className='flex flex-col w-1/4 uppercase tracking-[0.3em] text-[9px] text-neutral-500 italic'>
            Sivelor Prepress
          </div>
          <div className='flex flex-col items-center'>
            <span className='text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none mb-1'>
              Toplam Sığan
            </span>
            <div className='flex items-baseline gap-1'>
              <span className='text-4xl font-black italic tracking-tighter leading-none'>
                {Number.isNaN(totalCount) ? 0 : totalCount}
              </span>
              <span className='text-[10px] text-neutral-500 uppercase font-light tracking-widest'>
                Adet
              </span>
            </div>
          </div>
          <div className='flex gap-4 items-center w-1/4 justify-end'>
            <button
              onClick={() => canvasRef.current?.resetView()}
              className='text-[9px] px-4 py-2 border border-white/10 rounded-full hover:bg-white/5 uppercase tracking-widest transition-all'
            >
              Görünümü Resetle
            </button>
          </div>
        </div>
        <CanvasImposition
          ref={canvasRef}
          specs={specs}
          activePaper={activePaper}
          workOrientation={workOrientation}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          onCountChange={setTotalCount}
        />
      </main>
    </div>
  )
}
