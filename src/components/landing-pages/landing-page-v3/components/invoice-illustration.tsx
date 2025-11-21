import { cn } from '@/lib/utils'
import { LogoIcon } from '@/components/logo'
import { TrendingUp, TrendingDown, Clock, Home } from 'lucide-react'


export const InvoiceIllustration = ({ className }: { className?: string }) => {
    return (
        
            <div
                aria-hidden
                className="relative">
                <div className={cn('mask-b-from-65% group relative -mx-4 px-4 pt-6', className)}>
                    <div className="bg-illustration ring-border-illustration relative z-10 overflow-hidden rounded-2xl p-8 text-sm shadow-xl shadow-black/10 ring-1">
               <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1152&q=80" alt="Illustration" width={400} height={300} className="w-full h-auto rounded-xl" />
                    <div className="mb-6 flex items-start justify-between">
                        
                        <div className="space-y-0.5">
                            {/* <LogoIcon /> */}
                             
                            <div className="mt-4 font-mono text-xs text-muted-foreground">Sellers Market</div>
                            <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold text-green-600">Optimal Timing Detected</div>
                            <div className="text-xs font-medium text-gray-600">95% Confidence Score</div>
                        </div>
                        {/* <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div> */}
                    </div>

                    <div className="space-y-3 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Avg Days on Market
                            </span>
                            <div className="bg-border h-1 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full w-1/4 rounded-full"></div>
                            </div>
                            <span className="font-mono text-xs font-semibold">18 days</span>
                        </div>

                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                            <span className="text-muted-foreground text-xs font-medium flex items-center gap-1">
                                <Home className="w-3 h-3" />
                                Absorption Rate
                            </span>
                            <div className="bg-border h-1 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full w-3/4 rounded-full"></div>
                            </div>
                            <span className="font-mono text-xs font-semibold">73%</span>
                        </div>

                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                            <span className="text-muted-foreground text-xs font-medium">Price Trend</span>
                            <div className="bg-border h-1 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full w-5/6 rounded-full"></div>
                            </div>
                            <span className="font-mono text-xs font-semibold text-sky-600">+8.2%</span>
                        </div>

                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                            <span className="text-muted-foreground text-xs font-medium">Inventory Level</span>
                            <div className="bg-border h-1 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full w-1/3 rounded-full"></div>
                            </div>
                            <span className="font-mono text-xs font-semibold">2.1 months</span>
                        </div>

                        {/* <div className="pt-2 border-t border-gray-200">
                            <div className="text-xs text-gray-600">
                                <span className="font-medium">Market Confidence:</span> High seller's market
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}