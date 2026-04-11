import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const resetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
})

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const parsed = resetConfirmSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { token, newPassword } = parsed.data
    const tenant = await prisma.tenant.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reset token' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password reset confirm error:', error)
    return NextResponse.json({ success: false, error: 'Unable to reset password' }, { status: 500 })
  }
}
