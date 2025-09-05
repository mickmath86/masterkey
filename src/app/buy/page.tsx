import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Container } from "@/components/container"
import { Heading } from "@/components/text"
import { Lead } from "@/components/text"
import { FadeInStagger } from "@/components/animations"
import { Subheading } from "@/components/text"
import { ChartRadialStacked } from '@/components/ui/chart-radial-stacked'
import {
    ArrowPathIcon,
    CloudArrowUpIcon,
    Cog6ToothIcon,
    FingerPrintIcon,
    LockClosedIcon,
    ServerIcon,
  } from '@heroicons/react/20/solid'

import { Footer } from '@/components/footer'
import { ArrowRight, Home, Key, DollarSign, Star } from "lucide-react"
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'



const buyerServices = [
    {
        title: "Find Your Dream Home",
        link:"/questionnaire/sell", 
        slug: "property-search",
        icon: Home,
        excerpt: "Search thousands of listings with our advanced filters and AI-powered matching. Get detailed insights on every property that interests you."
    },
    {
        title: "Buyer Consultation",
        link:"/questionnaire/sell", 
        slug: "buyer-consultation",
        icon: Key,
        excerpt: "Start your home buying journey with a personalized consultation. We'll understand your needs, budget, and timeline to find the perfect match."
    },
    {
        title: "Market Analysis & Insights",
        link:"/questionnaire/sell", 
        slug: "market-insights",
        icon: DollarSign,
        excerpt: "Get comprehensive market data, neighborhood trends, and pricing insights to make informed decisions on your home purchase."
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
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=600"
            className="h-11 dark:hidden"
          />
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=500"
            className="h-11 not-dark:hidden"
          />
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-sm/6 font-semibold text-sky-600 ring-1 ring-sky-600/20 ring-inset dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/25">
                Buyer Specialists
              </span>
              <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600 dark:text-gray-300">
                <span>Dedicated agents focused on your home search</span>
                <ChevronRightIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
            Find your dream home with confidence
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
            Our buyer specialists combine deep market knowledge with advanced search technology to help you find and secure the perfect home. From first-time buyers to move-up purchasers, we make homeownership achievable.
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
              href="/questionnaire/real-estate-buy"
              className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500"
            >
           Start Your Home Search
            </a>
            <a href="/contact" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
              Speak with an Agent <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              alt="Modern luxury home exterior"
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2432&h=1442&fit=crop&crop=center"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 dark:hidden"
            />
            <img
              alt="Contemporary home at dusk with warm lighting"
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2432&h=1442&fit=crop&crop=center"
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
          <Subheading className="mt-16">Expert Buyer Services</Subheading>
          <Heading as="h1" className="mt-2">
            Find Your Perfect Home
          </Heading>
          <Lead className="mt-6 max-w-3xl">
          From first-time buyers to seasoned investors, <span className=" text-sky-500">MasterKey</span> provides expert guidance and cutting-edge technology to help you find and secure your dream home at the best possible price.
          </Lead>
        <div className="mt-16  pb-14">
        <div>
            <h2 className="text-2xl font-medium tracking-tight">Buyer Services</h2>
            <FadeInStagger className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {buyerServices.map((service) => (
                <a
                key={service.slug}
                href={service.link}
                className="relative flex flex-col h-full rounded-sm bg-white p-8 shadow-md ring-1 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-black/5 ring-black/5"
                >
                <div className="flex items-center justify-center w-12 h-12 bg-sky-100 rounded-lg mb-4">
                    <service.icon className="w-6 h-6 text-sky-600" />
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="text-base/7 font-medium">
                    {service.title}
                    </div>
                    <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                    {service.excerpt}
                    </div>
                    <div className="flex items-center gap-1 text-sky-500 mt-4">
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


const buyingSteps = [
  {
    name: 'Get Pre-Approved',
    description: 'Secure financing and understand your budget with our trusted lender partners.',
  },
  { 
    name: 'Search & Tour Properties', 
    description: 'Browse listings with our advanced search tools and schedule tours with your dedicated agent.' 
  },
  {
    name: 'Make an Offer',
    description: 'Submit competitive offers with expert guidance on pricing, terms, and negotiation strategy.',
  },
  { 
    name: 'Close & Move In', 
    description: 'Navigate inspections, appraisals, and final walkthrough to get your keys.' 
  },
]
function HowItWorks() {
  return (
    <div id="how-it-works" className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <div className="col-span-2">
            <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">How It Works</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
              Your Path to Homeownership
            </p>
            <p className="mt-6 text-base/7 text-gray-700 dark:text-gray-300">
              Our streamlined 4-step process makes buying your dream home simple and stress-free. From pre-approval to keys in hand, we guide you every step of the way.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                Get Started Today
              </a>
            </div>
          </div>
          <dl className="col-span-3 grid grid-cols-1 gap-x-8 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:gap-y-16 dark:text-gray-400">
            {buyingSteps.map((step, index) => (
              <div key={step.name} className="relative pl-9">
                <dt className="font-semibold text-gray-900 dark:text-white">
                  <div className="absolute top-1 left-0 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white dark:bg-sky-500">
                    {index + 1}
                  </div>
                  {step.name}
                </dt>
                <dd className="mt-2">{step.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

  
  const services = [
    {
      name: 'Buyer Representation',
      description: 'Dedicated buyer agent to represent your interests and negotiate the best terms on your behalf.',
      icon: CloudArrowUpIcon,
      href: '#',
    },
    {
      name: 'Property Search & Tours',
      description: 'Access to MLS listings, private showings, and guided property tours with market insights.',
      icon: LockClosedIcon,
      href: '#',
    },
    {
      name: 'Offer Strategy & Negotiation',
      description: 'Expert guidance on competitive offers, contract terms, and skilled negotiation to win your dream home.',
      icon: ArrowPathIcon,
      href: '#',
    },
    {
      name: 'Due Diligence Support',
      description: 'Coordination of inspections, appraisals, and title work to protect your investment.',
      icon: FingerPrintIcon,
      href: '#',
    },
    {
      name: 'Market Analysis & Pricing',
      description: 'Comprehensive market research and comparable sales analysis to ensure fair pricing.',
      icon: Cog6ToothIcon,
      href: '#',
    },
    {
      name: 'Transaction Management',
      description: 'Full-service coordination from accepted offer through closing, handling all paperwork and deadlines.',
      icon: ServerIcon,
      href: '#',
    },
  ]



  
  
  
  function ServicesList() {
    return (
      <div id="services"className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Complete Brokerage Services</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance dark:text-white">
              Everything you need to succeed
            </p>
            <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
              From initial property search to final closing, our comprehensive brokerage services provide expert guidance and cutting-edge technology to ensure your real estate success.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {services.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900 dark:text-white">
                    <feature.icon aria-hidden="true" className="size-5 flex-none text-sky-600 dark:text-sky-400" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base/7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mx-auto mt-16 flex justify-center">
            <a
              href="/contact"
              className="rounded-md bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  
  import { CheckCircleIcon } from '@heroicons/react/20/solid'
import Navbar3 from '@/components/navbar3'

const benefits = [
  'AI-powered market analysis',
  'Real-time property data',
  'Comparable sales research',
  'Neighborhood trend analysis',
  'Investment potential scoring',
  'Instant valuation reports',
]

function Testimonial() {
    return (
      <div className="bg-white min-h-screen  pt-24 pb-16 sm:pt-32 sm:pb-24 xl:pb-32 dark:bg-gray-900">
        <div className="bg-sky-900 pb-20 sm:pb-24 xl:pb-0 dark:bg-gray-800/50 dark:outline dark:outline-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
            <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
              <div className="relative aspect-2/1 h-full after:absolute after:inset-0 after:rounded-2xl after:inset-ring after:inset-ring-white/15 md:-mx-8 xl:mx-0 xl:aspect-auto">
                <img
                  alt="Luxury modern home exterior with professional landscaping"
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=2102&h=1402&fit=crop&crop=center"
                  className="absolute inset-0 size-full rounded-2xl bg-gray-800 object-cover shadow-2xl dark:bg-gray-700 dark:shadow-none"
                />
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <figure className="relative isolate pt-6 sm:pt-12">
                <svg
                  fill="none"
                  viewBox="0 0 162 128"
                  aria-hidden="true"
                  className="absolute top-0 left-0 -z-10 h-32 stroke-white/20"
                >
                  <path
                    d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                    id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                  />
                  <use x={86} href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" />
                </svg>
                <blockquote className="text-xl/8 font-semibold text-white sm:text-2xl/9 dark:text-gray-100">
                  <p>
                  MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-white dark:text-gray-100">Todd Shillington</div>
                  <div className="mt-1 text-gray-400">Past Client</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    )
  }


//   stats
  const stats = [
    { id: 1, name: 'Creators on the platform', value: '8,000+' },
    { id: 2, name: 'Flat platform fee', value: '3%' },
    { id: 3, name: 'Uptime guarantee', value: '99.9%' },
    { id: 4, name: 'Paid out to creators', value: '$70M' },
  ]

  function Stats() {
    return (
      <div className="relative bg-white dark:bg-gray-900">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80"
          className="h-56 w-full bg-gray-50 object-cover lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-1/2 dark:bg-gray-800"
        />
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="px-6 pt-16 pb-24 sm:pt-20 sm:pb-32 lg:col-start-2 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl lg:mr-0 lg:max-w-lg">
              <h2 className="text-base/8 font-semibold text-sky-600 dark:text-sky-400">Our track record</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                Trusted by thousands of creators worldwide
              </p>
              <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
                dolor cupiditate blanditiis ratione.
              </p>
              <dl className="mt-16 grid max-w-xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:mt-16">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex flex-col gap-y-3 border-l border-gray-900/10 pl-6 dark:border-white/10"
                  >
                    <dt className="text-sm/6 text-gray-600 dark:text-gray-400">{stat.name}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }


  function Bento() {
    return (
      <div className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-base/7 font-semibold text-sky-600 dark:text-sky-400">Exclusive Client Portals</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl dark:text-white">
            Premium tools for buyers and sellers
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl dark:bg-gray-800" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                    Mobile Access
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                    Access your personalized buyer or seller portal anywhere, anytime. View listings, track offers, and communicate with your agent on the go.
                  </p>
                </div>
                <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl dark:shadow-none dark:outline dark:outline-white/20">
                    <img
                      alt=""
                      src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                      className="size-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl dark:outline-white/15" />
            </div>
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl dark:bg-gray-800" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                    Real-Time Analytics
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                    Track your property's performance with live market data, showing views, interest levels, and comparable sales in your area.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                    className="w-full max-lg:max-w-xs dark:hidden"
                  />
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-performance.png"
                    className="w-full not-dark:hidden max-lg:max-w-xs"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl dark:outline-white/15" />
            </div>
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white dark:bg-gray-800" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                    Secure Document Management
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                    Safely store and access all transaction documents, contracts, and disclosures in one encrypted, organized location.
                  </p>
                </div>
                <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                    className="h-[min(152px,40cqw)] object-cover dark:hidden"
                  />
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png"
                    className="h-[min(152px,40cqw)] object-cover not-dark:hidden"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15" />
            </div>
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl dark:bg-gray-800" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                    Communication Hub
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                    Direct messaging with your agent, automated updates on listing activity, and instant notifications for new opportunities or offers.
                  </p>
                </div>
                <div className="relative min-h-120 w-full grow">
                  <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl outline outline-white/10 dark:bg-gray-900/60 dark:shadow-none">
                    <div className="flex bg-gray-900 outline outline-white/5">
                      <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                        <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                          NotificationSetting.jsx
                        </div>
                        <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                      </div>
                    </div>
                    <div className="px-6 pt-6 pb-14">{/* Your code example */}</div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:outline-white/15" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  

function ValuationCTA() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/75 px-6 py-16 shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20 dark:bg-white/3 dark:shadow-none dark:ring-white/10">
            {/* <img
              alt=""
              src="https://images.unsplash.com/photo-1519338381761-c7523edc1f46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
              className="h-96 w-full flex-none rounded-2xl object-cover shadow-none lg:aspect-square lg:h-auto lg:max-w-sm dark:shadow-xl"
            /> */}
            <ChartRadialStacked/>       
            <div className="w-full flex-auto">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl dark:text-white">
                AI-Powered Property Valuation
              </h2>
              <p className="mt-6 text-lg/8 text-pretty text-gray-600 dark:text-gray-400">
                Our advanced AI valuation engine analyzes thousands of data points including recent sales, market trends, and property characteristics to provide accurate, real-time property valuations you can trust.
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base/7 text-gray-950 sm:grid-cols-2 dark:text-gray-200"
              >
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="h-7 w-5 flex-none text-sky-500 dark:text-gray-200"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex">
                <a
                  href="#"
                  className="text-sm/6 font-semibold text-sky-600 hover:text-sky-300 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  Get Your Property Valuation
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
            className="aspect-1318/752 w-329.5 flex-none bg-linear-to-r from-[#0ea5e9] to-[#22c55e] opacity-50 dark:from-[#0ea5e9] dark:to-[#22c55e] dark:opacity-20"
          />
        </div>
      </div>
    </div>
  )
}

const faqs = [
  {
    question: "How much money do I need to buy a home?",
    answer:
      "Typically, you'll need 3-20% for a down payment, plus closing costs (2-5% of purchase price), and reserves for moving expenses. We'll help you understand all costs upfront and connect you with lenders offering various down payment programs.",
  },
  {
    question: 'How long does the home buying process take?',
    answer:
      'From start to finish, the process typically takes 30-60 days once you find a home. Getting pre-approved can take 1-3 days, house hunting varies by market, and closing takes 30-45 days after your offer is accepted.',
  },
  {
    question: 'What is the difference between pre-qualification and pre-approval?',
    answer:
      'Pre-qualification is an estimate based on self-reported information, while pre-approval involves verification of your income, assets, and credit. Pre-approval carries more weight with sellers and shows you\'re a serious buyer.',
  },
  {
    question: 'Should I get a home inspection?',
    answer:
      "Absolutely. A professional inspection typically costs $300-500 but can save you thousands by identifying potential issues. We'll help you find qualified inspectors and negotiate repairs or credits based on findings.",
  },
  {
    question: "What happens if my offer isn't accepted?",
    answer:
      'Don\'t get discouraged! We\'ll analyze why the offer wasn\'t accepted and adjust our strategy. This might mean improving terms, increasing the offer price, or finding properties that better match your budget and preferences.',
  },
  {
    question: 'Do I need to use the seller\'s preferred lender or title company?',
    answer:
      "No, you have the right to choose your own lender and in many states, your title company. However, using the seller's preferred providers might make your offer more attractive in competitive situations.",
  },
  {
    question: 'What are closing costs and who pays them?',
    answer:
      'Closing costs include loan fees, title insurance, appraisal, and other transaction expenses, typically 2-5% of the purchase price. Both buyers and sellers have closing costs, and some can be negotiated as part of your offer.',
  },
  {
    question: 'Can I back out of a purchase after signing a contract?',
    answer:
      'Yes, but only under specific contingency conditions like financing, inspection, or appraisal issues. We\'ll ensure your contract includes appropriate contingencies to protect your interests and earnest money.',
  },
  {
    question: 'How do I know if I\'m making a competitive offer?',
    answer:
      'We\'ll provide a comprehensive market analysis showing recent comparable sales, current market conditions, and days on market. This data helps us craft offers that are competitive while protecting your interests.',
  },
  {
    question: 'What should I do to prepare for homeownership?',
    answer:
      'Start by checking your credit score, saving for down payment and closing costs, getting pre-approved, and researching neighborhoods. We\'ll guide you through each step and connect you with trusted professionals.',
  },
]

 function BuyerFAQs() {
  return (
    <div id="faqs" className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Frequently asked <span className="text-sky-500">buyer</span> questions
          </h2> 
          <dl className="mt-16 divide-y divide-gray-900/10 dark:divide-white/10">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                    <span className="text-base/7 font-semibold">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusSmallIcon aria-hidden="true" className="size-6 group-data-open:hidden" />
                      <MinusSmallIcon aria-hidden="true" className="size-6 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-base/7 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}


export default function Buy() {
  return (
    <>
   
    <Hero/>
    <ThreeCard/>
    <HowItWorks/>
    <Testimonial/>
    <Stats />   
    {/* <Bento/> */}
    <ServicesList/>   
    {/* <ValuationCTA/> */}
    <BuyerFAQs/>  
    <Footer/>       
    </>
  )
}


  


