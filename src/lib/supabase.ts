import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Browser client (for client components)
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server client (for API routes and server components)
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

// Types for Supabase tables (extend as needed)
export type Tables = {
  sessions: {
    id: string
    created_at: string
    last_active_at: string
    device_hash: string | null
    preferences: Record<string, unknown> | null
  }
  alerts: {
    id: string
    latitude: number
    longitude: number
    address: string | null
    neighborhood: string | null
    alert_type: string
    description: string | null
    status: string
    verification_count: number
    reported_at: string
    occurred_at: string
    resolved_at: string | null
    expires_at: string
    reporter_session_id: string | null
    verifier_hashes: string[]
  }
}
