import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Container } from "@/components/container"
import { Heading } from "@/components/text"
import { Lead } from "@/components/text"
import { FadeIn, FadeInStagger } from "@/components/animations"
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
  import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'
import { ArrowRight, ArrowUpRight, Link, Building, Users, Wrench, Star } from "lucide-react"


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
export default function PropertyManagement() {
  return (
    <>
   
    <Hero/>
    <ThreeCard/>        
    <Footer/>       
    </>
  )
}
