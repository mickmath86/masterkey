import { BentoCard } from '@/components/bento-card'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Gradient } from '@/components/gradient'
import { Keyboard } from '@/components/keyboard'
import { Link } from '@/components/link'
import { LinkedAvatars } from '@/components/linked-avatars'
import { LogoCloud } from '@/components/logo-cloud'
import { LogoCluster } from '@/components/logo-cluster'
import { LogoTimeline } from '@/components/logo-timeline'
import { Map } from '@/components/map'
import Navbar3 from '@/components/navbar3'
import { Navbar4 } from '@/components/navbar4'
import { Screenshot } from '@/components/screenshot'
import { Testimonials } from '@/components/testimonials'
import { Heading, Subheading } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { FadeInUp, FadeInStagger } from '@/components/animations';
import { Star } from 'lucide-react';
import type { Metadata } from 'next'
import { SectionHeader } from '@/components/section-header'
import HeroFeature1 from '@/components/hero-feature1'
import BrokerFeature from '@/components/broker-feature'
import ManagementFeature from '@/components/management-feature'
import PropertyProfileCTA from '@/components/property-profile-cta'


export const metadata: Metadata = {
  description:
    'Radiant helps you sell more by revealing sensitive information about your customers.',
}

function Hero() {
  return (
    <div className="relative">
      {/* Background image */}
      <div 
        className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset bg-cover bg-center bg-no-repeat"
        style={{
          // backgroundImage: 'url(https://d1xt9s86fx9r45.cloudfront.net/assets/hl-production/assets/hlca/home/hero_desktop_wide-5b3707a057fa6298422d5dd72baea5c852a16db63d806cb0ea75eac6f86b6a7f.webp)'
          backgroundImage: 'url(/images/hero-bg.webp)'
        }}
      />
      {/* Gradient overlay */}
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset opacity-90" />
      <Container className="relative">
        {/* <Navbar
          banner={
            <Link
              href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
              className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
            >
              Radiant raises $100M Series A from Tailwind Ventures
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        /> */}
        <Navbar3 />
       {/* <Navbar4 />   */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
            <FadeInUp delay={0.2}>
              <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
                Close every deal.
              </h1>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
                Radiant helps you sell more by revealing sensitive information about
                your customers.
              </p>
            </FadeInUp>
            
            {/* Google Reviews Section */}
            <FadeInUp delay={0.5}>
              <div className="mt-8 flex items-center gap-x-4">
                <div className="flex items-center gap-x-2">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-950">Google</span>
                </div>
                <div className="flex items-center gap-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-950/75">4.9 out of 5</span>
              </div>
            </FadeInUp>
            {/* <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
              <Button href="#">Get started</Button>
              <Button variant="secondary" href="/pricing">
                See pricing
              </Button>
            </div> */}
            
          </div>
        
          <FadeInUp delay={0.6}>
            <div className="bg-background mb-10 shadow-lg h-[75%] p-10 w-100 border border-gray-200 rounded-sm  flex flex-col gap-y-4 items-center justify-center">
             
              <h2 className="text-2xl font-medium">How can we help?</h2>
              <p className="text-gray-500">Choose the plan that best fits your needs.</p>
              <Button className="w-full" href="/real-estate-buy">Looking to Buy</Button>
              <Button className="w-full" href="/real-estate-sell">Looking to Sell</Button>
              <Button className="w-full" href="#">Looking for Both</Button>
            </div>
          </FadeInUp>
        </div>
       
      </Container>
    </div>
  )
}

function FeatureSection() {
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <FadeInUp delay={0.2}>
          <Heading as="h2" className="max-w-3xl">
            A snapshot of your entire sales pipeline.
          </Heading>
        </FadeInUp>
        <FadeInUp delay={0.4}>
          <Screenshot
            width={1216}
            height={768}
            src="/screenshots/app.png"
            className="mt-16 h-144 sm:h-auto sm:w-304"
          />
        </FadeInUp>
      </Container>
    </div>
  )
}

