import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const verifySchema = z.object({
  token: z.string().min(1, 'Verification token is required')
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = verifySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { token } = parsed.data
    const tenant = await prisma.tenant.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!tenant) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    })

    return NextResponse.json({ success: true, message: 'Email verified successfully' })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Unable to verify email' },
      { status: 500 }
    )
  }
}
