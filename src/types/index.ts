export interface Tenant {
  id: string
  subdomain: string
  name: string
  email: string
  plan: 'beta' | 'pro' | 'enterprise'
  settings: TenantSettings
  createdAt: Date
  updatedAt: Date
}

export interface TenantSettings {
  primaryColor?: string
  logo?: string
  currency?: string
  timezone?: string
  shippingZones?: ShippingZone[]
  paymentGateways?: PaymentGateway[]
}

export interface Product {
  id: string
  tenantId: string
  name: string
  description?: string
  price: number
  compareAtPrice?: number
  imageUrl?: string
  images?: string[]
  category: string
  tags?: string[]
  stock: number
  sku?: string
  weight?: number
  aiGenerated?: string
  targeting?: TargetingConfig
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  tenantId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: Address
  billingAddress?: Address
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Campaign {
  id: string
  tenantId: string
  productId: string
  name: string
  platform: 'meta' | 'google' | 'snapchat'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  sales: number
  impressions: number
  clicks: number
  roas: number
  campaignId?: string
  adSetId?: string
  adId?: string
  targeting: TargetingConfig
  createdAt: Date
  updatedAt: Date
}

export interface TargetingConfig {
  interests?: string[]
  ageRange?: string
  genders?: number[]
  behaviors?: string[]
  locales?: string[]
  devicePlatforms?: string[]
  customAudiences?: string[]
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  cost: number
  freeShippingThreshold?: number
}

export interface PaymentGateway {
  id: string
  name: string
  enabled: boolean
  config?: Record<string, any>
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AnalyticsSummary {
  totalRevenue: number
  totalOrders: number
  totalAdSpend: number
  totalSales: number
  roas: number
  profit: number
  averageOrderValue: number
  conversionRate: number
}

export interface DailyAnalytics {
  date: string
  revenue: number
  orders: number
  visitors: number
  adSpend: number
}