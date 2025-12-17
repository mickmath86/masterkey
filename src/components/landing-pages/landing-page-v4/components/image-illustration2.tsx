'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import VideoPlayer from '@/components/video-player'

import { motion, useScroll, useTransform } from 'motion/react'

export const ImageIllustration = () => {
    const { scrollY } = useScroll()
    const parallaxFactor = 0.2
    const y = useTransform(scrollY, [0, 500], [0, 500 * parallaxFactor], { clamp: false })
    const maxScale = 1.5
    const scale = useTransform(scrollY, [0, 500], [1, maxScale], { clamp: true })
    const rotateX = useTransform(scrollY, [0, 500], [12, 0], { clamp: true })

    useEffect(() => {
        if (typeof window === 'undefined') return

        // Load Wistia player scripts
        const playerScript = document.createElement('script')
        playerScript.src = 'https://fast.wistia.com/player.js'
        playerScript.async = true

        const embedScript = document.createElement('script')
        embedScript.src = 'https://fast.wistia.com/embed/docfron0i3.js'
        embedScript.async = true
        embedScript.type = 'module'

        document.body.appendChild(playerScript)
        document.body.appendChild(embedScript)

        // Add preload style for custom element
        const style = document.createElement('style')
        style.textContent = "wistia-player[media-id='docfron0i3']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/docfron0i3/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }"
        document.head.appendChild(style)

        return () => {
            document.body.removeChild(playerScript)
            document.body.removeChild(embedScript)
            document.head.removeChild(style)
        }
    }, [])

    return (
        <motion.div
            style={{ y, scale }}
            className="perspective-near mx-auto mt-8 max-w-xl">
            <motion.div
                style={{ rotateX }}
                className="relative mx-auto max-w-xs sm:max-w-xl">
                <div className="group relative">
                    <button className="absolute inset-1 z-10 flex items-center justify-center rounded-xl border border-dotted border-white/15">
                        <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="active:scale-99 m-auto w-fit rounded-full bg-white/15 text-white shadow-lg ring-white/25 backdrop-blur transition-all duration-200 before:absolute before:inset-0 hover:-translate-y-1 hover:scale-105 hover:bg-white/20 active:-translate-y-0.5">
                            <div>
                                <Play className="size-3.5!" />
                                Watch demo
                            </div>
                        </Button>
                    </button>
                    <div className="ring-background/25 before:inset-ring-4 before:mask-y-from-55% before:z-1 before:inset-ring-white/35 before:border-foreground relative aspect-video overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 before:absolute before:inset-0 before:rounded-2xl before:border">
                        <VideoPlayer/>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

declare module 'react' {
    interface IntrinsicElements {
        'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
}