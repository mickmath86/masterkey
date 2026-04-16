import Image from 'next/image'

export function TikTok({ className }: { className?: string }) {
    return (
        <Image
            src="/logos/tik-tok-logo.png"
            alt="TikTok"
            width={32}
            height={32}
            className={className}
        />
    )
}
