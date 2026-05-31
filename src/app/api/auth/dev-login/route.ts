import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

// Dev-only login: enabled when DEV_LOGIN=true or NODE_ENV!="production"
export async function POST(req: Request) {
  try {
    const allow = process.env.DEV_LOGIN === 'true' || process.env.NODE_ENV !== 'production'
    if (!allow) return NextResponse.json({ success: false, message: 'Dev login disabled' }, { status: 403 })

    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 })

    const tenant = await prisma.tenant.findUnique({ where: { email: email.toLowerCase() } })
    if (!tenant) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })

    const match = await bcrypt.compare(password, tenant.password || '')
    if (!match) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })

    // Return basic tenant info for local testing. Integrate with NextAuth if needed.
    return NextResponse.json({ success: true, tenant: { id: tenant.id, email: tenant.email, subdomain: tenant.subdomain, name: tenant.name } })
  } catch (error) {
    console.error('Dev login error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
