import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      const newProduct = await response.json()
      setProducts([...products, newProduct])
      toast.success('Product added successfully')
      return newProduct
    } catch (error) {
      toast.error('Failed to add product')
      throw error
    }
  }

  const generateAI = async (productId: string) => {
    const toastId = toast.loading('AI is generating content...')
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await response.json()
      toast.success('AI content generated!', { id: toastId })
      await fetchProducts() // Refresh
      return data
    } catch (error) {
      toast.error('AI generation failed', { id: toastId })
      throw error
    }
  }

  return { products, loading, addProduct, generateAI }
} 