export async function createTabbySession(amount: number, orderId: string) {
  // Tabby API implementation
  const response = await fetch('https://api.tabby.ai/api/v1/checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TABBY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount * 100,
      currency: 'SAR',
      order: { id: orderId },
      buyer: { email: 'customer@example.com' }
    })
  })
  
  return response.json()
} 