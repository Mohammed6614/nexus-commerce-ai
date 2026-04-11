import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const tenantId = session.client_reference_id
      const amountTotal = session.amount_total ? session.amount_total / 100 : 0
      
      if (tenantId) {
        // Update order status
        await prisma.order.updateMany({
          where: {
            tenantId,
            orderNumber: session.id
          },
          data: {
            paymentStatus: 'paid',
            status: 'processing'
          }
        })
      }
      break
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
      break
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
  
  return NextResponse.json({ received: true })
} 