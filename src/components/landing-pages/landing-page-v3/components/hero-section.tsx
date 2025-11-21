import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Header } from "./header"
import { ChevronRight, CirclePlay, Star } from 'lucide-react'
import GradientText from '@/components/GradientText'

import { Spotify } from './logos/spotify'
import { Supabase } from './logos/supabase'
import { Beacon } from './logos/beacon'
import { FadeIn, FadeInRight } from '@/components/animations'

export function HeroSection() {
    return (
        <>
            <Header />
            <main
                role="main"
                className="overflow-x-hidden pb-6">
                <section>
                    <div className="relative pb-36 pt-24 md:pt-36 lg:pt-44">
                        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-12">
                            <div className="md:w-1/2">
                                <div>
                                    <FadeIn>
                                    <span className="text-primary text-sm font-medium">For homeowners who want the full picture before they sell.</span>
                                    <h1 className="max-w-md mt-4 text-balance text-5xl font-medium md:text-6xl">To sell or to wait. {<br />} 
                                        <GradientText
                                            colors={["#0ea5e9", "#075985", "#22c55e", "#166534"]}
                                            animationSpeed={10}
                                            showBorder={false}
                                            className="custom-class font-semibold"
                                            >
                                
                                            That is the question. 
                                        </GradientText> 
                                    </h1>
                                    </FadeIn>
                                    <p className="text-muted-foreground mb-8 mt-4 max-w-2xl text-balance text-xl">You deserve more than a guess. Get a personalized Sell/Wait Report built on real market trends, days-on-market analysis, and your home’s unique features.</p>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="pl-4 pr-2.5">
                                            <Link href="/questionnaire/listing-presentation">
                                                <span className="text-nowrap">Get Seller's Report</span>
                                                <ChevronRight className="opacity-50" />
                                            </Link>
                                        </Button>
                                        {/* <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="pl-3.5 pr-4">
                                            <Link href="#link">
                                                <CirclePlay className="fill-primary/25 stroke-primary" />
                                                <span className="text-nowrap">Watch video</span>
                                            </Link>
                                        </Button> */}
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <p className="text-muted-foreground">Rated 5.0 on Google by <span className="font-semibold">Ventura</span> and <span className="font-semibold">Los Angeles County</span> owners</p>
                                    <div className="mt-4 flex items-center gap-3">
                                        {/* Google Logo */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" className="flex-shrink-0">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        
                                        {/* 5 Stars */}
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        
                                        {/* Rating Text */}
                                        <span className="text-sm font-medium text-foreground">5.0</span>
                                        {/* <span className="text-sm text-muted-foreground">(127 reviews)</span> */}
                                    </div>
                                    {/* <div className="**:fill-foreground mt-6 flex w-full max-w-md flex-wrap items-center gap-8 *:w-fit">
                                        <Spotify
                                            height={26}
                                            width="auto"
                                        />
                                        <Supabase
                                            height={24}
                                            width="auto"
                                        />
                                        <Beacon
                                            height={18}
                                            width="auto"
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                            <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full max-w-3xl before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                                <FadeInRight>
                                <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                                    <Image
                                        src="/images/app-screenshot.png"
                                        alt="app screen"
                                        width="2880"
                                        height="1842"
                                        className="object-top-left size-full object-cover"
                                    />
                                </div>
                                </FadeInRight>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}