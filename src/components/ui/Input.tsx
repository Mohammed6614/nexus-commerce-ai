import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/helpers'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, icon, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {helper && !error && (
          <p className="text-xs text-gray-500">{helper}</p>
        )}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input' 