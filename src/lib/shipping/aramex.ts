export async function createAramexShipment(order: any) {
  const response = await fetch('https://api.aramex.com/shipping/v1/createShipment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ARAMEX_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shipper: { name: 'Store Name', address: order.shippingAddress },
      consignee: { name: order.customerName, address: order.shippingAddress },
      shipmentDetails: { weight: 1, items: order.items }
    })
  })
  
  return response.json()
}

export async function trackAramexShipment(trackingNumber: string) {
  const response = await fetch(`https://api.aramex.com/tracking/v1/${trackingNumber}`, {
    headers: { 'Authorization': `Bearer ${process.env.ARAMEX_API_KEY}` }
  })
  
  return response.json()
} 