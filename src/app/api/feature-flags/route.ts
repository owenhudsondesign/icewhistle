import { NextRequest, NextResponse } from 'next/server'

// Feature flags (hardcoded - no database needed)
const FLAGS: Record<string, { enabled: boolean; platforms: string[] }> = {
  // Reporting submission controls (can disable per-platform for App Store compliance)
  reporting_submit_enabled_web: { enabled: true, platforms: ['web'] },
  reporting_submit_enabled_ios: { enabled: false, platforms: ['ios'] },
  reporting_submit_enabled_android: { enabled: false, platforms: ['android'] },

  // Report viewing (community updates)
  reporting_view_enabled_web: { enabled: true, platforms: ['web'] },
  reporting_view_enabled_ios: { enabled: true, platforms: ['ios'] },
  reporting_view_enabled_android: { enabled: true, platforms: ['android'] },

  // Push notifications
  push_enabled: { enabled: true, platforms: ['ios', 'android'] },
  push_enabled_ios: { enabled: true, platforms: ['ios'] },
  push_enabled_android: { enabled: true, platforms: ['android'] },

  // Notify only on moderated/approved reports (App Store requirement)
  notify_on_approved_only: { enabled: true, platforms: ['ios', 'android', 'web'] },

  // Global kill switches
  maintenance_mode: { enabled: false, platforms: ['web', 'ios', 'android'] },
  emergency_disable_all: { enabled: false, platforms: ['web', 'ios', 'android'] },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform') || 'web'

  // Filter flags by platform
  const filteredFlags: Record<string, boolean> = {}
  for (const [key, config] of Object.entries(FLAGS)) {
    if (config.platforms.includes(platform) || config.platforms.length === 0) {
      filteredFlags[key] = config.enabled
    }
  }

  return NextResponse.json({
    flags: filteredFlags,
    platform,
    timestamp: new Date().toISOString(),
  })
}
