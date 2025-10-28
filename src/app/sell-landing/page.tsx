'use client'

import { useState } from 'react'
import { ChevronRightIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'
import { FadeIn, FadeInUp } from '@/components/animations/fade-in'

const testimonials = [
  {
    quote: "MasterKey's AI valuation was spot-on with our appraisal, and we sold 15% above asking. Their technology made the whole process transparent and stress-free.",
    author: "Sarah Johnson",
    location: "Sold in Austin, TX",
    readMoreLink: "#"
  },
  {
    quote: "The instant home valuation gave us confidence in our pricing strategy. We had multiple offers within 48 hours of listing.",
    author: "Michael Chen",
    location: "Sold in Denver, CO", 
    readMoreLink: "#"
  },
  {
    quote: "Their AI-powered market analysis helped us time our sale perfectly. We got top dollar and closed on our timeline.",
    author: "Lisa Rodriguez",
    location: "Sold in Phoenix, AZ",
    readMoreLink: "#"
  },
  {
    quote: "No surprises, no hidden fees. The AI valuation was accurate and the whole team was incredibly professional throughout.",
    author: "David Thompson",
    location: "Sold in Seattle, WA",
    readMoreLink: "#"
  },
  {
    quote: "We didn't want the stress of pricing guesswork. MasterKey's technology took the uncertainty out of selling our home.",
    author: "Jennifer Martinez",
    location: "Sold in Miami, FL",
    readMoreLink: "#"
  }
]

const stats = [
  { value: "98%", label: "Customer satisfaction rate" },
  { value: "14 days", label: "Average time to close" },
  { value: "$50K+", label: "Average price above market" }
]

export default function SellLandingPage() {
  const [address, setAddress] = useState('')

  const handleGetOffer = () => {
    if (address.trim()) {
      window.location.href = `/questionnaire/listing-presentation?address=${encodeURIComponent(address)}`
    } else {
      window.location.href = '/questionnaire/listing-presentation'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar3 />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <Container className="relative">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInUp delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Make the easy move
              </h1>
            </FadeInUp>
            
            <FadeInUp delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                Get an AI-powered cash offer and explore the ways we can help you sell your home.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Enter your home address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleGetOffer()}
                  />
                  <Button
                    onClick={handleGetOffer}
                    className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
                  >
                    Get cash offer
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Free • No obligation • Get results in minutes
                </p>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span>Verified Reviews</span>
              </div>
            </FadeInUp>
          </div>
        </Container>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
                Start your sale with an offer in hand
              </h2>
              <p className="text-xl text-gray-700 text-center mb-16 max-w-3xl mx-auto">
                Skip the work with an AI-powered cash offer from MasterKey. Or list for more and use our offer as a backup plan.
              </p>
            </FadeInUp>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {stats.map((stat, index) => (
                <FadeInUp key={index} delay={0.1 * index}>
                  <div className="text-center p-6 rounded-xl bg-gray-50">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <div className="text-gray-700">{stat.label}</div>
                  </div>
                </FadeInUp>
              ))}
            </div>

            <FadeInUp>
              <div className="text-center bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <span className="text-blue-600">2,500+</span> and counting
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Every 3 minutes, a homeowner requests an offer from MasterKey.
                </p>
                <Button
                  onClick={handleGetOffer}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                >
                  Get cash offer
                </Button>
              </div>
            </FadeInUp>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <Container>
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Join our customers and move without the hassle
            </h2>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {testimonials.map((testimonial, index) => (
              <FadeInUp key={index} delay={0.1 * index}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600 mb-3">{testimonial.location}</div>
                    <a 
                      href={testimonial.readMoreLink}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                    >
                      Read more
                      <ChevronRightIcon className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ/Contact Section */}
      <section className="py-24 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <FadeInUp>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                We have answers.
              </h2>
              <p className="text-xl text-gray-700 mb-12">
                Tell us about your selling goals. We'll help you reach them.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 rounded-2xl p-8 text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your AI Valuation</h3>
                  <p className="text-gray-700 mb-6">
                    Our AI analyzes thousands of data points to give you an accurate home value in minutes.
                  </p>
                  <Button
                    onClick={handleGetOffer}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                  >
                    Start now
                  </Button>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-8 text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Speak with an Expert</h3>
                  <p className="text-gray-700 mb-6">
                    Get personalized advice from our real estate professionals about your selling strategy.
                  </p>
                  <Button
                    href="/contact"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
                  >
                    Contact us
                  </Button>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <div className="text-center">
                <p className="text-gray-600 mb-4">Questions? We're here to help.</p>
                <a 
                  href="mailto:hello@usemasterkey.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  hello@usemasterkey.com
                </a>
              </div>
            </FadeInUp>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  )
}
