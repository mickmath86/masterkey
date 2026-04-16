import Image from 'next/image'

export function Redfin({ className }: { className?: string }) {
    return (
        <Image
            src="/logos/redfin-logo.png"
            alt="Redfin"
            width={32}
            height={32}
            className={className}
        />
    )
}
