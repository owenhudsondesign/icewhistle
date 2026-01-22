'use client'

import { useRecordingStore, formatRecordingTime } from '@/stores/recordingStore'
import { useEnhancedRecording } from '@/hooks/useEnhancedRecording'
import { Button } from '@/components/ui/button'
import { Video, Mic, Square, Pause, Play, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecordingIndicatorProps {
  className?: string
  onStopClick?: () => void
}

export function RecordingIndicator({ className, onStopClick }: RecordingIndicatorProps) {
  const { isRecording, isPaused, recordingTime, recordingType, cameraMode } = useRecordingStore()
  const { stopRecording, pauseRecording, resumeRecording } = useEnhancedRecording()

  if (!isRecording) {
    return null
  }

  const handleStop = async () => {
    await stopRecording()
    onStopClick?.()
  }

  const handlePauseResume = () => {
    if (isPaused) {
      resumeRecording()
    } else {
      pauseRecording()
    }
  }

  const getCameraLabel = () => {
    switch (cameraMode) {
      case 'front':
        return 'Front'
      case 'back':
        return 'Back'
      case 'both':
        return 'Both'
      default:
        return ''
    }
  }

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50',
        'bg-black/90 backdrop-blur-sm rounded-full',
        'px-4 py-2 flex items-center gap-3',
        'shadow-lg border border-white/10',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        className
      )}
    >
      {/* Recording indicator dot */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'w-3 h-3 rounded-full',
            isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
          )}
        />
        {recordingType === 'video' ? (
          <Video className="h-4 w-4 text-white" />
        ) : (
          <Mic className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Camera mode badge (video only) */}
      {recordingType === 'video' && (
        <div className="flex items-center gap-1 text-xs text-white/70">
          <Camera className="h-3 w-3" />
          <span>{getCameraLabel()}</span>
        </div>
      )}

      {/* Time display */}
      <span className="text-white font-mono text-sm min-w-[48px]">
        {formatRecordingTime(recordingTime)}
      </span>

      {/* Pause/Resume button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePauseResume}
        className="h-8 w-8 p-0 text-white hover:bg-white/20"
      >
        {isPaused ? (
          <Play className="h-4 w-4" />
        ) : (
          <Pause className="h-4 w-4" />
        )}
      </Button>

      {/* Stop button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleStop}
        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
      >
        <Square className="h-4 w-4 fill-current" />
      </Button>
    </div>
  )
}

// Compact version for smaller spaces
export function RecordingIndicatorCompact({ className }: { className?: string }) {
  const { isRecording, isPaused, recordingTime } = useRecordingStore()

  if (!isRecording) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30',
        className
      )}
    >
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
        )}
      />
      <span className="text-xs font-mono text-red-400">
        {formatRecordingTime(recordingTime)}
      </span>
    </div>
  )
}
