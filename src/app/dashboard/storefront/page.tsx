'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Palette, Layout, Type, Eye, Save } from 'lucide-react'
import { toast } from 'sonner'

const previewProducts = [
  {
    name: 'Velvet Travel Bag',
    price: '129.00',
    category: 'Accessories',
    label: 'Best seller',
  },
  {
    name: 'Smart Home Speaker',
    price: '89.99',
    category: 'Electronics',
    label: 'New arrival',
  },
  {
    name: 'Luxury Candle Set',
    price: '42.00',
    category: 'Home',
    label: 'Featured',
  },
]

const themes = [
  { value: 'modern', label: 'Modern', preview: 'Calm, clean, and conversion-focused', className: 'bg-white text-slate-900', accent: 'from-slate-100 to-slate-50', buttonText: 'text-slate-900' },
  { value: 'luxury', label: 'Luxury', preview: 'Elegant styling for premium products', className: 'bg-slate-950 text-white', accent: 'from-slate-900 to-slate-950', buttonText: 'text-white' },
  { value: 'dark', label: 'Dark', preview: 'Bold visuals with strong contrast', className: 'bg-slate-900 text-white', accent: 'from-slate-950 to-slate-900', buttonText: 'text-white' },
  { value: 'playful', label: 'Playful', preview: 'Bright, friendly and energetic', className: 'bg-slate-50 text-slate-900', accent: 'from-rose-50 to-sky-50', buttonText: 'text-slate-900' },
]

const fonts = [
  { value: 'inter', label: 'Inter (Modern)', family: 'Inter, ui-sans-serif, system-ui, sans-serif' },
  { value: 'playfair', label: 'Playfair Display (Elegant)', family: 'Playfair Display, Georgia, serif' },
  { value: 'montserrat', label: 'Montserrat (Clean)', family: 'Montserrat, ui-sans-serif, system-ui, sans-serif' },
]

export default function StorefrontPage() {
  const [theme, setTheme] = useState('modern')
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  const [font, setFont] = useState('inter')

  const selectedTheme = useMemo(() => themes.find((item) => item.value === theme) ?? themes[0], [theme])
  const selectedFont = useMemo(() => fonts.find((item) => item.value === font) ?? fonts[0], [font])

  const handleSave = () => {
    toast.success('Store design saved. Your storefront is ready for launch.')
  }

  const handlePreview = () => {
    const params = new URLSearchParams({ theme, color: primaryColor, font })
    window.open(`/preview-store?${params.toString()}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold gradient-text">Storefront Designer</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-7">
          Create a shopping experience that feels real, polished, and ready for customers across every screen size.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Layout className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold">Theme</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose the visual style that matches your brand.</p>
              </div>
            </div>
            <div className="space-y-3">
              {themes.map((t) => (
                <label
                  key={t.value}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-2xl cursor-pointer transition ${theme === t.value ? 'border-blue-500 bg-slate-100 dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <div className="flex items-center gap-3">
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t.preview}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-bold">Branding</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Set your store color and typography.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded border cursor-pointer"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#3b82f6" />
                </div>
              </div>
              <Select label="Font Family" value={font} onChange={(e) => setFont(e.target.value)} options={fonts} />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Store
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Publish Changes
        </Button>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Live Store Preview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                A real storefront experience built for shopping and discovery.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              {selectedTheme.label} theme • {selectedFont.label}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className={`rounded-3xl border p-6 ${selectedTheme.className} border-slate-200 dark:border-slate-700`} style={{ fontFamily: selectedFont.family }}>
              <div className={`rounded-[32px] p-6 bg-gradient-to-br ${selectedTheme.accent}`}>
                <div>
                  <p className={`text-sm uppercase tracking-[.2em] ${theme === 'dark' || theme === 'luxury' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Featured collection
                  </p>
                  <h3 className="mt-3 text-3xl font-bold" style={{ color: primaryColor }}>
                    Elevate every purchase
                  </h3>
                  <p className={`mt-3 text-sm leading-7 ${theme === 'dark' || theme === 'luxury' ? 'text-slate-300' : 'text-slate-600'}`}>
                    A premium storefront experience with fast checkout, polished product presentation, and trust-building details that convert.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button style={{ backgroundColor: primaryColor, borderColor: primaryColor, color: selectedTheme.buttonText }}>
                      Shop Now
                    </Button>
                    <Button variant="outline">View Collection</Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {previewProducts.map((product) => (
                  <div key={product.name} className={`rounded-3xl border p-4 ${theme === 'dark' || theme === 'luxury' ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>
                    <p className="text-xs uppercase tracking-[.2em] text-slate-500 dark:text-slate-400">{product.category}</p>
                    <h4 className="mt-3 font-semibold">{product.name}</h4>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{product.label}</p>
                    <p className="mt-3 text-xl font-bold" style={{ color: primaryColor }}>${product.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl border p-6 ${theme === 'dark' || theme === 'luxury' ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`} style={{ fontFamily: selectedFont.family }}>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[.2em] text-slate-500 dark:text-slate-400">Store performance</p>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">Live</span>
                  </div>
                  <div className="mt-5 space-y-4">
                    <Metric label="Conversion rate" value="5.4%" />
                    <Metric label="Average order" value="$98.30" />
                    <Metric label="Visitor growth" value="+24%" />
                  </div>
                </div>
                <div className={`rounded-3xl border border-dashed p-4 ${theme === 'dark' || theme === 'luxury' ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <p className="text-sm font-semibold">Ready to publish</p>
                  <p className="text-sm mt-2 ${theme === 'dark' || theme === 'luxury' ? 'text-slate-300' : 'text-gray-500'}">Complete your theme selection and launch a storefront that feels like a real e-commerce destination.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}
