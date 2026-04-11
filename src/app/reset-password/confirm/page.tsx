'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tokenFromUrl = searchParams.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ token?: string; newPassword?: string }>({})
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setToken(tokenFromUrl)
  }, [tokenFromUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setFormError('')

    const errors: { token?: string; newPassword?: string } = {}
    if (!token.trim()) {
      errors.token = 'Reset token is required'
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required'
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toast.error('Please fix the highlighted fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })
      const data = await response.json()

      if (!data.success) {
        setFormError(data.error || 'Unable to reset password')
        toast.error(data.error || 'Unable to reset password')
      } else {
        toast.success(data.message)
        router.push('/login')
      }
    } catch (error) {
      console.error('Password reset confirm error:', error)
      setFormError('Unable to reset password')
      toast.error('Unable to reset password')
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
            <h1 className="text-3xl font-bold gradient-text">Confirm Password Reset</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter the reset token and your new password.
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/20 dark:text-red-300">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Reset Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter reset token"
              required
              error={fieldErrors.token}
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={fieldErrors.newPassword}
            />
            <Button type="submit" loading={loading} className="w-full">
              Reset Password
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Got a token?{' '}
            <Link href="/reset-password" className="text-blue-600 hover:underline">
              Request another
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
