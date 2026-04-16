import Image from 'next/image'

export function Facebook({ className }: { className?: string }) {
    return (
        <Image
            src="/logos/facebook-logo.png"
            alt="Facebook"
            width={32}
            height={32}
            className={className}
        />
    )
}
