'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldError('')
    setStatusMessage('')

    if (!email.trim()) {
      setFieldError('Email is required')
      toast.error('Please enter your email')
      return
    }

    if (!emailRegex.test(email)) {
      setFieldError('Please enter a valid email address')
      toast.error('Please enter a valid email')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() })
      })
      const data = await response.json()

      if (!data.success) {
        setFieldError(data.error || 'Unable to request reset token')
        toast.error(data.error || 'Unable to request reset token')
      } else {
        const message = data.message || 'Reset instructions sent. Check your email.'
        setStatusMessage(message)
        setResetToken(data.token || '')
        toast.success(message)
      }
    } catch (error) {
      console.error('Reset request error:', error)
      setFieldError('Unable to request password reset')
      toast.error('Unable to request password reset')
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
            <h1 className="text-3xl font-bold gradient-text">Reset Password</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your email and we will send a reset token.
            </p>
          </div>

          {statusMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700 dark:bg-green-950/20 dark:text-green-300">
              {statusMessage}
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
              error={fieldError}
            />

            <Button type="submit" loading={loading} className="w-full">
              Request Reset
            </Button>
          </form>

          {resetToken && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-700 dark:text-green-300">Reset Token</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 break-all mt-2">{resetToken}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Use this token on the <Link href="/reset-password/confirm" className="text-blue-600 hover:underline">confirm page</Link>.
              </p>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Remembered your password?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
