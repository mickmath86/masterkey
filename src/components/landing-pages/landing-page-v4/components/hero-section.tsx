import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from "../sections/header"
// import { LogoCloud } from "../components/logo-cloud"
import Image from 'next/image'

export function HeroSection() {
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
                        <h1 className="text-foreground text-balance text-4xl  sm:mt-12 sm:text-6xl">Sell <span className="text-sky-500 font-semibold">3332 Mountain Trail</span> in 60 days or less – or pay us {' '}
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
                            <Image
                                className="border-t shadow-md"
                                src="https://res.cloudinary.com/dohqjvu9k/image/upload/v1755171585/oxy_jjuhdv.webp"
                                alt="Oxymor overview"
                                width={1280}
                                height={720}
                                sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
                            />
                        </div>
                    </div>
                </section>
                {/* <LogoCloud /> */}
            </main>
        </>
    )
}