import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BedDouble, Bath, Ruler } from 'lucide-react'
export function HomeStats() {
    return (
        <section className="bg-background @container">
            <div className="bg-muted/50 py-16 md:py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="mx-auto max-w-2xl text-balance text-center text-3xl font-semibold lg:text-4xl">Delivering measurable Results</h2>
                    <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-pretty text-center text-lg">
                        Our platform has helped companies <strong className="text-foreground font-semibold">increase conversion rates and boost engagement</strong> across all digital channels.
                    </p>

                    <div className="relative mt-12">
                        {/* <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
                        <PlusDecorator className="right-0 -translate-y-[calc(50%-0.5px)] translate-x-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 right-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
                        <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" /> */}
                        <Image src="/images/mountaintrail.jpeg" alt="Stats illustration" className="w-full max-w-md mx-auto rounded-md mb-8" 
                        width={1200} height={800}
                        />
                        <div className="**:text-center bg-background *:hover:bg-muted/25 @xl:grid-cols-3 grid grid-cols-2 divide-x border *:p-8">
                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <BedDouble className="h-6 w-6 text-sky-500" />
                                    <span className="text-3xl font-medium md:text-5xl">3</span>
                                </div>
                                <p className="text-muted-foreground text-sm">Bedrooms</p>
                            </div>
                            <div className="@max-xl:border-0 space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <Bath className="h-6 w-6 text-sky-500" />
                                    <span className="text-3xl font-medium md:text-5xl">2</span>
                                </div>
                                <p className="text-muted-foreground text-sm">Bathrooms</p>
                            </div>
                            <div className="@max-xl:hidden space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <Ruler className="h-6 w-6 text-sky-500" />
                                    <span className="text-3xl font-medium md:text-5xl">1,234</span>
                                </div>
                                <p className="text-muted-foreground text-sm">Sq Ft</p>
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