// @/app/admin/layout.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from './_components/AdminSidebar'
import { ThemeProvider } from './ThemeProvider'
import '@/app/admin-global.css'

export default async function AdminLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get (name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <ThemeProvider>
      <div className='flex h-screen w-full admin-container overflow-hidden font-sans'>
        {user && <AdminSidebar userEmail={user.email!} />}
        <main className='flex-1 h-full overflow-y-auto relative admin-container scrollbar-thin scrollbar-thumb-admin-border-primary scrollbar-track-transparent'>
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
