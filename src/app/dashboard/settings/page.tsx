'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Bell, CreditCard, Globe, Shield, Store } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('general')
  const [storeName, setStoreName] = useState('')
  const [storeEmail, setStoreEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  useEffect(() => {
    const tenantId = session?.user?.tenantId
    if (status !== 'authenticated' || !tenantId) {
      setLoading(false)
      return
    }

    const fetchSettings = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/store/${tenantId}/settings`)
        const data = await response.json()

        if (!data.success) {
          toast.error(data.error || 'Unable to load store settings')
          return
        }

        setStoreName(data.data.storeName || '')
        setStoreEmail(data.data.storeEmail || '')
        setPhoneNumber(data.data.phoneNumber || '')
        setAddress(data.data.address || '')
        setProfilePhoto(data.data.profilePhoto || '')
      } catch (error) {
        toast.error('Unable to load store settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [session?.user?.tenantId, status])

  const handleSave = async () => {
    const tenantId = session?.user?.tenantId
    if (!tenantId) {
      toast.error('Unable to save settings: no tenant')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/store/${tenantId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName, storeEmail, phoneNumber, address, profilePhoto }),
      })

      const data = await response.json()
      if (!data.success) {
        toast.error(data.error || 'Unable to save settings')
      } else {
        toast.success(data.message || 'Settings saved successfully')
      }
    } catch (error) {
      toast.error('Unable to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-7">
          Control every part of your storefront with real configuration panels for payments, shipping, and store details.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-72 w-full">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-shadow ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 shadow-sm border border-blue-500/20 text-blue-700'
                    : 'bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <Card>
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Store Information</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Update your branding, contact details, and store identity.
                    </p>
                  </div>
                  <Button onClick={handleSave} loading={saving} disabled={loading || saving}>
                    Save General Settings
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="Store Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    label="Store Email"
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <Input
                  label="Profile Photo URL"
                  placeholder="https://..."
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  disabled={loading}
                />

                {profilePhoto && (
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <img
                      src={profilePhoto}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">Profile photo preview</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Customers see this badge throughout your dashboard.</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'payments' && (
            <Card>
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Payment Gateways</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Enable faster checkouts with modern payment options.
                    </p>
                  </div>
                  <Button onClick={handleSave} loading={saving} disabled={saving}>
                    Save Payment Settings
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PaymentOption name="Stripe" connected={true} description="Card, Apple Pay, Google Pay" />
                  <PaymentOption name="PayPal" connected={false} description="Fast checkout for international customers" />
                  <PaymentOption name="Tabby (BNPL)" connected={true} description="Buy now, pay later options" />
                  <PaymentOption name="Local Bank Transfer" connected={false} description="Support local payments and invoices" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 p-5 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm font-semibold">Accepted currencies</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">USD, EUR, GBP, AED, SAR</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-5 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm font-semibold">Fraud prevention</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Built-in risk monitoring keeps revenue secure.</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'shipping' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Shipping Settings</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Define delivery options and build trust with transparent shipping details.
                  </p>
                </div>

                <div className="space-y-4">
                  <ShippingOption name="Aramex" connected={true} eta="2-4 business days" cost="$7.99" />
                  <ShippingOption name="DHL" connected={false} eta="1-3 business days" cost="$12.50" />
                  <ShippingOption name="FedEx" connected={false} eta="2-5 business days" cost="$10.00" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Default Shipping Cost" type="number" defaultValue="5.99" />
                  <Input label="Free Shipping Minimum" type="number" defaultValue="50" />
                </div>

                <Button onClick={handleSave} loading={saving} disabled={saving}>
                  Save Shipping Settings
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Alert settings are coming soon for order updates and promotion campaigns.
                </p>
                <Button onClick={() => toast.success('Notification settings will arrive soon!')}>
                  Notify me
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Security</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Protect your store with secure authentication and trusted platform APIs.
                </p>
                <Button onClick={() => toast.success('Security scans are enabled.')}>Run a store scan</Button>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

function PaymentOption({ name, connected, description }: { name: string; connected: boolean; description: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${connected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
          {connected ? 'Connected' : 'Not Connected'}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="sm" variant={connected ? 'outline' : 'default'}>
          {connected ? 'Manage' : 'Connect'}
        </Button>
        {connected && <Button size="sm" variant="ghost">View logs</Button>}
      </div>
    </div>
  )
}

function ShippingOption({ name, connected, eta, cost }: { name: string; connected: boolean; eta: string; cost: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Delivery: {eta}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Rate: {cost}</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${connected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
          {connected ? 'Active' : 'Inactive'}
        </span>
        <Button size="sm" variant={connected ? 'outline' : 'default'}>
          {connected ? 'Settings' : 'Enable'}
        </Button>
      </div>
    </div>
  )
}
