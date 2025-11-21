import { ImageIllustration } from "./image-illustration"

export function SecondaryHero4() {
    return (
        <section>
            <div className="py-24 md:pt-32 lg:pt-44">
                <div className="mx-auto mb-12 max-w-5xl px-6">
                    <ImageIllustration />
                    <div className="relative mt-6 grid items-end gap-6 md:-mt-12 md:grid-cols-2">
                        <h1 className="text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl">Building the roots for your Startup growth</h1>
                        <p className="text-muted-foreground text-balance text-lg">Your team’s toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best web experiences with Vercel.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}