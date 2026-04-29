'use client'
import { useState, useEffect, useRef, useMemo } from 'react'

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { GooglePlacesInput } from '@/components/ui/google-places-input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from "@/components/ui/spinner"
import { usePropertyData } from '@/contexts/PropertyDataContext'
import posthog from "posthog-js"
import Navbar3 from '../navbar3'



import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroIllustration } from "@/components/hero-illustration"
import { Container } from '@/components/container'
import { Subheading } from '@/components/text'
import { Heading } from '@/components/text'
import { Lead } from '@/components/text'
import { FadeIn, FadeInStagger } from '@/components/animations'
import { CircleCheck, SparkleIcon, Sparkles, Home, Key } from 'lucide-react'
import { MasterKeyLogoInlineBlack } from '@/components/logo'
import { ShieldAlert } from 'lucide-react'
import VideoPlayer from '../video-player'
import Iphone15Pro from '../ui/shadcn-io/iphone-15-pro'
import { Cardstack } from '../cardstack'
import ProductHero from '../product-hero'
import PropertyProfileMobile from '../property-profile-mobile'

import { ArrowLeft, ArrowRight } from "lucide-react";
import { PostHogFeature } from 'posthog-js/react'



import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Footer } from '../footer'
import { Navbar2 } from '../navbar2'
import LandingNav from '../landing-nav'
import YoutubePlayer from '../youtube-player'
import Feature1 from './components/feature1'
import ReportDemo from './components/report-demo'
import ReportDemo2 from './components/report-demo2'
import Feature2 from './components/feature2'
import PhoneHeader from './components/header-mobilephone'
import SampleReportCTA from './components/sample-report-cta'
import Trust from './components/trust'

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
}
// House Background with Input Animation
function HouseBackground() {
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const targetText = '123 Main Street, Thousand Oaks, CA';
  
  useEffect(() => {
    let textIndex = 0;
    let cursorInterval: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;
    
    // Cursor blinking
    cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    // Typing animation
    const startTyping = () => {
      typingInterval = setInterval(() => {
        if (textIndex <= targetText.length) {
          setCurrentText(targetText.slice(0, textIndex));
          textIndex++;
        } else {
          clearInterval(typingInterval);
          // Wait 1 second then click button
          setTimeout(() => {
            setIsButtonClicked(true);
            setTimeout(() => {
              setShowSuccess(true);
              // Reset after 2 seconds
              setTimeout(() => {
                setCurrentText('');
                setIsButtonClicked(false);
                setShowSuccess(false);
                textIndex = 0;
                startTyping();
              }, 2000);
            }, 500);
          }, 1000);
        }
      }, 100);
    };
    
    startTyping();
    
    return () => {
      clearInterval(cursorInterval);
      clearInterval(typingInterval);
    };
  }, []);

  

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)'
        }}
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Input Animation - Positioned absolutely */}
      <div className="absolute top-40 left-6 md:bottom-6 md:left-6 right-6 z-10">
        <div className="max-w-sm mx-auto p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Property Address
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={currentText}
                  placeholder="Enter your property address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-base bg-white"
                  readOnly
                />
                {showCursor && currentText.length < targetText.length && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-0.5 h-5 bg-sky-500 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
            
            <button
              className={`w-full py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                isButtonClicked
                  ? 'bg-green-500 text-white transform scale-95'
                  : currentText.length > 0
                  ? 'bg-sky-500 hover:bg-sky-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {showSuccess ? (
                <div className="flex items-center justify-center gap-2">
                  <CircleCheck className="w-5 h-5" />
                  Address Validated!
                </div>
              ) : (
                'Get Started'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cardstack with House Background Component
function CardstackWithHouse() {
  return (
    <div className="relative w-full h-full rounded-xl  shadow-lg">
      {/* Background Image */}
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)'
        }}
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Cardstack positioned over the house */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="transform scale-75">
          <Cardstack />
        </div>
      </div>
    </div>
  );
}

const steps = [
    {
        title: "Step 1",
        description: "Enter your address",
        visual: (
            <HouseBackground />
        )
    },
    {
        title: "Step 2",
        description: "Answer a few questions about your property",
        visual: <ProductHero />
    },
    {
        title: "Step 3",
        description: "Review your report",
        visual: <PropertyProfileMobile/>
    },
]


 function HeroSection() {
 const [address, setAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [addressError, setAddressError] = useState('');
  const router = useRouter();
  const { prefetchPropertyData, isLoading, propertyTypeError, setPropertyTypeError, setIsLoading } = usePropertyData();

  // Memoize VideoPlayer to prevent re-rendering on address changes
  const memoizedVideoPlayer = useMemo(() => <VideoPlayer />, []);

  // Reset loading state when component unmounts
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  const handleGetStarted = async () => {
    // Clear any previous errors
    setAddressError('');
    
    if (!address.trim()) {
      setAddressError('Please enter your property address to get started');
      return;
    }
    
    if (!isAddressValid) {
      setAddressError('Please enter a valid address from the suggestions');
      return;
    }

    // Prefetch property data before navigating
    console.log('Prefetching property data for address:', address);
    const result = await prefetchPropertyData(address);
    
    // If property type is not supported, the modal will show automatically
    // Only navigate if we got valid property data
    if (result && !propertyTypeError) {
      // Navigate to questionnaire with pre-filled address, starting at step 2 (timeline)
      router.push(`/questionnaire/listing-presentation?address=${encodeURIComponent(address)}&step=2`);
    }
  };

  // feature flags
  posthog.featureFlags.overrideFeatureFlags({ flags: {'vsl-headline': 'control'} })
posthog.featureFlags.overrideFeatureFlags({ flags: {'vsl-video-display': 'test'} })


  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative isolate pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-sky-500 to-green-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75 dark:opacity-20"
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">

              {/* post hog header test */}
              {/* <PostHogFeature flag='vsl-headline' match='control'>
                  <FadeIn>
                    <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
                        Discover Your Home's <span className="text-sky-500">True Worth</span>
                    </h1>
                  </FadeIn>
                  <FadeIn >
                    <p className="my-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                        Get instant <span className="text-sky-500">AI-powered</span> insights on your property value and local market conditions. Simply enter your address to unlock comprehensive analysis and data-driven recommendations.
                    </p>
                </FadeIn>
              </PostHogFeature> */}
               <PostHogFeature flag='vsl-headline' match='control'>
                <FadeIn>
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
                      Should You Sell Your Home Now — <span className="text-sky-500">or Wait? </span>
                  </h1>
                </FadeIn>
                <FadeIn >
                  <p className="my-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                     Get a personalized Sell/Wait Strategy Report powered by real <span className="text-sky-500">Ventura & LA</span> market data and AI insight. See if selling today puts more money in your pocket — or if waiting could earn you more.
                  </p>
               </FadeIn>
    
              </PostHogFeature>

              <PostHogFeature flag='vsl-headline' match='market-timing'>
                <FadeIn>
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
                      Is Now the Right Time to Sell Your Home?
                  </h1>
                </FadeIn>
                <FadeIn >
                  <p className="my-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                     Our AI-powered report analyzes your home's value, local demand, inventory, and price trends to reveal whether selling today or waiting is the smarter financial move.
                  </p>
               </FadeIn>
    
              </PostHogFeature>

              <PostHogFeature flag='vsl-headline' match='financial-decision'>
                <FadeIn>
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
                     What’s the Smartest Move for Your Equity Right Now?
                  </h1>
                </FadeIn>
                <FadeIn >
                  <p className="my-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                     Get a seller-focused market analysis that compares your home’s current value, projected pricing, and buyer demand — so you know exactly what to do next.
                  </p>
               </FadeIn>
    
              </PostHogFeature>
              
              <PostHogFeature flag='vsl-headline' match='ai-version'>
                <FadeIn>
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
                    AI-Powered Clarity for the Most Important Home Decision You’ll Make
                  </h1>
                </FadeIn>
                <FadeIn >
                  <p className="my-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                      MasterKey analyzes your address, upgrades, market trends, and seller conditions to give you a clear, data-backed recommendation: sell now, or wait for a better market.
                  </p>
               </FadeIn>
    
              </PostHogFeature>

                <PostHogFeature flag='vsl-headline' match='luxury'>
                <FadeIn>
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
                    A Smarter Way to Decide When to Sell Your Home
                  </h1>
                </FadeIn>
                <FadeIn >
                  <p className="my-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                     Your personalized Sell/Wait briefing blends AI valuation, market forecasts, and human expertise — giving you confidence in every step of your decision.
                  </p>
               </FadeIn>
    
              </PostHogFeature>
   
              <FadeIn className="flex-1 top-0">
                      <GooglePlacesInput
                        value={address}
                        onChange={setAddress}
                        onValidationChange={setIsAddressValid}
                        placeholder="Enter your property address..."
                        className="w-full px-4  bg-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-base"
                      />
                      {addressError && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                          {addressError}
                        </p>
                      )}
                  </FadeIn>
              <FadeIn className="mt-10 flex items-center justify-center gap-x-6">
                 <Button
                    onClick={() => {
                      try {
                        posthog.capture('get_started_button_clicked', {
                          address: address,
                          step: 'listing_presentation',
                        });
                      } catch (error) {
                        console.log('PostHog capture failed:', error);
                      }
                      handleGetStarted();
                    }}
                    disabled={isLoading}
                    className="px-8 py-3 h-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium rounded-sm transition-colors duration-200"
                    >
                    {isLoading ? <div className="flex flex-row items-center gap-2"><p>Loading... </p><Spinner /></div> : 'Get Started'}
                  </Button>
              </FadeIn>
            </div>
             <PostHogFeature flag='vsl-video-display' match='control'>
                  <FadeIn className="mt-16 flow-root sm:mt-24">
                    {/* {memoizedVideoPlayer} */}
                    <YoutubePlayer videoId="fB3P-VxboKU" />     
                  </FadeIn>
            </PostHogFeature>
          
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-gradient-to-tr from-sky-500 to-green-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75 dark:opacity-20"
          />
        </div>
      </div>
    </div>
  )
}


 function FeatureSection() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-bottom gap-4">
            <p className="max-w-2xl text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl sm:text-balance dark:text-white">
                    Get Your Home's Value in <span className="text-sky-500">60 Seconds</span>
            </p>
            <p className="max-w-md text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Our AI-powered valuation tool analyzes your property instantly, giving you accurate market insights without the wait or hassle of traditional appraisals.
            </p>
        </div>

      {steps.map((step, key)=>(
        <FadeIn key={key} className="relative mt-16 h-288 md:h-192 w-full bg-gray-100 rounded-lg">
            <div className="absolute -inset-2 rounded-[calc(var(--radius-xl)+calc(var(--spacing)*2))] shadow-xs ring-1 ring-black/5 dark:bg-white/2.5 dark:ring-white/10" />

                {/* content */}
                <div className="flex flex-col md:flex-row h-full md:h-full w-full items-center justify-center gap-6 py-10">
                    <div className="flex flex-col h-auto md:h-full w-full gap-2 text-left p-10 md:justify-between">
                        <h1 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900  sm:text-balance dark:text-white">{step.title}</h1> 
                        <p className="max-w-md text-3xl text-gray-900 dark:text-gray-400 leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                    <div className="flex flex-col min-h-192 md:h-full w-full items-center justify-center p-10 overflow-y-hidden">   
                        {step.visual}
                    </div>
                </div>
                
        </FadeIn>
        ))}
        
      </div>
    </div>
  )
}

function CTA() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const valuationCards = [
    {
      id: 1,
      address: "1234 Oak Street",
      value: "$875,000",
      change: "+$45,000",
      position: "sm:top-10 sm:left-4 md:top-16 md:left-12 lg:top-16 lg:left-40 xl:top-25 xl:left-100",
      pointer: "bottom-left",
      delay: 0
    },
    {
      id: 2,
      address: "5678 Pine Avenue", 
      value: "$1,250,000",
      change: "+$78,000",
      position: "sm:top-16 sm:right-4 md:top-20 md:right-8 lg:top-24 lg:right-12 xl:top-32 xl:right-100 ",
      pointer: "bottom-right",
      delay: 1000
    },
    {
      id: 3,
      address: "9012 Maple Drive",
      value: "$695,000", 
      change: "+$32,000",
      position: "sm:bottom-32 sm:left-4 md:bottom-60 md:left-10 lg:bottom-60 lg:left-40 xl:bottom-20 xl:left-60 ",
      pointer: "top-left",
      delay: 2000
    },
    {
      id: 4,
      address: "3456 Cedar Lane",
      value: "$1,450,000",
      change: "+$95,000", 
      position: "sm:bottom-16 sm:right-4 md:bottom-24 md:right-8 lg:bottom-28 lg:right-10 xl:bottom-32 xl:right-75",
      pointer: "top-right",
      delay: 3000
    }
  ];

  // Intersection Observer to detect when CTA is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 } // Trigger when 30% of component is visible
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  // Start card animations when component is in view
  useEffect(() => {
    if (!isInView) return;

    // Wait for FadeIn animation to complete before starting card animations
    const fadeInDelay = 1000;
    
    valuationCards.forEach((card) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, card.id]);
      }, fadeInDelay + card.delay);
    });
  }, [isInView]);

  return (
    <div ref={ctaRef} className="relative h-[90vh] w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: 'url(/images/map.png)' }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Animated Valuation Cards */}
      {valuationCards.map((card) => (
        <FadeIn
          key={card.id}
          className={`hidden md:block absolute ${card.position} transform transition-all duration-500 ${
            visibleCards.includes(card.id) 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs border border-gray-200 relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 font-medium">New Valuation</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{card.address}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-lg font-bold text-gray-900">{card.value}</div>
                <div className="text-sm font-medium text-green-600">{card.change}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Updated just now</div>
            </div>
            
            {/* Pointer Triangle */}
            <div 
              className={`absolute w-0 h-0 z-10 ${
                card.pointer === 'bottom-left' ? 'bottom-0 left-4 transform translate-y-full border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white' :
                card.pointer === 'bottom-right' ? 'bottom-0 right-4 transform translate-y-full border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white' :
                card.pointer === 'top-left' ? 'top-0 left-4 transform -translate-y-full border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white' :
                card.pointer === 'top-right' ? 'top-0 right-4 transform -translate-y-full border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white' :
                ''
              }`}
            />
          </div>
        </FadeIn>
      ))}
      
      {/* Content */}
      <div className="relative z-10 px-6 py-24 sm:py-32 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-sky-300 mb-4">Serving Ventura and Los Angeles Counties</p>
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            Get Your Home's Value in 60 Seconds
          </h2>
          {/* <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-200">
            Our AI-powered valuation tool analyzes your property instantly, giving you accurate market insights without the wait or hassle of traditional appraisals.
          </p> */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/questionnaire/listing-presentation"
              className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Get Started Free
            </Link>
            {/* <a href="/questionnaire/listing-presentation" className="text-sm/6 font-semibold text-white">
              Learn more
              <span aria-hidden="true">→</span>
            </a> */}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}






