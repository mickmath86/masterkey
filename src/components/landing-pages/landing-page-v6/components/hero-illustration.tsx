import { LogoIcon } from './logo'
import { MasterKeyMark } from '@/components/logo'
import Image from 'next/image'
import { ChartIllustration } from './chart-illustration'

export const HeroIllustration = () => {
    return (
        <div className="relative max-md:-mx-6">
            <div className="z-1 absolute inset-y-0 my-auto h-fit w-full max-w-72 origin-left scale-75 max-lg:left-6">
                <div className="bg-linear-to-r absolute -inset-6 from-purple-400 via-emerald-400 to-white opacity-40 blur-3xl"></div>

                <div className="bg-card ring-border-illustration relative rounded-2xl p-6 shadow-xl ring-1">
                    <div className="mb-6 flex items-start justify-between w-100">
                        <div className="space-y-0.5">
                    
                            <MasterKeyMark className="h-8 w-auto" />
                            <ChartIllustration />
                            <div className="mt-4 font-mono text-xs">VENTURA COUNTY</div>
                            <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">42 days</div>
                            <div className="text-xs font-medium">Average days on market</div>
                        </div>
                    </div>

                    {/* <div className="border-foreground/15 bg-foreground/5 mt-6 flex h-24 items-center justify-center rounded-md border border-dashed">
                        <div className="text-foreground/50 border-foreground/35 border-b px-6 font-serif text-lg">Sign here</div>
                    </div> */}
                </div>
            </div>
            <div className="mask-radial-from-75% ml-auto w-4/5 px-4 py-8">
                <div className="before:border-foreground/5 before:bg-primary/5 aspect-2/3 md:aspect-2/3 relative mt-auto h-fit overflow-hidden rounded-xl shadow-xl before:absolute before:inset-0 before:rounded-xl before:border sm:aspect-video">
                    <Image
                        src="https://res.cloudinary.com/dohqjvu9k/image/upload/v1757920412/work4_c0ffmk.webp"
                        alt="tailark hero section work 4"
                        className="size-full object-cover"
                        width={987}
                        height={1481}
                    />
                </div>
            </div>
        </div>
    )
}