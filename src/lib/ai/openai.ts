import OpenAI from 'openai'

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY')
  }
  return new OpenAI({ apiKey })
}

export async function generateProductDescription(productName: string, category: string, price: number) {
  const openai = getOpenAIClient()
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert e-commerce copywriter. Write compelling, SEO-friendly product descriptions.'
      },
      {
        role: 'user',
        content: `Write a product description for ${productName} (${category}) priced at $${price}. Include benefits and a call to action.`
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  })
  
  return response.choices[0].message.content
}

export async function generateAdCopy(productName: string, productDescription: string) {
  const openai = getOpenAIClient()
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a Facebook Ads expert. Write high-converting ad copy.'
      },
      {
        role: 'user',
        content: `Create 3 Facebook ad headlines and 2 primary texts for: ${productName}\nDescription: ${productDescription}`
      }
    ],
    temperature: 0.8,
    max_tokens: 400
  })
  
  return response.choices[0].message.content
} 