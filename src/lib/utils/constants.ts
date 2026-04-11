export const APP_NAME = 'Nexus Commerce AI'
export const APP_DESCRIPTION = 'Autonomous E-Commerce Platform with AI Marketing'

export const PLAN_LIMITS = {
  beta: {
    products: 50,
    monthlyOrders: 100,
    aiCredits: 1000,
    features: ['ai_content', 'basic_analytics']
  },
  pro: {
    products: 500,
    monthlyOrders: 1000,
    aiCredits: 10000,
    features: ['ai_content', 'ai_ads', 'advanced_analytics', 'api_access']
  },
  enterprise: {
    products: Infinity,
    monthlyOrders: Infinity,
    aiCredits: Infinity,
    features: ['all']
  }
}

export const CATEGORIES = [
  'Clothing',
  'Electronics',
  'Home Decor',
  'Beauty',
  'Perfume',
  'Fitness',
  'Books',
  'Toys',
  'Food',
  'Jewelry'
]

export const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'UAE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD' },
  { code: 'QA', name: 'Qatar', currency: 'QAR' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' }
]