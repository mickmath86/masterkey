import { HeroSection } from "./sections/hero-section";
import  Content6  from "./sections/content-6";
import CTA3 from "./components/cta3";
import { CallToAction } from "./components/call-to-action";
import AboutUsSection from "./sections/about-us";
import  WhyThisWorksSection  from "./sections/why-this-works";
import FAQ from "./sections/faq";
import CTA2 from "./sections/cta2";
import Footer from './sections/footer'
import { FeaturesSection } from "./sections/features-12";

import Testimonials  from "./components/testimonials";

import { FeaturesSection as HowItWorksSection }  from "./components/how-it-works-3";
import { ContentSection2 } from "./components/content-section2";
import { StatsSection } from "./sections/stats";
import { Process } from "./components/process";
import { FeaturesSection4 } from "./sections/features-4";
import { HeroSection as SecondaryHero11 } from "./sections/secondary-hero-11";
import { HomeStats } from "./sections/stats-4";

import { HouseHero } from "./sections/house-hero";
import { HeroSection as Hero2 } from "./sections/hero2";


export default function LandingPageV4() {
    return (
    <>
        <HeroSection />
        <Content6 />
        <CTA3/>
        <AboutUsSection />
        <Testimonials /> 
        <WhyThisWorksSection />
        <FAQ/>
        <CTA2 /> 
        <Footer />
      
       
    </>
        
        
    )

}