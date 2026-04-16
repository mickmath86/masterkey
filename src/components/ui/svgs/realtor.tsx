import Image from 'next/image'

export function Realtor({ className }: { className?: string }) {
    return (
        <Image
            src="/logos/realtor-logo.png"
            alt="Realtor"
            width={32}
            height={32}
            className={className}
        />
    )
}
