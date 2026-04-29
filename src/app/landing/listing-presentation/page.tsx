
"use client";

import { Container } from "@/components/container"
import { Heading } from "@/components/text"
import { Lead } from "@/components/text"
import { Subheading } from "@/components/text"
import { FadeInStagger } from "@/components/animations"
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XMarkIcon, CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/16/solid';
import { StarIcon } from '@heroicons/react/20/solid'
import { trackEvent } from '@/hooks/useSimpleAnalytics';
import { Home, Key, DollarSign, ArrowRight, SparkleIcon, Sparkles, ShieldAlert } from "lucide-react"
import Link from 'next/link'
import { GooglePlacesInput } from '@/components/ui/google-places-input'
import { Button } from '@/components/button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePropertyData } from '@/contexts/PropertyDataContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { Gradient } from "@/components/gradient";
import { PlusGrid } from "@/components/plus-grid";
import { MasterKeyLogoInlineBlack } from '@/components/logo'
import { Spinner } from "@/components/ui/spinner";
import posthog from "posthog-js";
import LandingPageV2 from "@/components/landing-pages/landing-page-v2";
import LandingPageV3 from "@/components/landing-pages/landing-page-v3/page";

function AddressTest() {
  const [address, setAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);
  const router = useRouter();
  const { prefetchPropertyData, isLoading, propertyTypeError, setPropertyTypeError, setIsLoading } = usePropertyData();


  // Reset loading state when component unmounts
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  const handleGetStarted = async () => {
    if (address.trim()) {
      // Prefetch property data before navigating
      console.log('Prefetching property data for address:', address);
      const result = await prefetchPropertyData(address);
      
      // If property type is not supported, the modal will show automatically
      // Only navigate if we got valid property data
      if (result && !propertyTypeError) {
        // Navigate to questionnaire with pre-filled address, starting at step 2 (timeline)
        router.push(`/questionnaire/listing-presentation?address=${encodeURIComponent(address)}&step=2`);
      }
    } else {
      // Navigate to questionnaire without pre-filled address
      router.push('/questionnaire/listing-presentation');
    }
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="relative isolate overflow-hidden bg-linear-to-b from-sky-100/20 dark:from-sky-950/10">
        <div className="mx-auto max-w-7xl pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
          
                <MasterKeyLogoInlineBlack className="h-11  dark:hidden"/>
                <MasterKeyLogoInlineBlack className="h-11  not-dark:hidden"/>
                
                {/* <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a href="/questionnaire/listing-presentation" className="inline-flex space-x-6">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-sm/6 font-semibold text-sky-600 ring-1 ring-sky-600/20 ring-inset dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-500/25">
                      Selling Made Simple
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600 dark:text-gray-300">
                      <span>Get your free market analysis</span>
                      <ChevronRightIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
                    </span>
                  </a>
                </div> */}
                <div className="flex flex-row items-start gap-2">
                
                    {/* <Sparkles className="h-24 w-24 not-dark:hidden"/> */}
                  <h1 className="text-center md:text-left mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
                    {}
                  <Sparkles className="h-4 w-4 dark:hidden top-2 md:h-10 md:w-10 inline-block left-24 text-sky-500"/>
                   Discover Your Home's <span className="text-sky-500">True Worth</span>
                  </h1>
                </div>
               
                <p className="text-center md:text-left mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                  Get instant <span className="text-sky-500">AI-powered</span> insights on your property value and local market conditions. Simplies enter your address to unlock comprehensive analysis and data-driven recommendations.
                </p>
                <div className="mt-10 flex flex-col md:flex-row md:items-start mx-auto  gap-6">
                  <div className="flex-1 top-0">
                      <GooglePlacesInput
                        value={address}
                        onChange={setAddress}
                        onValidationChange={setIsAddressValid}
                        placeholder="Enter your property address..."
                        className="w-full px-4  bg-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-base"
                      />
                      <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 flex flex-col"><span className="font-semibold">MasterKey Real Estate</span> DRE# 02250486</p>
                  </div>
                  <Button
                    onClick={() => {
                      posthog.capture('get_started_button_clicked', {
                        address: address,
                        step: 'listing_presentation',
                      });
                      handleGetStarted();
                    }}
                    // onClick={handleGetStarted}
                    disabled={isLoading || !isAddressValid}
                    className="px-8 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium rounded-sm transition-colors duration-200"
                    >
                    {isLoading ? <div className="flex flex-row items-center gap-2"><p>Loading... </p><Spinner /></div> : 'Get Started'}
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
      
      {/* Property Type Error Modal */}
      <Dialog open={!!propertyTypeError} onOpenChange={() => setPropertyTypeError(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orange-500 flex flex-row items-center gap-2"><ShieldAlert className="inline-block h-5 w-5 "/>Property Type Not Supported</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700">
              {propertyTypeError}
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Try entering a different property address</li>
              <li>
                <a 
                  href="/questionnaire/real-estate-sell" 
                  className="text-sky-600 hover:text-sky-700 underline font-medium"
                >
                  Click here to provide us with your property address information for a valuation consultation
                </a>
              </li>
            </ul>
            <div className="flex justify-end">
              <Button
                onClick={() => setPropertyTypeError(null)}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                Understood
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
const landingCards = [
  {
      title: "Property Valuation",
      link:"/questionnaire/listing-presentation", 
      slug: "property-valuation",
      icon: Home,
      excerpt: "Get an accurate market valuation of your property with comprehensive analysis of recent sales and current market trends."
  },
  {
      title: "Seller Consultation",
      link:"/contact", 
      slug: "seller-consultation",
      icon: Key,
      excerpt: "Schedule a personalized consultation to discuss your selling goals, timeline, and develop a custom marketing strategy for your home."
  },
  {
      title: "Marketing Strategy",
      link:"/questionnaire/listing-presentation", 
      slug: "marketing-strategy",
      icon: DollarSign,
      excerpt: "Receive a detailed marketing plan designed to maximize your home's exposure and attract qualified buyers quickly."
  },
]

function LandingHero() {

  return (
  <> 
    
    <Container className="mx-auto max-w-7xl py-16 text-center md:text-left bg-gray-50 ">
          <Subheading className=" text-sky-500">Expert Seller Services</Subheading>
          <Heading as="h1" className="mt-2">
            Sell Your Home with Confidence
          </Heading>
          <Lead className="mt-6 max-w-3xl">
             Whether you're upgrading, downsizing, or relocating, <span className=" text-sky-500">MasterKey</span> provides expert guidance and proven marketing strategies to help you sell your home quickly and for maximum value.
          </Lead>
        <div className="mt-16  pb-14">
        <div>
            <h2 className="text-2xl font-medium tracking-tight">Seller Services</h2>
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
          <Link  className="mx-auto flex items-center justify-center w-full bg-sky-500 text-white px-6 py-2 rounded-md" href="/questionnaire/listing-presentation">Get Started</Link>
        </div>
        </div>
       
        </div>
    
    </Container>
    </>
  )
}


const testimonials = [
  {
      title: "Todd Shillington",
      link:"/questionnaire/listing-presentation", 
      slug: "seller-testimonial-1",
      icon: Home,
      quote: "MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!"
  },
  {
      title: "Kevin Marsden",
      link:"/questionnaire/listing-presentation", 
      slug: "seller-testimonial-2",
      icon: Key,
      quote: "Professional and excellent service. I highly recommend. The Mathias team can help you out with all you real estate and management needs."
  },
  {
      title: "Javier Aguilera",
      link:"/questionnaire/listing-presentation", 
      slug: "seller-testimonial-3",
      icon: DollarSign,
      quote: "I highly recommend them not only as property managers but as brokers as well."
  },
]


function Testimonials() {
  return (
  <> 
    
    <Container className="mx-auto max-w-7xl py-16 text-center md:text-left bg-gray-50 ">
          <Subheading className=" text-sky-500">Success Stories</Subheading>
          <Heading as="h1" className="mt-2">
            Hear from our satisfied sellers
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
                      <span className="ml-2 text-xs text-gray-500">Google Reviews</span>
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
          <Link  className="mx-auto flex items-center justify-center w-full bg-sky-500 text-white px-6 py-2 rounded-md"href="/questionnaire/listing-presentation">Get Started</Link>
        </div>
        </div>
       
        </div>
    
    </Container>
    </>
  )
}




const features = [
  {
    name: 'Expert Market Analysis',
    description:
      'Get comprehensive market data and pricing insights to position your home competitively and attract serious buyers.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Professional Marketing',
    description: 'High-quality photography, virtual tours, and strategic online marketing to showcase your home to qualified buyers.',
    icon: LockClosedIcon,
  },
  {
    name: 'Dedicated Support',
    description: 'Personal guidance through every step of the selling process, from listing to closing, ensuring a smooth transaction.',
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
               Your trusted partner for selling homes in Southern California
              </p>
              <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
                With years of experience and deep local market knowledge, we help homeowners achieve their selling goals through innovative marketing strategies and personalized service.
              </p>
              <h3 className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
               We will provide...
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
      title: "Get Your Property Valued",
      link:"/questionnaire/listing-presentation", 
      slug: "property-valuation",
      stepElement: <div className="flex items-center justify-center w-12 h-12 bg-sky-300 rounded-lg"><span className="font-bold text-sky-600 text-lg">1</span></div>,
      excerpt: "Start with our comprehensive questionnaire to receive an accurate market valuation and personalized selling strategy for your home."
  },
  {
      title: "Schedule Your Consultation",
      link:"/contact", 
      slug: "seller-consultation",
      stepElement: <div className="flex items-center justify-center w-12 h-12 bg-sky-300 rounded-lg"><span className=" font-bold text-sky-600 text-lg">2</span></div>,
      excerpt: "Meet with our expert team to discuss your selling goals, timeline, and develop a custom marketing strategy tailored to your property."
  },
  {
      title: "List and Sell Successfully",
      link:"/questionnaire/listing-presentation", 
      slug: "successful-sale",
      stepElement: <div className="flex items-center justify-center w-12 h-12 bg-green-300 rounded-lg"><CheckBadgeIcon className="w-6 h-6 text-green-600" /></div>,
      excerpt: "Launch your listing with professional marketing, manage showings, and close the sale with our expert guidance every step of the way."
  },
]

function NextSteps() {

  return (
  <> 
    
    <Container className="mx-auto max-w-7xl py-16 text-center md:text-left bg-gray-50 ">
          <Subheading className=" text-sky-500">Your selling journey</Subheading>
          <Heading as="h1" className="mt-2">
            Ready to Sell Your Home?
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
          <Link  
            className="mx-auto font-semibold flex items-center justify-center w-full bg-sky-500 text-white px-6 py-2 rounded-md"
            href="/questionnaire/listing-presentation"
            onClick={() => trackEvent('cta_click', {
              button_text: 'Get Started',
              page: '/landing/listing-presentation',
              section: 'next_steps'
            })}
          >
            Get Started
          </Link>
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
        <Subheading>Ready to sell your home?</Subheading>
        <p className="mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl">
          Get maximum value
          <br />
          for your property.
        </p>
      </hgroup>
      <p className="mx-auto mt-6 max-w-xs text-sm/6 text-gray-500">
        Experience the MasterKey difference with our expert selling strategies and
        personalized marketing approach.
      </p>
      <div className="mt-6">
        <Button className="w-full sm:w-auto" href="/questionnaire/listing-presentation">
          Get Free Market Analysis
        </Button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <Gradient className="relative p-0">
        <div className="absolute inset-2 rounded-4xl bg-white/80" />
        <Container>
          <CallToAction />

        </Container>
      </Gradient>
    </footer>
  )
}

export default function ListingPresentation() {
  posthog.featureFlags.overrideFeatureFlags({ flags: {'landing-page-conversion': 'control'} })

  if (posthog.getFeatureFlag('landing-page-conversion') === 'control') {
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
} else {
  return (
    <>
    {/* <LandingPageV3 /> */}
    <LandingPageV2/>
    </>
  )
}

}



