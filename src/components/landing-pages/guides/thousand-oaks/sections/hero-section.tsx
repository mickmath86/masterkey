'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from "../../../landing-page-v4/sections/header"
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'

interface HeroFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

function HeroSectionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState<HeroFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState('')
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})

  // Capture UTM parameters on component mount
  useEffect(() => {
    const params: Record<string, string> = {}
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    
    utmKeys.forEach(key => {
      const value = searchParams.get(key)
      if (value) {
        params[key] = value
      }
    })
    
    setUtmParams(params)
  }, [searchParams])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation: require first name, last name, and at least email OR phone
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your first and last name')
      return
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setError('Please provide either an email or phone number')
      return
    }

    // Email validation if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address')
        return
      }
    }

    setIsSubmitting(true)

    try {
      const webhookUrl = 'https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/94a71d44-448e-4e77-8d2b-3e4b6938ed29'
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email || null,
            phone: formData.phone || null
          },
          metadata: {
            leadSource: 'Thousand Oaks Neighborhood Guide',
            guide: 'Thousand Oaks',
            submittedAt: new Date().toISOString(),
            ...utmParams
          }
        })
      })

      if (response.ok) {
        setSubmitSuccess(true)
        // Redirect to the scorecard page
        router.push('/landing/guides/thousand-oaks-guide')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Unable to submit form. Please try again.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof HeroFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  return (
    <>
      <Header />
      
      <main role="main" className="bg-muted/50">
        <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-40 max-w-2xl rounded-t-full bg-gradient-to-b via-amber-50 to-purple-100 blur-3xl"
          />
          
          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Form */}
            <div className="order-1 lg:order-1">
              <div className="mb-6">
                <p className="text-sky-600 font-semibold text-sm uppercase tracking-wide mb-2">
                  Free Neighborhood Guide
                </p>
                <h1 className="text-foreground font-bold text-4xl sm:text-5xl lg:text-6xl mb-4">
                  Discover the Best Neighborhoods in{' '}
                  <span className="text-sky-500">Thousand Oaks</span>
                </h1>
                <p className="text-muted-foreground text-lg sm:text-xl">
                  Get expert video reviews and detailed ratings for 10 neighborhoods. 
                  Download your free scorecard with ratings across 9 key categories.
                </p>
              </div>

              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 dark:bg-green-900/20 dark:border-green-800">
                  <h3 className="text-green-800 font-semibold text-lg mb-2 dark:text-green-200">
                    Success! Your guide is downloading...
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Check your downloads folder for the Thousand Oaks Neighborhood Guide. 
                    We'll also send you a copy via email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder="(805) 555-0123"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-900/20 dark:border-red-800">
                      <p className="text-red-700 text-sm dark:text-red-300">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Downloading...' : 'Download Free Guide'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center dark:text-gray-400">
                    * Email or phone required. We respect your privacy.
                  </p>
                </form>
              )}
            </div>

            {/* Right Column - Image */}
            <div className="order-2 lg:order-2">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl blur-2xl opacity-20"
                />
                <div className="relative bg-white rounded-xl shadow-2xl p-8 dark:bg-gray-800">
                  {/* Map image */}
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src="/images/thousand-oaks-map.png"
                      alt="Thousand Oaks Neighborhood Map"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Areas covered preview */}
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      10 Areas Covered:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Wildwood
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Conejo Oaks Area
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        North Central TO
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Northeast TO
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Hillcrest East
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Thousand Oaks South
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Sunset Hills
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Shadow Oaks
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Kevington
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                        Lynn Ranch
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export function HeroSection() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted/50" />}>
      <HeroSectionContent />
    </Suspense>
  )
}
