
"use client";

import Link from "next/link"
import { Container } from "@/components/container"
import { Heading } from "@/components/text"
import { Lead } from "@/components/text"
import { Subheading } from "@/components/text"
import { FadeInStagger } from "@/components/animations"
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { StarIcon } from '@heroicons/react/20/solid'
import { Home, Key, DollarSign, ArrowRight, SparkleIcon } from "lucide-react"
import { GooglePlacesInput } from '@/components/ui/google-places-input'
import { Button } from '@/components/button'
import { useState } from 'react'
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { Gradient } from "@/components/gradient";
import { PlusGrid } from "@/components/plus-grid";

function LandingNav() {
  return (
  
  <Container className=" py-4 ">
    <h1 className="text-2xl font-medium tracking-tight">M</h1>
  </Container>
  )
}



function AddressTest() {

  const [address, setAddress] = useState('');

  const handleGetStarted = () => {
    if (address.trim()) {
      // Redirect to questionnaire with pre-filled address, starting at step 2 (timeline)
      window.location.href = `/questionnaire/real-estate-sell?address=${encodeURIComponent(address)}&step=2`;
    } else {
      // Redirect to questionnaire without pre-filled address
      window.location.href = '/questionnaire/real-estate-sell';
    }
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="relative isolate overflow-hidden bg-linear-to-b from-sky-100/20 dark:from-sky-950/10">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <img
                  alt="Masterkey"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=600"
                  className="h-11 dark:hidden"
                />
                <img
                  alt="Masterkey"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=500"
                  className="h-11 not-dark:hidden"
                />
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a href="/questionnaire/real-estate-sell" className="inline-flex space-x-6">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-sm/6 font-semibold text-sky-600 ring-1 ring-sky-600/20 ring-inset dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/25">
                      What's new
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600 dark:text-gray-300">
                      <span>Just shipped v1.0</span>
                      <ChevronRightIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
                    </span>
                  </a>
                </div>
                <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
                  Supercharge your web app
                </h1>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                </p>
                <div className="mt-10 flex flex-col md:flex-row md:items-start mx-auto  gap-6">
                  <div className="flex-1 top-0">
                      <GooglePlacesInput
                        value={address}
                        onChange={setAddress}
                        placeholder="Enter your property address..."
                        className="w-full px-4  py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-base"
                      />
                  </div>
                  <Button
                    onClick={handleGetStarted}
                    className="px-8 py-3 bg-sky-500 hover:bg-sky-600   text-white font-medium rounded-sm transition-colors duration-200"
                    >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-sky-600/10 ring-sky-50 md:-mr-20 lg:-mr-36 dark:bg-gray-800/30 dark:shadow-sky-400/10 dark:ring-white/5"
            />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-sky-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_var(--radius-3xl))]">
                <div
                  aria-hidden="true"
                  className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-sky-100 opacity-20 inset-ring inset-ring-white md:ml-20 lg:ml-36"
                />
                <div className="relative px-6 pt-8 sm:pt-16 md:pr-0 md:pl-16">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-200 h-100 overflow-hidden rounded-tl-xl bg-gray-900">
                      <img
                        src="https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
                        alt="Luxury modern house"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset md:rounded-3xl dark:ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32 dark:from-gray-900" />
      </div>
    </div>
  )
}
const landingCards = [
  {
      title: "Find Your Dream Home",
      link:"/questionnaire/real-estate-buy", 
      slug: "property-search",
      icon: Home,
      excerpt: "Search thousands of listings with our advanced filters and AI-powered matching. Get detailed insights on every property that interests you."
  },
  {
      title: "Buyer Consultation",
      link:"/contact", 
      slug: "buyer-consultation",
      icon: Key,
      excerpt: "Start your home buying journey with a personalized consultation. We'll understand your needs, budget, and timeline to find the perfect match."
  },
  {
      title: "Market Analysis & Insights",
      link:"/questionnaire/real-estate-buy", 
      slug: "market-insights",
      icon: DollarSign,
      excerpt: "Get comprehensive market data, neighborhood trends, and pricing insights to make informed decisions on your home purchase."
  },
]

