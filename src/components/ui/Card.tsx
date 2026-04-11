import { cn } from '@/lib/utils/helpers'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn(
      'glass-morphism rounded-2xl p-6',
      hover && 'card-hover cursor-pointer',
      className
    )}>
      {children}
    </div>
  )
} 