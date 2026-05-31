const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = 'Password123!'
  const hashed = await bcrypt.hash(password, 10)

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Store',
      email: 'demo@local.test',
      subdomain: 'demo-store',
      password: hashed,
      emailVerified: true,
      plan: 'beta',
      settings: JSON.stringify({ currency: 'USD', timezone: 'UTC', theme: 'modern', createdAt: new Date().toISOString() })
    }
  })

  const product = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      name: 'Demo Product',
      price: 9.99,
      category: 'demo',
      stock: 100
    }
  })

  console.log('Seed created:')
  console.log({ tenantId: tenant.id, email: tenant.email, password })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
