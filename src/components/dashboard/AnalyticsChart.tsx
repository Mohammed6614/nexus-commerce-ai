'use client'

import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AnalyticsChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No performance data yet. Generate orders or campaigns to see analytics here.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis yAxisId="left" stroke="#3b82f6" />
          <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#8b5cf6"
            fill="url(#colorOrders)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 