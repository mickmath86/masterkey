import { HeroSection } from "./components/hero-section";

import { SecondaryHero20 } from "./components/secondary-hero-20";
import { SecondaryHero4 } from "./components/secondary-hero-4";
import { FeaturesSection } from "./components/features-12";
import { CallToAction } from "./components/call-to-action";
import { Testimonials } from "./components/testimonials-8";


import { ContentSection } from "./components/content-5";
import { StatsSection } from "./components/stats-3";

export default function LandingPageV3() {
    return (
    <>
        <HeroSection />
        <SecondaryHero20 />
        {/* <SecondaryHero4 />   */}
        <FeaturesSection />
        <CallToAction /> 
        <Testimonials /> 
        <ContentSection />
        <StatsSection />
    </>
        
        
    )

}