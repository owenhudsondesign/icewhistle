'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEnhancedRecording, formatRecordingTime } from '@/hooks/useEnhancedRecording'
import { useRecordingStore, type CameraMode, type RecordingType } from '@/stores/recordingStore'
import { CameraSelector } from '@/components/recording/CameraSelector'
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
  ChevronRight,
  ChevronLeft,
  Camera,
} from 'lucide-react'

interface RecordingModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueWithoutRecording: () => void
  language: 'en' | 'es' | 'pt'
}

type ModalStep = 'choose-type' | 'choose-camera' | 'recording' | 'complete' | 'saved'

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
    chooseCamera: 'Choose camera',
    chooseCameraDesc: 'Select which camera to use',
    startRecording: 'Start recording',
    back: 'Back',
    frontCamera: 'Front Camera',
    backCamera: 'Back Camera',
    frontCameraDesc: 'Record yourself',
    backCameraDesc: 'Record your surroundings',
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
    chooseCamera: 'Elegir cámara',
    chooseCameraDesc: 'Selecciona qué cámara usar',
    startRecording: 'Iniciar grabación',
    back: 'Volver',
    frontCamera: 'Cámara frontal',
    backCamera: 'Cámara trasera',
    frontCameraDesc: 'Grábate a ti mismo',
    backCameraDesc: 'Graba tu entorno',
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
    chooseCamera: 'Escolher câmera',
    chooseCameraDesc: 'Selecione qual câmera usar',
    startRecording: 'Iniciar gravação',
    back: 'Voltar',
    frontCamera: 'Câmera frontal',
    backCamera: 'Câmera traseira',
    frontCameraDesc: 'Grave você mesmo',
    backCameraDesc: 'Grave seu ambiente',
  },
}

export function RecordingModal({
  isOpen,
  onClose,
  onContinueWithoutRecording,
  language
}: RecordingModalProps) {
  const router = useRouter()
  const t = translations[language]

  const [step, setStep] = useState<ModalStep>('choose-type')
  const [selectedType, setSelectedType] = useState<RecordingType>('video')
  const [selectedCamera, setSelectedCamera] = useState<CameraMode>('back')

  const {
    isRecording,
    isPaused,
    recordingTime,
    recordingType,
    recordingBlob,
    secondaryBlob,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    saveRecording,
    discardRecording,
  } = useEnhancedRecording()

  const store = useRecordingStore()

  if (!isOpen) return null

  const handleChooseType = (type: RecordingType) => {
    setSelectedType(type)
    if (type === 'video') {
      setStep('choose-camera')
    } else {
      // Audio - start recording directly
      handleStartRecording(type, 'back')
    }
  }

  const handleStartRecording = async (type: RecordingType, camera: CameraMode) => {
    const success = await startRecording(type, camera)
    if (success) {
      setStep('recording')
      // Navigate to encounter page while recording continues
      setTimeout(() => {
        router.push('/encounter')
      }, 500)
    }
  }

  const handleStopRecording = async () => {
    await stopRecording()
    setStep('complete')
  }

  const handleSaveAndContinue = () => {
    saveRecording()
    setStep('saved')
    setTimeout(() => {
      onContinueWithoutRecording()
    }, 1500)
  }

  const handleDiscard = () => {
    discardRecording()
    onContinueWithoutRecording()
  }

  const handleContinueWithoutRecording = () => {
    router.push('/encounter')
  }

  const handleBack = () => {
    setStep('choose-type')
  }

  // Camera selection translations
  const cameraTranslations = {
    front: t.frontCamera,
    back: t.backCamera,
    frontDesc: t.frontCameraDesc,
    backDesc: t.backCameraDesc,
  }

  // Show saved confirmation
  if (step === 'saved') {
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
  if (step === 'complete' && recordingBlob) {
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
            {secondaryBlob && (
              <p className="text-small text-muted-foreground mt-1">
                + {t.frontCamera} recording
              </p>
            )}
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

  // Show active recording (brief state before navigation)
  if (step === 'recording' && isRecording) {
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

  // Show camera selection
  if (step === 'choose-camera') {
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
              <Camera className="h-8 w-8 text-[#DC2626]" strokeWidth={2} />
            </div>
            <h2 className="text-title mb-1">{t.chooseCamera}</h2>
            <p className="text-caption text-muted-foreground">{t.chooseCameraDesc}</p>
          </div>

          <CameraSelector
            selectedMode={selectedCamera}
            onSelect={setSelectedCamera}
            translations={cameraTranslations}
            className="mb-4"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-12 rounded-[8px] press-scale"
            >
              <ChevronLeft className="h-4 w-4 mr-1" strokeWidth={2} />
              {t.back}
            </Button>

            <Button
              onClick={() => handleStartRecording('video', selectedCamera)}
              className="flex-1 h-12 bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded-[8px] press-scale"
            >
              {t.startRecording}
              <ChevronRight className="h-4 w-4 ml-1" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show recording options (choose type)
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
            onClick={() => handleChooseType('video')}
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
            onClick={() => handleChooseType('audio')}
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
          onClick={handleContinueWithoutRecording}
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
