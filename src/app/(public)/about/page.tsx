import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  Shield,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Video,
  Bell,
  Map,
  Lock
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About & How It Works',
  description: 'How ICEwhistle works: No accounts, no tracking, location rounded for privacy. Learn about our privacy-first design.',
}

export default function AboutPage() {
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
            <h1 className="text-3xl font-bold">How ICEwhistle Works</h1>
            <p className="text-sm text-muted-foreground">Transparency & Privacy</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* TL;DR */}
          <section>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-bold text-primary text-lg mb-2">
                No accounts. No tracking. Location rounded for privacy.
              </p>
              <p className="text-sm text-muted-foreground">
                ICEwhistle is designed to protect your privacy while helping communities stay informed.
                We collect the minimum data necessary and never track you.
              </p>
            </div>
          </section>

          {/* Location Privacy */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Location Privacy</h2>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Rounded to ~500 meter grid</p>
                  <p className="text-sm text-muted-foreground">
                    Your exact coordinates are never stored. We round to a 500m grid,
                    which covers roughly 4-6 city blocks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Random offset added</p>
                  <p className="text-sm text-muted-foreground">
                    We add a random offset of ±100m so even the grid position is unpredictable.
                    This makes it impossible to reverse-engineer your exact location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Result: Neighborhood-level only</p>
                  <p className="text-sm text-muted-foreground">
                    Reports identify a general area, not a specific address. You cannot
                    be identified by your report location.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">What We Collect</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">Data</th>
                    <th className="text-left py-2 pr-4 font-medium">When</th>
                    <th className="text-left py-2 font-medium">Retention</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Approximate location (~500m)</td>
                    <td className="py-3 pr-4">When you submit a report</td>
                    <td className="py-3">8 hours (auto-deleted)</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Push notification token</td>
                    <td className="py-3 pr-4">If you enable notifications</td>
                    <td className="py-3">Until you opt out</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">ZIP code preference</td>
                    <td className="py-3 pr-4">If you set alert area</td>
                    <td className="py-3">Until you change it</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Language preference</td>
                    <td className="py-3 pr-4">When you select language</td>
                    <td className="py-3">Stored on device only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* What We DON'T Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">What We Don't Collect</h2>
            </div>

            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Your name, email, or phone number</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Precise GPS coordinates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Device identifiers or advertising IDs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Browsing history or app usage patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Analytics data (no Google Analytics, Mixpanel, etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Crash reports (no Sentry, Crashlytics, etc.)</span>
              </li>
            </ul>
          </section>

          {/* Recordings */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Recordings</h2>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="font-medium text-green-600 dark:text-green-400 mb-2">
                Recordings never leave your device
              </p>
              <p className="text-sm text-muted-foreground">
                When you record video or audio, it saves directly to your device's storage.
                We never upload, access, or store your recordings. They are 100% yours.
              </p>
            </div>
          </section>

          {/* Alert Reports */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Alert Reports</h2>
            </div>

            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Anonymous:</strong> No account required. No identifying information attached.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Auto-expire:</strong> Reports automatically delete after 8 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Community verified:</strong> Other users can confirm reports to increase visibility.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Shared publicly:</strong> Reports appear on the community map for others to see.</span>
              </li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Third-Party Services</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="font-medium mb-1">Mapbox (Maps)</p>
                <p className="text-sm text-muted-foreground mb-2">
                  We use Mapbox to display maps. When you view the map, Mapbox receives
                  the map area you're viewing to load map tiles. We do not send your
                  stored location preferences to Mapbox.
                </p>
                <a
                  href="https://www.mapbox.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Mapbox Privacy Policy →
                </a>
              </div>

              <div className="p-4 rounded-lg bg-muted/30">
                <p className="font-medium mb-1">Supabase (Database)</p>
                <p className="text-sm text-muted-foreground">
                  Alert data and notification preferences are stored on Supabase servers.
                  All data is encrypted in transit and at rest.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>

            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>All connections encrypted (HTTPS/TLS)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Data automatically deleted after 8 hours</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No data sold to third parties</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Open source (code available for audit)</span>
              </li>
            </ul>
          </section>

          {/* Links */}
          <section className="pt-6 border-t border-border">
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-primary hover:underline text-sm">
                Full Privacy Policy →
              </Link>
              <Link href="/terms" className="text-primary hover:underline text-sm">
                Terms of Service →
              </Link>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              ICEwhistle is a community project providing general information for educational purposes.
              It is not affiliated with any government agency and does not provide legal advice.
              For advice about your specific situation, please consult a qualified immigration attorney.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
