import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Please enter a valid store name'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, 'Subdomain may only contain lowercase letters, numbers, and dashes').min(1)
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return NextResponse.json(
        { success: false, message: firstError.message },
        { status: 400 }
      )
    }

    const { name, email, password, subdomain } = parsed.data

    const existingTenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { subdomain: subdomain.toLowerCase() }
        ]
      }
    })

    if (existingTenant) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو النطاق الفرعي مستخدم بالفعل' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const tenant = await prisma.tenant.create({
      data: {
        name,
        email: email.toLowerCase(),
        subdomain: subdomain.toLowerCase(),
        password: hashedPassword,
        plan: 'beta',
        settings: JSON.stringify({
          currency: 'USD',
          timezone: 'UTC',
          theme: 'modern',
          createdAt: new Date().toISOString()
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المتجر بنجاح',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        email: tenant.email
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء إنشاء المتجر',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
