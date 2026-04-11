'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Sparkles, ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  useEffect(() => {
    fetchProduct()
  }, [params.id])
  
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      if (response.ok) {
        toast.success('Product updated successfully')
      }
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }
  
  const generateAIContent = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id })
      })
      const data = await response.json()
      setProduct({ ...product, aiGenerated: data.description })
      toast.success('AI content generated!')
    } catch (error) {
      toast.error('Generation failed')
    } finally {
      setGenerating(false)
    }
  }
  
  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold gradient-text">Edit Product</h1>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Info */}
        <Card>
          <div className="space-y-4">
            <Input
              label="Product Name"
              value={product?.name || ''}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
            
            <Input
              label="Price"
              type="number"
              value={product?.price || ''}
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            />
            
            <Input
              label="Category"
              value={product?.category || ''}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            />
            
            <Input
              label="Stock Quantity"
              type="number"
              value={product?.stock || 0}
              onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
            />
            
            <Input
              label="Image URL"
              value={product?.imageUrl || ''}
              onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
            />
          </div>
        </Card>
        
        {/* AI Content */}
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-semibold">AI Generated Description</label>
              <Button size="sm" onClick={generateAIContent} loading={generating}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>
            
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[200px]"
              value={product?.aiGenerated || ''}
              onChange={(e) => setProduct({ ...product, aiGenerated: e.target.value })}
              placeholder="AI will generate a compelling product description..."
            />
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">🤖 AI Optimization Tips</p>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Add high-quality images to improve CTR by up to 40%</li>
                <li>• Keep price competitive in your category</li>
                <li>• AI will automatically target the right audience</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
} 