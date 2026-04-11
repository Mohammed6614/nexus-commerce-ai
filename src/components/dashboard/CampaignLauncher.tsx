'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Rocket, ShoppingBag, Search, Camera } from 'lucide-react'
import { toast } from 'sonner'

interface CampaignLauncherProps {
  dailyBudget: number
  selectedProduct: string
  onProductChange: (productId: string) => void
  onCampaignLaunched?: () => void
}

export function CampaignLauncher({ dailyBudget, selectedProduct, onProductChange, onCampaignLaunched }: CampaignLauncherProps) {
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState('meta')
  const [products, setProducts] = useState<any[]>([])
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products')
    }
  }
  
  const handleLaunch = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/ads/create-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          dailyBudget,
          platform
        })
      })
      
      if (response.ok) {
        toast.success(`Campaign launched on ${platform === 'meta' ? 'Facebook & Instagram' : 'Google Ads'}!`)
        onCampaignLaunched?.()
      } else {
        toast.error('Failed to launch campaign')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold">Launch AI Campaign</h2>
        </div>
        
        <Select
          label="Select Product"
          value={selectedProduct}
          onChange={(e) => onProductChange(e.target.value)}
          options={[
            { value: '', label: 'Choose a product...' },
            ...products.map(p => ({ value: p.id, label: p.name }))
          ]}
        />
        
        <div className="flex gap-4">
          <button
            onClick={() => setPlatform('meta')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              platform === 'meta'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-semibold">Meta Ads</p>
            <p className="text-xs text-gray-600">Facebook + Instagram</p>
          </button>
          
          <button
            onClick={() => setPlatform('google')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              platform === 'google'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Search className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold">Google Ads</p>
            <p className="text-xs text-gray-600">Search + Shopping</p>
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-4 rounded-xl">
          <p className="text-sm font-semibold mb-2">What happens next?</p>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <li>✨ AI generates ad creatives and copy</li>
            <li>🎯 Auto-targets best audience for your product</li>
            <li>💰 Optimizes budget in real-time for maximum ROAS</li>
            <li>📊 You'll see results within 24 hours</li>
          </ul>
        </div>
        
        <Button onClick={handleLaunch} loading={loading} className="w-full">
          <Rocket className="w-4 h-4 mr-2" />
          Launch AI Campaign
        </Button>
      </div>
    </Card>
  )
}
