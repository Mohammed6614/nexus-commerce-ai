'use client'

import { useState, useEffect } from 'react'
import { CampaignLauncher } from '@/components/dashboard/CampaignLauncher'
import { BudgetSlider } from '@/components/dashboard/BudgetSlider'
import { Card } from '@/components/ui/Card'
import { Target, DollarSign, TrendingUp, Clock } from 'lucide-react'

export default function MarketingPage() {
  const [dailyBudget, setDailyBudget] = useState(50)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    roas: 0,
    visitors: 0,
    conversionRate: 0
  })
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    fetchMarketingData()
  }, [])

  const fetchMarketingData = async () => {
    await Promise.all([fetchAnalytics(), fetchCampaigns()])
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?period=7d')
      const data = await response.json()
      if (data.error) return

      const visitors = data.summary?.visitors || 0
      const orders = data.summary?.totalOrders || 0
      setStats({
        revenue: data.summary?.totalRevenue || 0,
        orders,
        roas: Number(data.summary?.roas || 0),
        visitors,
        conversionRate: visitors > 0 ? orders / visitors : 0
      })
    } catch (error) {
      console.error('Failed to load marketing analytics', error)
    }
  }

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/ads/performance')
      const data = await response.json()
      if (data.error) return
      setCampaigns(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load campaigns', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text">AI Marketing</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Let our AI run your ads. Set a budget, choose a product, and watch sales grow.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget Control */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Daily Budget</h2>
          </div>
          <BudgetSlider value={dailyBudget} onChange={setDailyBudget} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            AI will optimize spending across best-performing platforms
          </p>
        </Card>

        {/* Quick Stats */}
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.roas.toFixed(2)}x</div>
              <div className="text-sm text-gray-600">Avg. ROAS</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{(stats.conversionRate * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Campaign Launcher */}
      <CampaignLauncher 
        dailyBudget={dailyBudget}
        selectedProduct={selectedProduct}
        onProductChange={setSelectedProduct}
        onCampaignLaunched={fetchCampaigns}
      />

      {/* Active Campaigns */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Active Campaigns</h2>
        <div className="space-y-3">
          {campaigns.length > 0 ? (
            campaigns.map((campaign, i) => (
              <div key={campaign.id || i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl gap-3">
                <div>
                  <p className="font-semibold">{campaign.name || campaign.product?.name || 'Campaign'}</p>
                  <p className="text-sm text-gray-600">Platform: {campaign.platform === 'google' ? 'Google Ads' : 'Meta Ads'}</p>
                  <p className="text-sm text-gray-600">Status: {campaign.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${campaign.sales ?? 0}</p>
                  <p className="text-sm">Spent: ${campaign.spent ?? 0}</p>
                  <p className="text-sm">ROAS: {campaign.roas ? `${campaign.roas.toFixed(1)}x` : '0.0x'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              No active campaigns yet. Launch your first AI campaign to see real performance metrics here.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 