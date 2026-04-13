'use server'

import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'

const emailFrom = process.env.EMAIL_FROM || 'no-reply@nexus-commerce-ai.com'
const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

function getVerificationUrl(token: string) {
  return `${baseUrl.replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`
}

async function sendWithSendGrid({ to, subject, html }: { to: string; subject: string; html: string }) {
  const sendGridKey = process.env.SENDGRID_API_KEY
  if (!sendGridKey) {
    throw new Error('SENDGRID_API_KEY is not defined in environment variables')
  }

  sgMail.setApiKey(sendGridKey)

  await sgMail.send({
    to,
    from: emailFrom,
    subject,
    html,
  })
}

async function sendWithNodemailer({ to, subject, html }: { to: string; subject: string; html: string }) {
  const emailServer = process.env.EMAIL_SERVER
  if (!emailServer) {
    throw new Error('EMAIL_SERVER is not defined in environment variables')
  }

  const transporter = nodemailer.createTransport(emailServer)

  await transporter.sendMail({
    from: emailFrom,
    to,
    subject,
    html,
  })
}

export async function sendVerificationEmail({
  to,
  token,
  name,
}: {
  to: string
  token: string
  name: string
}) {
  const verificationUrl = getVerificationUrl(token)
  const subject = 'قم بتأكيد بريدك الإلكتروني - Nexus Commerce AI'
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>مرحبًا ${name},</h2>
      <p>شكرًا لتسجيلك في Nexus Commerce AI.</p>
      <p>يرجى الضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك:</p>
      <p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px;">
          تأكيد البريد الإلكتروني
        </a>
      </p>
      <p>إذا لم تقم بطلب ذلك، يمكنك تجاهل هذه الرسالة.</p>
      <p>شكراً،<br/>فريق Nexus Commerce AI</p>
    </div>
  `

  if (process.env.SENDGRID_API_KEY) {
    try {
      return await sendWithSendGrid({ to, subject, html })
    } catch (error) {
      console.error('SendGrid email send failed, falling back to SMTP:', error)
      if (process.env.EMAIL_SERVER) {
        return await sendWithNodemailer({ to, subject, html })
      }
      throw error
    }
  }

  return sendWithNodemailer({ to, subject, html })
}
