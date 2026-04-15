import { Button } from '@/components/ui/button'
import { Signature } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ActionnableIllustration = ({ className }: { className?: string }) => {
    return (
        <div
            aria-hidden
            className={cn('before:bg-card before:ring-border-illustration relative mx-auto my-6 w-fit before:absolute before:inset-x-2 before:-bottom-2 before:top-2 before:rounded-2xl before:opacity-75 before:shadow before:ring-1', className)}>
            <div className="bg-illustration inset-ring-1 inset-ring-background ring-border-illustration shadow-black/6.5 relative flex gap-3 overflow-hidden rounded-2xl p-4 pr-8 shadow-md ring-1 backdrop-blur">
                <div className="mask-r-from-25% absolute inset-1 w-1/2 rounded-l-xl border border-emerald-400 opacity-10 [background-image:linear-gradient(-45deg,var(--color-emerald-500)_25%,transparent_25%,transparent_50%,var(--color-emerald-500)_50%,var(--color-emerald-500)_75%,transparent_75%,transparent)] [background-size:5px_5px]" />

                <div className="bg-illustration border-foreground/10 relative flex size-8 shrink-0 rounded-full border">
                    <Signature className="m-auto size-4 text-emerald-600" />
                </div>

                <div className="relative text-left">
                    <div className="mb-3 text-sm">
                        <div className="text-foreground font-medium">Signature Approved!</div>
                        <div className="text-muted-foreground line-clamp-1 text-xs">Generate reports and insights</div>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7"
                        asChild>
                        <div>View Report</div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ActionnableIllustration