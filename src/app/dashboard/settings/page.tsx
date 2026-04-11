'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'shipping', label: 'Shipping', icon: Globe },
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
        body: JSON.stringify({ storeName, storeEmail, phoneNumber, address, profilePhoto })
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
      <div>
        <h1 className="text-4xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your store configuration
        </p>
      </div>
      
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-600 border border-blue-500/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Store Information</h2>
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
                <Input
                  label="Profile Photo URL"
                  placeholder="https://..."
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  disabled={loading}
                />
                {profilePhoto && (
                  <div className="flex items-center gap-3">
                    <img
                      src={profilePhoto}
                      alt="Profile preview"
                      className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Profile photo preview</p>
                  </div>
                )}
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
                <Button onClick={handleSave} loading={saving} disabled={loading || saving}>
                  Save Changes
                </Button>
              </div>
            </Card>
          )}
          
          {activeTab === 'payments' && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Payment Gateways</h2>
                <div className="space-y-3">
                  <PaymentOption name="Stripe" connected={true} />
                  <PaymentOption name="PayPal" connected={false} />
                  <PaymentOption name="Tabby (BNPL)" connected={true} />
                </div>
              </div>
            </Card>
          )}
          
          {activeTab === 'shipping' && (
            <Card>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Shipping Settings</h2>
                <div className="space-y-3">
                  <ShippingOption name="Aramex" connected={true} />
                  <ShippingOption name="DHL" connected={false} />
                  <ShippingOption name="FedEx" connected={false} />
                </div>
                <Input label="Default Shipping Cost" type="number" defaultValue="5.99" />
                <Input label="Free Shipping Minimum" type="number" defaultValue="50" />
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function PaymentOption({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <span className="font-medium">{name}</span>
      <div className="flex items-center gap-3">
        <span className={`text-sm ${connected ? 'text-green-600' : 'text-gray-400'}`}>
          {connected ? 'Connected' : 'Not Connected'}
        </span>
        <Button size="sm" variant={connected ? 'outline' : 'default'}>
          {connected ? 'Configure' : 'Connect'}
        </Button>
      </div>
    </div>
  )
}

function ShippingOption({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <span className="font-medium">{name}</span>
      <div className="flex items-center gap-3">
        <span className={`text-sm ${connected ? 'text-green-600' : 'text-gray-400'}`}>
          {connected ? 'Active' : 'Inactive'}
        </span>
        <Button size="sm" variant={connected ? 'outline' : 'default'}>
          {connected ? 'Settings' : 'Enable'}
        </Button>
      </div>
    </div>
  )
} 