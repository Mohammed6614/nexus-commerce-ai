import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const products = await prisma.product.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { name, price, category, imageUrl } = body
    
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        imageUrl,
        tenantId: session.user.tenantId,
        stock: 100,
      }
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
} 