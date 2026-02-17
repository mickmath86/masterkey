import { Header } from "./sections/header"
import { HeroSection } from "./sections/hero-section"
import { VideoSection } from "./sections/video-section"
import ValueSection from "./sections/value-section"
import AboutUsSection from "./sections/about-us"
import Testimonials from "./components/testimonials"
import CTASection from "./sections/cta-section"
import Footer from './sections/footer'

export default function ThousandOaksGuide() {
  return (
    <>
      <Header />
      <HeroSection />
      {/* <VideoSection /> */}
      <ValueSection />
      <AboutUsSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  )
}
