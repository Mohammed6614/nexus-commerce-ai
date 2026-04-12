import { NextResponse } from 'next/server'
import { getOpenAIClient } from '@/lib/ai/openai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

export async function POST(req: Request) {
  const openai = getOpenAIClient()
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { prompt, productName, category } = await req.json()
    
    // Enhanced prompt for e-commerce product images
    const enhancedPrompt = prompt || 
      `Professional e-commerce product photography of ${productName}, 
       clean white background, studio lighting, high resolution, 
       product showcase style, ${category} product, 4k, commercial photography`
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    })
    
    const imageUrl = response.data[0].url
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      prompt: enhancedPrompt
    })
    
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
} 