'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Bell, Search, User, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/Input'

export function Header() {
  const { data: session } = useSession()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const tenantId = session?.user?.tenantId
    if (!tenantId) {
      setProfilePhoto('')
      return
    }

    const fetchProfileSettings = async () => {
      try {
        const response = await fetch(`/api/store/${tenantId}/settings`)
        const data = await response.json()
        setProfilePhoto(data?.data?.profilePhoto || '')
      } catch {
        setProfilePhoto('')
      }
    }

    fetchProfileSettings()
  }, [session?.user?.tenantId])

  const userName = session?.user?.name || 'John Doe'
  const userEmail = session?.user?.email || 'john@example.com'
  const userInitial = userName?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || 'A'

  const currentTheme = mounted ? resolvedTheme : theme
  const isDark = currentTheme === 'dark'

  const renderThemeIcon = () => {
    if (!mounted) {
      return <Sun className="w-5 h-5 opacity-0" />
    }
    return isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
  }

  return (
    <header className="sticky top-0 z-40 glass-morphism border-b border-white/20">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search products, orders..."
            icon={<Search className="w-4 h-4" />}
            className="bg-white/50 dark:bg-black/20"
          />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
            <Bell className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            {renderThemeIcon()}
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
              )}
              <User className="w-5 h-5" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-morphism rounded-xl shadow-lg overflow-hidden slide-in">
                <div className="p-3 border-b border-white/20">
                  <p className="font-semibold">{userName}</p>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 