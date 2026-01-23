'use client'

import { useState, useRef } from 'react'
import { Camera, Video, X, Loader2, ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  compressImage,
  getVideoDuration,
  getFileExtension,
  isVideoFile,
  isImageFile,
  formatFileSize,
} from '@/lib/media-utils'
import { useLanguage } from '@/hooks/use-language'

const translations = {
  en: {
    addPhoto: 'Add Photo',
    addVideo: 'Add Video',
    caption: 'Caption (optional)',
    captionPlaceholder: 'Describe what you see...',
    uploading: 'Uploading...',
    processing: 'Processing...',
    uploadFailed: 'Upload failed - tap to retry',
    retry: 'Retry',
    remove: 'Remove',
    maxSize: 'Max 100MB for videos, 10MB for photos',
    videoTooLong: 'Video must be under 2 minutes',
    fileTooLarge: 'File is too large',
    anonymousNotice: 'Completely anonymous - no connection to you',
    uploadError: 'Upload error',
    uploadsNotConfigured: 'Media uploads temporarily unavailable',
    uploadSuccess: 'Uploaded successfully',
  },
  es: {
    addPhoto: 'Agregar Foto',
    addVideo: 'Agregar Video',
    caption: 'Descripción (opcional)',
    captionPlaceholder: 'Describe lo que ves...',
    uploading: 'Subiendo...',
    processing: 'Procesando...',
    uploadFailed: 'Error al subir - toca para reintentar',
    retry: 'Reintentar',
    remove: 'Eliminar',
    maxSize: 'Máx 100MB para videos, 10MB para fotos',
    videoTooLong: 'El video debe ser menor a 2 minutos',
    fileTooLarge: 'El archivo es muy grande',
    anonymousNotice: 'Completamente anónimo - sin conexión contigo',
    uploadError: 'Error de carga',
    uploadsNotConfigured: 'Subida de medios temporalmente no disponible',
    uploadSuccess: 'Subido exitosamente',
  },
  pt: {
    addPhoto: 'Adicionar Foto',
    addVideo: 'Adicionar Vídeo',
    caption: 'Legenda (opcional)',
    captionPlaceholder: 'Descreva o que você vê...',
    uploading: 'Enviando...',
    processing: 'Processando...',
    uploadFailed: 'Falha no envio - toque para tentar novamente',
    retry: 'Tentar novamente',
    remove: 'Remover',
    maxSize: 'Máx 100MB para vídeos, 10MB para fotos',
    videoTooLong: 'O vídeo deve ter menos de 2 minutos',
    fileTooLarge: 'O arquivo é muito grande',
    anonymousNotice: 'Completamente anônimo - sem conexão com você',
    uploadError: 'Erro de upload',
    uploadsNotConfigured: 'Upload de mídia temporariamente indisponível',
    uploadSuccess: 'Enviado com sucesso',
  },
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  file?: File
  previewUrl: string
  caption: string
  status: 'pending' | 'uploading' | 'ready' | 'failed'
  progress: number
  // After upload
  publicUrl?: string
  videoId?: string
  hlsUrl?: string
  thumbnailUrl?: string
  durationSeconds?: number
  fileSizeBytes?: number
}

interface MediaUploadProps {
  media: MediaItem[]
  onChange: (media: MediaItem[]) => void
  maxItems?: number
  disabled?: boolean
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_VIDEO_DURATION = 120 // 2 minutes

export function MediaUpload({
  media,
  onChange,
  maxItems = 3,
  disabled = false,
}: MediaUploadProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'video'
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setError(null)
    const file = files[0]

    // Validate file size
    if (type === 'image' && file.size > MAX_IMAGE_SIZE) {
      setError(t.fileTooLarge)
      return
    }
    if (type === 'video' && file.size > MAX_VIDEO_SIZE) {
      setError(t.fileTooLarge)
      return
    }

    // Validate video duration
    if (type === 'video') {
      try {
        const duration = await getVideoDuration(file)
        if (duration > MAX_VIDEO_DURATION) {
          setError(t.videoTooLong)
          return
        }
      } catch (err) {
        console.error('Error getting video duration:', err)
      }
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)

    // Create new media item
    const newItem: MediaItem = {
      id: crypto.randomUUID(),
      type,
      file,
      previewUrl,
      caption: '',
      status: 'pending',
      progress: 0,
      fileSizeBytes: file.size,
    }

    // Add to list
    onChange([...media, newItem])

    // Clear input
    event.target.value = ''

    // Start upload
    uploadMedia(newItem)
  }

