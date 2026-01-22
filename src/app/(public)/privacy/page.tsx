import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ICEwhistle Privacy Policy - No accounts. No tracking. Location rounded for privacy.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 22, 2025'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* TL;DR */}
          <section>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-bold text-primary text-lg mb-2">No accounts. No tracking. Location rounded for privacy.</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>No account required</strong> — use the app without signing up</li>
                <li>• <strong>No analytics or tracking</strong> — zero third-party tracking services</li>
                <li>• <strong>Location rounded to ~100m</strong> — we never store precise GPS coordinates</li>
                <li>• <strong>Recordings stay on device</strong> — never uploaded anywhere</li>
                <li>• <strong>Alerts auto-delete after 8 hours</strong></li>
              </ul>
            </div>
          </section>

          {/* What We Collect */}
          <section>
            <h2 className="text-xl font-semibold mb-3">What We Collect</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4">Data Type</th>
                    <th className="text-left py-2 pr-4">Collected</th>
                    <th className="text-left py-2 pr-4">Shared</th>
                    <th className="text-left py-2">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">Approximate Location</td>
                    <td className="py-2 pr-4">Yes (if you report)</td>
                    <td className="py-2 pr-4">Yes (with other users)</td>
                    <td className="py-2">Community alerts</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">Push Token</td>
                    <td className="py-2 pr-4">Yes (if you enable)</td>
                    <td className="py-2 pr-4">No</td>
                    <td className="py-2">Send notifications</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">Language Preference</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2 pr-4">No</td>
                    <td className="py-2">Display content</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Recordings</td>
                    <td className="py-2 pr-4">No (device only)</td>
                    <td className="py-2 pr-4">No</td>
                    <td className="py-2">N/A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Alert Reports */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Alert Reports</h2>
            <p className="text-muted-foreground mb-4">
              When you submit an alert report:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>Location is rounded to ~100 meters</strong> — we intentionally reduce precision
                to protect your privacy while still being useful for the community.
              </li>
              <li>
                <strong>Reports are anonymous</strong> — no account, name, or identifying information
                is attached to your report.
              </li>
              <li>
                <strong>Auto-deleted after 8 hours</strong> — reports automatically expire and are
                removed from the database.
              </li>
              <li>
                <strong>Shared with other users</strong> — approved reports appear on the community
                map so others can see activity in their area.
              </li>
            </ul>
          </section>

          {/* Push Notifications */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Push Notifications</h2>
            <p className="text-muted-foreground mb-4">
              If you enable push notifications:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>Push token stored</strong> — we store your device's push notification token
                to send you alerts.
              </li>
              <li>
                <strong>No other use</strong> — the token is only used to deliver notifications,
                not for tracking or advertising.
              </li>
              <li>
                <strong>ZIP code for targeting</strong> — if you set a location preference, we use
                ZIP code (not precise location) to send relevant alerts.
              </li>
              <li>
                <strong>You can opt out anytime</strong> — disable notifications in app settings
                or your device settings.
              </li>
            </ul>
          </section>

          {/* Recordings */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Recordings</h2>
            <p className="text-muted-foreground mb-4">
              When you use the recording feature:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>Recordings never leave your device</strong> — video and audio are saved
                directly to your device's storage.
              </li>
              <li>
                <strong>No upload to any server</strong> — we do not have access to your recordings.
              </li>
              <li>
                <strong>You control your files</strong> — recordings are yours to keep, share,
                or delete as you choose.
              </li>
            </ul>
          </section>

          {/* No Tracking */}
          <section>
            <h2 className="text-xl font-semibold mb-3">No Analytics or Third-Party Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We do not use any analytics or tracking services:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• No Google Analytics</li>
              <li>• No Mixpanel, Amplitude, or similar</li>
              <li>• No Facebook Pixel or advertising trackers</li>
              <li>• No crash reporting services (Sentry, Crashlytics)</li>
              <li>• No Vercel Analytics</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We don't track how you use the app, what pages you visit, or how long you spend
              on any screen.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>

            <h3 className="text-lg font-medium mt-4 mb-2">Mapbox</h3>
            <p className="text-muted-foreground mb-4">
              We use Mapbox to display maps in the app. When you view the map:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Mapbox receives the map area you're viewing to render map tiles</li>
              <li>• We do not send your stored location preferences to Mapbox</li>
              <li>• Mapbox has their own privacy policy: <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com/legal/privacy</a></li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Supabase</h3>
            <p className="text-muted-foreground mb-4">
              We use Supabase to store alert data and push notification preferences. All data
              is encrypted in transit and at rest.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>✓ <strong>Data encrypted in transit</strong> — all connections use HTTPS/TLS</li>
              <li>✓ <strong>Data can be deleted</strong> — alerts auto-expire after 8 hours</li>
              <li>✓ <strong>No data sold</strong> — we never sell your information</li>
              <li>✓ <strong>Minimal data collection</strong> — we only collect what's necessary</li>
            </ul>
          </section>

          {/* What We Don't Collect */}
          <section>
            <h2 className="text-xl font-semibold mb-3">What We Do NOT Collect</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>• Your name, email, or phone number</li>
              <li>• Precise GPS coordinates or location history</li>
              <li>• Device identifiers or advertising IDs</li>
              <li>• Browsing history or app usage patterns</li>
              <li>• Contacts, photos, or other personal files</li>
              <li>• Immigration status or any legal information</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>Delete your data:</strong> Use "Delete my device data" in Settings to
                clear all local data and unregister your push token.
              </li>
              <li>
                <strong>Opt out of notifications:</strong> Disable anytime in app or device settings.
              </li>
              <li>
                <strong>Use without any data:</strong> Know-your-rights information works without
                providing any personal information.
              </li>
            </ul>
          </section>

          {/* California Privacy */}
          <section>
            <h2 className="text-xl font-semibold mb-3">California Privacy Rights (CCPA)</h2>
            <p className="text-muted-foreground">
              California residents: Because we collect minimal data and do not sell personal
              information, most CCPA provisions are already satisfied. You may request information
              about data collection or deletion through the app's settings.
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
            <p className="text-muted-foreground">
              ICEwhistle does not knowingly collect personal information from children under 13.
              The app provides educational know-your-rights information that may be useful for
              families.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this policy from time to time. Significant changes will be posted
              here with an updated date.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm">
                <strong>ICEwhistle</strong><br />
                Website: <a href="https://icewhistle.app" className="text-primary hover:underline">icewhistle.app</a><br />
                Email: privacy@icewhistle.app
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground italic">
              ICEwhistle is a community project that provides general information for
              educational purposes. It is not affiliated with any government agency and
              does not provide legal advice. For advice about your specific situation,
              please consult a qualified immigration attorney.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
