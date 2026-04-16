
import { LogoIcon, MasterkeyWhiteMark } from '@/components/logo'
import { cn } from '@/lib/utils'

import { InfiniteSlider } from '@/components/ui/infinite-slider'


import { OpenAI } from '@/components/ui/svgs/open-ai'

import { Zillow } from '@/components/ui/svgs/zillow'
import { Instagram } from '@/components/ui/svgs/instagram'
import { Realtor } from '@/components/ui/svgs/realtor'
import { Redfin } from '@/components/ui/svgs/redfin'
import { Trulia } from '@/components/ui/svgs/trulia'
import { Facebook } from '@/components/ui/svgs/facebook'
import { TikTok } from '@/components/ui/svgs/tiktok'

export default function IntegrationsSection() {
    return (
     
            <div className="perspective-dramatic relative group w-full mx-auto">
                <div className="rotate-x-6 hover:rotate-x-0 mask-radial-from-70% mask-radial-[50%_90%] group relative mx-auto max-w-2xl scale-y-90 items-center justify-between space-y-6 from-transparent pb-1 transition-transform duration-1000 hover:scale-y-100">
                    <div className="mask-radial-to-55% absolute inset-0 bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] opacity-25 [background-size:16px_16px]" />
                    <div>
                        <InfiniteSlider
                            gap={56}
                            speed={20}
                            speedOnHover={10}>
                            <IntegrationCard>
                                <Zillow />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Instagram />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Realtor />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Redfin />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Trulia />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Facebook />
                            </IntegrationCard>
                            <IntegrationCard>
                                <TikTok />
                            </IntegrationCard>
                            <IntegrationCard>
                                <OpenAI />
                            </IntegrationCard>
                        </InfiniteSlider>
                    </div>

                    <div>
                        <InfiniteSlider
                            gap={56}
                            speed={20}
                            speedOnHover={10}
                            reverse>
                            <IntegrationCard>
                                <Zillow />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Instagram />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Realtor />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Redfin />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Trulia />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Facebook />
                            </IntegrationCard>
                            <IntegrationCard>
                                <TikTok />
                            </IntegrationCard>
                            <IntegrationCard>
                                <OpenAI />
                            </IntegrationCard>
                        </InfiniteSlider>
                    </div>
                    <div>
                        <InfiniteSlider
                            gap={56}
                            speed={15}
                            speedOnHover={10}>
                            <IntegrationCard>
                                <Zillow />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Instagram />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Realtor />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Redfin />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Trulia />
                            </IntegrationCard>
                            <IntegrationCard>
                                <Facebook />
                            </IntegrationCard>
                            <IntegrationCard>
                                <TikTok />
                            </IntegrationCard>
                            <IntegrationCard>
                                <OpenAI />
                            </IntegrationCard>
                        </InfiniteSlider>
                    </div>
                    <div className="absolute inset-0 m-auto flex size-fit -translate-y-3.5 justify-center gap-2">
                        <IntegrationCard
                            className="relative size-24 rounded-2xl border border-white/20 bg-zinc-700/50 shadow-xl shadow-black/20 ring-1 ring-black/50 backdrop-blur-lg"
                            isCenter={true}>
                            <MasterkeyWhiteMark className="h-64 w-64" /> 
                        </IntegrationCard>
                    </div>
                </div>
              
            </div>
       
    )
}

const IntegrationCard = ({ children, className, isCenter = false }: { children: React.ReactNode; className?: string; position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom'; isCenter?: boolean }) => {
    return (
        <div
            aria-hidden
            className={cn('bg-card relative z-20 flex size-20 rounded-xl border', className)}>
            <div className={cn('m-auto size-fit *:size-8', isCenter && '*:size-8')}>{children}</div>
        </div>
    )
}