  const uploadMedia = async (item: MediaItem) => {
    if (!item.file) return

    // Update status to uploading
    updateItem(item.id, { status: 'uploading', progress: 10 })

    try {
      if (item.type === 'image') {
        await uploadImage(item)
      } else {
        await uploadVideo(item)
      }
    } catch (err) {
      console.error('Upload failed:', err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(`${t.uploadError}: ${errorMsg}`)
      updateItem(item.id, { status: 'failed', progress: 0 })
    }
  }

  const retryUpload = (item: MediaItem) => {
    if (item.file) {
      setError(null)
      uploadMedia(item)
    }
  }

  const uploadImage = async (item: MediaItem) => {
    if (!item.file) return

    // Compress and strip EXIF
    updateItem(item.id, { progress: 20 })
    const compressed = await compressImage(item.file)

    // Upload via our API (which proxies to Bunny Storage)
    updateItem(item.id, { progress: 40 })
    const formData = new FormData()
    formData.append('file', compressed, `image.${getFileExtension(item.file)}`)

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
      if (response.status === 503) {
        throw new Error(t.uploadsNotConfigured)
      }
      throw new Error(errorData.error || 'Failed to upload image')
    }

    const { publicUrl } = await response.json()

    // Update item with public URL
    updateItem(item.id, {
      status: 'ready',
      progress: 100,
      publicUrl,
      fileSizeBytes: compressed.size,
    })
  }

  const uploadVideo = async (item: MediaItem) => {
    if (!item.file) return

    // Get video duration
    const duration = await getVideoDuration(item.file)
    updateItem(item.id, { progress: 10, durationSeconds: duration })

    // Create video in Bunny Stream
    updateItem(item.id, { progress: 20 })
    const response = await fetch('/api/upload/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error(t.uploadsNotConfigured)
      }
      throw new Error('Failed to create video')
    }

    const { videoId, uploadUrl, tusHeaders, thumbnailUrl, hlsUrl } = await response.json()

    // Upload using TUS protocol
    updateItem(item.id, { progress: 30 })

