export const targetingTemplates: Record<string, any> = {
  'perfume': {
    interests: ['Perfume', 'Luxury Goods', 'Fragrance', 'Sephora', 'Ulta Beauty'],
    age_range: '18-45',
    genders: [1, 2],
    behaviors: ['ENGAGED_SHOPPERS', 'LUXURY_RETAIL'],
    locales: ['US', 'UAE', 'SA', 'KW', 'QA'],
    device_platforms: ['mobile', 'desktop']
  },
  'clothing': {
    interests: ['Fashion', 'Zara', 'H&M', 'Streetwear', 'Fashion Accessories'],
    age_range: '16-35',
    genders: [1, 2],
    behaviors: ['ONLINE_FASHION_SHOPPERS'],
    locales: ['US', 'UK', 'CA', 'AU'],
    device_platforms: ['mobile', 'desktop']
  },
  'electronics': {
    interests: ['Technology', 'Gadgets', 'Smartphones', 'Gaming', 'Best Buy'],
    age_range: '18-50',
    genders: [1, 2],
    behaviors: ['TECH_EARLY_ADOPTERS'],
    locales: ['US', 'JP', 'KR', 'DE'],
    device_platforms: ['desktop', 'mobile']
  },
  'home_decor': {
    interests: ['Home Decor', 'Interior Design', 'Furniture', 'IKEA', 'Wayfair'],
    age_range: '25-55',
    genders: [2],
    behaviors: ['HOME_OWNERS'],
    locales: ['US', 'CA', 'UK', 'AU'],
    device_platforms: ['mobile', 'desktop']
  },
  'beauty': {
    interests: ['Makeup', 'Skincare', 'Cosmetics', 'Sephora', 'Beauty Products'],
    age_range: '18-40',
    genders: [2],
    behaviors: ['BEAUTY_ENTHUSIASTS'],
    locales: ['US', 'UK', 'FR', 'BR'],
    device_platforms: ['mobile']
  },
  'fitness': {
    interests: ['Fitness', 'Gym', 'Workout', 'Yoga', 'Crossfit'],
    age_range: '18-45',
    genders: [1, 2],
    behaviors: ['FITNESS_ENTHUSIASTS'],
    locales: ['US', 'CA', 'AU', 'DE'],
    device_platforms: ['mobile', 'desktop']
  }
}

export function getTargetingForCategory(category: string) {
  return targetingTemplates[category.toLowerCase()] || targetingTemplates['clothing']
}