function LandingHero() {

  return (
  <> 
    
    <Container className="mx-auto max-w-7xl py-16 text-center md:text-left bg-gray-50 ">
          <Subheading className=" text-sky-500">Expert Buyer Services</Subheading>
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
            
            {landingCards.map((service) => (
                <a
                key={service.slug}
                href={service.link}
                className="relative flex flex-col h-full rounded-sm bg-white p-8 shadow-md ring-1 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-black/5 ring-black/5"
                >
                <div className="flex items-center mx-auto justify-center w-12 h-12 bg-sky-100 rounded-lg mb-4">
                    <service.icon className="w-6 h-6 text-sky-600" />
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="text-base/7 font-medium">
                    {service.title}
                    </div>
                    <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                    {service.excerpt}
                    </div>
                    
                </div>
                </a>
            ))}
                
        </FadeInStagger>
        <div className="mt-16 mx-auto text-center flex flex-col items-center justify-center  gap-y-4">
          <SparkleIcon className="w-12 h-12 text-sky-500 mb-4"/>  
          <h2 className="text-2xl font-medium tracking-tight">Ready to Get Started?</h2>
          <p className="my-2 text-sm text-gray-500">Start your journey to finding your dream home today.</p>
          <Link  className="mx-auto flex items-center justify-center w-100 bg-sky-500 text-white px-6 py-2 rounded-md"href="/questionnaire/real-estate-sell">Get Started</Link>
        </div>
        </div>
       
        </div>
    
    </Container>
    </>
  )
}


const testimonials = [
  {
      title: "Todd Schilington",
      link:"/questionnaire/real-estate-buy", 
      slug: "property-search",
      icon: Home,
      quote: "Search thousands of listings with our advanced filters and AI-powered matching. Get detailed insights on every property that interests you."
  },
  {
      title: "Buyer Consultation",
      link:"/contact", 
      slug: "buyer-consultation",
      icon: Key,
      quote: "Start your home buying journey with a personalized consultation. We'll understand your needs, budget, and timeline to find the perfect match."
  },
  {
      title: "Market Analysis & Insights",
      link:"/questionnaire/real-estate-buy", 
      slug: "market-insights",
      icon: DollarSign,
      quote: "Get comprehensive market data, neighborhood trends, and pricing insights to make informed decisions on your home purchase."
  },
]
function Testimonials() {
  return (
  <> 
    
    <Container className="mx-auto max-w-7xl py-16 text-center md:text-left bg-gray-50 ">
          <Subheading className=" text-sky-500">Testimontials</Subheading>
          <Heading as="h1" className="mt-2">
            Hear from our previous clients
          </Heading>
          {/* <Lead className="mt-6 max-w-3xl">
             From first-time buyers to seasoned investors, <span className=" text-sky-500">MasterKey</span> provides expert guidance and cutting-edge technology to help you find and secure your dream home at the best possible price.
          </Lead> */}
        <div className="mt-16  pb-14">
        <div>
           
            <FadeInStagger className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {testimonials.map((service) => (
                <a
                key={service.slug}
                href={service.link}
                className="relative flex flex-col h-full rounded-sm bg-white p-8 shadow-md ring-1 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-black/5 ring-black/5"
                >
                <div className="flex items-center mx-auto justify-center w-12 h-12 bg-sky-100 rounded-lg mb-4">
                    <service.icon className="w-6 h-6 text-sky-600" />
                </div>
                <div className="flex flex-1 mx-auto items-center justify-center flex-col">
                    <div className="text-base/7 font-medium">
                    {service.title}
                    </div>
                    <div className="flex mx-auto items-center gap-1 my-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                    {service.quote}
                    </div>
                    
                </div>
                </a>
            ))}
                
        </FadeInStagger>
        <div className="mt-16 mx-auto text-center flex flex-col items-center justify-center gap-y-4 ">
          <SparkleIcon className="w-12 h-12 text-sky-500 mb-4"/>  
          <h2 className="text-2xl font-medium tracking-tight">Become a Future Success Story</h2>
          <p className="my-2 text-sm text-gray-500">Start your journey to finding your dream home today.</p>
          <Link  className="mx-auto flex items-center justify-center w-100 bg-sky-500 text-white px-6 py-2 rounded-md"href="/questionnaire/real-estate-sell">Get Started</Link>
        </div>
        </div>
       
        </div>
    
    </Container>
    </>
  )
}




const features = [
  {
    name: 'Push to deploy.',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]
 function AboutUs() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">About Us</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
               Leading the charge in real estate and technology in Southern California
              </p>
              <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque,
                iste dolor cupiditate blanditiis ratione.
              </p>
              <h3 className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
               We will...
              </h3>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none dark:text-gray-400">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-sky-600 dark:text-sky-400"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Team collaborating in modern office"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2432&h=1442&q=80"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 not-dark:hidden sm:w-228 md:-ml-4 lg:-ml-0 dark:ring-white/10"
          />
          <img
            alt="Team collaborating in modern office"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2432&h=1442&q=80"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0 dark:hidden dark:ring-white/10"
          />
        </div>
      </div>
    </div>
  )
}




