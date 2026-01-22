// @/app/admin/actions.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// --- ÇIKIŞ YAPMA AKSİYONU ---
export async function signOut () {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get (name: string) {
          return cookieStore.get(name)?.value
        },
        set (name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove (name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )

  await supabase.auth.signOut()
  redirect('/admin/login')
}

// --- YENİ FİKİR EKLEME AKSİYONU ---
export async function addIdea (formData: FormData) {
  const cookieStore = await cookies()

  // Form verilerini al
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const priority = formData.get('priority') as string
  const description = formData.get('description') as string

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get (name: string) {
          return cookieStore.get(name)?.value
        },
        set (name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove (name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        }
      }
    }
  )

  // Veritabanına Ekle
  const { error } = await supabase
    .from('sivelor_ideas')
    .insert([{ title, category, priority, description, status: 'Planlanıyor' }])

  if (error) {
    console.error('Hata:', error)
    return { success: false, message: 'Kayıt başarısız.' }
  }

  // Dashboard'ı yenile (yeni veriyi göster) ve modalı kapatmak için state yönetimi (client tarafında yapılacak)
  revalidatePath('/admin/dashboard')
  return { success: true, message: 'Fikir eklendi.' }
}
