'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { useProducts } from '@/hooks/useProducts'
import { motion } from 'framer-motion'

export default function ProductsPage() {
  const router = useRouter()
  const { products, loading, addProduct, generateAI } = useProducts()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addProduct(newProduct)
    setIsDialogOpen(false)
    setNewProduct({ name: '', price: '', category: '', imageUrl: '' })
  }

  const handleAIGenerate = async (productId: string) => {
    await generateAI(productId)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold gradient-text">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 leading-7">
            Build a professional catalog with product details, inventory control, and AI-powered descriptions for every item.
          </p>
        </div>

        <div className="flex items-center justify-start sm:justify-end">
          <Button className="w-full sm:w-auto" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product: any, index: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="h-full"
          >
            <Card hover className="group h-full flex flex-col overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-52 sm:h-56 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-52 sm:h-56 rounded-xl bg-slate-100 dark:bg-slate-900 mb-4 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  No image available
                </div>
              )}

              <div className="flex-1 space-y-4 min-h-[220px]">
                <div>
                  <h3 className="text-xl font-semibold">{product.name || 'Untitled Product'}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {product.category || 'General'} • SKU {product.sku || '0000'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${product.price ?? '0.00'}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-900/20 dark:text-emerald-200">
                    {product.stock ?? 12} in stock
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {product.description || 'A polished product description helps customers understand what makes this item special.'}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button size="sm" onClick={() => handleAIGenerate(product.id)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Description
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/products/${product.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {!loading && products.length === 0 && (
          <Card className="col-span-full p-8 bg-slate-50 dark:bg-slate-900 text-center">
            <h2 className="text-2xl font-semibold">Start your catalog</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Add products, upload imagery, and create a storefront that looks like a modern commerce brand.
            </p>
            <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
              Add your first product
            </Button>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="mx-4 sm:mx-auto w-full max-w-lg rounded-[32px] bg-white/95 dark:bg-slate-950/95 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-900/10 backdrop-blur-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a product profile and bring your catalog to life.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <Input
              label="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
            <Input
              label="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <Input
              label="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              required
            />
            <Input
              label="Image URL"
              value={newProduct.imageUrl}
              onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  )
}
