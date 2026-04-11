import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function createCheckoutSession(
  items: Array<{ name: string; price: number; quantity: number }>,
  tenantId: string,
  orderId: string
) {
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: item.quantity
  }))
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?order=${orderId}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    client_reference_id: tenantId,
    metadata: { orderId }
  })
  
  return session
}

export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      // Update order status
      return { processed: true, orderId: session.metadata?.orderId }
    default:
      return { processed: false }
  }
} 