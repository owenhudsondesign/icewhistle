'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppHeader } from '@/components/shared/AppHeader'
import { SkipToContent } from '@/components/shared/SkipToContent'
import { RecordingModal } from '@/components/shared/RecordingModal'
import { useLanguage } from '@/hooks/use-language'
import { useUserZip } from '@/hooks/use-user-zip'
import { LegalDisclaimer } from '@/components/shared/LegalDisclaimer'
import { getHotlinesForZip, getLocationDisplay, hasLocalResources } from '@/data/hotlines'
import { ZipPromptCard } from '@/components/shared/ZipPromptCard'
import {
  trackEmergencyButtonClick,
  trackHotlineCallClick,
  trackZipCodeEntered,
  type EmergencyEntryPoint,
} from '@/lib/analytics'
import {
  AlertTriangle,
  Search,
  Phone,
  Shield,
  Building,
  Scale,
  Lock,
  ChevronRight,
  Heart,
  Car,
  Users,
  Video,
  CheckCircle,
  FileCheck,
  ClipboardList,
  BookOpen,
  Sparkles,
  MapPin,
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const { language, t } = useLanguage()
  const { zip, updateZip, mounted } = useUserZip()

  const common = t.common
  const home = t.home
  const hotlines = t.hotlines

  // Get personalized hotlines based on ZIP
  const allHotlines = mounted ? getHotlinesForZip(zip) : []
  const localHotlines = allHotlines.filter(h => h.type === 'local' || h.type === 'state')
  const nationalHotlines = allHotlines.filter(h => h.type === 'national')
  const locationDisplay = mounted ? getLocationDisplay(zip, language) : ''
  const hasLocal = mounted && hasLocalResources(zip)

  // Build display list: prioritize local, then national
  const displayHotlines = [
    ...localHotlines.slice(0, 2),
    ...nationalHotlines.slice(0, 4 - Math.min(localHotlines.length, 2))
  ].slice(0, 4)

  const handleZipSubmit = (zipCode: string) => {
    updateZip(zipCode)
    trackZipCodeEntered() // Track for social proof (not the actual ZIP)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleEmergencyClick = (type: EmergencyEntryPoint) => {
    // Track which entry point was used, not just that one of them was
    trackEmergencyButtonClick(type)

    // For "ICE Is Near Me", show recording modal first
    if (type === 'near') {
      setShowRecordingModal(true)
      return
    }
    router.push(`/emergency?type=${type}`)
  }

  const handleContinueAfterRecording = () => {
    // RecordingModal now handles navigation to /encounter
    setShowRecordingModal(false)
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <SkipToContent />
      <AppHeader />

      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-4 max-w-4xl">
        {/* The page needs exactly one h1 naming it. It is visually hidden
            because the emergency grid below is the real visual heading. */}
        <h1 className="sr-only">ICEwhistle</h1>
        {/* Anonymous Badge */}
        <div className="flex items-center justify-center gap-2 text-caption text-muted-foreground mb-4">
          <Lock className="h-4 w-4" />
          <span>{common.anonymous}</span>
        </div>

        {/* ZIP capture - above the fold so localized hotlines actually reach people */}
        {mounted && !zip && (
          <ZipPromptCard onSubmit={handleZipSubmit} />
        )}

        {/* BENTO GRID - Soft Transit Design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-6">
          {/* ICE IS NEAR ME - Emergency Red - Large Hero Button */}
          <button
            onClick={() => handleEmergencyClick('near')}
            className="col-span-2 row-span-2 bg-[#DC2626] text-white rounded-[16px] p-8 flex flex-col items-center justify-center gap-4 press-scale hover-scale glow-emergency animate-urgent relative overflow-hidden"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative z-10 w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12" strokeWidth={2.5} />
            </div>
            <div className="relative z-10 text-center">
              <div className="text-display tracking-tight">{home.iceNear}</div>
              <div className="text-body text-white/80 mt-1">{home.iceNearSub}</div>
            </div>
          </button>

          {/* Traffic Stop - Bondi Blue */}
          <button
            onClick={() => handleEmergencyClick('vehicle')}
            className="col-span-1 bg-[#00A6B4] text-white rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 press-scale hover-scale shadow-lg hover:glow-bondi min-h-[120px]"
          >
            <Car className="h-8 w-8 flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-sm font-semibold leading-tight break-words">{home.trafficStop}</div>
              <div className="text-xs text-white/80 leading-tight mt-0.5 break-words">{home.trafficStopSub}</div>
            </div>
          </button>

          {/* Someone Taken - Tangerine */}
          <button
            onClick={() => handleEmergencyClick('taken')}
            className="col-span-1 bg-[#FF8C42] text-white rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 press-scale hover-scale shadow-lg hover:glow-tangerine min-h-[120px]"
          >
            <Building className="h-8 w-8 flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-sm font-semibold leading-tight break-words">{home.someoneTaken}</div>
              <div className="text-xs text-white/80 leading-tight mt-0.5 break-words">{home.someoneTakenSub}</div>
            </div>
          </button>

          {/* My Emergency Plan - Grape */}
          <Link
            href="/emergency-contacts"
            className="col-span-1 bg-[#7C3AED] text-white rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 press-scale hover-scale shadow-lg hover:glow-grape min-h-[120px]"
          >
            <ClipboardList className="h-8 w-8 flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-sm font-semibold leading-tight break-words">{home.emergencyPlan}</div>
              <div className="text-xs text-white/80 leading-tight mt-0.5 break-words">{home.emergencyPlanSub}</div>
            </div>
          </Link>

          {/* Know Your Rights - Lime */}
          <Link
            href="/rights"
            className="col-span-1 bg-[#84CC16] text-white rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 press-scale hover-scale shadow-lg hover:glow-lime min-h-[120px]"
          >
            <Shield className="h-8 w-8 flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-sm font-semibold leading-tight break-words">{home.knowRights}</div>
              <div className="text-xs text-white/80 leading-tight mt-0.5 break-words">{home.knowRightsSub}</div>
            </div>
          </Link>
        </div>

        {/* Search Bar - Glass Card */}
        <div className="card-glass p-4 mb-4 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={home.askQuestion}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-[8px]"
              />
            </div>
            <Button type="submit" className="h-12 px-6 rounded-[8px] bg-[#00A6B4] hover:bg-[#00A6B4]/90 text-white">
              {common.search}
            </Button>
          </form>
        </div>

        {/* Secondary Bento - Resources - Glass Cards with Category Bars */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Link
            href="/resources#legal"
            className="card-glass p-3 flex flex-col items-center justify-center gap-1.5 press-scale hover:bg-accent/50 min-h-[100px]"
          >
            <Scale className="h-7 w-7 text-[#7C3AED] flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-xs font-semibold leading-tight break-words">{home.findLawyer}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 break-words">{home.findLawyerSub}</div>
            </div>
          </Link>

          <Link
            href="/hotlines"
            className="card-glass p-3 flex flex-col items-center justify-center gap-1.5 press-scale hover:bg-accent/50 min-h-[100px]"
          >
            <Phone className="h-7 w-7 text-[#DC2626] flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-xs font-semibold leading-tight break-words">{home.emergencyHotlines}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 break-words">{common.available247}</div>
            </div>
          </Link>

          <Link
            href="/resources#bond"
            className="card-glass p-3 flex flex-col items-center justify-center gap-1.5 press-scale hover:bg-accent/50 min-h-[100px]"
          >
            <Heart className="h-7 w-7 text-[#FF8C42] flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-xs font-semibold leading-tight break-words">{home.bondFunds}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 break-words">{home.bondFundsSub}</div>
            </div>
          </Link>
        </div>

        {/* How It Works - Simple 3-step explanation */}
        <div className="card-glass p-4 mb-4">
          <h2 className="text-headline mb-4 text-center">{home.howItWorks}</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#84CC16]/10 flex items-center justify-center mb-2">
                <BookOpen className="h-5 w-5 text-[#84CC16]" strokeWidth={2} />
              </div>
              <div className="text-xs font-bold text-[#84CC16] leading-tight">{home.step1Title}</div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight break-words">{home.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-2">
                <ClipboardList className="h-5 w-5 text-[#7C3AED]" strokeWidth={2} />
              </div>
              <div className="text-xs font-bold text-[#7C3AED] leading-tight">{home.step2Title}</div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight break-words">{home.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#00A6B4]/10 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-[#00A6B4]" strokeWidth={2} />
              </div>
              <div className="text-xs font-bold text-[#00A6B4] leading-tight">{home.step3Title}</div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight break-words">{home.step3Desc}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
            <Lock className="h-4 w-4 flex-shrink-0" />
            <span className="break-words"><strong className="text-foreground">{home.privacyFirst}:</strong> {home.privacyDesc}</span>
          </div>
        </div>

        {/* Recording Feature - Authenticity */}
        <div className="card-glass p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00A6B4]/10 flex items-center justify-center flex-shrink-0">
              <Video className="h-5 w-5 text-[#00A6B4]" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold mb-1">{home.recordingFeature}</h2>
              <p className="text-xs text-muted-foreground mb-3 break-words">{home.recordingFeatureDesc}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#00A6B4]/10 text-[#00A6B4] px-2 py-1 rounded-full">
                  <Video className="h-3 w-3 flex-shrink-0" />
                  <span className="break-words">{home.recordingFeature1}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#84CC16]/10 text-[#84CC16] px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  <span className="break-words">{home.recordingFeature2}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#7C3AED]/10 text-[#7C3AED] px-2 py-1 rounded-full">
                  <FileCheck className="h-3 w-3 flex-shrink-0" />
                  <span className="break-words">{home.recordingFeature3}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Hotlines - Personalized based on ZIP */}
        <div className="card-glass p-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#DC2626] text-white text-[10px] font-bold rounded-full tracking-wide">
                {home.badgeHotlines}
              </span>
              {mounted && hasLocal && (
                <span className="px-2 py-0.5 bg-[#00A6B4]/10 text-[#00A6B4] text-[10px] font-bold rounded-full tracking-wide">
                  {language === 'es' ? 'PERSONALIZADO' : 'PERSONALIZED'}
                </span>
              )}
            </div>
            {mounted && zip && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {locationDisplay}
              </span>
            )}
          </div>
          <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#DC2626] flex-shrink-0" strokeWidth={2} />
            <span className="break-words">{home.emergencyHotlines}</span>
          </h2>
          <p className="text-xs text-muted-foreground mb-3">{hotlines.callFree247}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayHotlines.map((hotline) => {
              const name = language === 'es' && hotline.nameEs ? hotline.nameEs : hotline.name
              const desc = language === 'es' && hotline.descriptionEs ? hotline.descriptionEs : hotline.description
              const isLocal = hotline.type === 'local' || hotline.type === 'state'
              const color = isLocal ? 'bg-[#00A6B4]' : hotline.type === 'national' ? 'bg-[#DC2626]' : 'bg-[#FF8C42]'

              return (
                <a
                  key={hotline.id}
                  href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                  className={`flex items-start gap-2 p-3 rounded-[12px] bg-background/50 hover:bg-background press-scale border ${
                    isLocal ? 'border-[#00A6B4]/30' : 'border-border/30'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                    <Phone className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <div className="font-semibold text-xs leading-tight break-words">{name}</div>
                      {isLocal && (
                        <span className="px-1 py-0.5 bg-[#00A6B4]/10 text-[#00A6B4] text-[8px] font-semibold rounded">
                          LOCAL
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight break-words">{desc}</div>
                    <div className="font-bold text-xs text-primary mt-1">{hotline.phone}</div>
                  </div>
                </a>
              )
            })}
          </div>
          <Link
            href="/hotlines"
            className="inline-flex items-center text-xs text-[#00A6B4] hover:underline mt-4 font-semibold min-h-11 py-2"
          >
            {common.viewAll} <ChevronRight className="h-4 w-4 ml-1 flex-shrink-0" />
          </Link>
        </div>

        {/* Quick Rights Reminder - Structured Q&A style */}
        <div className="card-glass p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#84CC16] text-white text-[10px] font-bold rounded-full tracking-wide">
              {home.badgeRights}
            </span>
          </div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#84CC16] flex-shrink-0" strokeWidth={2} />
            <span className="break-words">{home.knowRights}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-[12px] bg-[#84CC16]/10 border border-[#84CC16]/20">
              <p className="text-xs font-bold text-[#84CC16] mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{home.youCanSay}</span>
              </p>
              <ul className="text-xs space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] mt-0.5 flex-shrink-0">✓</span>
                  <span className="break-words">{home.rightSilent}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] mt-0.5 flex-shrink-0">✓</span>
                  <span className="break-words">{home.rightLawyer}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] mt-0.5 flex-shrink-0">✓</span>
                  <span className="break-words">{home.rightNoEntry}</span>
                </li>
              </ul>
            </div>
            <div className="p-3 rounded-[12px] bg-[#DC2626]/10 border border-[#DC2626]/20">
              <p className="text-xs font-bold text-[#DC2626] mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{home.never}</span>
              </p>
              <ul className="text-xs space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] mt-0.5 flex-shrink-0">✗</span>
                  <span className="break-words">{home.neverOpenDoor}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] mt-0.5 flex-shrink-0">✗</span>
                  <span className="break-words">{home.neverSign}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] mt-0.5 flex-shrink-0">✗</span>
                  <span className="break-words">{home.neverLie}</span>
                </li>
              </ul>
            </div>
          </div>
          <Link
            href="/rights"
            className="inline-flex items-center text-xs text-[#00A6B4] hover:underline mt-4 font-semibold min-h-11 py-2"
          >
            {common.learnMore} <ChevronRight className="h-4 w-4 ml-1 flex-shrink-0" />
          </Link>
        </div>

        {/* Privacy Footer - Glass */}
        <div className="card-glass p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-small text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>{home.noTracking}</span>
          </div>
          <LegalDisclaimer variant="compact" className="mt-3 pt-3 border-t border-border/30" />
          <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/about"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center min-h-11 px-2"
            >
              About
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center min-h-11 px-2"
            >
              Privacy
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center min-h-11 px-2"
            >
              Terms
            </Link>
          </div>
        </div>
      </main>

      {/* Recording Modal for ICE Is Near Me */}
      <RecordingModal
        isOpen={showRecordingModal}
        onClose={() => setShowRecordingModal(false)}
        onContinueWithoutRecording={handleContinueAfterRecording}
        language={language}
      />
    </div>
  )
}
