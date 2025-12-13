import { HeroSection } from "./sections/hero-section";

import { SecondaryHero20 } from "./sections/secondary-hero-20";
import { SecondaryHero4 } from "./sections/secondary-hero-4";
import { FeaturesSection } from "./sections/features-12";
import { CallToAction } from "./components/call-to-action";
import { Testimonials } from "./components/testimonials-8";

import { FeaturesSection as HowItWorksSection }  from "./components/how-it-works-3";
import { ContentSection2 } from "./components/content-section2";
import { StatsSection } from "./sections/stats";
import { Process } from "./components/process";
import { FeaturesSection4 } from "./sections/features-4";
import { HeroSection as SecondaryHero11 } from "./sections/secondary-hero-11";
import { HomeStats } from "./sections/stats-4";

import { HouseHero } from "./sections/house-hero";
import { HeroSection as Hero2 } from "./sections/hero2";
import  Content6  from "./sections/content-6";

export default function LandingPageV4() {
    return (
    <>
        <HeroSection />
         <Content6 />
        <SecondaryHero20 />
        <CallToAction /> 
       
        <Testimonials /> 
        <HowItWorksSection />
    
        <HouseHero />
        <FeaturesSection4 />
    
        <Process />
       
        <FeaturesSection />
        
       
        <ContentSection2 />
        <StatsSection />
       
    </>
        
        
    )

}