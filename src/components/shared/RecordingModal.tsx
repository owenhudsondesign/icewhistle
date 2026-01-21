'use client'

import { useState } from 'react'
import { useRecording, formatRecordingTime, downloadRecording, RecordingType } from '@/hooks/useRecording'
import { Button } from '@/components/ui/button'
import {
  Video,
  Mic,
  Square,
  Pause,
  Play,
  Download,
  X,
  AlertTriangle,
  Shield,
  ChevronRight
} from 'lucide-react'

interface RecordingModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueWithoutRecording: () => void
  language: 'en' | 'es' | 'pt'
}

const translations = {
  en: {
    title: 'Document this encounter',
    subtitle: 'Recording can protect your rights',
    recordVideo: 'Record video',
    recordAudio: 'Record audio only',
    continueWithout: 'Continue without recording',
    recording: 'Recording',
    paused: 'Paused',
    stopRecording: 'Stop recording',
    saveAndContinue: 'Save & continue',
    discard: 'Discard',
    permissionDenied: 'Camera/microphone access denied',
    tip: 'You have the right to record police encounters in public',
    saved: 'Recording saved',
    savedDesc: 'Your recording has been saved to your device',
    cameraAudio: 'Camera + audio',
    micOnly: 'Microphone only',
    videoRecorded: 'Video recorded',
    audioRecorded: 'Audio recorded',
  },
  es: {
    title: 'Documenta este encuentro',
    subtitle: 'Grabar puede proteger tus derechos',
    recordVideo: 'Grabar video',
    recordAudio: 'Solo grabar audio',
    continueWithout: 'Continuar sin grabar',
    recording: 'Grabando',
    paused: 'Pausado',
    stopRecording: 'Detener grabación',
    saveAndContinue: 'Guardar y continuar',
    discard: 'Descartar',
    permissionDenied: 'Acceso a cámara/micrófono denegado',
    tip: 'Tienes derecho a grabar encuentros policiales en público',
    saved: 'Grabación guardada',
    savedDesc: 'Tu grabación se ha guardado en tu dispositivo',
    cameraAudio: 'Cámara + audio',
    micOnly: 'Solo micrófono',
    videoRecorded: 'Video grabado',
    audioRecorded: 'Audio grabado',
  },
  pt: {
    title: 'Documente este encontro',
    subtitle: 'Gravar pode proteger seus direitos',
    recordVideo: 'Gravar vídeo',
    recordAudio: 'Gravar apenas áudio',
    continueWithout: 'Continuar sem gravar',
    recording: 'Gravando',
    paused: 'Pausado',
    stopRecording: 'Parar gravação',
    saveAndContinue: 'Salvar e continuar',
    discard: 'Descartar',
    permissionDenied: 'Acesso à câmera/microfone negado',
    tip: 'Você tem o direito de gravar encontros policiais em público',
    saved: 'Gravação salva',
    savedDesc: 'Sua gravação foi salva no seu dispositivo',
    cameraAudio: 'Câmera + áudio',
    micOnly: 'Apenas microfone',
    videoRecorded: 'Vídeo gravado',
    audioRecorded: 'Áudio gravado',
  },
}