const data = [
  {
    id: "seller-testimonial-1",
    title: "Todd Shillington",
    description:
      "MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!",
    href: "/questionnaire/listing-presentation",
    image:
      "https://images.unsplash.com/photo-1560170412-0f7df0eb0fb1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2296",
  },
  {
    id: "seller-testimonial-2",
    title: "Kevin Marsden",
    description:
      "Professional and excellent service. I highly recommend. The Mathias team can help you out with all you real estate and management needs.",
    href: "/questionnaire/listing-presentation",
    image:
      "https://images.unsplash.com/photo-1526363269865-60998e11d82d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370",
  },
  {
    id: "seller-testimonial-3",
    title: "Javier Aguilera",
    description:
      "I highly recommend them not only as property managers but as brokers as well.",
    href: "/questionnaire/listing-presentation",
    image:
      "https://images.unsplash.com/photo-1606788075819-9574a6edfab3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2368",
  },
  {
    id: "seller-testimonial-4",
    title: "Steve Scherer",
    description:
      "I always got the information I needed, and they were totally upfront about everything. Plus, their honesty and integrity made the whole process so much smoother. I highly recommend them!",
    href: "/questionnaire/listing-presentation",
    image:
      "https://images.unsplash.com/photo-1542644425-bc949ec841a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287",
  },
  {
    id: "seller-testimonial-5",
    title: "Samir Akhter",
    description:
      "Mark was very professional to work with. Always responsive and straightforward. It was a pleasure working with the team. Would highly recommend.",
    href: "/questionnaire/listing-presentation",
    image:
      "https://images.unsplash.com/photo-1584738766473-61c083514bf4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370",
  },
  {
    id: "seller-testimonial-6",
    title: "Olivia Sellers",
    description:
      "The team was quick to respond and handle maintenance issues and kept the property in great shape.",
    href: "/questionnaire/listing-presentation",
    image:
      "https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370",
  },
];

