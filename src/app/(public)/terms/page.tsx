import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, AlertTriangle } from 'lucide-react'
import { PageWrapper } from '@/components/shared/PageWrapper'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ICEwhistle Terms of Service - Rules and guidelines for using the app responsibly.',
}

export default function TermsOfServicePage() {
  const lastUpdated = 'January 21, 2026'
  const effectiveDate = 'January 21, 2026'

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-8">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-500 mb-1">Important Legal Notice</p>
              <p className="text-sm text-muted-foreground">
                ICEwhistle provides general information for educational purposes only.
                <strong> This app does not provide legal advice</strong> and is not a substitute
                for consultation with a qualified immigration attorney. ICEwhistle is not
                affiliated with any government agency.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using ICEwhistle ("the App"), you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree to these Terms, please do not
              use the App.
            </p>
            <p className="text-muted-foreground">
              These Terms apply to all users of the App, including users who contribute
              content, information, or other materials through the App.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              ICEwhistle is a community resource that provides:
            </p>
            <ul className="text-muted-foreground space-y-2 mb-4">
              <li>• General information about constitutional rights</li>
              <li>• Community-shared safety updates and information</li>
              <li>• Emergency contact information and hotlines</li>
              <li>• Links to legal aid resources and organizations</li>
              <li>• Educational materials about immigration processes</li>
            </ul>
            <p className="text-muted-foreground">
              The App is provided free of charge and is maintained by a community of volunteers.
            </p>
          </section>

          {/* Not Legal Advice */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Not Legal Advice</h2>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
              <p className="text-sm font-medium">
                THE INFORMATION PROVIDED BY ICEWHISTLE IS FOR GENERAL EDUCATIONAL AND
                INFORMATIONAL PURPOSES ONLY. IT IS NOT LEGAL ADVICE AND SHOULD NOT BE
                RELIED UPON AS SUCH.
              </p>
            </div>
            <ul className="text-muted-foreground space-y-2">
              <li>
                • Every legal situation is unique. The information in the App may not apply
                to your specific circumstances.
              </li>
              <li>
                • Immigration law is complex and changes frequently. Information may become
                outdated.
              </li>
              <li>
                • For advice about your specific situation, you must consult with a qualified
                immigration attorney.
              </li>
              <li>
                • Using the App does not create an attorney-client relationship.
              </li>
            </ul>
          </section>

          {/* Not Government Affiliated */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Not Government Affiliated</h2>
            <p className="text-muted-foreground">
              ICEwhistle is an independent community project. It is <strong>not affiliated
              with, endorsed by, or connected to</strong> any government agency, including but
              not limited to U.S. Immigration and Customs Enforcement (ICE), U.S. Customs and
              Border Protection (CBP), the Department of Homeland Security (DHS), or any other
              federal, state, or local government entity.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. User Responsibilities</h2>
            <p className="text-muted-foreground mb-4">By using the App, you agree to:</p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                <strong>Use the App lawfully:</strong> You will not use the App for any
                unlawful purpose or in violation of any applicable laws.
              </li>
              <li>
                <strong>Provide accurate information:</strong> If you submit community reports,
                you will provide truthful and accurate information to the best of your knowledge.
              </li>
              <li>
                <strong>Not interfere with law enforcement:</strong> You will not use the App
                to interfere with, obstruct, or evade lawful law enforcement activities.
              </li>
              <li>
                <strong>Respect others:</strong> You will not submit content that is harassing,
                threatening, defamatory, or discriminatory.
              </li>
              <li>
                <strong>Not misuse the service:</strong> You will not attempt to disrupt,
                damage, or gain unauthorized access to the App or its systems.
              </li>
            </ul>
          </section>

          {/* Community Reports */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Community Reports</h2>
            <p className="text-muted-foreground mb-4">
              The App allows users to share community safety information. Regarding these reports:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>
                • Reports are user-submitted and may not be verified. ICEwhistle does not
                guarantee the accuracy of any community report.
              </li>
              <li>
                • Reports are subject to moderation and may be removed if they violate these Terms.
              </li>
              <li>
                • False reports submitted knowingly or maliciously are prohibited.
              </li>
              <li>
                • By submitting a report, you grant ICEwhistle a non-exclusive license to
                display and distribute the report through the App.
              </li>
              <li>
                • Do not include personal identifying information about specific individuals
                in reports.
              </li>
            </ul>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">You may not use the App to:</p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Submit false, misleading, or malicious reports</li>
              <li>• Harass, threaten, or harm any individual or group</li>
              <li>• Impersonate any person or entity</li>
              <li>• Collect personal information about other users</li>
              <li>• Interfere with or disrupt the App's functionality</li>
              <li>• Attempt to circumvent security measures</li>
              <li>• Use automated systems to access the App without permission</li>
              <li>• Facilitate any illegal activity</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The App and its original content, features, and functionality are owned by
              the ICEwhistle community and are protected by applicable intellectual property
              laws. The App is made available as an open-source project, and contributions
              are governed by the applicable open-source license.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Disclaimer of Warranties</h2>
            <div className="p-4 rounded-lg bg-muted/30 mb-4">
              <p className="text-sm">
                THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
                KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
                OR ACCURACY.
              </p>
            </div>
            <p className="text-muted-foreground">
              We do not warrant that the App will be uninterrupted, error-free, or secure,
              or that any information provided through the App is accurate, complete, or
              current.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ICEWHISTLE AND ITS VOLUNTEERS,
              CONTRIBUTORS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>• Loss of profits, data, or other intangible losses</li>
              <li>• Damages resulting from reliance on information provided by the App</li>
              <li>• Damages resulting from unauthorized access to your data</li>
              <li>• Any other damages arising from your use of the App</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless ICEwhistle and its volunteers,
              contributors, and affiliates from any claims, damages, losses, or expenses
              (including reasonable attorney's fees) arising from your use of the App,
              your violation of these Terms, or your violation of any rights of another.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users
              of significant changes by posting the updated Terms on this page and updating
              the "Last updated" date. Your continued use of the App after changes are posted
              constitutes your acceptance of the modified Terms.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-semibold mb-3">13. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your access to the App at any time,
              without notice, for conduct that we believe violates these Terms or is harmful
              to other users, the App, or third parties, or for any other reason in our sole
              discretion.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-semibold mb-3">14. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of
              the United States, without regard to its conflict of law provisions. Any disputes
              arising from these Terms or your use of the App shall be resolved in the
              appropriate courts of the United States.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-xl font-semibold mb-3">15. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is found to be unenforceable or invalid, that
              provision shall be limited or eliminated to the minimum extent necessary, and
              the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3">16. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm">
                <strong>ICEwhistle</strong><br />
                Website: <a href="https://icewhistle.app" className="text-primary underline underline-offset-2">icewhistle.app</a><br />
                Email: legal@icewhistle.app
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground italic">
              By using ICEwhistle, you acknowledge that you have read, understood, and agree
              to be bound by these Terms of Service and our{' '}
              <Link href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </section>
        </div>
        </div>
      </div>
    </PageWrapper>
  )
}
