import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/ai/openai'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: Request) {
  const { productId } = await req.json()

  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const fallbackDescription = `Discover ${product.name}, a standout ${product.category} item priced at $${product.price}. Crafted for premium value, this product offers exceptional styling, effortless performance, and a polished shopping experience.`

  try {
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert e-commerce copywriter. Create compelling product descriptions and ad copy.'
        },
        {
          role: 'user',
          content: `Write a persuasive product description for ${product.name} priced at $${product.price}. Category: ${product.category}. Make it engaging and SEO-friendly.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiDescription = completion?.choices?.[0]?.message?.content?.trim() || fallbackDescription
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { aiGenerated: aiDescription }
    })

    return NextResponse.json({
      success: true,
      description: aiDescription,
      fallback: false,
      product: updatedProduct
    })
  } catch (error) {
    console.error('AI generation failed, using fallback description:', error)

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { aiGenerated: fallbackDescription }
    })

    return NextResponse.json({
      success: true,
      description: fallbackDescription,
      fallback: true,
      product: updatedProduct
    })
  }
} 