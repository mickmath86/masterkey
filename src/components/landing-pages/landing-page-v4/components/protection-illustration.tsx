import { Shield } from 'lucide-react'
import { MasterKeyMark } from '@/components/logo'

export const ProtectionIllustration = () => {
    return (
        <div
            aria-hidden
            className="flex items-center justify-center relative">
            <div className="bg-linear-to-b b-green-500 to-background flex flex-col items-center justify-center h-40 relative w-64 space-y-3 rounded-md from-emerald-200 from-25% to-75% p-4 shadow-md [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]">
                {/* Shield Icon */}
                <div className="flex items-center justify-center">
                    <Shield className="size-12 text-emerald-700 stroke-[1.5]" />
                </div>
                
                {/* Protection Label */}
                <div className="flex flex-col space-y-2 items-center justify-center">
                    <span className="text-xs font-semibold text-emerald-900 text-center">
                        Protected
                    </span>
                     <MasterKeyMark className=" bottom-2  size-10" />
                </div>

                {/* MasterKey Mark */}
               
            </div>
        </div>
    )
}
