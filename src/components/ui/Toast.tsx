'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  }
  
  const backgrounds = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${backgrounds[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-black/5 rounded">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
} 