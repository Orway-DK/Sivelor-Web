// @/app/die-cut/page.tsx
'use client'

import React, { useState } from 'react'
import { FaCut, FaDownload } from 'react-icons/fa'
import jsPDF from 'jspdf'

export default function DieCutGenerator () {
  const [specs, setSpecs] = useState({
    w: 50, // Etiket Genişlik
    h: 100, // Etiket Yükseklik
    cols: 5, // Sütun Sayısı
    rows: 4, // Satır Sayısı
    margin: 10
  })

  const exportCommonCutPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [330, 487] // Örnek Konica ölçüsü
    })

    const { w, h, cols, rows, margin } = specs
    doc.setDrawColor(255, 0, 0) // Bıçak izi genelde kırmızı olur
    doc.setLineWidth(0.1)

    // 1. YATAY ÇİZGİLER (Soldan sağa boydan boya)
    const totalW = cols * w
    const totalH = rows * h

    for (let i = 0; i <= rows; i++) {
      const y = margin + i * h
      doc.line(margin, y, margin + totalW, y)
    }

    // 2. DİKEY ÇİZGİLER (Yukarıdan aşağı boydan boya)
    for (let j = 0; j <= cols; j++) {
      const x = margin + j * w
      doc.line(x, margin, x, margin + totalH)
    }

    doc.save(`Sivelor_Ortak_Bicak_${w}x${h}.pdf`)
  }

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white p-12'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <div className='flex items-center gap-4 border-b border-white/10 pb-6'>
          <FaCut className='text-blue-500 text-3xl' />
          <h1 className='text-2xl font-bold tracking-widest uppercase'>
            Akıllı Bıçak (Common Cut)
          </h1>
        </div>

        <div className='grid grid-cols-2 gap-8 bg-neutral-900 p-8 rounded-2xl border border-white/5'>
          <div className='space-y-4'>
            <h3 className='text-xs font-bold text-neutral-500 uppercase tracking-widest'>
              Ölçü Ayarları
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <input
                type='number'
                placeholder='Genişlik'
                value={specs.w}
                onChange={e => setSpecs({ ...specs, w: +e.target.value })}
                className='bg-black p-3 rounded border border-white/10'
              />
              <input
                type='number'
                placeholder='Yükseklik'
                value={specs.h}
                onChange={e => setSpecs({ ...specs, h: +e.target.value })}
                className='bg-black p-3 rounded border border-white/10'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <input
                type='number'
                placeholder='Sütun'
                value={specs.cols}
                onChange={e => setSpecs({ ...specs, cols: +e.target.value })}
                className='bg-black p-3 rounded border border-white/10'
              />
              <input
                type='number'
                placeholder='Satır'
                value={specs.rows}
                onChange={e => setSpecs({ ...specs, rows: +e.target.value })}
                className='bg-black p-3 rounded border border-white/10'
              />
            </div>
          </div>

          <div className='flex flex-col justify-end'>
            <button
              onClick={exportCommonCutPDF}
              className='w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-3 transition-all'
            >
              <FaDownload /> BIÇAK PDF OLUŞTUR
            </button>
            <p className='text-[10px] text-neutral-500 mt-4 text-center'>
              * Bu araç çakışan kenarları siler, Summa'da çift kesimi engeller.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
