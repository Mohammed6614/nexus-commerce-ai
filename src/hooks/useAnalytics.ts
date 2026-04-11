import { useState, useEffect } from 'react'

interface AnalyticsData {
  summary: {
    totalRevenue: number
    totalOrders: number
    totalAdSpend: number
    totalSales: number
    roas: number
    profit: number
    averageOrderValue: number
  }
  dailyData: Array<{
    date: string
    revenue: number
    orders: number
  }>
  campaigns: Array<any>
}

export function useAnalytics(period: '7d' | '30d' | '90d' = '30d') {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchAnalytics()
  }, [period])
  
  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?period=${period}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return { data, loading, error, refetch: fetchAnalytics }
} 