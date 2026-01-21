'use client'

import Link from 'next/link'
import { AppHeader } from '@/components/shared/AppHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage, commonTranslations } from '@/hooks/use-language'
import {
  Server,
  Globe,
  Wrench,
  FileCheck,
  Shield,
  ExternalLink,
  Lock,
} from 'lucide-react'

export default function SupportPage() {
  const { language } = useLanguage()
  const t = commonTranslations[language]

  const supportItems = [
    { icon: Server, label: t.supportHosting },
    { icon: Globe, label: t.supportTranslation },
    { icon: Wrench, label: t.supportMaintenance },
    { icon: FileCheck, label: t.supportLegal },
  ]

  const trustItems = [
    t.donationsOptional,
    t.donationsSecure,
    t.noStoreDonorInfo,
    t.accessNeverGated,
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBack title={t.supportTitle} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-3">{t.supportTitle}</h1>
          <p className="text-muted-foreground">
            {t.supportIntro}
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed">
              {t.supportMission}
            </p>
          </CardContent>
        </Card>

        {/* How support is used */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">{t.howSupportUsed}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t.supportHelps}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {supportItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency note */}
        <Card className="mb-6 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.supportTransparency}
            </p>
          </CardContent>
        </Card>

        {/* Privacy & trust */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#84CC16]" />
            {t.privacyTrust}
          </h2>
          <ul className="space-y-2">
            {trustItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-[#84CC16] mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Closing statement */}
        <p className="text-sm text-muted-foreground text-center mb-8">
          {t.supportClosing}
        </p>

        {/* Donation section */}
        <div className="border-t pt-8">
          <p className="text-xs text-muted-foreground text-center mb-4">
            {t.donationsProcessed}
          </p>

          {/* OpenCollective iframe */}
          <div className="rounded-lg overflow-hidden border mb-4">
            <iframe
              src="https://opencollective.com/embed/icewhistle/donate"
              style={{ width: '100%', minHeight: '400px', border: 'none' }}
              title="Donate to ICEwhistle via OpenCollective"
            />
          </div>

          {/* Alternative: External link */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              {t.preferDirect}
            </p>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://opencollective.com/icewhistle"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t.openInOC}
              </a>
            </Button>
          </div>
        </div>

        {/* Footer privacy reminder */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>{t.supportInfrastructure}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
