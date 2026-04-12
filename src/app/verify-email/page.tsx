'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'missing'>('loading')
  const [message, setMessage] = useState('جارٍ التحقق من البريد الإلكتروني...')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('missing')
      setMessage('لم يتم العثور على رمز التحقق في الرابط.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage('تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.')
          toast.success('تم تأكيد البريد الإلكتروني بنجاح.')
        } else {
          setStatus('error')
          setMessage(data.message || 'فشل التحقق من البريد الإلكتروني.')
          toast.error(data.message || 'فشل التحقق من البريد الإلكتروني.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('حدث خطأ أثناء محاولة تأكيد البريد الإلكتروني.')
        toast.error('حدث خطأ أثناء التحقق.')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">تأكيد البريد الإلكتروني</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        </div>

        <div className="flex flex-col gap-4">
          {status === 'success' && (
            <Button onClick={() => router.push('/login')} className="w-full">
              متابعة إلى تسجيل الدخول
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button onClick={() => router.push('/register')} className="w-full">
                العودة للتسجيل
              </Button>
              <Link href="/login" className="text-center block text-sm text-blue-600 hover:underline">
                العودة لتسجيل الدخول
              </Link>
            </div>
          )}

          {status === 'missing' && (
            <Link href="/register" className="text-center block text-sm text-blue-600 hover:underline">
              اذهب للتسجيل
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}
