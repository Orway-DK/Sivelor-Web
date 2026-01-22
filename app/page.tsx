// @/app/page.tsx
import React from 'react'
import { FaWhatsapp, FaPenNib } from 'react-icons/fa'
import { Montserrat } from 'next/font/google'

const logoFont = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200']
})

export const metadata = {
  title: 'Sivelor | Prepress Intelligence',
  description: 'Art of Printing & Workshop',
  icons: {
    icon: '/favicon.svg' // public klasöründeki dosya
  }
}

export default function ComingSoon () {
  const whatsappNumber = '905309630199'
  const whatsappMessage = encodeURIComponent(
    'Merhaba Sivelor, baskı çözümleriniz hakkında bilgi almak istiyorum.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div
      className={`h-screen w-full flex flex-col items-center justify-center p-6 bg-[#080808] relative overflow-hidden ${logoFont.className}`}
    >
      {/* Dynamic Background: Pixelleşmeyen yumuşak gradyanlar */}
      <div className='absolute inset-0 z-0'>
        {/* Ana Derinlik */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_#080808_100%)]' />

        {/* Üst Köşeden Gelen Hafif Gümüş Işık */}
        <div className='absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/[0.03] blur-[120px] rounded-full' />

        {/* Alt Köşeden Gelen Hafif Gümüş Işık */}
        <div className='absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-white/[0.02] blur-[120px] rounded-full' />
      </div>

      <div className='max-w-7xl w-full flex flex-col items-center justify-center text-center space-y-12 md:space-y-16 z-10'>
        {/* Logo Alanı: Sivelor Gümüş Yazı */}
        <div className='flex flex-col items-center group'>
          <h1
            className='text-6xl md:text-[110px] font-thin tracking-[0.35em] uppercase leading-none select-none
            bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]'
          >
            Sivelor
          </h1>

          <p className='text-[10px] md:text-xs tracking-[0.7em] text-neutral-400 uppercase font-light mt-8 opacity-60'>
            Prepress Intelligence & Creative Workshop
          </p>
        </div>

        {/* Zarif Ayırıcı */}
        <div className='flex justify-center items-center gap-8'>
          <div className='h-[1px] w-20 bg-gradient-to-r from-transparent via-neutral-700 to-transparent' />
          <FaPenNib className='text-neutral-600 text-[10px] opacity-40' />
          <div className='h-[1px] w-20 bg-gradient-to-l from-transparent via-neutral-700 to-transparent' />
        </div>

        {/* Mesaj Bölümü */}
        <div className='space-y-8'>
          <h2 className='text-xl md:text-4xl font-extralight text-neutral-200 italic tracking-tight leading-snug max-w-4xl mx-auto'>
            Mürekkebin kağıtla en{' '}
            <span className='text-white font-normal not-italic border-b border-white/20'>
              zarif
            </span>{' '}
            buluşması için <br className='hidden md:block' /> sistemlerimizi ve
            tekniklerimizi geliştiriyoruz.
          </h2>
          <p className='text-neutral-500 text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed tracking-wide'>
            Butik baskı çözümleri, akıllı dizgi sistemleri ve kreatif uygulama
            atölyemiz çok yakında kapılarını açıyor.
          </p>
        </div>

        {/* İletişim Butonu */}
        <div className='pt-4'>
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-4 px-10 py-4 bg-white/[0.03] border border-white/10 rounded-full text-neutral-300 hover:text-white hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 group shadow-xl'
          >
            <div className='relative'>
              <div className='absolute inset-0 bg-green-500 blur-md opacity-10 group-hover:opacity-30 transition-opacity' />
              <FaWhatsapp className='text-lg text-green-500 relative z-10 group-hover:rotate-12 transition-transform' />
            </div>
            <span className='text-[9px] tracking-[0.4em] uppercase font-bold'>
              Atölye ile İletişime Geç
            </span>
          </a>
        </div>

        {/* Footer */}
        <div className='pt-12'>
          <div className='text-[8px] tracking-[0.5em] text-neutral-700 uppercase font-semibold'>
            © 2026 Sivelor / Crafting the Future of Print
          </div>
        </div>
      </div>

      {/* İnce Çerçeve Efekti */}
      <div className='absolute inset-10 border border-white/[0.02] pointer-events-none hidden lg:block' />
    </div>
  )
}
