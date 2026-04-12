'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Megaphone,
  BarChart3,
  Settings,
  Store,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils/helpers'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: ShoppingBag, label: 'Orders', href: '/dashboard/orders' },
  { icon: Megaphone, label: 'Marketing', href: '/dashboard/marketing' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Store, label: 'Storefront', href: '/dashboard/storefront' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full w-64 glass-morphism z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold gradient-text">Nexus AI</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">E-Commerce OS</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : 'hover:bg-white/10 text-gray-700 dark:text-gray-300'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
} 