const Gallery4 = ({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences. These case studies showcase real-world applications and success stories.",
  items = data,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl  lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-bottom mb-10 gap-4">    
            <p className="max-w-2xl px-6 md:px-0 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl sm:text-balance dark:text-white">
                    See what our clients have to say
            </p>
            <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
        
                <div className="hidden shrink-0 gap-2 md:flex">
                    <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        carouselApi?.scrollPrev();
                    }}
                    disabled={!canScrollPrev}
                    className="disabled:pointer-events-auto"
                    >
                    <ArrowLeft className="size-5" />
                    </Button>
                    <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        carouselApi?.scrollNext();
                    }}
                    disabled={!canScrollNext}
                    className="disabled:pointer-events-auto"
                    >
                    <ArrowRight className="size-5" />
                    </Button>
                </div>
            </div>
        </div>
      
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl">
                  <div className="md:aspect-5/4 lg:aspect-16/9 group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.7)_100%)]" />
                    <div className="text-primary-foreground absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                      <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 md:mb-12 lg:mb-9">
                        {item.description}
                      </div>
                      {/* <div className="flex items-center text-sm">
                        Read more{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div> */}
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export { Gallery4 };


function LastCTA() {
  return (
    <div className="overflow-hidden bg-white py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:min-w-full lg:flex-none lg:gap-y-8">
          <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              We're here to help
            </h2>
            <p className="mt-6 text-xl/8 text-gray-700 dark:text-gray-300">
              Whether you're buying, selling, or managing property in Ventura and Los Angeles Counties, our experienced team is ready to guide you through every step of your real estate journey.
            </p>
            <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-400">
              Get personalized advice, market insights, and professional support tailored to your unique needs. We're committed to making your real estate experience smooth and successful throughout Southern California.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="tel:+18052629707"
                className="text-2xl font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                +1 805-262-9707
              </a>
            </div>
            <div className="mt-6 flex">
              <a
                href="/contact"
                className="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                Contact us today
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
            <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
              <img
                alt="Beautiful modern home exterior"
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1152&q=80"
                className="aspect-7/5 w-148 max-w-none rounded-2xl bg-gray-50 object-cover max-sm:w-120 dark:bg-gray-800"
              />
            </div>
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-148 lg:items-start lg:justify-end lg:gap-x-8">
              <div className="order-first flex w-64 flex-none justify-end self-end max-sm:w-40 lg:w-auto">
                <img
                  alt="Luxury house with landscaping"
                  src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&h=604&q=80"
                  className="aspect-4/3 w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover dark:bg-gray-800"
                />
              </div>
              <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                <img
                  alt="Contemporary home with large windows"
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1152&h=842&q=80"
                  className="aspect-7/5 w-148 max-w-none flex-none rounded-2xl bg-gray-50 object-cover max-sm:w-120 dark:bg-gray-800"
                />
              </div>
              <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                <img
                  alt="Charming residential property"
                  src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&h=604&q=80"
                  className="aspect-4/3 w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}









export default function LandingPageV2() {

    return (
        <>
            {/* <Navbar3 />  */}
            <LandingNav />
            <HeroSection />
            <ReportDemo2 />
             <Feature2 />  
             <SampleReportCTA /> 
             {/* <PhoneHeader /> */}
            {/* <CTA /> */}
            <Trust />   
            <Gallery4 items={data} />
            <LastCTA />
            <Footer />
        </>
    )
}


 








