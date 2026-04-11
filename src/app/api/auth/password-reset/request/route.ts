import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { randomBytes } from 'crypto'
import { z } from 'zod'

const resetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email')
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email } = parsed.data
    const tenant = await prisma.tenant.findUnique({ where: { email: email.toLowerCase() } })

    if (!tenant) {
      return NextResponse.json({
        success: true,
        message: 'If the email exists, password reset instructions were sent.'
      })
    }

    const resetToken = randomBytes(20).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.tenant.update({
      where: { email: email.toLowerCase() },
      data: { resetToken, resetTokenExpiry }
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset token created. Use it to reset your password.',
      token: resetToken
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json({ success: false, error: 'Unable to process password reset request' }, { status: 500 })
  }
}
