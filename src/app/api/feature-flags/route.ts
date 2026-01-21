import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Default feature flags (used when database is unavailable or for new deployments)
const DEFAULT_FLAGS: Record<string, { enabled: boolean; platforms: string[] }> = {
  // Reporting submission controls (can disable per-platform for App Store compliance)
  reporting_submit_enabled_web: { enabled: true, platforms: ['web'] },
  reporting_submit_enabled_ios: { enabled: false, platforms: ['ios'] }, // Start disabled for iOS v1
  reporting_submit_enabled_android: { enabled: false, platforms: ['android'] }, // Start disabled for Android v1

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
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') || 'web'

    // Try to fetch from database
    let flags: Record<string, boolean> = {}

    try {
      const dbFlags = await prisma.featureFlag.findMany({
        where: {
          OR: [
            { platforms: { has: platform } },
            { platforms: { isEmpty: true } }, // Empty means all platforms
          ],
        },
      })

      // Convert to simple key-value object
      for (const flag of dbFlags) {
        // Apply rollout percentage
        if (flag.rolloutPercent < 100) {
          const randomValue = Math.random() * 100
          flags[flag.key] = flag.enabled && randomValue < flag.rolloutPercent
        } else {
          flags[flag.key] = flag.enabled
        }
      }
    } catch (dbError) {
      // Database unavailable, use defaults
      console.warn('Feature flags database unavailable, using defaults')
    }

    // Merge with defaults (database values take precedence)
    const mergedFlags: Record<string, boolean> = {}
    for (const [key, config] of Object.entries(DEFAULT_FLAGS)) {
      // Check if this flag applies to the requested platform
      if (config.platforms.includes(platform) || config.platforms.length === 0) {
        mergedFlags[key] = flags[key] !== undefined ? flags[key] : config.enabled
      }
    }

    // Add any database-only flags
    for (const [key, value] of Object.entries(flags)) {
      if (!(key in mergedFlags)) {
        mergedFlags[key] = value
      }
    }

    return NextResponse.json({
      flags: mergedFlags,
      platform,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching feature flags:', error)

    // Return safe defaults on error
    return NextResponse.json({
      flags: {
        reporting_submit_enabled_web: true,
        reporting_submit_enabled_ios: false,
        reporting_submit_enabled_android: false,
        reporting_view_enabled_web: true,
        reporting_view_enabled_ios: true,
        reporting_view_enabled_android: true,
        maintenance_mode: false,
      },
      platform: 'web',
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch flags, using defaults',
    })
  }
}
