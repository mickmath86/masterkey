import Image from 'next/image'

export function Zillow({ className }: { className?: string }) {
    return (
        <Image
            src="/logos/zillow-logo.png"
            alt="Zillow"
            width={32}
            height={32}
            className={className}
        />
    )
}
