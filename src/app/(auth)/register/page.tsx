'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const subdomainRegex = /^[a-z0-9-]+$/

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subdomain: '',
  })
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; subdomain?: string }>({})
  const [formError, setFormError] = useState('')

  const validateForm = () => {
    const errors: { name?: string; email?: string; password?: string; subdomain?: string } = {}

    if (!formData.name.trim()) {
      errors.name = 'Store name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.subdomain.trim()) {
      errors.subdomain = 'Subdomain is required'
    } else if (!subdomainRegex.test(formData.subdomain)) {
      errors.subdomain = 'Subdomain may only contain lowercase letters, numbers, and dashes'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toast.error('يرجى تصحيح الحقول المطلوبة')
      return
    }

    setFieldErrors({})
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('تم إنشاء المتجر بنجاح! جاري تسجيل الدخول تلقائياً...')

        const loginResult = await signIn('credentials', {
          redirect: false,
          email: formData.email.toLowerCase(),
          password: formData.password
        })

        if (loginResult?.error) {
          toast.error('تم إنشاء المتجر ولكن فشل تسجيل الدخول تلقائياً. الرجاء تسجيل الدخول يدوياً.')
          router.push('/login')
        } else {
          router.push('/dashboard')
        }
      } else {
        const errorMessage = data.message || 'فشل إنشاء المتجر'
        setFormError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setFormError('حدث خطأ أثناء الاتصال بالسيرفر')
      toast.error('حدث خطأ في الاتصال بالخادم')
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
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              إنشاء متجر جديد
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              ابدأ متجرك في 5 دقائق مع التسويق بالذكاء الاصطناعي
            </p>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/20 dark:text-red-300">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="اسم المتجر"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="متجري الرائع"
              required
              error={fieldErrors.name}
            />

            <Input
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="merchant@example.com"
              required
              error={fieldErrors.email}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                النطاق الفرعي
              </label>
              <div className="flex gap-2">
                <Input
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                  placeholder="متجري"
                  required
                  className="flex-1"
                  error={fieldErrors.subdomain}
                />
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  .nexus.ai
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                سيتمكن عملاؤك من الوصول إلى متجرك على: {formData.subdomain || 'متجري'}.nexus.ai
              </p>
            </div>

            <Input
              label="كلمة المرور"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              error={fieldErrors.password}
            />

            <Button type="submit" loading={loading} className="w-full">
              إنشاء المتجر
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

