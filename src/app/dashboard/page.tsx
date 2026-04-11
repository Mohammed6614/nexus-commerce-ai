'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { Card } from '@/components/ui/Card'
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Users,
  Zap,
  Target
} from 'lucide-react'

export default function DashboardHome() {
  const { data: session, status } = useSession()
  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    storeEmail: '',
    phoneNumber: '',
    address: '',
    profilePhoto: ''
  })
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    roas: 0,
    visitors: 0
  })
  const [trends, setTrends] = useState({
    revenue: '+0%',
    orders: '+0%',
    roas: '+0%',
    visitors: '+0%'
  })
  const [insights, setInsights] = useState({
    bestProductName: '',
    bestCampaignName: '',
    bestCampaignRoas: 0,
    topCategory: ''
  })
  const [chartData, setChartData] = useState([])
  
  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])
  
  useEffect(() => {
    const tenantId = session?.user?.tenantId
    if (status !== 'authenticated' || !tenantId) return

    const fetchStoreInfo = async () => {
      try {
        const response = await fetch(`/api/store/${tenantId}/settings`)
        const data = await response.json()
        if (!data.success) return

        setStoreInfo({
          storeName: data.data.storeName || session.user.name || '',
          storeEmail: data.data.storeEmail || session.user.email || '',
          phoneNumber: data.data.phoneNumber || '',
          address: data.data.address || '',
          profilePhoto: data.data.profilePhoto || ''
        })
      } catch (error) {
        console.error('Failed to load store info', error)
      }
    }

    fetchStoreInfo()
  }, [session?.user?.tenantId, status])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics?period=7d')
      const data = await response.json()

      if (data.error) {
        console.error('Analytics API returned error', data.error)
        return
      }

      setStats({
        revenue: data.summary?.totalRevenue || 0,
        orders: data.summary?.totalOrders || 0,
        roas: Number(data.summary?.roas || 0),
        visitors: data.summary?.visitors || 0
      })
      setTrends({
        revenue: data.trends?.revenue || '+0%',
        orders: data.trends?.orders || '+0%',
        roas: data.trends?.roas || '+0%',
        visitors: data.trends?.visitors || '+0%'
      })
      setInsights({
        bestProductName: data.insights?.bestProductName || '',
        bestCampaignName: data.insights?.bestCampaignName || '',
        bestCampaignRoas: data.insights?.bestCampaignRoas || 0,
        topCategory: data.insights?.topCategory || ''
      })
      setChartData(data.dailyData || [])
    } catch (error) {
      console.error('Failed to load dashboard stats', error)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text">
          {storeInfo.storeName ? `${storeInfo.storeName} Dashboard` : 'Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {storeInfo.storeName
            ? `Welcome back to ${storeInfo.storeName}. Your AI-powered store performance at a glance.`
            : 'Your AI-powered store performance at a glance'}
        </p>
        {storeInfo.storeEmail && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <h3 className="text-sm uppercase tracking-wide text-gray-500">Store</h3>
              <p className="mt-2 text-lg font-semibold">{storeInfo.storeName}</p>
            </Card>
            <Card>
              <h3 className="text-sm uppercase tracking-wide text-gray-500">Email</h3>
              <p className="mt-2 text-lg font-semibold break-all">{storeInfo.storeEmail}</p>
            </Card>
            <Card>
              <h3 className="text-sm uppercase tracking-wide text-gray-500">Phone</h3>
              <p className="mt-2 text-lg font-semibold">{storeInfo.phoneNumber || 'Not set'}</p>
            </Card>
            <Card>
              <h3 className="text-sm uppercase tracking-wide text-gray-500">Address</h3>
              <p className="mt-2 text-lg font-semibold">{storeInfo.address || 'Not set'}</p>
            </Card>
          </div>
        )}
      </div>
      
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend={trends.revenue}
        />
        <StatsCard
          title="Orders"
          value={stats.orders.toString()}
          icon={<ShoppingBag className="w-6 h-6" />}
          trend={trends.orders}
        />
        <StatsCard
          title="ROAS"
          value={`${stats.roas.toFixed(2)}x`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={trends.roas}
        />
        <StatsCard
          title="Store Visitors"
          value={stats.visitors.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
          trend={trends.visitors}
        />
      </div>
      
      {/* AI Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold">AI Marketing Insights</h2>
          </div>
          <div className="space-y-3">
            {insights.bestProductName ? (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm">
                  🤖 Your best performing product is <span className="font-semibold">{insights.bestProductName}</span>, generating <span className="font-semibold">{insights.bestCampaignRoas.toFixed(2)}x</span> ROAS in recent campaigns.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm">
                  🤖 No product sales yet. Add products and launch a campaign to generate the first insight.
                </p>
              </div>
            )}

            {insights.topCategory ? (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm">
                  📈 Your top category is <span className="font-semibold">{insights.topCategory}</span>. Focus your next campaign on this segment to boost conversions.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm">
                  📈 No category insights available yet. Start selling products and collecting order data to power smart recommendations.
                </p>
              </div>
            )}
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              🚀 Launch AI Campaign for New Products
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              📊 Generate Weekly Performance Report
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
              🎨 AI Generate Store Banner Images
            </button>
          </div>
        </Card>
      </div>
      
      {/* Analytics Chart */}
      <Card>
        <h2 className="text-xl font-bold mb-4">7-Day Performance</h2>
        <AnalyticsChart data={chartData} />
      </Card>
    </div>
  )
} 