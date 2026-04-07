export default function CTA3() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
            Ready to Sell With Confidence?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-600">
            Get a professional appraisal, data-driven pricing strategy, and our performance guarantee — all backed by 
            our commitment to deliver results or waive our commission.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="tel:805-262-9707"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Call Now
            </a>
            <a href="#" className="text-sm/6 font-semibold text-gray-900 hover:text-gray-600">
             Schedule an Appointment <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
      >
        <circle r={512} cx={512} cy={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#0ea5e9" />
            <stop offset={1} stopColor="#22c55e" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
