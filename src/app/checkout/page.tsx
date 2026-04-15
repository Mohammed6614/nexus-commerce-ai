'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency, generateOrderNumber } from '@/lib/utils/helpers'

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [orderCreating, setOrderCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const saved = window.localStorage.getItem('nexus_store_cart')
    if (saved) {
      setCart(JSON.parse(saved))
    }
  }, [])

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const handlePlaceOrder = () => {
    if (!name || !email || !address || !city || !zip || cart.length === 0) {
      return
    }
    setOrderCreating(true)
    const orderId = generateOrderNumber()
    window.localStorage.setItem('nexus_store_order', JSON.stringify({ orderId, name, email, total, items: cart }))
    window.localStorage.removeItem('nexus_store_cart')
    setTimeout(() => {
      setOrderCreating(false)
      router.push(`/checkout/success?order=${orderId}`)
    }, 800)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">No items in cart</p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Your shopping cart is empty</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Add items from the store to see the full checkout experience.</p>
            <Link href="/preview-store">
              <Button className="mt-8">Back to Store</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/preview-store" className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" /> Back to store
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-950">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Shipping details</p>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Complete your order</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input label="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input label="ZIP / Postal Code" value={zip} onChange={(e) => setZip(e.target.value)} />
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Order Summary</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{formatCurrency(total)}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Includes shipping estimates and taxes.</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Payment methods</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['Visa', 'Mastercard', 'Apple Pay'].map((method) => (
                  <div key={method} className="rounded-2xl border border-slate-300 bg-white p-4 text-center text-sm dark:border-slate-700 dark:bg-slate-950">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Order details</p>
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span>{formatCurrency(9.99)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Estimated tax</span>
                  <span>{formatCurrency(total * 0.08)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-lg font-semibold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatCurrency(total + 9.99 + total * 0.08)}</span>
                </div>
              </div>

              <Button className="mt-6 w-full" onClick={handlePlaceOrder} loading={orderCreating}>
                {orderCreating ? 'Placing order...' : 'Place Order'}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
