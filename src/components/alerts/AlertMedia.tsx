'use client'

import { useState } from 'react'
import { Play, X, ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MediaItem {
  type: 'image' | 'video'
  url: string
  caption?: string
  thumbnailUrl?: string
  durationSeconds?: number
}

interface AlertMediaProps {
  media: MediaItem[]
}

/**
 * Displays media (photos/videos) attached to an alert
 * Videos use HLS streaming from Bunny.net
 */
export function AlertMedia({ media }: AlertMediaProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!media || media.length === 0) return null

  const currentMedia = media[currentIndex]

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {media.map((item, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="relative flex-shrink-0 w-20 h-20 rounded-[8px] overflow-hidden bg-muted group"
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={item.caption || 'Alert photo'}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img
                  src={item.thumbnailUrl || item.url.replace('/playlist.m3u8', '/thumbnail.jpg')}
                  alt={item.caption || 'Alert video'}
                  className="w-full h-full object-cover"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-4 w-4 text-black ml-0.5" fill="currentColor" />
                  </div>
                </div>
                {/* Duration badge */}
                {item.durationSeconds && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {formatDuration(item.durationSeconds)}
                  </div>
                )}
              </>
            )}

            {/* Type indicator */}
            <div className="absolute top-1 left-1 p-1 bg-black/50 rounded">
              {item.type === 'image' ? (
                <ImageIcon className="h-3 w-3 text-white" />
              ) : (
                <Video className="h-3 w-3 text-white" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Caption preview */}
      {media.length === 1 && media[0].caption && (
        <p className="text-small text-muted-foreground mt-1 line-clamp-2">
          {media[0].caption}
        </p>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/50">
            <div className="text-white text-sm">
              {currentIndex + 1} / {media.length}
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Media */}
          <div className="flex-1 flex items-center justify-center relative">
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={currentMedia.caption || 'Alert photo'}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-full"
              >
                {/* HLS fallback - if browser supports HLS natively */}
                <source src={currentMedia.url} type="application/x-mpegURL" />
                Your browser does not support video playback.
              </video>
            )}

            {/* Navigation arrows */}
            {media.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Caption */}
          {currentMedia.caption && (
            <div className="p-4 bg-black/50">
              <p className="text-white text-sm text-center">
                {currentMedia.caption}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default AlertMedia
