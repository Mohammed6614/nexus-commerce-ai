'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { AuthProvider } from '@/components/providers/AuthProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="md:ml-64">
          <Header
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <main className="p-4 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
} 