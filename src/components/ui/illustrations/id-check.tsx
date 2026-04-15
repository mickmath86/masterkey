import '@/styles/how-it-works-5.css'
import { cn } from '@/lib/utils'
import { ShieldCheck, Signature } from 'lucide-react'

export const IDCheckIllustration = ({ className }: { className?: string }) => {
    return (
        <div
            aria-hidden
            className={cn('before:bg-card before:ring-border relative mx-auto w-fit before:absolute before:inset-x-2 before:-bottom-2 before:top-2 before:rounded-xl before:shadow before:ring-1', className)}>
            <div className="border-border-illustration bg-illustration shadow-black/6.5 relative overflow-hidden rounded-xl border shadow-md">
                <div className="grid grid-cols-[1fr_auto] gap-6 p-3">
                    <div className="text-left text-sm">
                        <div className="text-foreground">123 Main Street, Thousand Oaks</div>
                        <div className="text-muted-foreground text-xs">Masterkey</div>
                    </div>
                    <div className="border p-2">
                        <Signature className="size-5" />
                    </div>
                </div>
                <div className="bg-linear-to-br border-foreground/5 flex items-center gap-1 border-t from-indigo-400 to-emerald-600 p-2 text-sm">
                    <ShieldCheck className="size-4 text-white drop-shadow-sm" />
                    <span className="text-white">Verified</span>
                </div>
            </div>
        </div>
    )
}

export default IDCheckIllustration