import { Map } from "@/components/map"

export default function StatsSection() {
    return (
        <section className="bg-muted @container">
            <div className="relative py-12 md:py-20">
                <div className="mask-radial-to-75% absolute inset-0 max-md:hidden">
                    <Map />
                </div>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="md:max-w-3/5 lg:max-w-1/2 bg-card ring-border-illustration relative rounded-xl p-6 shadow-xl shadow-black/10 ring-1 sm:p-10">
                        <div className="mb-8 space-y-4">
                            <h2 className="text-muted-foreground text-balance text-3xl font-semibold">
                                Building the next generation of <strong className="text-foreground font-semibold">AI-powered Marketing Tools</strong>
                            </h2>

                            <p className="text-muted-foreground">
                                Our advanced visual processing system can <strong className="text-foreground font-semibold">analyze and interpret complex images</strong>, enabling applications.
                            </p>
                        </div>
                        <div className="**:text-center *:bg-muted/50 grid grid-cols-2 gap-1 *:rounded-md *:p-4">
                            <div className="space-y-3 *:block">
                                <span className="text-3xl font-semibold">
                                    99.9 <span className="text-muted-foreground text-lg">%</span>
                                </span>
                                <p className="text-muted-foreground text-balance text-sm">
                                    <strong className="text-foreground font-medium">Uptime guarantee</strong> for all our services.
                                </p>
                            </div>
                            <div className="space-y-3 *:block">
                                <span className="text-3xl font-semibold">24/7</span>
                                <p className="text-muted-foreground text-balance text-sm">
                                    <strong className="text-foreground font-medium">24/7 support</strong> available around the clock.
                                </p>
                            </div>
                            <div className="space-y-3 *:block">
                                <span className="text-3xl font-semibold">
                                    12 <span className="text-muted-foreground text-lg">X</span>
                                </span>
                                <p className="text-muted-foreground text-balance text-sm">
                                    <strong className="text-foreground font-medium">12X</strong> faster processing than previous generation.
                                </p>
                            </div>
                            <div className="space-y-3 *:block">
                                <span className="text-3xl font-semibold">
                                    12 <span className="text-muted-foreground text-lg">X</span>
                                </span>
                                <p className="text-muted-foreground text-balance text-sm">
                                    <strong className="text-foreground font-medium">12X</strong> faster processing than previous generation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}