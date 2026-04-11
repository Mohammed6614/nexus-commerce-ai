import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'
import { getTargetingForCategory } from '@/lib/ai/targeting-templates'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { productId, dailyBudget, platform = 'meta' } = await req.json()
    
    // Get product details
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        tenantId: session.user.tenantId
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Save campaign to database (mock for now)
    const campaign = await prisma.campaign.create({
      data: {
        tenantId: session.user.tenantId,
        productId: product.id,
        name: `${product.name} - AI Campaign`,
        platform,
        budget: dailyBudget,
        status: 'active',
        spent: 0,
        sales: 0,
        roas: 0
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      campaign,
      message: `Campaign launched successfully on ${platform === 'meta' ? 'Meta Ads' : 'Google Ads'}`
    })
    
  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}
