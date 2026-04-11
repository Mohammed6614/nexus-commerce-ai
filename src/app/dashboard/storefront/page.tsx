'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Palette, Layout, Type, Eye, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function StorefrontPage() {
  const [theme, setTheme] = useState('modern')
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [font, setFont] = useState('inter')
  
  const themes = [
    { value: 'modern', label: 'Modern', preview: 'Clean and minimalist' },
    { value: 'luxury', label: 'Luxury', preview: 'Elegant and premium' },
    { value: 'dark', label: 'Dark', preview: 'Bold and dramatic' },
    { value: 'playful', label: 'Playful', preview: 'Colorful and fun' }
  ]
  
  const fonts = [
    { value: 'inter', label: 'Inter (Modern)' },
    { value: 'playfair', label: 'Playfair Display (Elegant)' },
    { value: 'montserrat', label: 'Montserrat (Clean)' }
  ]
  
  const handleSave = () => {
    toast.success('Store theme updated! Your store will reflect changes in 5 minutes.')
  }
  
  const handlePreview = () => {
    window.open('/preview-store', '_blank')
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text">Storefront Designer</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your store's look and feel
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Theme Selection */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Layout className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Theme</h2>
          </div>
          <div className="space-y-3">
            {themes.map((t) => (
              <label key={t.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  name="theme"
                  value={t.value}
                  checked={theme === t.value}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium">{t.label}</p>
                  <p className="text-sm text-gray-600">{t.preview}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>
        
        {/* Colors & Fonts */}
        <Card>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold">Colors</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded border cursor-pointer"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Type className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold">Typography</h2>
              </div>
              <Select
                label="Font Family"
                value={font}
                onChange={(e) => setFont(e.target.value)}
                options={fonts}
              />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Preview & Save */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Store
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Publish Changes
        </Button>
      </div>
      
      {/* Live Preview */}
      <Card>
        <h3 className="font-semibold mb-3">Live Preview</h3>
        <div className="border rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
              Your Store Name
            </h2>
            <p className="text-gray-600 mt-2">Beautiful products await you</p>
            <button
              className="mt-4 px-6 py-2 rounded-lg text-white transition"
              style={{ backgroundColor: primaryColor }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
} 