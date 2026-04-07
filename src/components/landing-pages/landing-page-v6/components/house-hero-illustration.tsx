import { LogoIcon } from './logo'
import { MasterKeyMark } from '@/components/logo'

import Image from 'next/image'
import { ChartIllustration } from './chart-illustration'
import { Separator } from '@/components/ui/separator'

export const HouseHeroIllustration = () => {
      return (
        <div className="relative max-md:-mx-6">
            <div className="z-1 absolute inset-y-0 my-auto h-fit w-full max-w-72 origin-left scale-75 max-lg:left-6">
                <div className="bg-linear-to-r absolute -inset-6 from-purple-400 via-emerald-400 to-white opacity-40 blur-3xl"></div>

                <div className="bg-card ring-border-illustration relative rounded-2xl p-6 shadow-xl ring-1 overflow-hidden">
                    {/* Diagonal SOLD ribbon across top-left corner */}
                    <div className="pointer-events-none absolute -left-10 top-5 -rotate-45 bg-red-600 px-10 py-1 shadow-md">
                        <div className="text-[24px] font-bold tracking-[0.3em] text-white">SOLD</div>
                    </div>

                    <div className="mb-6 flex-col items-center justify-between my-10">
                        <div className="flex flex-col items-center space-y-4">
                           
                            <MasterKeyMark className="h-24 w-auto" />
                             {/* <div className="text-center font-mono text-lg">3332 Mountain Trail Ave </div> 
                            <div className="text-center font-mono   text-sm text-muted-foreground">Newbury Park, CA 91320</div> 
                         
                            <div className="mt-4 font-bold text-2xl bg-red-100 text-red-800 text-center px-2 py-1 rounded">MASTERKEY</div> */}
                            <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">MASTERKEY</div> 
                            {/* <div className="text-xs font-medium">Due in 15 days</div> */}
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
                        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop"
                        alt="Modern residential home"
                        className="size-full object-cover"
                        width={2070}
                        height={1380}
                    />
                </div>
            </div>
        </div>
    )
}