export function RecordingModal({
  isOpen,
  onClose,
  onContinueWithoutRecording,
  language
}: RecordingModalProps) {
  const t = translations[language]
  const {
    isRecording,
    isPaused,
    recordingTime,
    recordingType,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    error
  } = useRecording()

  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const handleStartRecording = async (type: RecordingType) => {
    await startRecording(type)
  }

  const handleStopRecording = async () => {
    const blob = await stopRecording()
    setRecordingBlob(blob)
  }

  const handleSaveAndContinue = () => {
    if (recordingBlob && recordingType) {
      downloadRecording(recordingBlob, recordingType)
      setSaved(true)
      setTimeout(() => {
        onContinueWithoutRecording()
      }, 1500)
    }
  }

  const handleDiscard = () => {
    setRecordingBlob(null)
    onContinueWithoutRecording()
  }

  // Show saved confirmation
  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="card-glass p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-[#84CC16]" strokeWidth={2} />
          </div>
          <h2 className="text-title mb-2">{t.saved}</h2>
          <p className="text-caption text-muted-foreground">{t.savedDesc}</p>
        </div>
      </div>
    )
  }

  // Show recording complete - save or discard
  if (recordingBlob) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="card-glass p-6 max-w-sm w-full">
          <h2 className="text-title text-center mb-6">{t.stopRecording}</h2>

          <div className="text-center mb-6">
            <div className="text-display font-mono text-[#00A6B4] mb-2">
              {formatRecordingTime(recordingTime)}
            </div>
            <p className="text-caption text-muted-foreground">
              {recordingType === 'video' ? t.videoRecorded : t.audioRecorded}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSaveAndContinue}
              className="w-full h-12 text-body bg-[#84CC16] hover:bg-[#84CC16]/90 text-white rounded-[8px] press-scale"
            >
              <Download className="h-5 w-5 mr-2" strokeWidth={2} />
              {t.saveAndContinue}
            </Button>

            <Button
              variant="outline"
              onClick={handleDiscard}
              className="w-full h-12 rounded-[8px] press-scale"
            >
              {t.discard}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show active recording
  if (isRecording) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="card-glass p-6 max-w-sm w-full text-center">
          {/* Recording indicator */}
          <div className="mb-6">
            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${isPaused ? 'bg-[#FF8C42]/20' : 'bg-[#DC2626]/20 animate-urgent'}`}>
              {recordingType === 'video' ? (
                <Video className={`h-10 w-10 ${isPaused ? 'text-[#FF8C42]' : 'text-[#DC2626]'}`} strokeWidth={2} />
              ) : (
                <Mic className={`h-10 w-10 ${isPaused ? 'text-[#FF8C42]' : 'text-[#DC2626]'}`} strokeWidth={2} />
              )}
            </div>
          </div>

          <div className="mb-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-caption font-semibold ${isPaused ? 'bg-[#FF8C42]/20 text-[#FF8C42]' : 'bg-[#DC2626]/20 text-[#DC2626]'}`}>
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-[#FF8C42]' : 'bg-[#DC2626] animate-pulse'}`}></span>
              {isPaused ? t.paused : t.recording}
            </span>
          </div>

          <div className="text-display font-mono mb-8">
            {formatRecordingTime(recordingTime)}
          </div>

          <div className="flex gap-3 justify-center mb-4">
            <Button
              variant="outline"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="h-14 w-14 rounded-full press-scale"
            >
              {isPaused ? <Play className="h-6 w-6" strokeWidth={2} /> : <Pause className="h-6 w-6" strokeWidth={2} />}
            </Button>

            <Button
              onClick={handleStopRecording}
              className="h-14 px-8 rounded-full bg-[#DC2626] hover:bg-[#DC2626]/90 text-white press-scale"
            >
              <Square className="h-5 w-5 mr-2" strokeWidth={2} />
              {t.stopRecording}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show recording options
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="card-glass p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground press-scale"
          aria-label="Close"
        >
          <X className="h-6 w-6" strokeWidth={2} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#DC2626]/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-[#DC2626]" strokeWidth={2} />
          </div>
          <h2 className="text-title mb-1">{t.title}</h2>
          <p className="text-caption text-muted-foreground">{t.subtitle}</p>
        </div>

        {error && (
          <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-[8px] p-3 mb-4 text-caption text-[#DC2626]">
            {t.permissionDenied}
          </div>
        )}

        <div className="space-y-3 mb-4">
          <button
            onClick={() => handleStartRecording('video')}
            className="w-full bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded-[16px] p-4 flex items-center gap-4 press-scale hover-scale"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Video className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="text-left flex-1">
              <div className="text-headline">{t.recordVideo}</div>
              <div className="text-caption text-white/70">{t.cameraAudio}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/50" strokeWidth={2} />
          </button>

          <button
            onClick={() => handleStartRecording('audio')}
            className="w-full bg-[#FF8C42] hover:bg-[#FF8C42]/90 text-white rounded-[16px] p-4 flex items-center gap-4 press-scale hover-scale"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Mic className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="text-left flex-1">
              <div className="text-headline">{t.recordAudio}</div>
              <div className="text-caption text-white/70">{t.micOnly}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/50" strokeWidth={2} />
          </button>
        </div>

        <Button
          variant="ghost"
          onClick={onContinueWithoutRecording}
          className="w-full h-12 text-muted-foreground rounded-[8px] press-scale"
        >
          {t.continueWithout}
          <ChevronRight className="h-4 w-4 ml-1" strokeWidth={2} />
        </Button>

        <div className="mt-4 text-center">
          <p className="text-small text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" strokeWidth={2} />
            {t.tip}
          </p>
        </div>
      </div>
    </div>
  )
}
