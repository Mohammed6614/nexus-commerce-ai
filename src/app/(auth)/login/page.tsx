'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState('')

  const verificationError = formError.toLowerCase().includes('verify') || formError.toLowerCase().includes('التحقق')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})

    const errors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(email)) {
      errors.email = 'Enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false
      })

      if (!result || result.error) {
        const message = result?.error ? result.error : 'Unable to sign in. Please try again.'
        setFormError('Invalid email or password')
        toast.error(message)
      } else {
        toast.success('Login successful!')
        router.push(from)
      }
    } catch (error) {
      console.error('Login error:', error)
      setFormError('Unable to sign in at the moment')
      toast.error('Unable to sign in. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-morphism rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your dashboard
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/20 dark:text-red-300">
              {formError}
            </div>
          )}

          {verificationError && (
            <div className="mb-4 text-sm text-blue-700 dark:text-blue-300">
              <Link href="/resend-verification" className="underline">
                أعد إرسال رسالة التحقق
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@example.com"
              required
              error={fieldErrors.email}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={fieldErrors.password}
            />

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/reset-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
 