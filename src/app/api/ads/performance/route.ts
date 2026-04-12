export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'
import { getMetaCampaignInsights } from '@/lib/ads/meta-api'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')
    
    if (!campaignId) {
      // Get all active campaigns for tenant
      const campaigns = await prisma.campaign.findMany({
        where: {
          tenantId: session.user.tenantId,
          status: 'active'
        },
        include: {
          product: true
        }
      })
      
      // Fetch performance for each campaign
      const performances = await Promise.all(
        campaigns.map(async (campaign) => {
          if (campaign.campaignId) {
            const insights = await getMetaCampaignInsights(campaign.campaignId)
            return {
              ...campaign,
              insights
            }
          }
          return campaign
        })
      )
      
      return NextResponse.json(performances)
    }
    
    // Get specific campaign performance
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        tenantId: session.user.tenantId
      }
    })
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }
    
    const insights = await getMetaCampaignInsights(campaign.campaignId!)
    
    return NextResponse.json({
      campaign,
      insights
    })
    
  } catch (error) {
    console.error('Performance fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch performance' }, { status: 500 })
  }
} 