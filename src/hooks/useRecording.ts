'use client'

import { useState, useRef, useCallback } from 'react'

export type RecordingType = 'audio' | 'video'

interface UseRecordingReturn {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  recordingType: RecordingType | null
  startRecording: (type: RecordingType) => Promise<boolean>
  stopRecording: () => Promise<Blob | null>
  pauseRecording: () => void
  resumeRecording: () => void
  error: string | null
}

export function useRecording(): UseRecordingReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingType, setRecordingType] = useState<RecordingType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const mediaStream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])
  const timerInterval = useRef<NodeJS.Timeout | null>(null)

  const startTimer = useCallback(() => {
    timerInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
      timerInterval.current = null
    }
  }, [])

  const startRecording = useCallback(async (type: RecordingType): Promise<boolean> => {
    try {
      setError(null)
      chunks.current = []
      setRecordingTime(0)

      const constraints: MediaStreamConstraints = type === 'video'
        ? { video: { facingMode: 'environment' }, audio: true }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      mediaStream.current = stream

      const mimeType = type === 'video'
        ? (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm')
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4')

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorder.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data)
        }
      }

      recorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingType(type)
      startTimer()

      return true
    } catch (err) {
      console.error('Failed to start recording:', err)
      setError(err instanceof Error ? err.message : 'Failed to access camera/microphone')
      return false
    }
  }, [startTimer])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current || mediaRecorder.current.state === 'inactive') {
        resolve(null)
        return
      }

      mediaRecorder.current.onstop = () => {
        const mimeType = recordingType === 'video' ? 'video/webm' : 'audio/webm'
        const blob = new Blob(chunks.current, { type: mimeType })

        // Stop all tracks
        mediaStream.current?.getTracks().forEach(track => track.stop())
        mediaStream.current = null
        mediaRecorder.current = null
        chunks.current = []

        setIsRecording(false)
        setIsPaused(false)
        setRecordingType(null)
        stopTimer()

        resolve(blob)
      }

      mediaRecorder.current.stop()
    })
  }, [recordingType, stopTimer])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.pause()
      setIsPaused(true)
      stopTimer()
    }
  }, [stopTimer])

  const resumeRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'paused') {
      mediaRecorder.current.resume()
      setIsPaused(false)
      startTimer()
    }
  }, [startTimer])

  return {
    isRecording,
    isPaused,
    recordingTime,
    recordingType,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    error
  }
}

// Helper to format recording time
export function formatRecordingTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Helper to download recording
export function downloadRecording(blob: Blob, type: RecordingType) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `icewhistle-recording-${new Date().toISOString()}.${type === 'video' ? 'webm' : 'webm'}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
