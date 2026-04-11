'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Edit, Trash2, Sparkles, Eye } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/helpers'
import { toast } from 'sonner'

interface ProductTableProps {
  products: any[]
  onRefresh: () => void
}

export function ProductTable({ products, onRefresh }: ProductTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setDeleting(id)
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      toast.success('Product deleted')
      onRefresh()
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }
  
  const handleAIGenerate = async (id: string) => {
    toast.loading('AI is generating content...')
    try {
      await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      })
      toast.success('AI content generated!')
      onRefresh()
    } catch (error) {
      toast.error('Generation failed')
    }
  }
  
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <Card key={product.id}>
          <div className="flex items-center gap-4">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
            )}
            
            <div className="flex-1">
              <Link href={`/dashboard/products/${product.id}`}>
                <h3 className="font-semibold hover:text-blue-600">{product.name}</h3>
              </Link>
              <p className="text-sm text-gray-600">{product.category}</p>
              {product.aiGenerated && (
                <p className="text-xs text-blue-600 mt-1">✨ AI Enhanced</p>
              )}
            </div>
            
            <div className="text-right">
              <p className="font-bold">{formatCurrency(product.price)}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => handleAIGenerate(product.id)}>
                <Sparkles className="w-4 h-4" />
              </Button>
              <Link href={`/dashboard/products/${product.id}`}>
                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)} loading={deleting === product.id}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 