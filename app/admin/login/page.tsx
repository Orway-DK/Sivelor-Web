// @/app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { FaFingerprint } from 'react-icons/fa'

export default function AdminLogin () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className='min-h-screen bg-[#050505] flex items-center justify-center text-white p-4'>
      <div className='w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden'>
        {/* Dekoratif Arkaplan */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full pointer-events-none'></div>

        <div className='flex flex-col items-center mb-8'>
          <div className='w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10'>
            <FaFingerprint className='text-xl text-blue-500' />
          </div>
          <h1 className='text-xl font-bold tracking-widest uppercase'>
            Sivelor Admin
          </h1>
          <p className='text-xs text-neutral-500 mt-1'>Sisteme Giriş Yapın</p>
        </div>

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='text-[10px] uppercase font-bold text-neutral-500 ml-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors text-white'
              placeholder='admin@sivelor.com'
            />
          </div>

          <div>
            <label className='text-[10px] uppercase font-bold text-neutral-500 ml-1'>
              Şifre
            </label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-colors text-white'
              placeholder='••••••••'
            />
          </div>

          {error && (
            <div className='p-3 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-xs text-center'>
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className='w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2'
          >
            {loading ? 'Giriş Yapılıyor...' : 'Panele Git'}
          </button>
        </form>
      </div>
    </div>
  )
}
