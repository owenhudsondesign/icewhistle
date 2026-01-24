'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AppHeader } from '@/components/shared/AppHeader'
import {
  AlertTriangle,
  Phone,
  Shield,
  FileX,
  Volume2,
  Building,
  Search,
  ExternalLink,
  ChevronRight,
  Home,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Globe,
  Scale,
  Flag,
  Car,
  User,
  Users,
  MapPin,
  Loader2,
  Radio
} from 'lucide-react'
import { fuzzyLocation, ALERT_EXPIRY_HOURS } from '@/types/alert'
import { useLanguage } from '@/hooks/use-language'

function EmergencyContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'near'
  const location = searchParams.get('location')

  if (type === 'taken') {
    return <SomeoneTakenFlow location={location} />
  }

  if (type === 'vehicle') {
    return <VehicleStopFlow location={location} />
  }

  return <ICENearMeFlow location={location} />
}

function ICENearMeFlow({ location }: { location: string | null }) {
  const { language, t: translations } = useLanguage()
  const t = translations.emergency || {}
  const [reportStatus, setReportStatus] = useState<'idle' | 'getting-location' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleQuickReport = async () => {
    setReportStatus('getting-location')
    setErrorMessage(null)

    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const latitude = fuzzyLocation(position.coords.latitude)
      const longitude = fuzzyLocation(position.coords.longitude)

      setReportStatus('submitting')

      // Submit the alert
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude,
          longitude,
          alertType: 'ice_raid',
          description: 'Quick report from ICE Is Near Me button'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit report')
      }

      setReportStatus('success')
    } catch (err) {
      setReportStatus('error')
      if (err instanceof GeolocationPositionError) {
        setErrorMessage(t.locationError)
      } else {
        setErrorMessage(t.submitError)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t.backToHome}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-destructive mb-2">
          ICE Is Near Me
        </h1>
        <p className="text-muted-foreground">
          Stay calm. You have rights. Follow these steps.
        </p>
        {location && (
          <p className="text-sm text-muted-foreground mt-2">
            Location: {location}
          </p>
        )}
      </div>

      {/* QUICK REPORT - Share Location with Community */}
      <Card className="mb-6 border-2 border-destructive bg-destructive/5">
        <CardContent className="pt-6">
          {reportStatus === 'success' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">
                {t.locationShared}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {t.reportWillAppear} {ALERT_EXPIRY_HOURS} {t.hours}.
              </p>
              <p className="text-xs text-muted-foreground">
                {t.thankYou}
              </p>
              <Link href="/alerts" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t.viewMap}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Radio className="h-5 w-5 text-destructive animate-pulse" />
                <h3 className="text-lg font-bold">{t.alertCommunity}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t.shareAnonymously} {ALERT_EXPIRY_HOURS} {t.hours}.
              </p>

              <Button
                onClick={handleQuickReport}
                disabled={reportStatus === 'getting-location' || reportStatus === 'submitting'}
                className="w-full h-14 text-lg font-bold bg-destructive hover:bg-destructive/90 text-white"
              >
                {reportStatus === 'getting-location' ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t.gettingLocation}
                  </>
                ) : reportStatus === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t.sharing}
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5 mr-2" />
                    {t.shareMyLocation}
                  </>
                )}
              </Button>

              {reportStatus === 'error' && errorMessage && (
                <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
              )}

              <p className="text-xs text-muted-foreground mt-3">
                <strong>{t.oneTimeSnapshot}</strong> — {t.neverTrack}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.anonymous100m}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* IMMEDIATE ACTIONS */}
      <Alert className="mb-6 border-destructive/30 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive">Do These Things NOW</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span><strong>Stay calm.</strong> Do not run.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span><strong>Do NOT open the door</strong> unless they show a warrant signed by a JUDGE.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span><strong>Remain silent.</strong> You do not have to answer questions.</span>
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* WHAT TO SAY */}
      <Card className="mb-6 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            What to Say
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium text-lg text-center">
                "I am exercising my right to remain silent."
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium text-lg text-center">
                "I want to speak to a lawyer."
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium text-lg text-center">
                "I do not consent to your entry."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IF AT HOME */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            If They Are At Your Door
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium">Keep the door closed</p>
                <p className="text-sm text-muted-foreground">You do not have to open it.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium">Ask through the door:</p>
                <p className="text-sm text-muted-foreground">"Do you have a warrant signed by a judge?"</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-medium">Ask to see it</p>
                <p className="text-sm text-muted-foreground">"Please slide the warrant under the door."</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <p className="font-medium">Check the warrant</p>
                <p className="text-sm text-muted-foreground">
                  A <strong>judicial warrant</strong> has a court name and judge's signature.
                  An <strong>ICE warrant (I-200, I-205)</strong> does NOT allow entry.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* WARRANT COMPARISON - QUICK */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="border-green-500/30">
          <CardHeader className="pb-2 bg-green-50 dark:bg-green-900/10">
            <CardTitle className="text-green-700 dark:text-green-400 text-base">
              Judicial Warrant = VALID
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Signed by a JUDGE
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Has court name
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-red-500/30">
          <CardHeader className="pb-2 bg-red-50 dark:bg-red-900/10">
            <CardTitle className="text-red-700 dark:text-red-400 text-base">
              ICE Warrant (I-200) = NOT VALID
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Signed by ICE officer
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                Does NOT allow entry
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* DO NOT */}
      <Card className="mb-6 border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <FileX className="h-5 w-5" />
            Do NOT Do These Things
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Do NOT open the door without a judicial warrant</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Do NOT run or flee</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Do NOT sign any documents</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Do NOT lie or show fake documents</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Do NOT physically resist</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* EMERGENCY CONTACTS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-destructive" />
            Call for Help
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <a
              href="tel:18443631423"
              className="flex items-center justify-between p-4 rounded-lg border-2 border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
            >
              <div>
                <p className="font-medium">United We Dream Hotline</p>
                <p className="text-sm text-muted-foreground">Report ICE activity</p>
              </div>
              <span className="text-xl font-bold text-destructive">1-844-363-1423</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* MORE RESOURCES */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href="/rights">
            <Shield className="h-4 w-4 mr-2" />
            Full Rights Guide
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/resources">
            <Phone className="h-4 w-4 mr-2" />
            All Hotlines
          </Link>
        </Button>
      </div>
    </div>
  )
}

