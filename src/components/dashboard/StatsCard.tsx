'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && (
              <p className="text-xs text-green-600 mt-1">
                ↑ {trend} from last week
              </p>
            )}
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 