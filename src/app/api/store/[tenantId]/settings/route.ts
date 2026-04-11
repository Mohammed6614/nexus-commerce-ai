import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.tenantId || session.user.tenantId !== params.tenantId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: params.tenantId }
  })

  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 })
  }

  let parsedSettings = {}
  try {
    parsedSettings = JSON.parse(tenant.settings || '{}')
  } catch (error) {
    parsedSettings = {}
  }

  return NextResponse.json({
    success: true,
    data: {
      storeName: tenant.name,
      storeEmail: tenant.email,
      phoneNumber: (parsedSettings as any).phoneNumber || '',
      address: (parsedSettings as any).address || '',
      profilePhoto: (parsedSettings as any).profilePhoto || '',
      ...parsedSettings
    }
  })
}

export async function PUT(req: NextRequest, { params }: { params: { tenantId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.tenantId || session.user.tenantId !== params.tenantId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { storeName, storeEmail, phoneNumber, address, profilePhoto } = body

  if (!storeName || !storeEmail) {
    return NextResponse.json(
      { success: false, error: 'Store name and email are required' },
      { status: 400 }
    )
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: params.tenantId }
  })

  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 })
  }

  let existingSettings = {}
  try {
    existingSettings = JSON.parse(tenant.settings || '{}')
  } catch (error) {
    existingSettings = {}
  }

  const updatedSettings = {
    ...existingSettings,
    phoneNumber: phoneNumber || '',
    address: address || '',
    profilePhoto: profilePhoto || ''
  }

  const updatedTenant = await prisma.tenant.update({
    where: { id: params.tenantId },
    data: {
      name: storeName,
      email: storeEmail,
      settings: JSON.stringify(updatedSettings)
    }
  })

  return NextResponse.json({
    success: true,
    message: 'Store settings updated successfully',
    data: {
      storeName: updatedTenant.name,
      storeEmail: updatedTenant.email,
      ...updatedSettings
    }
  })
}
