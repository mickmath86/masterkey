import { IntegrationsIllustration } from '@/components/illustrations/integrations-illustration'
import { InvoiceIllustration } from '@/components/illustrations/invoice-illustration'
import { ChatIllustration } from '@/components/illustrations/chat-illustration'
import { FlowIllustration } from '@/components/illustrations/flow-illustration'
import { Container } from '@/components/container'

import { MESCHAC_AVATAR } from '@/lib/const'

import { Quote } from 'lucide-react'
import { Stripe } from '@/components/ui/svgs/stripe'

export function PlatformFeatures() {
    return (
        <section>
            <Container>
                <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
                    <div className="mx-auto max-w-2xl space-y-4 text-center">
                        <span className="text-foreground font-mono text-sm uppercase">
                            <span className="text-muted-foreground">[01]</span> Complete Platform
                        </span>
                        <h2 className="text-foreground mt-6 text-balance text-4xl font-semibold lg:text-5xl">Unveil the contact info you’ve been seeking</h2>
                        <p className="text-muted-foreground text-balance text-lg">Our powerful analytics platform helps you visualize complex data, identify trends, and make data-driven decisions with confidence.</p>
                    </div>
                </div>
            </Container>
            <Container className="**:data-[slot=content]:py-0 border-foreground/10 border-dashed">
                <div className="divide-foreground/10 @4xl:grid-cols-4 @4xl:*:p-8 @5xl:*:p-12 grid grid-cols-2 divide-x divide-y overflow-hidden *:p-4">
                    <div className="@max-4xl:border-r-0 @4xl:col-span-2 col-span-full row-span-2 grid grid-rows-subgrid gap-8">
                        <div className="mx-auto self-center max-sm:max-w-xs">
                            <FlowIllustration />
                        </div>
                        <div className="mx-auto max-w-sm text-center">
                            <h3 className="text-balance font-semibold">Powerful analytics dashboard</h3>
                            <p className="text-muted-foreground mt-3">Track performance metrics with real-time data visualization and customizable reports for informed.</p>
                        </div>
                    </div>
                    <div className="@4xl:col-span-2 col-span-full row-span-2 grid grid-rows-subgrid gap-8 border-r-0">
                        <div className="min-w-xs mx-auto self-center">
                            <InvoiceIllustration />
                        </div>
                        <div className="relative z-10 mx-auto max-w-sm text-center">
                            <h3 className="text-balance font-semibold">Streamlined invoicing system</h3>
                            <p className="text-muted-foreground mt-3">Generate, send, and manage professional invoices automatically with integrated payment tracking.</p>
                        </div>
                    </div>

                    <div className="@max-2xl:p-4 bg-card @4xl:border-b-0 flex flex-col items-center justify-center space-y-1 text-center md:text-center">
                        <div className="text-foreground text-4xl font-bold">99%</div>
                        <p className="text-muted-foreground">Uptime Guarantee</p>
                    </div>

                    <div className="@max-4xl:border-r-0 @max-2xl:p-4 bg-card @4xl:border-b-0 flex flex-col items-center justify-center space-y-1 text-center md:text-center">
                        <div className="text-foreground text-4xl font-bold">73%</div>
                        <p className="text-muted-foreground">Time Savings</p>
                    </div>
                    <div className="@max-2xl:p-4 @max-2xl:col-span-full bg-card relative col-span-2 border-b-0 border-r-0">
                        <blockquote className="relative max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-indigo-500">
                            <p className="text-foreground">This platform transformed how we handle client projects. The automation features alone saved us countless hours of manual work every week.</p>

                            <footer className="mt-4 flex items-center gap-2">
                                <div className="ring-foreground/10 size-6 overflow-hidden rounded-md border border-transparent shadow ring-1">
                                    <img
                                        src="https://avatars.githubusercontent.com/u/68236786?v=4"
                                        alt="Théo Balick"
                                        loading="lazy"
                                        width={46}
                                        height={46}
                                    />
                                </div>

                                <cite>Théo Balick</cite>

                                <span
                                    aria-hidden
                                    className="bg-foreground/15 size-1 rounded-full"></span>
                                <span className="text-muted-foreground">CTO, TechSolutions</span>
                            </footer>
                        </blockquote>
                    </div>
                    <div className="@max-4xl:border-r-0 col-span-2 row-span-2 grid grid-rows-subgrid gap-8 border-b-0 border-t p-8">
                        <div className="w-84 scale-80 mx-auto max-w-lg self-center">
                            <IntegrationsIllustration />
                        </div>

                        <div className="mx-auto max-w-sm text-center">
                            <h3 className="text-balance font-semibold">Global Data Visualization</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Track worldwide metrics with interactive maps and region-specific analytics.</p>
                        </div>
                    </div>

                    <div className="relative col-span-2 row-span-2 grid grid-rows-subgrid gap-8 border-t p-8">
                        <div className="@4xl:px-8 mx-auto w-full max-w-md self-center">
                            <ChatIllustration />
                        </div>

                        <div className="relative z-10 mx-auto max-w-sm text-center">
                            <h3 className="text-balance font-semibold">Advanced Analytics Engine</h3>
                            <p className="text-muted-foreground mt-3 text-balance">Harness the power of predictive modeling and trend analysis to make data-driven decisions.</p>
                        </div>
                    </div>
                </div>
            </Container>
            <Container className="**:data-[slot=content]:bg-background max-lg:**:data-[slot=content]:px-6 **:data-[slot=content]:py-0 border-dashed">
                <div className="mx-auto max-w-2xl py-12 lg:pt-16">
                    <Quote
                        aria-hidden
                        className="fill-background stroke-background size-6 drop-shadow-sm"
                    />
                    <Stripe className="mt-6 h-auto w-16" />
                    <div className="mt-6">
                        <p className='text-xl *:leading-relaxed before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-2xl'>Using Tailark has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.</p>

                        <div className="mt-12 flex items-center gap-3">
                            <div className="ring-foreground/10 aspect-square size-10 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                                <img
                                    src={MESCHAC_AVATAR}
                                    alt="Méschac Irung"
                                    loading="lazy"
                                    width={460}
                                    height={460}
                                />
                            </div>
                            <div className="space-y-px">
                                <p className="text-sm font-medium">Méschac Irung</p>
                                <p className="text-muted-foreground text-xs">Founder & CEO, Stripe</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}