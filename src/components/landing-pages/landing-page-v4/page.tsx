import { HeroSection } from "./sections/hero-section";
import  Content6  from "./sections/content-6";
import CTA3 from "./components/cta3";
import AboutUsSection from "./sections/about-us";
import  WhyThisWorksSection  from "./sections/why-this-works";
import FAQ from "./sections/faq";
import CTA2 from "./sections/cta2";
import Footer from './sections/footer'
import Testimonials  from "./components/testimonials";


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