'use client'
import React, { useEffect } from 'react'

export function VideoSection() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load Wistia player scripts (you can replace with YouTube/Vimeo if preferred)
    const playerScript = document.createElement('script')
    playerScript.src = 'https://fast.wistia.com/player.js'
    playerScript.async = true

    // TODO: Replace with actual video ID
    const videoId = 'PLACEHOLDER_VIDEO_ID'
    const embedScript = document.createElement('script')
    embedScript.src = `https://fast.wistia.com/embed/${videoId}.js`
    embedScript.async = true
    embedScript.type = 'module'

    document.body.appendChild(playerScript)
    document.body.appendChild(embedScript)

    // Add preload style for custom element
    const style = document.createElement('style')
    style.textContent = `wistia-player[media-id='${videoId}']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${videoId}/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }`
    document.head.appendChild(style)

    return () => {
      if (document.body.contains(playerScript)) document.body.removeChild(playerScript)
      if (document.body.contains(embedScript)) document.body.removeChild(embedScript)
      if (document.head.contains(style)) document.head.removeChild(style)
    }
  }, [])

  return (
    <section className="border-foreground/10 relative border-y bg-white dark:bg-gray-900">
      <div className="relative z-10 mx-auto max-w-6xl border-x px-3">
        <div className="border-x">
          <div
            aria-hidden
            className="h-3 w-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5"
          />
          
          {/* Video Player Container */}
          <div className="relative bg-black">
            {/* TODO: Replace with actual Wistia video player or YouTube embed */}
            {/* Example Wistia: <wistia-player media-id="PLACEHOLDER_VIDEO_ID" /> */}
            
            {/* Placeholder for now - replace with actual video embed */}
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <svg
                  className="mx-auto h-20 w-20 text-sky-500 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-lg font-semibold">Thousand Oaks Neighborhood Guide</p>
                <p className="text-sm text-gray-400 mt-2">Video Player (Replace with actual video)</p>
              </div>
            </div>
          </div>
          
          <div
            aria-hidden
            className="h-3 w-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5"
          />
        </div>
      </div>
    </section>
  )
}
