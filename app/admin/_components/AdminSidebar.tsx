// @/app/admin/_components/AdminSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FaLayerGroup,
  FaPalette,
  FaTasks,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSun,
  FaMoon
} from 'react-icons/fa'
import { Montserrat } from 'next/font/google'
import { signOut } from '../actions'
import { ThemeToggle, useTheme } from '../ThemeProvider'

const logoFont = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300']
})

const MENU_ITEMS = [
  { name: 'Yapılacaklar', path: '/admin/dashboard', icon: <FaTasks /> },
  { name: 'Dizgi', path: '/admin/dizgi', icon: <FaLayerGroup /> },
  { name: 'Renk', path: '/admin/renk', icon: <FaPalette /> }
]

export default function AdminSidebar ({ userEmail }: { userEmail: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <aside
      className={`h-screen admin-main-sidebar flex flex-col justify-between shrink-0 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${logoFont.className}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className='absolute -right-3 top-13 w-6 h-6 bg-white border border-admin-border-primary
         rounded-full flex items-center justify-center text-[0.75rem] 
         admin-text-primary z-50 hover:bg-admin-border-primary transition-all shadow-xl'
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div
        className={`h-16 flex items-center border-b border-admin-border-primary admin-bg-primary overflow-hidden ${
          isCollapsed ? 'justify-center' : 'px-8'
        }`}
      >
        {!isCollapsed ? (
          <div className='flex flex-col'>
            <h1 className='text-lg font-light admin-text-primary tracking-[0.3em] uppercase leading-none bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent italic'>
              SIVELOR
            </h1>
          </div>
        ) : (
          <span className='text-xl font-thin admin-text-primary italic'>S</span>
        )}
      </div>

      <nav className='flex-1 py-8 px-4 space-y-2 overflow-hidden'>
        {MENU_ITEMS.map(item => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              title={item.name}
              className={`flex items-center rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group
                ${
                  isActive
                    ? 'bg-admin-bg-tertiary admin-text-primary border border-admin-border-primary'
                    : 'admin-text-tertiary hover:bg-admin-bg-tertiary hover:admin-text-primary'
                }
                ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-4'}`}
            >
              <span
                className={`text-lg ${
                  isActive
                    ? 'admin-text-primary'
                    : 'admin-text-tertiary group-hover:admin-text-primary'
                }`}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div
        className={`p-4 border-t border-admin-border-primary admin-bg-primary ${
          isCollapsed ? 'items-center space-y-2' : 'space-y-3'
        }`}
      >
        {/* Theme Toggle Button */}
        <div
          className={`flex ${
            isCollapsed ? 'justify-center' : 'justify-between items-center'
          }`}
        >
          {!isCollapsed && (
            <span className='text-[9px] admin-text-tertiary uppercase tracking-[0.2em] font-bold'>
              Tema
            </span>
          )}
          <ThemeToggle />
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className='pt-2 border-t border-admin-border-primary'>
            <p className='text-[10px] admin-text-secondary truncate mb-1'>
              {userEmail}
            </p>
            <p className='text-[8px] admin-text-tertiary uppercase tracking-[0.2em]'>
              Admin Panel
            </p>
          </div>
        )}

        {/* Logout Button */}
        <form action={signOut} className={`${isCollapsed ? 'mt-2' : ''}`}>
          <button
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl admin-text-tertiary hover:text-red-500 transition-all text-[9px] font-bold uppercase tracking-[0.3em] ${
              isCollapsed ? '' : 'hover:bg-red-900/5'
            }`}
          >
            <FaSignOutAlt /> {!isCollapsed && 'Session Exit'}
          </button>
        </form>
      </div>
    </aside>
  )
}
