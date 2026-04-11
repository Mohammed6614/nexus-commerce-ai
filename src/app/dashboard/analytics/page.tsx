'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Target,
  Calendar,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchAnalytics()
  }, [period])
  
  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?period=${period}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div className="flex justify-center py-12">Loading analytics...</div>
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your store performance metrics simplified
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' }
            ]}
          />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${data?.summary?.totalRevenue?.toLocaleString() || 0}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Total Orders"
          value={data?.summary?.totalOrders || 0}
          icon={<ShoppingBag className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="ROAS"
          value={`${data?.summary?.roas || 0}x`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Net Profit"
          value={`$${data?.summary?.profit?.toLocaleString() || 0}`}
          icon={<Target className="w-6 h-6" />}
          color="orange"
        />
      </div>
      
      {/* Chart */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Revenue & Orders Trend</h2>
        <AnalyticsChart data={data?.dailyData} />
      </Card>
      
      {/* Campaign Performance */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Campaign Performance</h2>
        <div className="space-y-3">
          {data?.campaigns?.map((campaign: any, i: number) => (
            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="font-semibold">{campaign.name}</p>
                <p className="text-sm text-gray-600">Spent: ${campaign.spent}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">${campaign.sales}</p>
                <p className="text-sm">ROAS: {(campaign.sales / campaign.spent).toFixed(1)}x</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, icon, color }: any) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-green-500/10 text-green-600',
    purple: 'bg-purple-500/10 text-purple-600',
    orange: 'bg-orange-500/10 text-orange-600'
  }
  
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
} 