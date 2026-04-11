'use client'

import { useState } from 'react'

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
}

export function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const [localValue, setLocalValue] = useState(value)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    setLocalValue(newValue)
    onChange(newValue)
  }
  
  const getRecommendation = (budget: number) => {
    if (budget < 20) return 'Minimum budget - Good for testing'
    if (budget < 50) return 'Recommended for beginners'
    if (budget < 100) return 'Aggressive growth - Higher ROAS expected'
    return 'Pro budget - Maximum reach'
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">${localValue}</span>
        <span className="text-sm text-gray-600">per day</span>
      </div>
      
      <input
        type="range"
        min="5"
        max="500"
        step="5"
        value={localValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(localValue / 500) * 100}%, #e5e7eb ${(localValue / 500) * 100}%, #e5e7eb 100%)`
        }}
      />
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>$5</span>
        <span>$100</span>
        <span>$200</span>
        <span>$500</span>
      </div>
      
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm">🤖 AI Recommendation: {getRecommendation(localValue)}</p>
      </div>
    </div>
  )
} 