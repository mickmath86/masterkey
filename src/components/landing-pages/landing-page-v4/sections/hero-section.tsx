'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from "./header"
// import { LogoCloud } from "../components/logo-cloud"
import Image from 'next/image'
import { ImageIllustration } from "../components/image-illustration2"

export function HeroSection() {
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
        <>
            <Header />

            <main
                role="main"
                className="bg-muted/50">
                <section
                    id="home"
                    className="relative mx-auto max-w-5xl px-6 pt-32 text-center">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 -bottom-16 mx-auto h-40 max-w-2xl rounded-t-full bg-gradient-to-b via-amber-50 to-purple-100 blur-3xl"
                    />
                    <div className="relative mx-auto max-w-3xl text-center">
                        <h1 className="text-foreground text-balance font-bold text-4xl  sm:mt-12 sm:text-6xl"> Get an Offer at Your Verified Value in 45 Days <span className="text-muted-foreground font-normal">— or You Pay Us</span> {' '}
                            <span className="relative font-bold text-sky-500">
                                    <svg
                                        aria-hidden
                                        className="pointer-events-none absolute inset-x-0 -bottom-3 w-full"
                                        viewBox="0 0 283 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332"
                                            stroke="url(#paint0_linear_pl)"
                                            strokeWidth="4"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_pl"
                                                x1="282"
                                                y1="5.49999"
                                                x2="40"
                                                y2="13"
                                                gradientUnits="userSpaceOnUse">
                                                <stop stopColor="var(--color-sky-300)" />
                                                <stop
                                                    offset="1"
                                                    stopColor="var(--color-blue-200)"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="relative">nothing</span>
                                </span>
                        </h1>
                        <p className="text-muted-foreground mb-8 mt-4 text-balance text-lg">Zero risk. Local experts. A proven system built to get homes sold fast — even in a slow market.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="px-4 text-sm">
                            <Link href="#">Call Now</Link>
                        </Button>
                         <Button
                            asChild
                            size="lg"
                            className="px-4 text-sm"
                            variant="outline"
                        >
                            <Link href="#">Schedule Appointment</Link>
                        </Button>
                        </div>
                       
                        {/* <span className="text-muted-foreground mt-3 block text-center text-sm">No credit card required!</span> */}
                    </div>
                </section>
                <section className="border-foreground/10 relative mt-8 border-y sm:mt-16">
                    <div className="relative z-10 mx-auto max-w-6xl border-x px-3">
                        <div className="border-x">
                            <div
                                aria-hidden
                                className="h-3 w-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5"
                            />
                           
                            {/* <Image
                                className="border-t shadow-md"
                                src="https://res.cloudinary.com/dohqjvu9k/image/upload/v1755171585/oxy_jjuhdv.webp"
                                alt="Oxymor overview"
                                width={1280}
                                height={720}
                                sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
                            /> */}
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
                </section>
                {/* <LogoCloud /> */}
            </main>
        </>
    )
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
        }
    }
}