const nextSteps = [
  {
      title: "Find Your Dream Home",
      link:"/questionnaire/real-estate-buy", 
      slug: "property-search",
      stepElement: <div className="flex items-center justify-center w-12 h-12 bg-sky-300 rounded-lg"><span className="font-bold text-sky-600 text-lg">1</span></div>,
      excerpt: "Search thousands of listings with our advanced filters and AI-powered matching. Get detailed insights on every property that interests you."
  },
  {
      title: "Buyer Consultation",
      link:"/contact", 
      slug: "buyer-consultation",
      stepElement: <div className="flex items-center justify-center w-12 h-12 bg-sky-300 rounded-lg"><span className=" font-bold text-sky-600 text-lg">2</span></div>,
      excerpt: "Start your home buying journey with a personalized consultation. We'll understand your needs, budget, and timeline to find the perfect match."
  },
  {
      title: "Market Analysis & Insights",
      link:"/questionnaire/real-estate-buy", 
      slug: "market-insights",
      stepElement: <div className="flex items-center justify-center w-12 h-12 bg-green-300 rounded-lg"><CheckBadgeIcon className="w-6 h-6 text-green-600" /></div>,
      excerpt: "Get comprehensive market data, neighborhood trends, and pricing insights to make informed decisions on your home purchase."
  },
]

function NextSteps() {

  return (
  <> 
    
    <Container className="mx-auto max-w-7xl py-16 text-center md:text-left bg-gray-50 ">
          <Subheading className=" text-sky-500">These are your next steps</Subheading>
          <Heading as="h1" className="mt-2">
            Ready to Move Forward?
          </Heading>
          {/* <Lead className="mt-6 max-w-3xl">
             From first-time buyers to seasoned investors, <span className=" text-sky-500">MasterKey</span> provides expert guidance and cutting-edge technology to help you find and secure your dream home at the best possible price.
          </Lead> */}
        <div className="mt-16  pb-14">
        <div>
            {/* <h2 className="text-2xl font-medium tracking-tight">Buyer Services</h2> */}
            <FadeInStagger className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {nextSteps.map((service) => (
                <a
                key={service.slug}
                href={service.link}
                className="relative flex flex-col h-full rounded-sm bg-white p-8 shadow-md ring-1 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-black/5 ring-black/5"
                >
                <div className="flex items-center mx-auto justify-center mb-4">
                    {service.stepElement}
                </div>
                <div className="flex flex-1 items-center text-center flex-col">
                    <div className="text-base/7 font-medium">
                    {service.title}
                    </div>
                    <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                    {service.excerpt}
                    </div>
                    
                </div>
                </a>
            ))}
                
        </FadeInStagger>
        <div className="mt-16 mx-auto text-center flex flex-col items-center justify-center  gap-y-4">
          {/* <SparkleIcon className="w-12 h-12 text-sky-500 mb-4"/>   */}
          {/* <h2 className="text-2xl font-medium tracking-tight">Ready to Get Started?</h2> */}
          <p className="my-2 text-sm text-gray-500">Start your journey to finding your dream home today.</p>
          <Link  className="mx-auto font-semibold flex items-center justify-center w-100 bg-sky-500 text-white px-6 py-2 rounded-md"href="/questionnaire/real-estate-sell">Get Started</Link>
        </div>
        </div>
       
        </div>
    
    </Container>
    </>
  )
}


function CallToAction() {
  return (
    <div className="relative pt-20 pb-16 text-center sm:py-24">
      <hgroup>
        <Subheading>Ready to make your move?</Subheading>
        <p className="mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl">
          Let's find your dream home
          <br />
          or sell for top dollar.
        </p>
      </hgroup>
      <p className="mx-auto mt-6 max-w-xs text-sm/6 text-gray-500">
        Experience the MasterKey difference with our expert agents and
        cutting-edge technology.
      </p>
      <div className="mt-6">
        <Button className="w-full sm:w-auto" href="/questionnaire/real-estate-sell">
          Get Free Consultation
        </Button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <Gradient className="relative">
        <div className="absolute inset-2 rounded-4xl bg-white/80" />
        <Container>
          <CallToAction />

        </Container>
      </Gradient>
    </footer>
  )
}

export default function SellV1Page() {
  return (
    <div className="bg-gray-50" >
      <AddressTest/>
      <LandingHero/>
      <Testimonials/> 
      <AboutUs/>  
      <NextSteps/>
    <Footer/>
    </div>
  )
}



