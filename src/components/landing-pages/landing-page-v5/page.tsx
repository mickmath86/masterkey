import { HeroSection } from "./sections/hero-section";
import CTA3 from "./components/cta3";
import AboutUsSection from "./sections/about-us";
import  WhyThisWorksSection  from "./sections/why-this-works";
import CTA2 from "./sections/cta2";
import Footer from './sections/footer'
import Testimonials  from "./components/testimonials";
import { Testimonial19 } from "@/components/testimonial19";


export default function LandingPageV5() {
    return (
    <>
        <HeroSection />
        <Testimonial19 />
        <CTA3/>
        <AboutUsSection />
        <Testimonials /> 
        <WhyThisWorksSection />
        <CTA2 /> 
        <Footer />
      
       
    </>
        
        
    )

}