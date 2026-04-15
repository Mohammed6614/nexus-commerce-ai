'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/storefront/ProductCard'
import { CartDrawer } from '@/components/storefront/CartDrawer'
import { Search, Sparkles } from 'lucide-react'

const storeProducts = [
  {
    id: 'p1',
    name: 'Nordic Smart Lamp',
    price: 79.99,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
    description: 'A modern lamp with touch controls, warm ambiance modes, and voice assistant support.',
  },
  {
    id: 'p2',
    name: 'Premium Leather Backpack',
    price: 149.0,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    description: 'Crafted from vegetable-tanned leather, built for travel with laptop protection and hidden pockets.',
  },
  {
    id: 'p3',
    name: 'Studio Noise Cancelling Headphones',
    price: 219.0,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=900&q=80',
    description: 'Immersive audio, long battery life, and premium comfort for long listening sessions.',
  },
  {
    id: 'p4',
    name: 'Ceramic Coffee Set',
    price: 48.5,
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=900&q=80',
    description: 'Minimalist ceramic set with matte finish and elegant storage box for luxury gifting.',
  },
  {
    id: 'p5',
    name: 'Performance Running Shoes',
    price: 119.99,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight, breathable trainers built for speed and comfort on every run.',
  },
  {
    id: 'p6',
    name: 'Organic Scented Candle Duo',
    price: 34.0,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
    description: 'Hand-poured candles with natural fragrances to make every room feel elevated.',
  },
]

const categories = ['All', 'Home', 'Accessories', 'Electronics', 'Kitchen', 'Fitness']

const themeStyles = {
  modern: {
    page: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
    card: 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white',
    accent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
    search: 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
  },
  luxury: {
    page: 'bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white',
    card: 'border-slate-800 bg-slate-950 text-white',
    accent: 'bg-amber-100 text-amber-900 dark:bg-amber-200/10 dark:text-amber-200',
    button: 'bg-amber-500 text-slate-950 hover:bg-amber-600',
    search: 'border-slate-700 bg-slate-900 text-slate-100',
  },
  dark: {
    page: 'bg-slate-950 text-white',
    card: 'border-slate-800 bg-slate-900 text-white',
    accent: 'bg-slate-800 text-slate-100',
    button: 'bg-slate-700 text-white hover:bg-slate-600',
    search: 'border-slate-700 bg-slate-900 text-slate-100',
  },
  playful: {
    page: 'bg-gradient-to-br from-rose-50 via-sky-50 to-lime-50 text-slate-900',
    card: 'border-slate-200 bg-white text-slate-900',
    accent: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-100/10 dark:text-fuchsia-100',
    button: 'bg-fuchsia-500 text-white hover:bg-fuchsia-600',
    search: 'border-slate-200 bg-white text-slate-900',
  },
}

const fonts = {
  inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  playfair: 'Playfair Display, Georgia, serif',
  montserrat: 'Montserrat, ui-sans-serif, system-ui, sans-serif',
}

export default function PreviewStorePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState<any[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const theme = searchParams?.get('theme') || 'modern'
  const primaryColor = searchParams?.get('color') || '#3b82f6'
  const font = searchParams?.get('font') || 'inter'
  const activeTheme = themeStyles[theme] ?? themeStyles.modern

  useEffect(() => {
    const savedCart = window.localStorage.getItem('nexus_store_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('nexus_store_cart', JSON.stringify(cart))
  }, [cart])

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.description?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [category, search])

  const handleAddToCart = (product: any) => {
    setCart((current) => {
      const existing = current.find((item: any) => item.id === product.id)
      if (existing) {
        return current.map((item: any) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...current, { ...product, quantity: 1 }]
    })
    setDrawerOpen(true)
  }

  const handleRemove = (id: string) => {
    setCart((current) => current.filter((item: any) => item.id !== id))
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className={`min-h-screen ${activeTheme.page}`} style={{ fontFamily: fonts[font] }}>
      <div className="container mx-auto px-4 py-10">
        <div className={`rounded-[2rem] border shadow-2xl backdrop-blur-xl p-8 ${activeTheme.card} border-opacity-60`}>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${activeTheme.accent}`}>
                <Sparkles className="w-4 h-4" />
                Demo Store Experience
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: theme === 'dark' || theme === 'luxury' ? '#ffffff' : '#0f172a' }}>
                Launch a premium shopping experience today.
              </h1>
              <p className={`mt-4 max-w-2xl text-lg leading-8 ${theme === 'dark' || theme === 'luxury' ? 'text-slate-300' : 'text-slate-600'}`}>
                Discover a curated collection of products, seamless cart flow, and checkout designed for ambitious brands.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className={activeTheme.button} onClick={() => setDrawerOpen(true)}>
                  View Cart {cartCount > 0 ? `(${cartCount})` : ''}
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/checkout')}>
                  Checkout Preview
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className={`rounded-3xl border p-6 ${activeTheme.card}`}>
                <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme === 'dark' || theme === 'luxury' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Fast Delivery
                </p>
                <p className={`mt-3 text-xl font-semibold ${theme === 'dark' || theme === 'luxury' ? 'text-white' : 'text-slate-900'}`}>
                  2-day shipping for premium orders
                </p>
              </div>
              <div className={`rounded-3xl border p-6 ${activeTheme.card}`}>
                <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme === 'dark' || theme === 'luxury' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Secure Checkout
                </p>
                <p className={`mt-3 text-xl font-semibold ${theme === 'dark' || theme === 'luxury' ? 'text-white' : 'text-slate-900'}`}>
                  Encrypted payments and trusted gateways
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={`text-sm uppercase tracking-[0.3em] ${theme === 'dark' || theme === 'luxury' ? 'text-slate-400' : 'text-slate-500'}`}>
                Curated Products
              </p>
              <h2 className={`mt-2 text-3xl font-bold ${theme === 'dark' || theme === 'luxury' ? 'text-white' : 'text-slate-900'}`}>
                Shop the collection
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  className={`w-full rounded-2xl border py-3 pl-11 pr-4 text-sm outline-none shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${activeTheme.search}`}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} accentColor={primaryColor} />
            ))}
          </div>
        </section>
      </div>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} items={cart} onRemove={handleRemove} onCheckout={handleCheckout} />
    </div>
  )
}
