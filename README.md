# Nexus Commerce AI - Autonomous E-Commerce Platform

## 🚀 The World's First AI-Powered E-Commerce SaaS

Build your online store in minutes. Our AI handles your entire marketing department.

### ✨ Features

- **Multi-tenant Architecture** - Host thousands of stores securely
- **AI Content Generation** - GPT-4 writes product descriptions and ad copy
- **Automated Marketing** - One-click Facebook & Google Ads campaigns
- **Smart Budget Optimization** - AI distributes budget to best-performing ads
- **Dummy-Proof Analytics** - See only what matters: Spend, Sales, Profit
- **Logistics Ready** - Pre-integrated with Stripe, Tabby, Aramex, DHL

### 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js
- OpenAI API (GPT-4, DALL-E)
- Meta Ads API
- Stripe

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nexus-commerce-ai.git
cd nexus-commerce-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### 🔐 Authentication

Nexus Commerce AI includes a full authentication system using:

- `next-auth` with credentials provider
- `Prisma` for tenant/user storage
- `bcryptjs` for password hashing
- `JWT` session strategy
- Email verification, registration, login, password reset, and sign-out flows
- Email delivery with SendGrid or SMTP via `nodemailer`

Visit `/register` to create a new store account, `/login` to sign in, `/verify-email` to confirm email, `/resend-verification` to resend a verification email, and `/reset-password` to recover a lost password.
