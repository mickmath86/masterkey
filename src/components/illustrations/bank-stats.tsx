import '@/styles/how-it-works-5.css'
import Image from 'next/image'
import { TrendingUp, SignalHigh, WifiHigh } from 'lucide-react'

export const BankStatsIllustration = () => (
    <div
        aria-hidden
        className="mask-b-from-75% min-w-92 relative px-4 pt-2">
        <div className="bg-background/75 ring-border-illustration shadow-black/6.5 mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1">
            <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pb-16 pt-2 shadow ring-1">
                <StatusBar />
                <div className="mb-8 mt-6 text-sm font-medium">123 Main Street Thousand Oaks</div>
                <Image src="/images/ventura.png" alt="Property" width={500} height={500} className="mx-auto rounded-sm w-full"   />
                

                <div className="mt-0.5 flex flex-col justify-between">
                    <div>
                        <span className="pt-2 text-foreground align-baseline text-3xl font-bold">$950,000.00</span>
                    </div>

                    <div className="mt-6 grid grid-cols-4 gap-1">
                        <div className="bg-foreground/5 rounded-2xl px-3 py-3">
                            <span className="text-foreground/50 text-xs">Bed</span>
                            <div className="text-foreground mt-0.5 text-lg font-semibold">4</div>
                        </div>
                        <div className="bg-foreground/5 rounded-2xl px-3 py-3">
                            <span className="text-foreground/50 text-xs">Bath</span>
                            <div className="text-foreground mt-0.5 text-lg font-semibold">3</div>
                        </div>
                        <div className="bg-foreground/5 rounded-2xl px-3 py-3">
                            <span className="text-foreground/50 text-xs">SF</span>
                            <div className="text-foreground mt-0.5 text-lg font-semibold">2.4k</div>
                        </div>
                        <div className="bg-foreground/5 rounded-2xl px-3 py-3">
                            <span className="text-foreground/50 text-xs">Lot</span>
                            <div className="text-foreground mt-0.5 text-lg font-semibold">8k</div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="text-foreground text-sm font-semibold">Spending Categories</div>
                        <div className="mt-2 flex h-4 gap-0.5 overflow-hidden rounded-lg *:rounded-sm">
                            <div className="w-3/6 bg-blue-500"></div>
                            <div className="w-2/6 bg-indigo-500"></div>
                            <div className="w-1/6 bg-purple-500"></div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="size-2 rounded-full bg-blue-500"></div>
                                <span className="text-foreground">Food & Dining</span>
                                <span className="text-foreground/50">$840</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="size-2 rounded-full bg-indigo-500"></div>
                                <span className="text-foreground">Shopping</span>
                                <span className="text-foreground/50">$520</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="size-2 rounded-full bg-purple-500"></div>
                                <span className="text-foreground">Entertainment</span>
                                <span className="text-foreground/50">$300</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const StatusBar = () => (
    <div className="flex items-center justify-between py-2 pl-4 text-xs">
        <span className="font-semibold">9:41</span>
        <div className="flex items-end gap-1">
            <SignalHigh className="size-4" />
            <WifiHigh className="size-4.5" />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mb-px size-4">
                <path
                    fillRule="evenodd"
                    d="M3.75 6.75a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 0 0-3-3h-15Zm15 1.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h15ZM4.5 9.75a.75.75 0 0 0-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75H4.5Z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    </div>
)

export default BankStatsIllustration