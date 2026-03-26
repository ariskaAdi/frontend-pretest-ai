'use client'

import * as React from 'react'
import { useGetMeQuery } from '@/queries/useUserQuery'

export function WelcomeBanner() {
  const { data: user } = useGetMeQuery()
  const [greeting, setGreeting] = React.useState('Selamat siang')

  React.useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 11) setGreeting('Selamat pagi')
    else if (hour < 15) setGreeting('Selamat siang')
    else if (hour < 19) setGreeting('Selamat sore')
    else setGreeting('Selamat malam')
  }, [])

  if (!user) return null

  return (
    <div className="relative overflow-hidden bg-primary rounded-3xl p-8 mb-8 shadow-lg shadow-primary/20 group">
      {/* Pattern decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-12 -translate-y-8 group-hover:translate-x-8 group-hover:-translate-y-4 transition-transform duration-700 pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="120" r="100" stroke="white" strokeWidth="40" />
          <path d="M40 40L200 200" stroke="white" strokeWidth="20" />
        </svg>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            {greeting}, {user.name}! <span className="inline-block animate-bounce-slow">👋</span>
          </h2>
          <p className="text-primary-light/90 text-lg font-medium leading-relaxed">
            Senang melihatmu kembali. Mari lanjutkan perjalanan belajarmu hari ini dan taklukkan tantangan baru!
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4">
             <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 group/item hover:bg-white/20 transition-colors">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-semibold text-white">Status: Aktif</span>
             </div>
             <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 group/item hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-light"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                <span className="text-sm font-semibold text-white">Target: 3 Modul/Minggu</span>
             </div>
          </div>
        </div>
        
        <div className="flex shrink-0">
          <button className="bg-white text-primary font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
            Mulai Belajar
          </button>
        </div>
      </div>
    </div>
  )
}
