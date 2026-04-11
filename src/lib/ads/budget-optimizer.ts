export class BudgetOptimizer {
  async optimizeBudget(campaigns: Array<{ id: string; spend: number; sales: number; budget: number }>) {
    // Calculate ROAS for each campaign
    const campaignsWithRoas = campaigns.map(campaign => ({
      ...campaign,
      roas: campaign.spend > 0 ? campaign.sales / campaign.spend : 0
    }))
    
    // Sort by ROAS
    const sorted = campaignsWithRoas.sort((a, b) => b.roas - a.roas)
    
    // Pause campaigns with ROAS < 0.5
    const toPause = sorted.filter(c => c.roas < 0.5)
    const active = sorted.filter(c => c.roas >= 0.5)
    
    // Redistribute budget to top performers
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
    const totalRoas = active.reduce((sum, c) => sum + c.roas, 0)
    
    const newBudgets = active.map(campaign => ({
      id: campaign.id,
      budget: totalBudget * (campaign.roas / totalRoas)
    }))
    
    return {
      budgets: newBudgets,
      paused: toPause.map(c => c.id),
      recommendations: {
        increaseBudget: active[0]?.id,
        decreaseBudget: active[active.length - 1]?.id
      }
    }
  }
}