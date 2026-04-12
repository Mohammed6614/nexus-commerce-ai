'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ResendVerificationPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!email.trim()) {
      setError('Email is required')
      toast.error('Please enter your email address')
      return
    }

    if (!emailRegex.test(email)) {
      setError('Enter a valid email address')
      toast.error('Please enter a valid email')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccessMessage(data.message)
        toast.success(data.message)
      } else {
        setError(data.message || 'Unable to resend verification email')
        toast.error(data.message || 'Unable to resend verification email')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setError('Unable to resend verification email')
      toast.error('Unable to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resend Verification</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Enter your email to receive a new verification link.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/20 dark:text-red-300">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700 dark:bg-green-950/20 dark:text-green-300">
            {successMessage}
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
          />

          <Button type="submit" loading={loading} className="w-full">
            Resend verification email
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline"
          >
            Back to login
          </button>
        </div>
      </motion.div>
    </div>
  )
}
