import '@/styles/how-it-works-5.css'
import { Button } from '@/components/ui/button'
import { DocumentIllustration } from "@/components/ui/illustrations/document-illustration"
import { CurrencyIllustration } from "@/components/ui/illustrations/currency-illustration"
import { ArrowBigDown } from 'lucide-react'
import Link from 'next/link'
import DocumentCsvIllustration from "@/components/ui/illustrations/document-csv"
import ActionnableIllustration from './ui/illustrations/actionnable'
import IDCheckIllustration from './ui/illustrations/id-check'
import { InvoiceIllustration } from './illustrations/invoice-illustration'
import { BankStatsIllustration } from './illustrations/bank-stats'

export default function HowItWorksSection() {
    return (
        <section className="overflow-hidden">
            <div className="bg-background m-4 rounded-[2rem] py-24">
                <div className="relative mx-auto w-full max-w-5xl px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-primary">Our Process</span>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold">Simple Three-Step Workflow</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">Experience our streamlined approach to data analysis that empowers your team to make informed decisions quickly and efficiently.</p>
                    </div>

                    <div className="md:max-w-1/3 mx-auto my-8 grid gap-12 *:py-6">
                        <div className="relative">
                            <div className="text-center">
                                <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">1</span>
                                <div className="mx-auto my-8 w-fit">
                                    <CurrencyIllustration />
                                </div>
                                <h3 className="text-foreground mb-3 text-lg font-medium">Home and Market Assessment</h3>
                                <p className="text-muted-foreground text-balance">Easily import data from multiple sources and formats with our intuitive integration tools.</p>
                            </div>
                            <ArrowBigDown className="fill-illustration stroke-illustration absolute inset-x-0 bottom-0 mx-auto translate-y-[150%] drop-shadow" />
                        </div>
                        <div className="relative">
                            <div className="text-center">
                                <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">2</span>
                                <div className="mx-auto my-8 w-fit">
                                    <InvoiceIllustration />
                                </div>
                                <h3 className="text-foreground mb-3 text-lg font-medium">Established Verified Value</h3>
                                <p className="text-muted-foreground text-balance">Our AI-powered system processes complex datasets to identify patterns and insights instantly.</p>
                            </div>
                            <ArrowBigDown className="fill-illustration stroke-illustration absolute inset-x-0 bottom-0 mx-auto translate-y-[150%] drop-shadow" />
                        </div>
                        <div className="space-y-6">
                            <div className="text-center">
                                <span className="bg-foreground/5 text-foreground mx-auto flex size-6 items-center justify-center rounded-full border text-sm font-medium">3</span>
                                <div className="mx-auto my-8 flex w-fit gap-2">
                                   <BankStatsIllustration />
                                </div>
                                <h3 className="text-foreground mb-3 text-lg font-medium">Enhanced Listing</h3>
                                <p className="text-muted-foreground text-balance">Transform insights into beautiful visualizations and shareable reports to drive decisions.</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="mx-auto flex w-fit">
                        <Link href="/sign-up">Get Started</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}