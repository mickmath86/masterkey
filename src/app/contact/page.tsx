'use client'

import { useState, useEffect } from 'react'
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Load calendar script when modal opens
  useEffect(() => {
    if (isCalendarModalOpen) {
      const script = document.createElement('script');
      script.src = 'https://link.msgsndr.com/js/form_embed.js';
      script.type = 'text/javascript';
      document.body.appendChild(script);
      
      return () => {
        // Cleanup script when modal closes
        const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [isCalendarModalOpen]);

  const handlePhoneClick = (phoneNumber: string) => {
    // Track conversion first
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17527173682/2s_nCLi7lZwbELLkzaVB',
        'value': 1.0,
        'currency': 'USD'
      });
    }
    
    // Then navigate to phone number (this preserves user gesture)
    window.location.href = phoneNumber;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        formType: 'contact-form',
        source: 'website'
      };

      const response = await fetch('https://services.leadconnectorhq.com/hooks/hXpL9N13md8EpjjO5z0l/webhook-trigger/aa5e62b9-da98-4e0a-9416-61183023caf4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
      <>
        <div className="relative isolate bg-white dark:bg-gray-900">
          <Navbar3 /> 
          <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
              <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2 dark:bg-gray-900 dark:ring-white/10">
                  <svg
                    aria-hidden="true"
                    className="absolute inset-0 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10"
                  >
                    <defs>
                      <pattern
                        x="100%"
                        y={-1}
                        id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                        width={200}
                        height={200}
                        patternUnits="userSpaceOnUse"
                      >
                        <path d="M130 200V.5M.5 .5H200" fill="none" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth={0} className="fill-white dark:fill-gray-900" />
                    <svg x="100%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-800/20">
                      <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                    </svg>
                    <rect fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" width="100%" height="100%" strokeWidth={0} />
                  </svg>
                  <div
                    aria-hidden="true"
                    className="absolute top-[calc(100%-13rem)] -left-56 hidden transform-gpu blur-3xl lg:top-[calc(50%-7rem)] lg:left-[max(-14rem,calc(100%-59rem))] dark:block"
                  >
                    <div
                      style={{
                        clipPath:
                          'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
                      }}
                      className="aspect-1155/678 w-288.75 bg-linear-to-br from-[#80caff] to-[#4f46e5] opacity-10 dark:opacity-20"
                    />
                  </div>
                </div>
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                  Get in touch
                </h2>
                <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
                  We'd love to hear from you! Whether you have questions about our real estate services, need assistance with property management, or want to discuss investment opportunities, our team is here to help.
                </p>
                <dl className="mt-10 space-y-4 text-base/7 text-gray-600 dark:text-gray-300">
                  <div className="flex gap-x-4">
                    <dt className="flex-none">
                      <span className="sr-only">Address</span>
                      <BuildingOffice2Icon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                    </dt>
                    <dd>
                      1000 Business Center Circle #112
                      <br />
                      Thousand Oaks, CA
                    </dd>
                  </div>
                  <div className="flex gap-x-4">
                    <dt className="flex-none">
                      <span className="sr-only">Telephone</span>
                      <PhoneIcon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                    </dt>
                    <dd>
                      <Button 
                        variant="link" 
                        className="text-gray-900 dark:text-white p-0 h-auto font-normal" 
                        onClick={() => handlePhoneClick('tel:+1 (805) 410-8748')}
                      >
                        +1 (805) 410-8748
                      </Button>
                      
                    </dd>
                  </div>
                  <div className="flex gap-x-4">
                    <dt className="flex-none">
                      <span className="sr-only">Email</span>
                      <EnvelopeIcon aria-hidden="true" className="h-7 w-6 text-gray-400" />
                    </dt>
                    <dd>
                      <a href="mailto:hello@usemasterkey.com" className="hover:text-gray-900 dark:hover:text-white">
                        mike@usemasterkey.com
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500"
                    onClick={() => setIsCalendarModalOpen(true)}
                  >
                    Schedule a Zoom
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-sky-600 shadow-xs ring-1 ring-inset ring-sky-600 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-gray-800 dark:text-sky-400 dark:ring-sky-400 dark:hover:bg-gray-700"
                    onClick={() => {
                      // Add your chat integration here (e.g., Intercom, Zendesk Chat, etc.)
                      console.log('Chat now clicked');
                    }}
                  >
                    Chat Now
                  </button>
                </div>
                <dl className="hidden">
                </dl>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48">
              <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                      First name
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="first-name"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                      Last name
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="last-name"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                      Email
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                      Phone number
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="phone-number"
                        name="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                      Message
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-sky-500"
                      />
                    </div>
                  </div>
                </div>
                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">
                      Sorry, there was an error sending your message. Please try again or contact us directly.
                    </p>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-sky-600 hover:bg-sky-500 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus-visible:outline-sky-500'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Calendar Modal */}
        {isCalendarModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-scroll">
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-white/20 backdrop-blur-sm transition-all duration-300"
                onClick={() => setIsCalendarModalOpen(false)}
              />
              
              {/* Modal Content */}
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Schedule a Zoom Call
                  </h3>
                  <button
                    onClick={() => setIsCalendarModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Calendar Iframe - Scrollable */}
                <div className="flex-1 overflow-hidden p-6">
                  <div className="w-full min-h-[600px]">
                    <iframe 
                      src="https://api.leadconnectorhq.com/widget/booking/dC0pazbNghUa1xKcbXiY" 
                      style={{ 
                        width: '100%', 
                        height: '800px',
                        border: 'none'
                      }} 
                      scrolling="yes" 
                      id="dC0pazbNghUa1xKcbXiY_1759871109473"
                      title="Schedule Appointment"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
}

export default function ContactPage() {
return (
    <>
    <ContactForm/>
    <Footer/>
    </>
  )
}
