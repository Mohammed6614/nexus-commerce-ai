import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { randomBytes } from 'crypto'
import { sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'

const resendSchema = z.object({
  email: z.string().email('Please enter a valid email')
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resendSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase()
    const tenant = await prisma.tenant.findUnique({ where: { email } })

    if (!tenant) {
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a verification link has been sent.'
      })
    }

    if (tenant.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified. Please sign in.'
      })
    }

    const verificationToken = randomBytes(24).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

    await prisma.tenant.update({
      where: { email },
      data: {
        verificationToken,
        verificationTokenExpiry,
      }
    })

    await sendVerificationEmail({
      to: tenant.email,
      token: verificationToken,
      name: tenant.name,
    })

    return NextResponse.json({
      success: true,
      message: 'Verification email resent. Please check your inbox.'
    })
  } catch (error) {
    console.error('Resend verification email error:', error)
    return NextResponse.json(
      { success: false, message: 'Unable to resend verification email' },
      { status: 500 }
    )
  }
}
