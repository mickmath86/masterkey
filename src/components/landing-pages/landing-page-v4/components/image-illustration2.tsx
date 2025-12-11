'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
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
                        <wistia-player
                            media-id="docfron0i3"
                            aspect="1.7777777777777777">
                            <div
                                className="wistia_preload_transcript_outer_wrapper"
                                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-56.25%' }}>
                                <div
                                    className="wistia_preload_transcript_inner_wrapper"
                                    style={{ overflow: 'auto' }}>
                                    <p
                                        className="wistia_preload_transcript_text"
                                        aria-hidden="true"
                                        tabIndex={-1}
                                        style={{ textAlign: 'justify', fontSize: '5px' }}>
                                        If you're anything like most people about to enter the real estate market, you understand that arriving at the decision to sell or to buy your next home can require a ton of research in an ever changing landscape of market conditions. And unfortunately, traditional online property valuation tools often fail to take all of this data into account, and they fail at capturing what makes your property unique. So that's why we built the MasterKey AI powered valuation tool. It's specifically made for Ventura and Los Angeles County residents, and it's a reporting system that goes beyond generic estimates to deliver custom, data driven reports for your exact property. All you need to do on this page is simply enter your address and answer a few quick questions about your property. The unique factor in our software is that we allow you to include any recent improvements you may have made to your home. After that, we'll generate your report, personalized for you, instantly. Our model blends real time comps, price per square foot data, and market trend analysis, and then it runs everything through AI to interpret all those numbers in the way that an expert would. And then the result is a clear insight on whether right now might be the right time to sell or if it's smarter to wait until market conditions improve. And if you ever wanna talk through any of your results, our team is here locally in Thousand Oaks, and we're just a call or a text away. There's no pressure. There's no pushy sales pitch. It's just honest guidance. So if that's interesting to you, feel free to enter your address in and answer those questions, and you should have your results in about sixty seconds. Thanks a lot, and we hope this helps.
                                    </p>
                                </div>
                            </div>
                        </wistia-player>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
        }
    }
}