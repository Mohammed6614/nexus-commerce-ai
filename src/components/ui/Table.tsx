import { cn } from '@/lib/utils/helpers'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead className={cn('bg-gray-50 dark:bg-gray-800', className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}>{children}</tbody>
}

export function TableRow({ children, className }: TableProps) {
  return <tr className={cn('hover:bg-gray-50 dark:hover:bg-gray-800/50 transition', className)}>{children}</tr>
}

export function TableHead({ children, className }: TableProps) {
  return (
    <th className={cn('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', className)}>
      {children}
    </th>
  )
}

export function TableCell({ children, className }: TableProps) {
  return <td className={cn('px-6 py-4 whitespace-nowrap', className)}>{children}</td>
} 