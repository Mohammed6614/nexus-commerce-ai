import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/ai/openai'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: Request) {
  const openai = getOpenAIClient()
  try {
    const { productId } = await req.json()
    
    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Generate AI description
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert e-commerce copywriter. Create compelling product descriptions and ad copy."
        },
        {
          role: "user",
          content: `Write a persuasive product description for ${product.name} priced at $${product.price}. 
                    Category: ${product.category}. Make it engaging and SEO-friendly.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })
    
    const aiDescription = completion.choices[0].message.content
    
    // Update product with AI content
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { aiGenerated: aiDescription }
    })
    
    return NextResponse.json({ 
      success: true, 
      description: aiDescription,
      product: updatedProduct 
    })
    
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
} 