// @/app/admin/dashboard/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import {
  FaRobot,
  FaTools,
  FaChartLine,
  FaLightbulb,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa'
import AddIdeaModal from './_components/AddIdeaModal'

const getIcon = (category: string) => {
  switch (category) {
    case 'Otomasyon':
      return <FaRobot className='text-purple-400' />
    case 'Araç':
      return <FaTools className='text-blue-400' />
    case 'Analiz':
      return <FaChartLine className='text-green-400' />
    case 'Yönetim':
      return <FaChartLine className='text-orange-400' />
    default:
      return <FaLightbulb className='text-yellow-400' />
  }
}

export default async function AdminDashboard () {
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

  const { data: projects } = await supabase
    .from('sivelor_ideas')
    .select('*')
    .order('id', { ascending: false })

  return (
    <div className='p-8 max-w-7xl mx-auto'>
      {/* BAŞLIK ALANI */}
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4'>
        <div>
          <h2 className='text-3xl font-bold admin-text-primary tracking-tight'>
            Yapılacaklar Listesi
          </h2>
          <p className='text-sm admin-text-secondary mt-1'>
            Sivelor geliştirme süreci ve fikir havuzu.
          </p>
        </div>
        <AddIdeaModal />
      </div>

      {/* KARTLAR */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects?.map((project: any) => (
          <div
            key={project.id}
            className='group admin-card rounded-2xl p-6 hover:border-blue-500/30 hover:bg-admin-bg-tertiary transition-all duration-300 relative overflow-hidden'
          >
            <div className='absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all'></div>

            <div className='flex justify-between items-start mb-4 relative z-10'>
              <div className='p-3 admin-bg-tertiary rounded-xl border border-admin-border-secondary group-hover:scale-110 transition-transform duration-300'>
                {getIcon(project.category)}
              </div>
              <div
                className={`text-[9px] font-bold px-2 py-1 rounded border uppercase tracking-wider
                  ${
                    project.priority === 'Kritik'
                      ? 'bg-red-900/20 text-red-400 border-red-500/20'
                      : project.priority === 'Yüksek'
                      ? 'bg-orange-900/20 text-orange-400 border-orange-500/20'
                      : 'admin-bg-tertiary admin-text-tertiary border-admin-border-secondary'
                  }`}
              >
                {project.priority}
              </div>
            </div>

            <h3 className='text-lg font-bold admin-text-primary mb-2 group-hover:text-blue-400 transition-colors'>
              {project.title}
            </h3>
            <p className='text-sm admin-text-secondary leading-relaxed mb-6 min-h-[60px] line-clamp-3'>
              {project.description}
            </p>

            <div className='flex items-center justify-between pt-4 border-t border-admin-border-primary'>
              <span className='text-[10px] admin-text-secondary font-medium uppercase tracking-wider flex items-center gap-1'>
                <span className='w-1.5 h-1.5 rounded-full bg-admin-text-tertiary'></span>{' '}
                {project.category}
              </span>
              <div className='flex items-center gap-1.5 text-[10px] font-bold'>
                {project.status === 'Planlanıyor' ? (
                  <FaClock className='text-yellow-500' />
                ) : (
                  <FaCheckCircle className='text-green-500' />
                )}
                <span
                  className={
                    project.status === 'Planlanıyor'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }
                >
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {(!projects || projects.length === 0) && (
          <div className='col-span-full py-20 text-center admin-text-secondary border border-dashed border-admin-border-primary rounded-2xl admin-bg-secondary'>
            Henüz bir proje fikri eklenmemiş. Sağ üstteki butondan
            ekleyebilirsiniz.
          </div>
        )}
      </div>
    </div>
  )
}
