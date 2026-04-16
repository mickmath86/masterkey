import Image from 'next/image'

export function Instagram({ className }: { className?: string }) {
    return (
        <Image
            src="/logos/instagram-logo.png"
            alt="Instagram"
            width={32}
            height={32}
            className={className}
        />
    )
}