function BentoSection() {
  return (
    <Container>
      <FadeInUp delay={0.2}>
        <Subheading>Sales</Subheading>
      </FadeInUp>
      <FadeInUp delay={0.4}>
        <Heading as="h3" className="mt-2 max-w-3xl">
          Know more about your customers than they do.
        </Heading>
      </FadeInUp>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <BentoCard
          eyebrow="Insight"
          title="Get perfect clarity"
          description="Radiant uses social engineering to build a detailed financial picture of your leads. Know their budget, compensation package, social security number, and more."
          graphic={
            <div className="h-80 bg-[url(/screenshots/profile.png)] bg-size-[1000px_560px] bg-position-[left_-109px_top_-112px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="Analysis"
          title="Undercut your competitors"
          description="With our advanced data mining, you’ll know which companies your leads are talking to and exactly how much they’re being charged."
          graphic={
            <div className="absolute inset-0 bg-[url(/screenshots/competitors.png)] bg-size-[1100px_650px] bg-position-[left_-38px_top_-73px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="lg:col-span-3 lg:rounded-tr-4xl"
        />
        <BentoCard
          eyebrow="Speed"
          title="Built for power users"
          description="It’s never been faster to cold email your entire contact list using our streamlined keyboard shortcuts."
          graphic={
            <div className="flex size-full pt-10 pl-10">
              <Keyboard highlighted={['LeftCommand', 'LeftShift', 'D']} />
            </div>
          }
          className="lg:col-span-2 lg:rounded-bl-4xl"
        />
        <BentoCard
          eyebrow="Source"
          title="Get the furthest reach"
          description="Bypass those inconvenient privacy laws to source leads from the most unexpected places."
          graphic={<LogoCluster />}
          className="lg:col-span-2"
        />
        <BentoCard
          eyebrow="Limitless"
          title="Sell globally"
          description="Radiant helps you sell in locations currently under international embargo."
          graphic={<Map />}
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
        />
      </div>
    </Container>
  )
}

function DarkBentoSection() {
  return (
    <div className="mx-2 mt-2 rounded-4xl bg-gray-900 py-32">
      <Container>
        <Subheading dark>Client Services</Subheading>
        <Heading as="h3" dark className="mt-2 max-w-3xl">
          Comprehensive real estate solutions powered by technology.
        </Heading>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <BentoCard
            dark
            eyebrow="Brokerage Services"
            title="Expert Real Estate Guidance"
            description="Our experienced agents leverage cutting-edge market analytics and AI-powered insights to help you buy or sell properties at optimal prices."
            graphic={
              <div className="h-80 bg-[url(/screenshots/networking.png)] bg-size-[851px_344px] bg-no-repeat" />
            }
            fade={['top']}
            className="max-lg:rounded-t-4xl lg:col-span-4 lg:rounded-tl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Technology Stack"
            title="Seamless Platform Integration"
            description="Connect with MLS systems, financial institutions, and property databases through our unified technology platform."
            graphic={<LogoTimeline />}
            // `overflow-visible!` is needed to work around a Chrome bug that disables the mask on the graphic.
            className="z-10 overflow-visible! lg:col-span-2 lg:rounded-tr-4xl"
          />
          <BentoCard
            dark
            eyebrow="Client Relations"
            title="Personalized Service"
            description="Dedicated account management with 24/7 support, ensuring every client receives tailored attention throughout their real estate journey."
            graphic={<LinkedAvatars />}
            className="lg:col-span-2 lg:rounded-bl-4xl"
          />
          <BentoCard
            dark
            eyebrow="Property Management"
            title="Complete Portfolio Solutions"
            description="From tenant screening to maintenance coordination, our comprehensive property management services maximize your investment returns with minimal effort."
            graphic={
              <div className="h-80 bg-[url(/screenshots/engagement.png)] bg-size-[851px_344px] bg-no-repeat" />
            }
            fade={['top']}
            className="max-lg:rounded-b-4xl lg:col-span-4 lg:rounded-br-4xl"
          />
        </div>
      </Container>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
       
        <div className="bg-linear-to-b from-white from-50% to-gray-100 py-32">
          <HeroFeature1/>
          <BrokerFeature/>  
          <ManagementFeature/>    
          {/* <BentoSection /> */}
        </div>
        <DarkBentoSection />
        <PropertyProfileCTA/> 
      </main>
      <Testimonials />
      <Footer />
    </div>
  )
}
