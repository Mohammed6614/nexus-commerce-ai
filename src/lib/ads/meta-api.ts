import axios from 'axios'

const META_API_VERSION = 'v18.0'
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

interface CampaignConfig {
  name: string
  dailyBudget: number
  targeting: any
  creative: {
    headline: string
    description: string
    imageUrl: string
  }
}

export async function createMetaCampaign(config: CampaignConfig) {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN
    const adAccountId = process.env.META_AD_ACCOUNT_ID
    
    // 1. Create Campaign
    const campaignResponse = await axios.post(
      `${BASE_URL}/${adAccountId}/campaigns`,
      {
        name: config.name,
        objective: 'OUTCOME_SALES',
        status: 'ACTIVE',
        special_ad_categories: [],
        access_token: accessToken
      }
    )
    
    const campaignId = campaignResponse.data.id
    
    // 2. Create Ad Set
    const adSetResponse = await axios.post(
      `${BASE_URL}/${adAccountId}/adsets`,
      {
        name: `${config.name} - Ad Set`,
        campaign_id: campaignId,
        daily_budget: config.dailyBudget * 100, // in cents
        targeting: config.targeting,
        status: 'ACTIVE',
        access_token: accessToken
      }
    )
    
    const adSetId = adSetResponse.data.id
    
    // 3. Create Ad Creative
    const creativeResponse = await axios.post(
      `${BASE_URL}/${adAccountId}/adcreatives`,
      {
        name: `${config.name} - Creative`,
        object_story_spec: {
          page_id: process.env.META_PAGE_ID,
          link_data: {
            link: 'https://your-store.com',
            message: config.creative.description,
            name: config.creative.headline,
            call_to_action: { type: 'SHOP_NOW' }
          }
        },
        access_token: accessToken
      }
    )
    
    // 4. Create Ad
    const adResponse = await axios.post(
      `${BASE_URL}/${adAccountId}/ads`,
      {
        name: config.name,
        adset_id: adSetId,
        creative: { creative_id: creativeResponse.data.id },
        status: 'ACTIVE',
        access_token: accessToken
      }
    )
    
    return { campaignId, adSetId, adId: adResponse.data.id }
    
  } catch (error) {
    console.error('Meta API error:', error)
    throw new Error('Failed to create Meta campaign')
  }
}

export async function getMetaCampaignInsights(campaignId: string) {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN
    
    const response = await axios.get(
      `${BASE_URL}/${campaignId}/insights`,
      {
        params: {
          fields: 'spend,impressions,clicks,actions',
          access_token: accessToken
        }
      }
    )
    
    const insights = response.data.data[0] || {}
    const spend = parseFloat(insights.spend || 0)
    const sales = insights.actions?.find((a: any) => a.action_type === 'purchase')?.value || 0
    
    return {
      spend,
      sales: parseFloat(sales),
      impressions: parseInt(insights.impressions || 0),
      clicks: parseInt(insights.clicks || 0),
      roas: spend > 0 ? sales / spend : 0
    }
    
  } catch (error) {
    console.error('Meta insights error:', error)
    return { spend: 0, sales: 0, impressions: 0, clicks: 0, roas: 0 }
  }
} 