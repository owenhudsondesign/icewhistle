'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppHeader } from '@/components/shared/AppHeader'
import { RecordingModal } from '@/components/shared/RecordingModal'
import { useLanguage, commonTranslations } from '@/hooks/use-language'
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
} from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const { language } = useLanguage()

  const t = commonTranslations[language]

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
    navigateToEmergency(type)
  }

  const navigateToEmergency = (type: 'near' | 'taken' | 'vehicle') => {
    router.push(`/emergency?type=${type}`)
  }

  const handleContinueAfterRecording = () => {
    setShowRecordingModal(false)
    navigateToEmergency('near')
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppHeader />

      <main className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Anonymous Badge */}
        <div className="flex items-center justify-center gap-2 text-caption text-muted-foreground mb-4">
          <Lock className="h-4 w-4" />
          <span>{t.anonymous}</span>
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
              <div className="text-display tracking-tight">{t.iceNear}</div>
              <div className="text-body text-white/80 mt-1">{t.iceNearSub}</div>
            </div>
          </button>

          {/* Traffic Stop - Bondi Blue */}
          <button
            onClick={() => handleEmergencyClick('vehicle')}
            className="col-span-1 bg-[#00A6B4] text-white rounded-[16px] p-5 flex flex-col items-center justify-center gap-3 press-scale hover-scale shadow-lg hover:glow-bondi"
          >
            <Car className="h-10 w-10" strokeWidth={2} />
            <div className="text-center">
              <div className="text-headline">{t.trafficStop}</div>
              <div className="text-small text-white/80">{t.trafficStopSub}</div>
            </div>
          </button>

          {/* Someone Taken - Tangerine */}
          <button
            onClick={() => handleEmergencyClick('taken')}
            className="col-span-1 bg-[#FF8C42] text-white rounded-[16px] p-5 flex flex-col items-center justify-center gap-3 press-scale hover-scale shadow-lg hover:glow-tangerine"
          >
            <Building className="h-10 w-10" strokeWidth={2} />
            <div className="text-center">
              <div className="text-headline">{t.someoneTaken}</div>
              <div className="text-small text-white/80">{t.someoneTakenSub}</div>
            </div>
          </button>

          {/* Live Alerts - Grape */}
          <Link
            href="/alerts"
            className="col-span-1 bg-[#8B5CF6] text-white rounded-[16px] p-5 flex flex-col items-center justify-center gap-3 press-scale hover-scale shadow-lg hover:glow-grape"
          >
            <Map className="h-10 w-10" strokeWidth={2} />
            <div className="text-center">
              <div className="text-headline">{t.liveAlerts}</div>
              <div className="text-small text-white/80">{t.liveAlertsSub}</div>
            </div>
          </Link>

          {/* Know Your Rights - Lime */}
          <Link
            href="/rights"
            className="col-span-1 bg-[#84CC16] text-white rounded-[16px] p-5 flex flex-col items-center justify-center gap-3 press-scale hover-scale shadow-lg hover:glow-lime"
          >
            <Shield className="h-10 w-10" strokeWidth={2} />
            <div className="text-center">
              <div className="text-headline">{t.knowRights}</div>
              <div className="text-small text-white/80">{t.knowRightsSub}</div>
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
                placeholder={t.askQuestion}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-[8px]"
              />
            </div>
            <Button type="submit" className="h-12 px-6 rounded-[8px] bg-[#00A6B4] hover:bg-[#00A6B4]/90 text-white">
              {t.search}
            </Button>
          </form>
        </div>

        {/* Secondary Bento - Resources - Glass Cards with Category Bars */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Link
            href="/resources#legal"
            className="card-glass category-bar category-bar-grape p-4 flex flex-col items-center justify-center gap-2 press-scale hover:bg-accent/50"
          >
            <Scale className="h-8 w-8 text-[#8B5CF6]" strokeWidth={2} />
            <div className="text-center">
              <div className="text-caption font-semibold">{t.findLawyer}</div>
              <div className="text-small text-muted-foreground">{t.findLawyerSub}</div>
            </div>
          </Link>

          <Link
            href="/resources"
            className="card-glass category-bar category-bar-emergency p-4 flex flex-col items-center justify-center gap-2 press-scale hover:bg-accent/50"
          >
            <Phone className="h-8 w-8 text-[#DC2626]" strokeWidth={2} />
            <div className="text-center">
              <div className="text-caption font-semibold">{t.emergencyHotlines}</div>
              <div className="text-small text-muted-foreground">{t.available247}</div>
            </div>
          </Link>

          <Link
            href="/resources#bond"
            className="card-glass category-bar category-bar-tangerine p-4 flex flex-col items-center justify-center gap-2 press-scale hover:bg-accent/50"
          >
            <Heart className="h-8 w-8 text-[#FF8C42]" strokeWidth={2} />
            <div className="text-center">
              <div className="text-caption font-semibold">{t.bondFunds}</div>
              <div className="text-small text-muted-foreground">{t.bondFundsSub}</div>
            </div>
          </Link>
        </div>

        {/* How It Works - Simple 3-step explanation */}
        <div className="card-glass p-4 mb-4">
          <h2 className="text-headline mb-4 text-center">{t.howItWorks}</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-[#DC2626]" strokeWidth={2} />
              </div>
              <div className="text-caption font-bold text-[#DC2626]">1. {t.step1Title}</div>
              <p className="text-[11px] text-muted-foreground mt-1">{t.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FF8C42]/10 flex items-center justify-center mb-2">
                <Bell className="h-6 w-6 text-[#FF8C42]" strokeWidth={2} />
              </div>
              <div className="text-caption font-bold text-[#FF8C42]">2. {t.step2Title}</div>
              <p className="text-[11px] text-muted-foreground mt-1">{t.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#84CC16]/10 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-[#84CC16]" strokeWidth={2} />
              </div>
              <div className="text-caption font-bold text-[#84CC16]">3. {t.step3Title}</div>
              <p className="text-[11px] text-muted-foreground mt-1">{t.step3Desc}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-center gap-2 text-small text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span><strong className="text-foreground">{t.privacyFirst}:</strong> {t.privacyDesc}</span>
          </div>
        </div>

        {/* Emergency Hotlines - Structured with explanations */}
        <div className="card-glass p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#DC2626] text-white text-[10px] font-bold rounded-full tracking-wide">
              {t.badgeHotlines}
            </span>
          </div>
          <h2 className="text-headline mb-1 flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#DC2626]" strokeWidth={2} />
            {t.emergencyHotlines}
          </h2>
          <p className="text-small text-muted-foreground mb-3">{t.callFree247}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { name: t.iceDetaineeLocator, desc: t.iceDetaineeDesc, phone: '1-888-351-4024', color: 'bg-[#DC2626]' },
              { name: t.unitedWeDream, desc: t.unitedWeDreamDesc, phone: '1-844-363-1423', color: 'bg-[#DC2626]' },
              { name: t.traffickingHotline, desc: t.traffickingDesc, phone: '1-888-373-7888', color: 'bg-[#FF8C42]' },
              { name: t.crisisLine, desc: t.crisisDesc, phone: '988', color: 'bg-[#00A6B4]' },
            ].map((hotline) => (
              <a
                key={hotline.phone}
                href={`tel:${hotline.phone.replace(/\D/g, '')}`}
                className="flex items-start gap-3 p-3 rounded-[12px] bg-background/50 hover:bg-background press-scale border border-border/30"
              >
                <div className={`w-10 h-10 rounded-full ${hotline.color} flex items-center justify-center flex-shrink-0`}>
                  <Phone className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-small">{hotline.name}</div>
                  <div className="text-[11px] text-muted-foreground">{hotline.desc}</div>
                  <div className="font-bold text-caption text-primary mt-1">{hotline.phone}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Rights Reminder - Structured Q&A style */}
        <div className="card-glass p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#84CC16] text-white text-[10px] font-bold rounded-full tracking-wide">
              {t.badgeRights}
            </span>
          </div>
          <h2 className="text-headline mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#84CC16]" strokeWidth={2} />
            {t.knowRights}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-[12px] bg-[#84CC16]/10 border border-[#84CC16]/20">
              <p className="text-small font-bold text-[#84CC16] mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t.youCanSay}
              </p>
              <ul className="text-small space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] mt-0.5">✓</span>
                  <span>{t.rightSilent}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] mt-0.5">✓</span>
                  <span>{t.rightLawyer}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] mt-0.5">✓</span>
                  <span>{t.rightNoEntry}</span>
                </li>
              </ul>
            </div>
            <div className="p-3 rounded-[12px] bg-[#DC2626]/10 border border-[#DC2626]/20">
              <p className="text-small font-bold text-[#DC2626] mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t.never}
              </p>
              <ul className="text-small space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] mt-0.5">✗</span>
                  <span>{t.neverOpenDoor}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] mt-0.5">✗</span>
                  <span>{t.neverSign}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#DC2626] mt-0.5">✗</span>
                  <span>{t.neverLie}</span>
                </li>
              </ul>
            </div>
          </div>
          <Link
            href="/rights"
            className="inline-flex items-center text-small text-[#00A6B4] hover:underline mt-4 font-semibold"
          >
            {t.learnMore} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Privacy Footer - Glass */}
        <div className="card-glass p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-small text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>{t.noTracking}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30">
            <Link
              href="/support"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.supportTool}
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
