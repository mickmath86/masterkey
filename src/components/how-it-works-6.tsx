import { Button } from '@/components/ui/button'
import { DocumentIllustration } from "@/components/ui/illustrations/document-illustration"
import { Equal, Plus } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ActionnableIllustration } from "@/components/ui/illustrations/actionnable"
import { IDCheckIllustration } from "@/components/ui/illustrations/id-check"

export default function HowItWorksSection() {
    return (
        <section className="bg-background overflow-hidden">
            <div className="relative m-4 overflow-hidden rounded-[2rem] py-24">
                <div className="absolute inset-0 bg-[radial-gradient(black_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px]"></div>

                <div className="@container relative mx-auto w-full max-w-5xl px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-foreground text-4xl font-semibold">Simple Three-Step Workflow</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">Experience our streamlined approach to data analysis that empowers your team to make informed decisions quickly and efficiently.</p>
                    </div>

                    <div className="@3xl:grid-cols-3 my-20 grid gap-12">
                        <div className="row-span-3 grid grid-rows-subgrid gap-8 text-center">
                            <div className="relative flex h-28 items-center self-center">
                                <div className="bg-foreground/5 relative mx-auto size-fit border p-2">
                                    <CardDecorator className="border-primary size-2" />
                                    <DocumentIllustration />
                                </div>
                                <Plus
                                    strokeWidth={4}
                                    className="@3xl:block fill-illustration stroke-illustration absolute inset-y-0 right-0 my-auto hidden translate-x-[75%] drop-shadow"
                                />
                            </div>
                            <div>
                                <h3 className="text-foreground mb-3 font-medium">Face Detection</h3>
                                <p className="text-muted-foreground text-balance text-sm">Effortlessly identify and manage users with our advanced face recognition system.</p>
                            </div>
                            <Plus
                                strokeWidth={4}
                                className="@3xl:hidden fill-illustration stroke-illustration mx-auto translate-y-[75%] drop-shadow"
                            />
                        </div>
                        <div className="row-span-3 grid grid-rows-subgrid gap-8 text-center">
                            <div className="relative flex h-28 items-center self-center">
                                <IDCheckIllustration />
                                <Equal
                                    strokeWidth={4}
                                    className="@3xl:block fill-illustration stroke-illustration absolute inset-y-0 right-0 my-auto hidden translate-x-[75%] drop-shadow"
                                />
                            </div>
                            <div>
                                <h3 className="text-foreground mb-3 font-medium">Automated Analysis</h3>
                                <p className="text-muted-foreground text-balance text-sm">Our AI-powered system processes complex datasets to identify patterns and insights instantly.</p>
                            </div>
                            <Equal
                                strokeWidth={4}
                                className="@3xl:hidden fill-illustration stroke-illustration mx-auto translate-y-[75%] drop-shadow"
                            />
                        </div>
                        <div className="row-span-3 grid grid-rows-subgrid gap-8 text-center">
                            <ActionnableIllustration className="max-w-58 self-center" />
                            <div>
                                <h3 className="text-foreground mb-3 font-medium">Actionable Reports</h3>
                                <p className="text-muted-foreground text-balance text-sm">Transform insights into beautiful visualizations and shareable reports to drive decisions.</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="mx-auto flex w-fit">
                        <Link href="/sign-up">Get Started</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export const CardDecorator = ({ className }: { className?: string }) => (
    <>
        <span className={cn('absolute -left-px -top-px block size-2 rounded-tl border-l border-t', className)}></span>
        <span className={cn('absolute -right-px -top-px block size-2 rounded-tr border-r border-t', className)}></span>
        <span className={cn('absolute -bottom-px -left-px block size-2 rounded-bl border-b border-l', className)}></span>
        <span className={cn('absolute -bottom-px -right-px block size-2 rounded-br border-b border-r', className)}></span>
    </>
)