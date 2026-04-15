'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/helpers'

export default function CheckoutSuccessPage() {
  const params = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem('nexus_store_order')
    if (saved) {
      setOrder(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Order Complete</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Thank you for shopping with Nexus Commerce AI. Your order has been received and is being prepared.
          </p>
          {order && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Order summary</p>
              <p className="mt-3 text-lg font-semibold">Order ID: {order.orderId || orderId}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Order total: {formatCurrency(order.total)}</p>
              <div className="mt-4 space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/preview-store">
              <Button>Continue shopping</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Go to dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
