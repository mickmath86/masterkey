import Image from 'next/image'

export function Trulia({ className }: { className?: string }) {
    return (
        <Image
            src="/logos/trulia-logo.jpeg"
            alt="Trulia"
            width={32}
            height={32}
            className={className}
        />
    )
}
