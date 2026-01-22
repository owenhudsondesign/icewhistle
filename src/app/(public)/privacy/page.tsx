import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ICEwhistle Privacy Policy - Learn how we protect your privacy with no accounts, no tracking, and minimal data collection.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 21, 2026'

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
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Our Commitment to Privacy</h2>
            <p className="text-muted-foreground mb-4">
              ICEwhistle is designed with privacy as a core principle. We believe that access to
              know-your-rights information and community safety resources should not require
              sacrificing your privacy. This policy explains what data we collect, how we use it,
              and your rights.
            </p>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="font-medium text-primary mb-2">Privacy-First Design:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>No account required</strong> - Use the app without signing up</li>
                <li>• <strong>No tracking or analytics</strong> - We don't track your behavior</li>
                <li>• <strong>No precise location</strong> - We only use ZIP code, never GPS</li>
                <li>• <strong>No advertising</strong> - We don't show ads or sell data</li>
                <li>• <strong>Works offline</strong> - Critical features work without internet</li>
              </ul>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>

            <h3 className="text-lg font-medium mt-4 mb-2">Information You Provide (Optional)</h3>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>
                <strong>ZIP Code:</strong> If you choose to set your home area for location-based
                community updates. We never collect or store your precise GPS location.
              </li>
              <li>
                <strong>Language Preference:</strong> Your selected language (English, Spanish,
                or Portuguese) to display content in your preferred language.
              </li>
              <li>
                <strong>Notification Preferences:</strong> If you opt-in to push notifications,
                we store your push token and notification settings.
              </li>
              <li>
                <strong>Community Reports:</strong> If you choose to submit a community report,
                the report content and approximate location (rounded to protect privacy).
              </li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Information We Do NOT Collect</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>• Your name, email, or phone number</li>
              <li>• Precise GPS location or location history</li>
              <li>• Device identifiers or advertising IDs</li>
              <li>• Browsing history or app usage patterns</li>
              <li>• Contacts, photos, or other personal files</li>
              <li>• Immigration status or any legal information</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Information</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>ZIP Code:</strong> To show community updates relevant to your general area
                and send location-based notifications if enabled.
              </li>
              <li>
                <strong>Language Preference:</strong> To display the app and send notifications
                in your preferred language.
              </li>
              <li>
                <strong>Push Token:</strong> To deliver notifications about community updates
                in your area (only if you opt-in).
              </li>
              <li>
                <strong>Community Reports:</strong> To share community safety information with
                other users in the relevant area, after moderation review.
              </li>
            </ul>
          </section>

          {/* Data Storage */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Storage and Security</h2>
            <p className="text-muted-foreground mb-4">
              Most of your preferences are stored locally on your device and never leave it.
              If you opt-in to notifications, minimal data (ZIP code, language, push token)
              is stored on our secure servers.
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Data is encrypted in transit using TLS/HTTPS</li>
              <li>• Server data is stored in secure, access-controlled databases</li>
              <li>• We do not store IP addresses with user data</li>
              <li>• Community reports are reviewed before publication</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, rent, or share your personal information with third parties
              for marketing purposes. We may share data only in the following circumstances:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>Service Providers:</strong> We use Mapbox for maps (they receive only
                the map area being viewed, not your stored location) and push notification
                services to deliver alerts.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information if required
                by law, such as in response to a valid court order. We will attempt to notify
                affected users when legally permitted.
              </li>
              <li>
                <strong>Community Reports:</strong> Reports you submit may be shared publicly
                with other app users after moderation, but without any identifying information.
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights and Choices</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>Delete Your Data:</strong> Use the "Delete my device data" option in
                Settings to clear all local data and unregister your push notification token.
              </li>
              <li>
                <strong>Opt-Out of Notifications:</strong> Disable notifications at any time
                in the app settings or your device settings.
              </li>
              <li>
                <strong>Change Preferences:</strong> Update your ZIP code, language, or
                notification settings at any time.
              </li>
              <li>
                <strong>Use Without Data:</strong> You can use the app's know-your-rights
                information and resources without providing any personal information.
              </li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
            <p className="text-muted-foreground">
              ICEwhistle is designed for general audiences and does not knowingly collect
              personal information from children under 13. The app provides educational
              know-your-rights information that may be useful for families. If you believe
              a child has provided personal information, please contact us to have it removed.
            </p>
          </section>

          {/* California Privacy Rights */}
          <section>
            <h2 className="text-xl font-semibold mb-3">California Privacy Rights</h2>
            <p className="text-muted-foreground">
              California residents have additional rights under the California Consumer Privacy
              Act (CCPA). Because we collect minimal data and do not sell personal information,
              most CCPA provisions are already satisfied by our privacy practices. California
              residents may request information about data collection and request deletion
              through the app's settings or by contacting us.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-xl font-semibold mb-3">International Users</h2>
            <p className="text-muted-foreground">
              ICEwhistle is primarily designed for use in the United States. If you access
              the app from outside the United States, please be aware that your information
              may be transferred to and processed in the United States. By using the app,
              you consent to this transfer.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes by posting the new policy on this page and updating the
              "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or our privacy practices,
              please contact us:
            </p>
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
