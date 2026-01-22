// @/app/admin/dashboard/_components/AddIdeaModal.tsx
'use client'

import { useState } from 'react'
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa'
import { addIdea } from '../../actions'

export default function AddIdeaModal () {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit (formData: FormData) {
    setLoading(true)
    const res = await addIdea(formData)
    setLoading(false)

    if (res.success) {
      setIsOpen(false)
    } else {
      alert('Hata oluştu!')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-md'
      >
        <FaPlus /> Yeni Fikir Ekle
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
          <div className='bg-[#1A1A1A] border border-[#2C2C2C] w-full max-w-lg rounded-2xl p-6 relative shadow-2xl'>
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-4 right-4 text-[#6B6B6B] hover:text-white transition-colors'
            >
              <FaTimes />
            </button>

            <h2 className='text-xl font-bold text-white mb-1'>
              Yeni Fikir Oluştur
            </h2>
            <p className='text-xs text-[#9A9A9A] mb-6 uppercase tracking-wider'>
              Sivelor Gelişim Süreci
            </p>

            <form action={handleSubmit} className='space-y-4'>
              <div>
                <label className='text-[10px] uppercase font-bold text-[#6B6B6B] ml-1 mb-1 block'>
                  Başlık
                </label>
                <input
                  required
                  name='title'
                  type='text'
                  placeholder='Örn: Stok Takip Modülü'
                  className='w-full bg-[#121212] border border-[#2C2C2C] rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-white placeholder:text-[#6B6B6B]'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-[10px] uppercase font-bold text-[#6B6B6B] ml-1 mb-1 block'>
                    Kategori
                  </label>
                  <select
                    name='category'
                    className='w-full bg-[#121212] border border-[#2C2C2C] rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-white appearance-none placeholder:text-[#6B6B6B]'
                  >
                    <option value='Otomasyon'>Otomasyon</option>
                    <option value='Araç'>Araç (Tool)</option>
                    <option value='Analiz'>Analiz</option>
                    <option value='Yönetim'>Yönetim</option>
                    <option value='SaaS / Web'>SaaS / Web</option>
                  </select>
                </div>
                <div>
                  <label className='text-[10px] uppercase font-bold text-[#6B6B6B] ml-1 mb-1 block'>
                    Öncelik
                  </label>
                  <select
                    name='priority'
                    className='w-full bg-[#121212] border border-[#2C2C2C] rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-white appearance-none placeholder:text-[#6B6B6B]'
                  >
                    <option value='Düşük'>Düşük</option>
                    <option value='Orta'>Orta</option>
                    <option value='Yüksek'>Yüksek</option>
                    <option value='Kritik'>Kritik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='text-[10px] uppercase font-bold text-[#6B6B6B] ml-1 mb-1 block'>
                  Açıklama
                </label>
                <textarea
                  required
                  name='description'
                  rows={3}
                  placeholder='Detayları buraya yazın...'
                  className='w-full bg-[#121212] border border-[#2C2C2C] rounded-lg p-3 text-sm focus:border-blue-500 outline-none text-white resize-none placeholder:text-[#6B6B6B]'
                />
              </div>

              <button
                disabled={loading}
                type='submit'
                className='w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  'Kaydediliyor...'
                ) : (
                  <>
                    <FaSave /> Kaydet
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
