// @/app/page.tsx

import React from 'react'
import { FaWhatsapp, FaPenNib } from 'react-icons/fa'

export default function ComingSoon () {
  const whatsappNumber = '905309630199'
  const whatsappMessage = encodeURIComponent(
    'Merhaba Sivelor, baskı çözümleriniz hakkında bilgi almak istiyorum.'
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#0a0a0a] relative overflow-hidden'>
      {/* Texture Layer: Kağıt dokusu hissi */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Ambient Light: Derinlik katan hafif aydınlatma */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-800/10 blur-[120px] rounded-full' />

      <div className='max-w-7xl w-full text-center space-y-12 z-10'>
        {/* Logo Alanı */}
        <div className='space-y-2'>
          <h1 className='text-5xl md:text-7xl font-extralight tracking-[0.3em] text-white/90 uppercase'>
            Sivelor
          </h1>
          <p className='text-xs tracking-[0.5em] text-neutral-500 uppercase'>
            Art of Printing & Workshop
          </p>
        </div>

        {/* Zarif Ayırıcı */}
        <div className='flex justify-center items-center gap-4'>
          <div className='h-[1px] w-12 bg-neutral-800' />
          <FaPenNib className='text-neutral-700 text-sm' />
          <div className='h-[1px] w-12 bg-neutral-800' />
        </div>

        {/* Mesaj Bölümü */}
        <div className='space-y-6'>
          <h2 className='text-2xl md:text-3xl font-light text-neutral-300 italic'>
            Mürekkebin kağıtla en zarif buluşması için hazırlanıyoruz.
          </h2>
          <p className='text-neutral-500 text-base md:text-lg max-w-lg mx-auto font-light leading-relaxed'>
            Butik baskı çözümleri ve kreatif uygulama atölyemiz çok yakında
            yayında olacak. Sorularınız için bize doğrudan ulaşabilirsiniz.
          </p>
        </div>

        {/* İletişim: Sadece WhatsApp */}
        <div className='pt-8'>
          <a
            href={whatsappUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group'
          >
            <FaWhatsapp className='text-xl text-green-500 group-hover:scale-110 transition-transform' />
            <span className='text-sm tracking-[0.2em] uppercase font-medium'>
              WhatsApp ile İletişime Geç
            </span>
          </a>
        </div>

        {/* Footer */}
        <div className='pt-16'>
          <div className='text-[10px] tracking-[0.3em] text-neutral-700 uppercase'>
            © 2026 Sivelor Atölye / İstanbul
          </div>
        </div>
      </div>

      {/* Kenar Çerçevesi */}
      <div className='absolute inset-8 border border-white/[0.02] pointer-events-none hidden md:block' />
    </div>
  )
}
