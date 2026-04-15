'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ShoppingCart, BarChart3, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">AI-Powered E-Commerce</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Your Store,</span>
              <br />
              <span className="text-gray-900 dark:text-white">Our AI Does Marketing</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Launch your online store in minutes. Our AI handles ads, content, and optimization.
              Just upload products and set your budget.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Free Trial
                  <Zap className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/preview-store">
                <Button size="lg" variant="outline">
                  Preview Store
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 sm:px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShoppingCart className="w-8 h-8" />}
            title="Smart Store Builder"
            description="Create your store with beautiful themes. No coding needed."
          />
          <FeatureCard 
            icon={<Sparkles className="w-8 h-8" />}
            title="AI Content Generation"
            description="GPT-4 writes your product descriptions and ad copy automatically."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8" />}
            title="Automated Marketing"
            description="AI runs your Facebook & Google ads. You just watch sales grow."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-morphism rounded-2xl p-8 text-center card-hover"
    >
      <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  )
} 