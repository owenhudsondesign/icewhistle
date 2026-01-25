'use client'

import Link from 'next/link'
import { AppHeader } from '@/components/shared/AppHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import {
  Server,
  Globe,
  Wrench,
  FileCheck,
  Shield,
  Heart,
  Lock,
  ExternalLink,
} from 'lucide-react'

export default function SupportPage() {
  const { t } = useLanguage()
  const support = t.support

  const supportItems = [
    { icon: Server, label: support.hosting },
    { icon: Globe, label: support.translation },
    { icon: Wrench, label: support.maintenance },
    { icon: FileCheck, label: support.legal },
  ]

  const trustItems = [
    support.donationsOptional,
    support.donationsSecure,
    support.noStoreDonorInfo,
    support.accessNeverGated,
  ]

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader showBack />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-3">{support.title}</h1>
          <p className="text-muted-foreground">
            {support.intro}
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed">
              {support.mission}
            </p>
          </CardContent>
        </Card>

        {/* How support is used */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">{support.howUsed}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {support.helps}
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
              {support.transparency}
            </p>
          </CardContent>
        </Card>

        {/* Privacy & trust */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#84CC16]" />
            {support.privacyTrust}
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
          {support.closing}
        </p>

        {/* Donation section */}
        <div className="border-t pt-8">
          <p className="text-xs text-muted-foreground text-center mb-4">
            {support.processed}
          </p>

          {/* OpenCollective iframe */}
          <div className="rounded-lg overflow-hidden border mb-4">
            <iframe
              src="https://opencollective.com/embed/icewhistle-app/donate"
              style={{ width: '100%', minHeight: '400px', border: 'none' }}
              title="Donate to ICEwhistle via OpenCollective"
            />
          </div>

          {/* Alternative: External link */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              {support.preferDirect}
            </p>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://opencollective.com/icewhistle-app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {support.openInOC}
              </a>
            </Button>
          </div>
        </div>

        {/* Footer privacy reminder */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>{support.infrastructure}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
