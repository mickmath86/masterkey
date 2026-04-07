import React from 'react'
import { ImageIllustration } from "../components/image-illustration"

export function HeroSection() {
    return (
        <section>
            <div className="pb-56 pt-56 lg:pt-96">
                <div className="mx-auto mb-8 max-w-6xl px-6 lg:mb-12 lg:px-12">
                    <h1 className="text-balance text-4xl font-semibold md:text-5xl">Building the next generation of AI-powered Marketing Tools</h1>
                </div>
                <ImageIllustration />
                <div className="mx-auto mt-8 max-w-6xl px-6 lg:mt-12 lg:px-12">
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