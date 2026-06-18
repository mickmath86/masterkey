import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Market Update — Mathias Real Estate Group',
  description: 'Monthly real estate market report by city.',
}

export default function MarketUpdatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Instrument Serif for display headings */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }

        /* Olive scale */
        :root {
          --olive-50:  #f8f8f4;
          --olive-100: #f0f0e8;
          --olive-200: #dcdcd0;
          --olive-300: #c0c0aa;
          --olive-400: #9ea08a;
          --olive-500: #7e8068;
          --olive-600: #636554;
          --olive-700: #4e5042;
          --olive-800: #3b3d31;
          --olive-900: #272820;
          --olive-950: #181910;
          /* Mist */
          --mist-100: #f5f5f0;
          --mist-950: #16160f;
        }

        .bg-mist-100   { background-color: var(--mist-100); }
        .bg-mist-950   { background-color: var(--mist-950); }
        .bg-olive-50   { background-color: var(--olive-50); }
        .bg-olive-100  { background-color: var(--olive-100); }
        .bg-olive-900  { background-color: var(--olive-900); }
        .bg-olive-950  { background-color: var(--olive-950); }
        .bg-olive-950\\/5  { background-color: color-mix(in srgb, var(--olive-950) 5%, transparent); }
        .bg-olive-950\\/8  { background-color: color-mix(in srgb, var(--olive-950) 8%, transparent); }
        .bg-olive-950\\/10 { background-color: color-mix(in srgb, var(--olive-950) 10%, transparent); }
        .bg-olive-950\\/15 { background-color: color-mix(in srgb, var(--olive-950) 15%, transparent); }
        .bg-olive-950\\/20 { background-color: color-mix(in srgb, var(--olive-950) 20%, transparent); }

        .text-olive-400 { color: var(--olive-400); }
        .text-olive-500 { color: var(--olive-500); }
        .text-olive-600 { color: var(--olive-600); }
        .text-olive-700 { color: var(--olive-700); }
        .text-olive-800 { color: var(--olive-800); }
        .text-olive-900 { color: var(--olive-900); }
        .text-olive-950 { color: var(--olive-950); }

        .border-olive-100  { border-color: var(--olive-100); }
        .border-olive-200  { border-color: var(--olive-200); }
        .border-olive-950\\/10 { border-color: color-mix(in srgb, var(--olive-950) 10%, transparent); }
        .border-olive-950\\/20 { border-color: color-mix(in srgb, var(--olive-950) 20%, transparent); }
        .border-olive-950\\/25 { border-color: color-mix(in srgb, var(--olive-950) 25%, transparent); }

        .ring-olive-950\\/20 { --tw-ring-color: color-mix(in srgb, var(--olive-950) 20%, transparent); }

        /* Wallpaper green — Kickbord default */
        .bg-wallpaper-green {
          background: linear-gradient(135deg, #9ca88f 0%, #596352 100%);
        }
        .bg-wallpaper-green-dark {
          background: linear-gradient(135deg, #333a2b 0%, #26361b 100%);
        }
      `}</style>
      {children}
    </>
  )
}
