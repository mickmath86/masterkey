export function StatsSection() {
    return (
        <section
            data-theme="dark"
            className="bg-background py-12 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-12 sm:grid-cols-2">
                    <div className="space-y-6">
                        <h2 className="text-muted-foreground text-balance text-4xl font-semibold md:w-2/3">
                            Building the next generation of <strong className="text-foreground font-semibold">AI-powered Marketing Tools</strong>
                        </h2>

                        <p className="text-muted-foreground">
                            Our advanced visual processing system can <strong className="text-foreground font-semibold">analyze and interpret complex images</strong>, enabling applications.
                        </p>
                    </div>
                    <div className="space-y-6 border-l sm:mx-auto sm:max-w-xs">
                        <div className="space-y-4 *:block">
                            <span className="border-primary -ml-px border-l pl-6 text-3xl font-semibold lg:pl-8">99.9%</span>
                            <p className="text-muted-foreground text-balance pl-6 text-sm lg:pl-8">
                                <strong className="text-foreground font-medium">Uptime guarantee</strong> for all our services. Experience reliability with minimal interruptions.
                            </p>
                        </div>
                        <div className="space-y-4 *:block">
                            <span className="border-primary -ml-px border-l pl-6 text-3xl font-semibold lg:pl-8">24/7</span>
                            <p className="text-muted-foreground text-balance pl-6 text-sm lg:pl-8">
                                <strong className="text-foreground font-medium">24/7 support</strong> available around the clock. Get help whenever you need it, wherever you are.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}