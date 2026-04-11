'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/helpers'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: any[]
  onRemove: (id: string) => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, items, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full py-3 rounded-xl font-semibold text-white transition"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 