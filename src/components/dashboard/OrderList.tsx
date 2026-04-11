'use client'

import { Card } from '@/components/ui/Card'
import { Eye, Package, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils/helpers'

interface OrderListProps {
  orders: any[]
  loading: boolean
}

export function OrderList({ orders, loading }: OrderListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>
  }
  
  if (orders.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-gray-600">When you get your first order, it will appear here</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id} hover>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="font-semibold">#{order.orderNumber}</p>
              <p className="text-sm text-gray-600">{order.customerName}</p>
              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            
            <div className="text-center">
              <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
} 