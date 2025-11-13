'use client'
import React, { useEffect } from 'react'

// TypeScript declaration removed since we're using dangerouslySetInnerHTML

export default function VideoPlayer() {
  useEffect(() => {
    // Check if scripts are already loaded to avoid duplicates
    if (!document.querySelector('script[src="https://fast.wistia.com/player.js"]')) {
      const playerScript = document.createElement('script')
      playerScript.src = 'https://fast.wistia.com/player.js'
      playerScript.async = true
      document.head.appendChild(playerScript)
    }

    if (!document.querySelector('script[src="https://fast.wistia.com/embed/docfron0i3.js"]')) {
      const embedScript = document.createElement('script')
      embedScript.src = 'https://fast.wistia.com/embed/docfron0i3.js'
      embedScript.async = true
      embedScript.type = 'module'
      document.head.appendChild(embedScript)
    }

    // Add CSS styles for the loading state
    if (!document.querySelector('#wistia-loading-styles')) {
      const style = document.createElement('style')
      style.id = 'wistia-loading-styles'
      style.textContent = `
        wistia-player[media-id='docfron0i3']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/docfron0i3/swatch');
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
      <div 
        dangerouslySetInnerHTML={{
          __html: `<wistia-player media-id="docfron0i3" aspect="1.7777777777777777" class="w-full h-auto rounded-xl"></wistia-player>`
        }}
      />
    </div>
  )
}
