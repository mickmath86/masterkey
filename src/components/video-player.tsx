'use client'
import { useEffect } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': {
        'media-id': string
        aspect: string
        className?: string
      }
    }
  }
}

export default function VideoPlayer() {
  useEffect(() => {
    // Check if scripts are already loaded to avoid duplicates
    if (!document.querySelector('script[src="https://fast.wistia.com/player.js"]')) {
      const playerScript = document.createElement('script')
      playerScript.src = 'https://fast.wistia.com/player.js'
      playerScript.async = true
      document.head.appendChild(playerScript)
    }

    if (!document.querySelector('script[src="https://fast.wistia.com/embed/d7gfe630xr.js"]')) {
      const embedScript = document.createElement('script')
      embedScript.src = 'https://fast.wistia.com/embed/d7gfe630xr.js'
      embedScript.async = true
      embedScript.type = 'module'
      document.head.appendChild(embedScript)
    }

    // Add CSS styles for the loading state
    if (!document.querySelector('#wistia-loading-styles')) {
      const style = document.createElement('style')
      style.id = 'wistia-loading-styles'
      style.textContent = `
        wistia-player[media-id='d7gfe630xr']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/d7gfe630xr/swatch');
          display: block;
          filter: blur(5px);
          padding-top: 56.25%;
          border-radius: 12px;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  return (
    <div className="relative w-full rounded-xl overflow-hidden">
      <wistia-player 
        media-id="d7gfe630xr" 
        aspect="1.7777777777777777"
        className="w-full h-auto rounded-xl"
      />
    </div>
  )
}