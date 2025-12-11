import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Container } from '@/components/container'
// import { LayoutIllustration } from './illustrations/layout-illustration'
import Image from 'next/image'

export function CallToAction() {
    return (
        <section className="relative">
            <Container className="**:data-[slot=content]:py-16">
                <span></span>
            </Container>
            <Container className="**:data-[slot=content]:py-0 **:data-[slot=content]:bg-linear-to-b **:data-[slot=content]:from-blue-400 **:data-[slot=content]:to-indigo-500 relative">
                <div
                    aria-hidden
                    className="dither-xs mask-x-from-65% mask-x-to-95% mask-y-from-75% pointer-events-none absolute inset-0 mix-blend-darken 2xl:mx-auto 2xl:max-w-7xl">
                    <div className="size-full">
                        <Image
                            src="https://res.cloudinary.com/dohqjvu9k/image/upload/v1759211132/grid-2-bg_bqde4m.webp"
                            alt="tailark cta background"
                            className="size-full -scale-x-100 object-cover"
                            width={2224}
                            height={1589}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1520px"
                        />
                    </div>
                </div>
                <div
                    data-theme="dark"
                    className="relative overflow-hidden pl-8 pt-8 md:p-20">
                    <div className="max-w-xl max-md:pr-8">
                        <div className="relative">
                            <h2 className="text-foreground text-balance text-4xl font-semibold lg:text-5xl">Create, Sell and Grow</h2>
                            <p className="text-foreground mb-6 mt-4 text-balance text-lg">Join a community of over 1000+ companies and developers who have already discovered the power of Tailark. </p>

                            <Button asChild>
                                <Link href="#">Contact Sales</Link>
                            </Button>
                        </div>
                    </div>
                    <div
                        data-theme="quartz"
                        className="max-lg:mask-b-from-35% max-lg:pt-6 max-md:mt-4 lg:absolute lg:inset-0 lg:top-12 lg:ml-auto lg:w-2/5">
                        {/* <LayoutIllustration /> */}
                    </div>
                </div>
            </Container>
            <div className="border-b"></div>
        </section>
    )
}