    // For simplicity, we'll use a direct upload instead of TUS
    // TUS would be better for large files with resumable uploads
    try {
      const uploadResponse = await fetch(
        `https://video.bunnycdn.com/library/${tusHeaders.LibraryId}/videos/${videoId}`,
        {
          method: 'PUT',
          headers: {
            'AccessKey': tusHeaders.AuthorizationSignature,
            'Content-Type': 'application/octet-stream',
          },
          body: item.file,
        }
      )

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'Unknown video error')
        throw new Error(`Video upload failed: ${uploadResponse.status} ${errorText}`)
      }
    } catch (fetchError) {
      // CORS errors show up as TypeError: Failed to fetch
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error('Video service access denied (CORS). Check Bunny Stream settings.')
      }
      throw fetchError
    }

    // Update item with video info
    updateItem(item.id, {
      status: 'ready',
      progress: 100,
      videoId,
      hlsUrl,
      thumbnailUrl,
      publicUrl: hlsUrl,
    })
  }

  const updateItem = (id: string, updates: Partial<MediaItem>) => {
    onChange(
      media.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  const removeItem = (id: string) => {
    const item = media.find((m) => m.id === id)
    if (item?.previewUrl) {
      URL.revokeObjectURL(item.previewUrl)
    }
    onChange(media.filter((m) => m.id !== id))
  }

  const updateCaption = (id: string, caption: string) => {
    updateItem(id, { caption })
  }

  const canAddMore = media.length < maxItems && !disabled

  return (
    <div className="space-y-4">
      {/* Media Items */}
      {media.length > 0 && (
        <div className="space-y-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="relative rounded-[8px] border bg-muted/30 overflow-hidden"
            >
              {/* Preview */}
              <div className="flex gap-3 p-3">
                <div className={`relative w-20 h-20 rounded-[6px] overflow-hidden bg-muted flex-shrink-0 ${item.status === 'ready' ? 'ring-2 ring-[#84CC16]' : ''}`}>
                  {item.type === 'image' ? (
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.previewUrl}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Status overlay */}
                  {item.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                  {item.status === 'failed' && (
                    <button
                      onClick={() => retryUpload(item)}
                      className="absolute inset-0 bg-red-500/70 flex items-center justify-center cursor-pointer hover:bg-red-500/80"
                    >
                      <div className="text-center">
                        <AlertCircle className="h-5 w-5 text-white mx-auto" />
                        <span className="text-[9px] text-white mt-1 block">{t.retry}</span>
                      </div>
                    </button>
                  )}

                  {/* Type indicator */}
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white">
                    {item.type === 'video' ? (
                      <span className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        {item.durationSeconds && `${item.durationSeconds}s`}
                      </span>
                    ) : (
                      <ImageIcon className="h-3 w-3" />
                    )}
                  </div>
                </div>

                {/* Caption input */}
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder={t.captionPlaceholder}
                    value={item.caption}
                    onChange={(e) => updateCaption(item.id, e.target.value)}
                    className="h-9 text-sm rounded-[6px]"
                    maxLength={200}
                    disabled={disabled}
                  />
                  <p className="text-[10px] mt-1">
                    {item.status === 'uploading' && (
                      <span className="text-muted-foreground">{t.uploading} {item.progress}%</span>
                    )}
                    {item.status === 'ready' && (
                      <span className="text-[#84CC16] font-medium flex items-center gap-1">
                        ✓ {t.uploadSuccess} ({formatFileSize(item.fileSizeBytes || 0)})
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="text-muted-foreground">{t.processing}</span>
                    )}
                    {item.status === 'failed' && (
                      <span className="text-[#DC2626]">{t.uploadFailed}</span>
                    )}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 hover:bg-muted rounded-[4px] text-muted-foreground hover:text-foreground"
                  aria-label={t.remove}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress bar */}
              {item.status === 'uploading' && (
                <div className="h-1 bg-muted">
                  <div
                    className="h-full bg-[#00A6B4] transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add buttons */}
      {canAddMore && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => photoInputRef.current?.click()}
            className="flex-1 h-10 rounded-[8px] gap-2"
            disabled={disabled}
          >
            <Camera className="h-4 w-4" />
            {t.addPhoto}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            className="flex-1 h-10 rounded-[8px] gap-2"
            disabled={disabled}
          >
            <Video className="h-4 w-4" />
            {t.addVideo}
          </Button>

          {/* Hidden file inputs - no capture attribute so users can choose camera OR gallery */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            onChange={(e) => handleFileSelect(e, 'image')}
            className="hidden"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={(e) => handleFileSelect(e, 'video')}
            className="hidden"
          />
        </div>
      )}

      {/* Size hint and anonymity notice */}
      {canAddMore && media.length === 0 && (
        <div className="text-center space-y-1">
          <p className="text-[11px] text-muted-foreground">
            {t.maxSize}
          </p>
          <p className="text-[11px] text-[#00A6B4] font-medium">
            🔒 {t.anonymousNotice}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-[#DC2626] text-center">{error}</p>
      )}
    </div>
  )
}

export default MediaUpload
