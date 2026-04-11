'use client'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { AuthProvider } from '@/components/providers/AuthProvider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Sidebar />
        <div className="ml-64">
          <Header />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
} 