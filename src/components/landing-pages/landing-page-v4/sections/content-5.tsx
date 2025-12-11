import Image from 'next/image'

export function ContentSection() {
    return (
        <section className="bg-background">
            <div className="bg-muted/25 py-16 md:py-24">
                <div className="mx-auto max-w-4xl space-y-12 px-6">
                    <h2 className="text-muted-foreground text-balance text-4xl font-semibold md:w-2/3">
                        Building the next generation of <strong className="text-foreground font-semibold">AI-powered Marketing Tools</strong>
                    </h2>
                    <div className="bg-background ring-foreground/5 aspect-video rounded-xl border border-transparent  shadow ring-1">
                        <Image
                            src="/images/mk-ventura-cover.jpg"
                            alt="Visual intelligence representation"
                            width={6394}
                            height={4500}
                            className="h-full w-full object-cover rounded-xl"
                        />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                        <p className="text-muted-foreground">
                            Our advanced visual processing system can <strong className="text-foreground font-semibold">analyze and interpret complex images</strong>, enabling applications from medical diagnostics to autonomous navigation and content moderation.
                        </p>

                        <p className="text-muted-foreground">
                            Our platform <strong className="text-foreground font-semibold">integrates text, image, and audio processing</strong> into a unified framework, creating more intuitive and powerful AI systems that understand the world more like humans do.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}