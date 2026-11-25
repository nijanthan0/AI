// API Client for PyLearn FastAPI Backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

export interface BillingPlan {
  id: 'monthly' | 'annual'
  name: string
  price: number
  interval: string
  discount_percent: number
  features: string[]
}

export interface SubscriptionStatus {
  is_pro: boolean
  plan_type: 'free' | 'monthly' | 'annual' | 'lifetime'
  status: 'active' | 'trialing' | 'canceled' | 'none' | 'expired'
  current_period_end?: string
  cancel_at_period_end: boolean
  customer_portal_url?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_pro: boolean
  plan_type: string
}

function getAuthHeaders(token?: string | null): Record<string, string> {
  const t = token || localStorage.getItem('pylearn_auth_token') || 'mock_developer_user'
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${t}`
  }
}

export const api = {
  // 1. Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`)
      return await res.json()
    } catch (e) {
      return { status: 'offline' }
    }
  },

  // 2. Fetch Subscription Plans (Netflix-style Monthly vs Discounted Annual)
  async getPlans(): Promise<BillingPlan[]> {
    try {
      const res = await fetch(`${API_BASE}/billing/plans`)
      if (!res.ok) throw new Error('Failed to fetch plans')
      return await res.json()
    } catch (e) {
      // Fallback defaults
      return [
        {
          id: 'monthly',
          name: 'Pro Monthly Pass',
          price: 499,
          interval: 'month',
          discount_percent: 0,
          features: [
            '120+ Optimal LeetCode Solutions & Complexity proofs',
            'Real-Time System Design Architecture Scenarios',
            'Interactive AI Debugging Mentor',
            'Cancel anytime in 1 click'
          ]
        },
        {
          id: 'annual',
          name: 'Pro Annual Pass (Recommended)',
          price: 3999,
          interval: 'year',
          discount_percent: 35,
          features: [
            'Everything in Monthly Pass',
            'Save 35% compared to monthly (Just ₹333/month)',
            'Official Verified Course Completion Certificate',
            'Direct 1-Click Capstone GitHub Portfolio Export',
            'Priority Access to all future AI & Systems modules'
          ]
        }
      ]
    }
  },

  // 3. Subscription Status
  async getSubscriptionStatus(token?: string | null): Promise<SubscriptionStatus> {
    try {
      const res = await fetch(`${API_BASE}/billing/status`, {
        headers: getAuthHeaders(token)
      })
      if (!res.ok) throw new Error('Failed')
      return await res.json()
    } catch {
      return {
        is_pro: false,
        plan_type: 'free',
        status: 'none',
        cancel_at_period_end: false
      }
    }
  },

  // 4. Activate or Upgrade Plan
  async activatePlan(planType: 'monthly' | 'annual', token?: string | null) {
    const res = await fetch(`${API_BASE}/billing/activate-simulated?plan_type=${planType}`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    })
    return await res.json()
  },

  // 5. Cloud Progress Sync
  async syncProgress(courseId: string, slideId: string | number, completed = true, savedCode?: string) {
    try {
      const numericId = typeof slideId === 'number' ? slideId : parseInt(String(slideId).replace(/\D/g, '') || '0', 10)
      await fetch(`${API_BASE}/progress/sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          course_id: courseId,
          slide_id: numericId,
          completed,
          saved_code: savedCode
        })
      })
    } catch {
      // Offline fallback: handled by localStorage
    }
  },

  // 6. AI Mentor Hint
  async getAiHint(slideId: number, userCode: string, errorMessage = '') {
    try {
      const res = await fetch(`${API_BASE}/ai/hint`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          slide_id: slideId,
          user_code: userCode,
          error_message: errorMessage
        })
      })
      return await res.json()
    } catch {
      return {
        hint: '🤖 AI Mentor: Verify syntax, base cases, and step through loop iterations.',
        remaining_daily_hints: 'Offline Mode'
      }
    }
  }
}
