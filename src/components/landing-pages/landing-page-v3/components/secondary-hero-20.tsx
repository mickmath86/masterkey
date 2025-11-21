import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroIllustration } from "./hero-illustration"

export function SecondaryHero20() {
    return (
        <section>
            <div className="bg-muted py-20">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <div className="max-md:text-center">
                            {/* <span className="text-primary text-sm font-medium">Billing</span> */}
                            <h1 className="mt-4 text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">Timing is everything</h1>
                            <p className="text-muted-foreground mb-6 mt-4 max-w-md text-balance text-lg max-md:mx-auto">Knowing <span className="italic">when</span> to sell can have a bigger impact on your profit than any upgrade you’ve made.
We analyze real market signals — days on market, absorption rate, and buyer demand — to show whether now is the right moment or if waiting could earn you more.</p>

                            {/* <Button asChild>
                                <Link href="#link">Get Started</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="ml-3">
                                <Link href="#link">Get a demo</Link>
                            </Button> */}

                            <div className="mt-12 grid max-w-sm grid-cols-2 max-md:mx-auto">
                                <div className="space-y-2 *:block">
                                    {/* <span className="text-lg font-semibold">
                                        99.9 <span className="text-muted-foreground text-lg">%</span>
                                    </span> */}
                                    <p className="text-muted-foreground text-balance text-sm">
                                        <strong className="text-foreground font-medium">Demand Signals</strong> We track how quickly homes are selling in your area — a clear indicator of current buyer motivation.
                                    </p>
                                </div>

                                <div className="space-y-2 *:block">
                                    {/* <span className="text-lg font-semibold">
                                        12 <span className="text-muted-foreground text-lg">X</span>
                                    </span> */}
                                    <p className="text-muted-foreground text-balance text-sm">
                                        <strong className="text-foreground font-medium">Market Leverage Shifts</strong> in days on market and inventory levels determine who has the advantage — buyers or sellers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <HeroIllustration />
                    </div>
                </div>
            </div>
        </section>
    )
}

{/* Demand Signals We track how quickly homes are selling in your area — a clear indicator of current buyer motivation.
Market Leverage Shifts in days on market and inventory levels determine who has the advantage — buyers or sellers.
Personalized Sell/Wait Insight Your report applies these trends to your home's features and location to show whether selling now or waiting may be smarter. */}