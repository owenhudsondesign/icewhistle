'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppHeader } from '@/components/shared/AppHeader'
import { RecordingModal } from '@/components/shared/RecordingModal'
import { useLanguage } from '@/hooks/use-language'
import { LegalDisclaimer } from '@/components/shared/LegalDisclaimer'
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
  Map,
  Bell,
  MapPin,
  Users,
  Eye,
  Video,
  CheckCircle,
  FileCheck,
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const { language, t } = useLanguage()

  const common = t.common
  const home = t.home
  const hotlines = t.hotlines

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleEmergencyClick = (type: 'near' | 'taken' | 'vehicle') => {
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
    <div className="min-h-screen bg-background pb-8">
      <AppHeader />

      <main className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Anonymous Badge */}
        <div className="flex items-center justify-center gap-2 text-caption text-muted-foreground mb-4">
          <Lock className="h-4 w-4" />
          <span>{common.anonymous}</span>
        </div>

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

          {/* Live Alerts - Grape */}
          <Link
            href="/alerts"
            className="col-span-1 bg-[#8B5CF6] text-white rounded-[16px] p-4 flex flex-col items-center justify-center gap-2 press-scale hover-scale shadow-lg hover:glow-grape min-h-[120px]"
          >
            <Map className="h-8 w-8 flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-sm font-semibold leading-tight break-words">{home.liveAlerts}</div>
              <div className="text-xs text-white/80 leading-tight mt-0.5 break-words">{home.liveAlertsSub}</div>
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
            <Scale className="h-7 w-7 text-[#8B5CF6] flex-shrink-0" strokeWidth={2} />
            <div className="text-center w-full">
              <div className="text-xs font-semibold leading-tight break-words">{home.findLawyer}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 break-words">{home.findLawyerSub}</div>
            </div>
          </Link>

          <Link
            href="/resources"
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
              <div className="w-10 h-10 mx-auto rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-2">
                <Eye className="h-5 w-5 text-[#DC2626]" strokeWidth={2} />
              </div>
              <div className="text-xs font-bold text-[#DC2626] leading-tight">1. {home.step1Title}</div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight break-words">{home.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#FF8C42]/10 flex items-center justify-center mb-2">
                <Bell className="h-5 w-5 text-[#FF8C42]" strokeWidth={2} />
              </div>
              <div className="text-xs font-bold text-[#FF8C42] leading-tight">2. {home.step2Title}</div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight break-words">{home.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#84CC16]/10 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-[#84CC16]" strokeWidth={2} />
              </div>
              <div className="text-xs font-bold text-[#84CC16] leading-tight">3. {home.step3Title}</div>
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
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#00A6B4]/10 text-[#00A6B4] px-2 py-1 rounded-full whitespace-nowrap">
                  <Video className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-none">{home.recordingFeature1}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#84CC16]/10 text-[#84CC16] px-2 py-1 rounded-full whitespace-nowrap">
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-none">{home.recordingFeature2}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-1 rounded-full whitespace-nowrap">
                  <FileCheck className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-none">{home.recordingFeature3}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Hotlines - Structured with explanations */}
        <div className="card-glass p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#DC2626] text-white text-[10px] font-bold rounded-full tracking-wide whitespace-nowrap">
              {home.badgeHotlines}
            </span>
          </div>
          <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#DC2626] flex-shrink-0" strokeWidth={2} />
            <span className="break-words">{home.emergencyHotlines}</span>
          </h2>
          <p className="text-xs text-muted-foreground mb-3">{hotlines.callFree247}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: hotlines.iceDetaineeLocator, desc: hotlines.iceDetaineeDesc, phone: '1-888-351-4024', color: 'bg-[#DC2626]' },
              { name: hotlines.unitedWeDream, desc: hotlines.unitedWeDreamDesc, phone: '1-844-363-1423', color: 'bg-[#DC2626]' },
              { name: hotlines.traffickingHotline, desc: hotlines.traffickingDesc, phone: '1-888-373-7888', color: 'bg-[#FF8C42]' },
              { name: hotlines.crisisLine, desc: hotlines.crisisDesc, phone: '988', color: 'bg-[#00A6B4]' },
            ].map((hotline) => (
              <a
                key={hotline.phone}
                href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                className="flex items-start gap-2 p-3 rounded-[12px] bg-background/50 hover:bg-background press-scale border border-border/30"
              >
                <div className={`w-9 h-9 rounded-full ${hotline.color} flex items-center justify-center flex-shrink-0`}>
                  <Phone className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs leading-tight break-words">{hotline.name}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight break-words">{hotline.desc}</div>
                  <div className="font-bold text-xs text-primary mt-1">{hotline.phone}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Rights Reminder - Structured Q&A style */}
        <div className="card-glass p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#84CC16] text-white text-[10px] font-bold rounded-full tracking-wide whitespace-nowrap">
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
            className="inline-flex items-center text-xs text-[#00A6B4] hover:underline mt-4 font-semibold"
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
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