function SomeoneTakenFlow({ location }: { location: string | null }) {
  const { t: translations } = useLanguage()
  const t = translations.emergency || {}

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t.backToHome || 'Back to Home'}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
          <Building className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-700 dark:text-amber-500 mb-2">
          {t.someoneTakenTitle || 'Someone Was Taken by ICE'}
        </h1>
        <p className="text-muted-foreground">
          {t.someoneTakenSubtitle || "Here's how to find them and get help."}
        </p>
        {location && (
          <p className="text-sm text-muted-foreground mt-2">
            Location: {location}
          </p>
        )}
      </div>

      {/* STEP 1: GET A-NUMBER */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</span>
            <div>
              <CardTitle>{t.takenStep1Title || 'Gather Information'}</CardTitle>
              <CardDescription>{t.gatherInfoDesc || 'Full legal name, date of birth, country of origin, A-number if known'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {t.takenStep1Desc || 'The A-Number is a 9-digit number starting with "A" (e.g., A123456789). This is critical for finding someone in custody.'}
          </p>
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium">{t.whereToFind || 'Where to find it:'}</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>• {t.immigrationDocs || 'Previous immigration documents'}</li>
              <li>• {t.workPermit || 'Work permit (EAD card)'}</li>
              <li>• {t.courtPapers || 'Any court papers'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* STEP 2: USE ICE LOCATOR */}
      <Card className="mb-6 border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</span>
            <div>
              <CardTitle>{t.useLocator || 'Use ICE Detainee Locator'}</CardTitle>
              <CardDescription>{t.locatorDesc || 'Online or call 1-888-351-4024 (this can take 24-72 hours to update)'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <a
              href="https://locator.ice.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">{t.detentionLocator || 'ICE Online Detainee Locator'}</p>
                  <p className="text-sm text-muted-foreground">locator.ice.gov</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-primary" />
            </a>

            <a
              href="tel:18883514024"
              className="flex items-center justify-between p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">{t.detentionLocatorDesc || 'ICE Detainee Locator Hotline'}</p>
                  <p className="text-sm text-muted-foreground">{translations.common?.available247 || '24/7'}</p>
                </div>
              </div>
              <span className="font-bold text-primary">1-888-351-4024</span>
            </a>
          </div>

          <div className="mt-4 p-3 bg-amber-500/10 rounded-lg text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-500">{t.note || 'Note'}:</p>
            <p className="text-muted-foreground">
              {t.locatorNote || 'It may take 24-72 hours for someone to appear in the system after arrest. Also check local jails as ICE sometimes holds people in county facilities.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* STEP 3: CONTACT AN ATTORNEY */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</span>
            <div>
              <CardTitle>Contact an Immigration Attorney</CardTitle>
              <CardDescription>Many offer free consultations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <a
              href="tel:3126601370"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">National Immigrant Justice Center</p>
              </div>
              <span className="font-medium text-primary">312-660-1370</span>
            </a>
            <a
              href="https://immigrantjustice.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">NIJC Website</p>
              </div>
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
            <a
              href="https://aila.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium text-sm">Find an Immigration Lawyer (AILA)</p>
              </div>
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* STEP 4: CONSULAR RIGHTS */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</span>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Contact Their Consulate
              </CardTitle>
              <CardDescription>They have a right to consular assistance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Under the Vienna Convention, detained individuals have the right to contact their country's consulate.
            The consulate can:
          </p>
          <ul className="text-sm space-y-1 mb-3">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Visit them in detention
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Help find a lawyer
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Contact family members
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* STEP 5: BOND INFORMATION */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">5</span>
            <div>
              <CardTitle>Understand the Bond Process</CardTitle>
              <CardDescription>Average bond is ~$8,176</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            A bond hearing typically occurs within 2-3 weeks of request. To help their case, gather:
          </p>
          <ul className="text-sm space-y-1 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
              Evidence of community ties (employment, family)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
              Character letters from employers, community members
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
              Documentation showing they are not a flight risk
            </li>
          </ul>

          <p className="text-sm font-medium mb-2">Need help with bond?</p>
          <div className="space-y-2">
            <a
              href="https://communitybailout.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <span className="text-sm">National Bail Fund Network</span>
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
            <a
              href="https://freedomforimmigrants.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <span className="text-sm">Freedom for Immigrants</span>
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* IMPORTANT WARNING */}
      <Alert className="mb-6 border-destructive/30 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive">Critical Warning</AlertTitle>
        <AlertDescription>
          Tell them: <strong>Do NOT sign any documents</strong>, especially "voluntary departure" forms.
          Signing can waive their right to see an immigration judge.
        </AlertDescription>
      </Alert>

      {/* MORE RESOURCES */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href="/resources">
            <Scale className="h-4 w-4 mr-2" />
            All Legal Resources
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/search">
            <Search className="h-4 w-4 mr-2" />
            Search for Help
          </Link>
        </Button>
      </div>
    </div>
  )
}

function VehicleStopFlow({ location }: { location: string | null }) {
  const { t: translations } = useLanguage()
  const t = translations.emergency || {}

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t.backToHome || 'Back to Home'}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
          <Car className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
          {t.trafficStopTitle || 'Traffic Stop'}
        </h1>
        <p className="text-muted-foreground">
          {t.trafficStopSubtitle || 'Know your rights as a driver or passenger'}
        </p>
        {location && (
          <p className="text-sm text-muted-foreground mt-2">
            Location: {location}
          </p>
        )}
      </div>

      {/* IMMEDIATE ACTIONS */}
      <Alert className="mb-6 border-blue-500/30 bg-blue-500/5">
        <Car className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700 dark:text-blue-400">Do These Things NOW</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <span><strong>Pull over safely.</strong> Turn off the engine.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <span><strong>Keep hands visible</strong> on the steering wheel.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <span><strong>Crack window only</strong> — do not fully open.</span>
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* DRIVER VS PASSENGER */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="border-blue-500/30">
          <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-900/10">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-base">
              <User className="h-5 w-5" />
              If You're the DRIVER
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <p className="text-sm font-medium mb-2">You MUST provide:</p>
            <ul className="text-sm space-y-1 mb-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Driver's license
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Vehicle registration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Proof of insurance
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              But you do <strong>NOT</strong> have to answer questions about immigration status or birthplace.
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30">
          <CardHeader className="pb-2 bg-green-50 dark:bg-green-900/10">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400 text-base">
              <Users className="h-5 w-5" />
              If You're a PASSENGER
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <p className="text-sm font-medium mb-2">You have NO obligation to:</p>
            <ul className="text-sm space-y-1 mb-3">
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-green-600" />
                Show any identification
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-green-600" />
                Give your name
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-green-600" />
                Answer any questions
              </li>
            </ul>
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              Passengers can remain completely silent.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* WHAT TO SAY */}
      <Card className="mb-6 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            What to Say / Qué Decir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-medium">"Are you from immigration or the police?"</p>
              <p className="text-sm text-muted-foreground italic">"¿Es usted de inmigración o de la policía?"</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-medium">"I am exercising my right to remain silent."</p>
              <p className="text-sm text-muted-foreground italic">"Estoy ejerciendo mi derecho a permanecer en silencio."</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-medium">"I do not consent to a search."</p>
              <p className="text-sm text-muted-foreground italic">"No doy mi consentimiento para un registro."</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-medium">"Am I free to leave?"</p>
              <p className="text-sm text-muted-foreground italic">"¿Soy libre de irme?"</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-medium">"I want to speak to a lawyer."</p>
              <p className="text-sm text-muted-foreground italic">"Quiero hablar con un abogado."</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STEP BY STEP */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step-by-Step Guide</CardTitle>
          <CardDescription>Paso a Paso</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-medium">Pull Over Safely</p>
                <p className="text-sm text-muted-foreground">Turn off engine. Keep hands on wheel. Don't reach for documents until asked.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-medium">Identify the Officers</p>
                <p className="text-sm text-muted-foreground">ICE uses unmarked cars and may say "police." Ask: "Are you from immigration or police? What agency?"</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-medium">Crack Window Only</p>
                <p className="text-sm text-muted-foreground">Open just enough to pass documents. A fully open window lets officers reach in.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <p className="font-medium">Provide Required Documents (Drivers Only)</p>
                <p className="text-sm text-muted-foreground">License, registration, insurance. Do NOT provide passport, consular ID, or foreign documents.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">5</span>
              <div>
                <p className="font-medium">Exercise Your Right to Remain Silent</p>
                <p className="text-sm text-muted-foreground">Don't answer about birthplace, immigration status, or destination.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">6</span>
              <div>
                <p className="font-medium">Do Not Consent to a Search</p>
                <p className="text-sm text-muted-foreground">ICE needs a warrant, probable cause, or your consent. Say: "I do not consent." If they search anyway, don't resist but repeat you don't consent.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">7</span>
              <div>
                <p className="font-medium">If Ordered to Exit</p>
                <p className="text-sm text-muted-foreground">Ask: "Am I required to get out?" If they insist, comply slowly with hands visible. Lock the car behind you.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">8</span>
              <div>
                <p className="font-medium">If Arrested</p>
                <p className="text-sm text-muted-foreground">Say: "I want a lawyer. I am exercising my right to remain silent." Do not sign anything. You have the right to a phone call.</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* DO NOT */}
      <Card className="mb-6 border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <FileX className="h-5 w-5" />
            Do NOT Do These Things
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Don't answer questions about immigration status or birthplace</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Don't consent to a search</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Don't sign anything without a lawyer</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Don't run or resist physically</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Don't lie or give false documents</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Don't open door or exit unless ordered</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
              <span>Don't provide passport, consular ID, or foreign documents</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* SAFETY WARNING */}
      <Alert className="mb-6 border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-700 dark:text-amber-500">Safety First</AlertTitle>
        <AlertDescription>
          ICE officers are armed. Even if you believe your rights are being violated, <strong>remain calm and do not physically resist</strong>.
          Document everything afterward and contact a lawyer.
        </AlertDescription>
      </Alert>

      {/* EMERGENCY CONTACTS */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-destructive" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <a
              href="tel:18443631423"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <span className="font-medium text-sm">United We Dream Hotline</span>
              <span className="font-bold text-primary">1-844-363-1423</span>
            </a>
            <a
              href="tel:18008987180"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <span className="font-medium text-sm">EOIR Case Status</span>
              <span className="font-bold text-primary">1-800-898-7180</span>
            </a>
            <a
              href="tel:18554357693"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <span className="font-medium text-sm">ICIRR (Illinois)</span>
              <span className="font-bold text-primary">1-855-435-7693</span>
            </a>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
              <span className="font-medium text-sm">Freedom for Immigrants (from detention)</span>
              <span className="font-bold text-primary">9233#</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MORE RESOURCES */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href="/rights">
            <Shield className="h-4 w-4 mr-2" />
            Full Rights Guide
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/resources">
            <Phone className="h-4 w-4 mr-2" />
            All Hotlines
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function EmergencyPage() {
  return (
    <>
      <AppHeader showBack />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      }>
        <EmergencyContent />
      </Suspense>
    </>
  )
}
