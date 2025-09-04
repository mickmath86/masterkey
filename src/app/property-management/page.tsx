import { ArrowPathIcon, ChevronRightIcon, CloudArrowUpIcon, Cog6ToothIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/20/solid'
import { Container } from "@/components/container"
import { Heading } from "@/components/text"
import { Lead } from "@/components/text"
import { FadeInStagger } from "@/components/animations"
import { Subheading } from "@/components/text"
  import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'
import { ArrowRight, Building, Users, Wrench, Star, ServerIcon } from "lucide-react"


const featredPosts = [
    {
        title: "Residential Management",
        link:"/residential-management", 
        slug: "residential-management",
        icon: Building,
        excerpt: "Full-service management for single-family homes, condos, and small multi-family properties with dedicated tenant support."
    },
    {
        title: "Commercial Management",
        link:"/commercial-management", 
        slug: "commercial-management",
        icon: Users,
        excerpt: "Professional management services for office buildings, retail spaces, and commercial properties with comprehensive lease administration."
    },
    {
        title: "Maintenance & Repairs",
        link:"/maintenance-services", 
        slug: "maintenance-repairs",
        icon: Wrench,
        excerpt: "24/7 maintenance coordination with vetted contractors, emergency response, and preventive maintenance programs."
    },
]

const Hero = () => {
    return (
        <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
             <Navbar3/> 
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="aspect-1108/632 w-277 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=green&shade=600"
            className="h-11 dark:hidden"
          />
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=green&shade=500"
            className="h-11 not-dark:hidden"
          />
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm/6 font-semibold text-green-600 ring-1 ring-green-600/20 ring-inset dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/25">
                Professional Management
              </span>
              <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600 dark:text-gray-300">
                <span>Trusted by property owners nationwide</span>
                <ChevronRightIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
            Professional property management services
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
            Maximize your investment returns with our comprehensive property management services. From tenant screening to maintenance coordination, we handle every aspect of your property so you can focus on growing your portfolio.
          </p>
          {/* Google Reviews Section */}
          <div className="mt-8 flex items-center gap-x-4">
            <div className="flex items-center gap-x-2">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Google</span>
            </div>
            <div className="flex items-center gap-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">4.9 out of 5</span>
          </div>
          
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 dark:bg-green-500 dark:hover:bg-green-400 dark:focus-visible:outline-green-500"
            >
           Get Management Quote
            </a>
            <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
              View Services <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              alt="Modern apartment building with professional landscaping"
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=2432&h=1442&fit=crop&crop=center"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 dark:hidden"
            />
            <img
              alt="Luxury residential complex at evening with warm lighting"
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=2432&h=1442&fit=crop&crop=center"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 not-dark:hidden"
            />
          </div>
        </div>
      </div>
    </div>
    )
}


function ThreeCard() {


  return (
    <Container>
          <Subheading className="mt-16">Expert Brokerage Services</Subheading>
          <Heading as="h1" className="mt-2">
            Buy and Sell with Confidence
          </Heading>
          <Lead className="mt-6 max-w-3xl">
          Whether you're buying your first home or selling your current property, <span className=" text-green-500">MasterKey</span> provides expert guidance and cutting-edge technology to ensure a smooth, successful transaction at the best possible price.
          </Lead>
        <div className="mt-16  pb-14">
        <div>
            <h2 className="text-2xl font-medium tracking-tight">Services</h2>
            <FadeInStagger className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {featredPosts.map((post) => (
                <a
                key={post.slug}
                href={post.link}
                className="relative flex flex-col h-full rounded-sm bg-white p-8 shadow-md ring-1 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-black/5 ring-black/5"
                >
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <post.icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="text-base/7 font-medium">
                    {post.title}
                    </div>
                    <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                    {post.excerpt}
                    </div>
                    <div className="flex items-center gap-1 text-green-500 mt-4">
                        Get Started 
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                </a>
            ))}
            
        </FadeInStagger>
        </div>
        </div>
    </Container>
  )
}

// Testimonial
function Testimonial() {
  return (
    <section className="isolate overflow-hidden bg-white px-6 lg:px-8 dark:bg-gray-900">
      <div className="relative mx-auto max-w-2xl py-24 sm:py-32 lg:max-w-4xl">
        <div className="absolute top-0 left-1/2 -z-10 h-200 w-360 -translate-x-1/2 bg-[radial-gradient(50%_100%_at_top,var(--color-green-100),white)] opacity-20 lg:left-36 dark:bg-[radial-gradient(45rem_50rem_at_top,var(--color-green-500),transparent)] dark:opacity-10" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-12 w-[150vw] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-green-600/10 ring-green-50 sm:mr-20 md:mr-0 lg:right-full lg:-mr-36 lg:origin-center dark:bg-gray-900 dark:shadow-2xl dark:shadow-green-500/5 dark:ring-white/10" />
        <figure className="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:gap-x-10">
          <div className="relative col-span-2 lg:col-start-1 lg:row-start-2">
            <svg
              fill="none"
              viewBox="0 0 162 128"
              aria-hidden="true"
              className="absolute -top-12 left-0 -z-10 h-32 stroke-gray-900/10 dark:stroke-white/20"
            >
              <path
                d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
              />
              <use x={86} href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" />
            </svg>
            <blockquote className="text-xl/8 font-semibold text-gray-900 sm:text-2xl/9 dark:text-white">
              <p>
                MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!
              </p>
            </blockquote>
          </div>
          <div className="col-end-1 w-16 lg:row-span-4 lg:w-72">
            <img
              alt="Luxury modern home exterior with professional landscaping"
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=2102&h=1402&fit=crop&crop=center"
              className="rounded-xl bg-green-50 lg:rounded-3xl dark:bg-green-900/20"
            />
          </div>
          <figcaption className="text-base lg:col-start-1 lg:row-start-3">
            <div className="font-semibold text-gray-900 dark:text-white">Todd Shillington</div>
            <div className="mt-1 text-gray-500 dark:text-gray-400">Past Client</div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

// Bento
function Bento() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base/7 font-semibold text-green-600 dark:text-green-400">Comprehensive Services</h2>
        <p className="mt-2 max-w-lg text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl dark:text-white">
          Everything you need for property management
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-t-4xl lg:rounded-tl-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-performance.png"
                className="h-80 object-cover object-left dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-performance.png"
                className="h-80 object-cover object-left not-dark:hidden"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-green-600 dark:text-green-400">Tenant Screening</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                  Quality tenant placement
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                  Comprehensive background checks, credit verification, and employment validation to ensure reliable tenants for your property.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl lg:rounded-tl-4xl dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg bg-white lg:rounded-tr-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-releases.png"
                className="h-80 object-cover object-left lg:object-right dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-releases.png"
                className="h-80 object-cover object-left not-dark:hidden lg:object-right"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-green-600 dark:text-green-400">Rent Collection</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">Automated payments</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                  Streamlined rent collection with online payment portals, automated reminders, and late fee management for consistent cash flow.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-tr-4xl dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-white lg:rounded-bl-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-speed.png"
                className="h-80 object-cover object-left dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-speed.png"
                className="h-80 object-cover object-left not-dark:hidden"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-green-600 dark:text-green-400">Maintenance</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                  24/7 response team
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                  Emergency repairs and preventive maintenance with vetted contractors to protect your investment.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-bl-4xl dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-white dark:bg-gray-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-integrations.png"
                className="h-80 object-cover dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-integrations.png"
                className="h-80 object-cover not-dark:hidden"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-green-600 dark:text-green-400">Financial Reports</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                  Detailed analytics
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                  Monthly financial statements, expense tracking, and performance metrics to maximize your ROI.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15" />
          </div>
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-br-4xl dark:bg-gray-800" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-network.png"
                className="h-80 object-cover dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-network.png"
                className="h-80 object-cover not-dark:hidden"
              />
              <div className="p-10 pt-4">
                <h3 className="text-sm/4 font-semibold text-green-600 dark:text-green-400">Legal Support</h3>
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">
                  Compliance & evictions
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
                  Legal compliance assistance, lease enforcement, and eviction proceedings when necessary.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-br-4xl dark:outline-white/15" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Services List
const features = [
  {
    name: 'Market Analysis',
    description: 'Comprehensive market research and comparable sales analysis to price your property competitively.',
    icon: CloudArrowUpIcon,
    href: '#',
  },
  {
    name: 'Secure Transactions',
    description: 'Protected escrow services and secure document handling throughout the entire buying or selling process.',
    icon: LockClosedIcon,
    href: '#',
  },
  {
    name: 'Fast Processing',
    description: 'Streamlined workflows and digital tools to accelerate your property transactions.',
    icon: ArrowPathIcon,
    href: '#',
  },
  {
    name: 'Verified Listings',
    description: 'All properties are thoroughly vetted and verified for accuracy and legitimacy.',
    icon: FingerPrintIcon,
    href: '#',
  },
  {
    name: 'Smart Matching',
    description: 'AI-powered algorithms match buyers with properties that meet their specific criteria and budget.',
    icon: Cog6ToothIcon,
    href: '#',
  },
  {
    name: 'Complete Support',
    description: 'Full-service support from initial consultation through closing and beyond.',
    icon: ServerIcon,
    href: '#',
  },
]

function ServicesList() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-green-600 dark:text-green-400">Complete Brokerage Services</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance dark:text-white">
            Everything you need to succeed
          </p>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
            From initial property search to final closing, our comprehensive brokerage services provide expert guidance and cutting-edge technology to ensure your real estate success.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white">
                  <feature.icon aria-hidden="true" className="size-5 flex-none text-green-600 dark:text-green-400" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
              
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}


export default function PropertyManagement() {
  return (
    <>
   
    <Hero/>
    <ThreeCard/>        
    <Testimonial/>
    <Bento/>
    <ServicesList/>
    <Footer/>       
    </>
  )
}


