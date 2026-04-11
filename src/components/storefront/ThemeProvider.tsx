'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  theme: string
  primaryColor: string
  font: string
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'modern',
  primaryColor: '#3b82f6',
  font: 'inter'
})

export function useStoreTheme() {
  return useContext(ThemeContext)
}

export function StoreThemeProvider({ children, tenantId }: { children: React.ReactNode; tenantId: string }) {
  const [settings, setSettings] = useState({
    theme: 'modern',
    primaryColor: '#3b82f6',
    font: 'inter'
  })
  
  useEffect(() => {
    // Fetch store settings from API
    fetch(`/api/store/${tenantId}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error)
  }, [tenantId])
  
  return (
    <ThemeContext.Provider value={settings}>
      <style jsx global>{`
        :root {
          --primary-color: ${settings.primaryColor};
        }
        body {
          font-family: ${settings.font === 'inter' ? 'Inter' : settings.font === 'playfair' ? 'Playfair Display' : 'Montserrat'};
        }
      `}</style>
      {children}
    </ThemeContext.Provider>
  )
} 