'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { OrderList } from '@/components/dashboard/OrderList'
import { Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }
  
  const filteredOrders = orders.filter((order: any) =>
    order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and track all customer orders
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by order # or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>
      
      {/* Orders Table */}
      <OrderList orders={filteredOrders} loading={loading} />
    </div>
  )
} 