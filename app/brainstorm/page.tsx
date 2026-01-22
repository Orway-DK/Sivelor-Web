// @/app/brainstorm/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import {
  FaArrowLeft,
  FaLightbulb,
  FaRobot,
  FaTools,
  FaChartLine,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa'

// FİKİR LİSTESİ VERİTABANI
const PROJECTS = [
  {
    id: 1,
    title: 'Otomatik Akıllı Montaj (Auto-Nesting)',
    category: 'Otomasyon',
    priority: 'Kritik',
    description:
      'Müşteriden gelen farklı boyutlardaki (örn: 10x10, 30x20) dosyaları analiz edip, 35x50 veya 33x48 tabakaya en az fire verecek şekilde otomatik yerleştiren algoritma.',
    status: 'Planlanıyor',
    icon: <FaRobot className='text-purple-400' />
  },
  {
    id: 2,
    title: 'Ambalaj Bıçak İzi Oluşturucu',
    category: 'Araç',
    priority: 'Yüksek',
    description:
      'Kutu tipi (Kilitli, Yastık vb.) ve E/B/Y ölçüleri girildiğinde otomatik olarak bıçak izini PDF/SVG olarak çizen modül.',
    status: 'Fikir',
    icon: <FaTools className='text-blue-400' />
  },
  {
    id: 3,
    title: 'Otomatik Taşma (Bleed) Ekleyici',
    category: 'Görüntü İşleme',
    priority: 'Orta',
    description:
      "Kenar payı olmayan müşteri görsellerini 'mirror' veya 'stretch' yöntemiyle uzatarak otomatik 3mm kesim payı ekleme.",
    status: 'Fikir',
    icon: <FaLightbulb className='text-yellow-400' />
  },
  {
    id: 4,
    title: 'Mürekkep Yoğunluk Analizörü',
    category: 'Analiz',
    priority: 'Düşük',
    description:
      "Yüklenen PDF'in CMYK yoğunluğunu hesaplayarak toner/mürekkep maliyetini önceden tahmin eden araç.",
    status: 'Fikir',
    icon: <FaChartLine className='text-green-400' />
  },
  {
    id: 5,
    title: 'Matbaa Fiyat Hesaplama Motoru',
    category: 'Yönetim',
    priority: 'Orta',
    description:
      'Kağıt, baskı, laminasyon ve işçilik giderlerini parametrik olarak alıp anlık müşteri fiyat teklifi oluşturan sistem.',
    status: 'Fikir',
    icon: <FaChartLine className='text-green-400' />
  },
  {
    id: 6,
    title: 'Vektörel QR & Barkod Üretici',
    category: 'Araç',
    priority: 'Düşük',
    description:
      'Baskıya uygun, %100 K (Siyah) değerinde vektörel QR kod ve barkod üreten basit araç.',
    status: 'Fikir',
    icon: <FaTools className='text-blue-400' />
  },
  {
    id: 7,
    title: 'Müşteri Dosya Yükleme Portalı',
    category: 'SaaS / Web',
    priority: 'Yüksek',
    description:
      "Müşterilerin dosyalarını yüklediği, sistemin otomatik 'Pre-flight' (DPI, Boyut, Renk) kontrolü yaptığı ön kabul ekranı.",
    status: 'Fikir',
    icon: <FaChartLine className='text-green-400' />
  }
]

export default function BrainstormPage () {
  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30'>
      {/* HEADER */}
      <header className='h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/60 sticky top-0 z-50 backdrop-blur-md'>
        <div className='flex items-center gap-4'>
          <Link
            href='/imposition'
            className='p-2 rounded-full hover:bg-white/5 transition-colors text-neutral-400 hover:text-white'
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-white'>
              Sivelor{' '}
              <span className='text-blue-500 font-light italic'>
                Brainstorm
              </span>
            </h1>
            <p className='text-[10px] text-neutral-500 uppercase tracking-widest'>
              Gelecek Projeler & Fikirler
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs bg-blue-900/30 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-medium'>
            {PROJECTS.length} Proje Fikri
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className='p-8 max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {PROJECTS.map(project => (
            <div
              key={project.id}
              className='group bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-[#161616] transition-all duration-300 relative overflow-hidden'
            >
              {/* Arkaplan Efekti */}
              <div className='absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all'></div>

              {/* Üst Kısım: İkon ve Badge */}
              <div className='flex justify-between items-start mb-4 relative z-10'>
                <div className='p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300'>
                  {project.icon}
                </div>
                <div
                  className={`text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider
                  ${
                    project.priority === 'Kritik'
                      ? 'bg-red-900/20 text-red-400 border-red-500/20'
                      : project.priority === 'Yüksek'
                      ? 'bg-orange-900/20 text-orange-400 border-orange-500/20'
                      : 'bg-neutral-800 text-neutral-400 border-white/5'
                  }`}
                >
                  {project.priority}
                </div>
              </div>

              {/* Başlık ve Açıklama */}
              <h3 className='text-lg font-bold text-neutral-200 mb-2 group-hover:text-blue-400 transition-colors'>
                {project.title}
              </h3>
              <p className='text-sm text-neutral-500 leading-relaxed mb-6 h-20 overflow-hidden text-ellipsis'>
                {project.description}
              </p>

              {/* Alt Bilgi: Kategori ve Durum */}
              <div className='flex items-center justify-between pt-4 border-t border-white/5'>
                <span className='text-[10px] text-neutral-400 font-medium uppercase tracking-wider flex items-center gap-1'>
                  <span className='w-1.5 h-1.5 rounded-full bg-neutral-600'></span>{' '}
                  {project.category}
                </span>

                <div className='flex items-center gap-1.5 text-[10px] font-bold'>
                  {project.status === 'Planlanıyor' ? (
                    <FaClock className='text-yellow-500' />
                  ) : (
                    <FaCheckCircle className='text-neutral-600' />
                  )}
                  <span
                    className={
                      project.status === 'Planlanıyor'
                        ? 'text-yellow-500'
                        : 'text-neutral-600'
                    }
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Yeni Fikir Ekle Kartı (Placeholder) */}
          <div className='border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-neutral-600 hover:border-white/10 hover:text-neutral-400 transition-all cursor-pointer min-h-[280px]'>
            <FaLightbulb className='text-4xl mb-4 opacity-20' />
            <span className='text-sm font-medium uppercase tracking-widest'>
              Yeni Fikir Ekle
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
