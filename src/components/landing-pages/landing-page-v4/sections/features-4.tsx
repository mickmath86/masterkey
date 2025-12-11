import { AdomIllustration } from "../components/adom-illustration"
import { VisualizationIllustration } from "../components/visualization-illustration"
import { Sparkles, Cpu, Lock, Zap } from 'lucide-react'

export function FeaturesSection4() {
    return (
        <section className="bg-background">
            <div className="bg-muted/50 py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="grid max-md:divide-y md:grid-cols-2 md:divide-x">
                        <div className="row-span-2 grid grid-rows-subgrid gap-8 pb-12 md:pr-12">
                            <div>
                                <h3 className="text-foreground text-xl font-semibold">Intuitive Invoice Creation</h3>
                                <p className="text-muted-foreground mt-4 text-lg">Create professional invoices instantly with our intuitive tools. Customize templates and automate billing to save time.</p>
                            </div>
                            <AdomIllustration />
                        </div>
                        <div className="row-span-2 grid grid-rows-subgrid gap-8 pb-12 max-md:pt-12 md:pl-12">
                            <div>
                                <h3 className="text-foreground text-xl font-semibold">Data Visualization</h3>
                                <p className="text-muted-foreground mt-4 text-lg">Transform complex data into intuitive visualizations. Our powerful tools help you uncover insights and communicate findings effectively.</p>
                            </div>
                            <VisualizationIllustration />
                        </div>
                    </div>
                    <div className="relative grid grid-cols-2 gap-x-3 gap-y-6 border-t pt-12 sm:gap-6 lg:grid-cols-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap className="text-foreground size-4" />
                                <h3 className="text-sm font-medium">Faaast</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Cpu className="text-foreground size-4" />
                                <h3 className="text-sm font-medium">Powerful</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Lock className="text-foreground size-4" />
                                <h3 className="text-sm font-medium">Security</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">An helping developers businesses innovate.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-foreground size-4" />

                                <h3 className="text-sm font-medium">AI Powered</h3>
                            </div>
                            <p className="text-muted-foreground text-sm">Helping developers businesses innovate.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}