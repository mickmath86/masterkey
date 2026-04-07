import { IntegrationsIllustration } from "@/components/landing-pages/landing-page-v3/components/integrations-illustration"
import { Zap, Sparkles, Lock, Cpu } from 'lucide-react'
import { InvoiceIllustration } from "@/components/landing-pages/landing-page-v3/components/invoice-illustration"
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import IntelliJIDEA from '@/components/landing-pages/landing-page-v3/components/logos/intellij'
import VisualStudioCode from '@/components/landing-pages/landing-page-v3/components/logos/vs-code'
import Windsurf from '@/components/landing-pages/landing-page-v3/components/logos/windsurf'

export function FeaturesSection() {
    return (
        <section className="bg-background">
            <div className="bg-muted/50 @container py-24">
                <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
                    <div className="relative">
                        <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
                        <PlusDecorator className="right-0 -translate-y-[calc(50%-0.5px)] translate-x-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 right-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />

                        <div className="border-foreground/10 @max-3xl:*:nth-6:border-r @max-3xl:*:nth-4:border-r *:nth-[1n+1]:nth-[-n+5]:border-b @3xl:*:nth-[1n+1]:nth-[-n+3]:border-b *:nth-3:border-r-0! @3xl:*:nth-[1n+2]:nth-[-n+6]:border-r divide-foreground/10 @3xl:grid-cols-4 @4xl:*:p-8 relative grid grid-cols-2 overflow-hidden border *:p-4">
                            <div className="col-span-full">
                                <div className="mx-auto max-w-xl pt-8 text-center">
                                    <h2 className="text-balance text-4xl font-semibold">We Provide. You decide. </h2>
                                    <p className="text-muted-foreground my-6 text-balance text-lg">Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum at.</p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="/pricing">Get Started</Link>
                                    </Button>
                                </div>
                                <div className="relative">
                                    {/* <div className="absolute inset-x-0 bottom-4 z-10 mx-auto max-w-56 space-y-3">
                                        <h3 className="text-center font-medium">Replaces your IDE</h3>
                                        <div className="*:bg-foreground/5 grid grid-cols-3 gap-0.5 *:flex *:items-center *:justify-center *:rounded *:px-2 *:py-3">
                                            <div className="!rounded-l-lg">
                                                <IntelliJIDEA className="size-5" />
                                            </div>
                                            <div>
                                                <VisualStudioCode className="size-5" />
                                            </div>
                                            <div className="!rounded-r-lg">
                                                <Windsurf className="size-5" />
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="mask-b-from-35% @4xl:px-8 mx-auto mt-16 max-w-4xl px-4 pt-1">
                                        <div className="bg-background rounded-(--radius) ring-border-illustration @4xl:h-80 relative h-64 overflow-hidden border border-transparent shadow-xl shadow-black/10 ring-1">
                                            <Image
                                                src="/images/app-screenshot.png"
                                                alt="app screen"
                                                width="2880"
                                                height="1842"
                                                className="object-top-left size-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8! col-span-2 row-span-2 grid grid-rows-subgrid gap-8">
                                <div className="max-w-84 mx-auto w-full self-center">
                                    <InvoiceIllustration />
                                </div>
                                <div className="mx-auto max-w-sm text-center">
                                    <h3 className="text-balance font-semibold">Powerful analytics dashboard</h3>
                                    <p className="text-muted-foreground mt-3">Track performance metrics with real-time data visualization and customizable reports for informed.</p>
                                </div>
                            </div>
                            <div className="p-8! relative col-span-2 row-span-2 grid grid-rows-subgrid gap-8">
                                <PlusDecorator className="bottom-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]" />

                                <div className="@4xl:px-8 mx-auto max-w-sm self-center">
                                    <IntegrationsIllustration />
                                </div>
                                <div className="relative z-10 mx-auto max-w-sm text-center">
                                    <h3 className="text-balance font-semibold">Streamlined invoicing system</h3>
                                    <p className="text-muted-foreground mt-3">Generate, send, and manage professional invoices automatically with integrated payment tracking.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="text-foreground size-4" />
                                    <h3 className="text-sm font-medium">Faaast</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="text-foreground size-4" />
                                    <h3 className="text-sm font-medium">Powerful</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Lock className="text-foreground size-4" />
                                    <h3 className="text-sm font-medium">Security</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">An helping developers businesses innovate.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="text-foreground size-4" />

                                    <h3 className="text-sm font-medium">AI Powered</h3>
                                </div>
                                <p className="text-muted-foreground text-sm">Helping developers businesses innovate.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const PlusDecorator = ({ className }: { className?: string }) => (
    <div
        aria-hidden
        className={cn('mask-radial-from-15% before:bg-foreground/25 after:bg-foreground/25 absolute size-3 before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px', className)}
    />
)