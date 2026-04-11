'use client'

import { useState } from 'react'
import { Plus, Sparkles, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { useProducts } from '@/hooks/useProducts'
import { motion } from 'framer-motion'

export default function ProductsPage() {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your inventory and let AI optimize your product listings
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any, index: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="relative group">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <div className="space-y-3">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${product.price}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category: {product.category}
                </p>
                {product.aiGenerated && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm italic">{product.aiGenerated}</p>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAIGenerate(product.id)}
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex gap-3 justify-end">
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