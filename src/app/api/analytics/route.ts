import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30d'
    
    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const orders = await prisma.order.findMany({
      where: {
        tenantId: session.user.tenantId,
        createdAt: { gte: startDate }
      }
    })

    const campaigns = await prisma.campaign.findMany({
      where: {
        tenantId: session.user.tenantId,
        createdAt: { gte: startDate }
      }
    })

    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - days)

    const previousOrders = await prisma.order.findMany({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      }
    })

    const previousCampaigns = await prisma.campaign.findMany({
      where: {
        tenantId: session.user.tenantId,
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      }
    })

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          tenantId: session.user.tenantId,
          createdAt: { gte: startDate }
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const totalAdSpend = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
    const totalSales = campaigns.reduce((sum, campaign) => sum + campaign.sales, 0)
    const roas = totalAdSpend > 0 ? totalSales / totalAdSpend : 0
    const visitors = Math.max(
      Math.floor(totalOrders * 22 + totalAdSpend * 1.2),
      Math.floor(totalSales * 7),
      0
    )

    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const previousOrdersCount = previousOrders.length
    const previousAdSpend = previousCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
    const previousSales = previousCampaigns.reduce((sum, campaign) => sum + campaign.sales, 0)
    const previousRoas = previousAdSpend > 0 ? previousSales / previousAdSpend : 0
    const previousVisitors = Math.max(
      Math.floor(previousOrdersCount * 22 + previousAdSpend * 1.2),
      Math.floor(previousSales * 7),
      0
    )

    const formatTrend = (current: number, previous: number) => {
      if (previous === 0) {
        return current === 0 ? '0%' : '+100%'
      }
      const diff = current - previous
      const percent = ((diff / previous) * 100).toFixed(0)
      return `${diff >= 0 ? '+' : ''}${percent}%`
    }

    const productRevenueMap = orderItems.reduce((map, item) => {
      if (!item.product) return map
      const key = item.product.id
      const existing = map[key] || {
        name: item.product.name,
        category: item.product.category,
        revenue: 0,
        quantity: 0
      }
      existing.revenue += item.price * item.quantity
      existing.quantity += item.quantity
      map[key] = existing
      return map
    }, {} as Record<string, { name: string; category: string; revenue: number; quantity: number }>)

    const productList = Object.values(productRevenueMap)
    const bestProduct = productList.sort((a, b) => b.revenue - a.revenue)[0] || null
    const categoryCounts = productList.reduce((map, product) => {
      map[product.category] = (map[product.category] || 0) + product.quantity
      return map
    }, {} as Record<string, number>)
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

    const bestCampaign = campaigns.sort((a, b) => (b.roas || 0) - (a.roas || 0))[0] || null

    const dailyData = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === date.toDateString()
      )
      
      dailyData.unshift({
        date: date.toISOString().split('T')[0],
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length
      })
    }
    
    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders,
        totalAdSpend,
        totalSales,
        roas: parseFloat(roas.toFixed(2)),
        visitors,
        profit: totalSales - totalAdSpend,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      trends: {
        revenue: formatTrend(totalRevenue, previousRevenue),
        orders: formatTrend(totalOrders, previousOrdersCount),
        roas: formatTrend(roas, previousRoas),
        visitors: formatTrend(visitors, previousVisitors)
      },
      insights: {
        bestProductName: bestProduct?.name || null,
        bestProductRevenue: bestProduct?.revenue || 0,
        topCategory: topCategory || null,
        bestCampaignName: bestCampaign?.name || null,
        bestCampaignRoas: bestCampaign?.roas || 0,
        bestCampaignPlatform: bestCampaign?.platform || null
      },
      dailyData,
      campaigns
    })
    
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
} 