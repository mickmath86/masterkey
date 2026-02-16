'use client'
import { MasterKeyLogoInlineBlack } from '@/components/logo'

export default function Mailer() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Container for print preview */}
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Direct Mailer Campaign</h1>
                    <p className="mt-2 text-gray-600">9" x 5" Postcard Design (Landscape - 9:5 Aspect Ratio)</p>
                    <button 
                        onClick={() => window.print()} 
                        className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
                    >
                        Print Mailer
                    </button>
                </div>

                {/* Front Side */}
                <div className="mb-12">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Front Side</h2>
                    <div 
                        className="relative mx-auto overflow-hidden bg-white shadow-2xl"
                        style={{ aspectRatio: '9/5', maxWidth: '900px' }}
                    >
                        {/* Background gradient */}
                        <svg
                            viewBox="0 0 1024 1024"
                            aria-hidden="true"
                            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
                        >
                            <circle r={512} cx={512} cy={512} fill="url(#gradient-front)" fillOpacity="0.15" />
                            <defs>
                                <radialGradient id="gradient-front">
                                    <stop stopColor="#0ea5e9" />
                                    <stop offset={1} stopColor="#22c55e" />
                                </radialGradient>
                            </defs>
                        </svg>

                        {/* Content */}
                        <div className="relative flex h-full flex-row items-center gap-8 p-8">
                            {/* Left side - Logo and headline */}
                            <div className="flex-1">
                                <div className="mb-6">
                                    <MasterKeyLogoInlineBlack className="h-8 w-auto" />
                                </div>
                                <h1 className="text-balance font-bold text-3xl leading-tight text-gray-900">
                                    Get an Offer at Your{' '}
                                    <span className="relative text-sky-600">
                                        <svg
                                            aria-hidden
                                            className="pointer-events-none absolute inset-x-0 -bottom-2 w-full"
                                            viewBox="0 0 283 22"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1.24715 19.3744C72.4051 10.3594 228.122 -4.71194 281.724 7.12332"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                className="text-sky-300"
                                            />
                                        </svg>
                                        <span className="relative">Verified Value</span>
                                    </span>
                                    {' '}in 45 Days
                                </h1>
                                <p className="mt-4 text-lg font-medium text-gray-600">
                                    — or You Pay Us{' '}
                                    <span className="font-bold text-sky-600">Nothing</span>
                                </p>
                            </div>

                            {/* Right side - Benefits and CTA */}
                            <div className="flex-1">
                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <span className="mt-1 text-green-600">✓</span>
                                        <span>Professional third-party appraisal (we pay)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="mt-1 text-green-600">✓</span>
                                        <span>Data-driven pricing strategy</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="mt-1 text-green-600">✓</span>
                                        <span>Zero risk performance guarantee</span>
                                    </div>
                                </div>

                                <div className="mt-8 border-t border-gray-200 pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Call Now
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">805-262-9707</p>
                                        </div>
                                        <div className="rounded-full bg-sky-600 p-3">
                                            <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Back Side</h2>
                    <div 
                        className="relative mx-auto overflow-hidden bg-white shadow-2xl"
                        style={{ aspectRatio: '9/5', maxWidth: '900px' }}
                    >
                        {/* Background gradient */}
                        <svg
                            viewBox="0 0 1024 1024"
                            aria-hidden="true"
                            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
                        >
                            <circle r={512} cx={512} cy={512} fill="url(#gradient-back)" fillOpacity="0.1" />
                            <defs>
                                <radialGradient id="gradient-back">
                                    <stop stopColor="#0ea5e9" />
                                    <stop offset={1} stopColor="#22c55e" />
                                </radialGradient>
                            </defs>
                        </svg>

                        {/* Content */}
                        <div className="relative flex h-full flex-row gap-8 p-8">
                            {/* Left column - Header and first 3 steps */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    The Verified Value Guarantee
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                                    Most sellers are asked to trust opinions, not data. Our M.A.S.T.E.R.™ system removes uncertainty from day one with:
                                </p>

                                <div className="mt-6 space-y-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sky-600">M</span>
                                            <span className="text-sm font-semibold text-gray-900">Market Assessment</span>
                                        </div>
                                        <p className="ml-6 mt-1 text-xs text-gray-600">Smart, defensible listing price</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sky-600">A</span>
                                            <span className="text-sm font-semibold text-gray-900">Appraisal</span>
                                        </div>
                                        <p className="ml-6 mt-1 text-xs text-gray-600">Independent third-party valuation</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sky-600">S</span>
                                            <span className="text-sm font-semibold text-gray-900">Systems Review</span>
                                        </div>
                                        <p className="ml-6 mt-1 text-xs text-gray-600">Identify issues before buyers do</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right column - Last 3 steps and footer */}
                            <div className="flex-1">
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sky-600">T</span>
                                            <span className="text-sm font-semibold text-gray-900">True Price Approval</span>
                                        </div>
                                        <p className="ml-6 mt-1 text-xs text-gray-600">Your verified value guarantee</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sky-600">E</span>
                                            <span className="text-sm font-semibold text-gray-900">Enhanced Listing</span>
                                        </div>
                                        <p className="ml-6 mt-1 text-xs text-gray-600">Maximum impact from day one</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sky-600">R</span>
                                            <span className="text-sm font-semibold text-gray-900">Risk-Free Sale</span>
                                        </div>
                                        <p className="ml-6 mt-1 text-xs text-gray-600">Our commission is on the line</p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 border-t border-gray-200 pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <MasterKeyLogoInlineBlack className="h-6 w-auto" />
                                            <p className="mt-2 text-xs text-gray-500">
                                                Licensed Real Estate Broker
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-gray-900">Schedule Today</p>
                                            <p className="text-lg font-bold text-sky-600">805-262-9707</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .min-h-screen {
                        min-height: 0;
                    }
                    button {
                        display: none;
                    }
                    h1, h2, p {
                        page-break-inside: avoid;
                    }
                    .mb-12 {
                        page-break-after: always;
                    }
                }
            `}</style>
        </div>
    )
}