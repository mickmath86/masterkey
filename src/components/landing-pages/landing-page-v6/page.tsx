import { HeroSection } from "./sections/hero-section";
import CTA3 from "./components/cta3";
import AboutUsSection from "./sections/about-us";
import  WhyThisWorksSection  from "./sections/why-this-works";
import CTA2 from "./sections/cta2";
import Footer from './sections/footer'
import Testimonials  from "./components/testimonials";


export default function LandingPageV6() {
    return (
    <>
        {/* <HeroSection /> */}
        <CTA3/>
        <AboutUsSection />
        <Testimonials /> 
        <WhyThisWorksSection />
        <CTA2 /> 
        <Footer />
      
       
    </>
        
        
    )

}