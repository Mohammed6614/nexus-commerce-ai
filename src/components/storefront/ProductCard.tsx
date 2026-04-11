'use client'

import { useState } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/helpers'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
    description?: string
  }
  onAddToCart: (product: any) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
          {formatCurrency(product.price)}
        </p>
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white'
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
} 