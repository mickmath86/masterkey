'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function TestStep9Page() {
  const [formData, setFormData] = useState({
    contactMethod: '', // 'email' or 'phone'
    email: '',
    phone: '',
    priceUpdates: false
  })
  
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value })
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handlePhoneChange = (value: string) => {
    // Basic phone formatting
    const cleaned = value.replace(/\D/g, '')
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    setFormData({ ...formData, phone: formatted })
  }

  const isFormValid = () => {
    if (formData.contactMethod === 'email') {
      return formData.email && validateEmail(formData.email) && !emailError
    } else if (formData.contactMethod === 'phone') {
      return formData.phone && formData.phone.length >= 10
    }
    return false
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    alert('Form submitted! Check console for data.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-2xl font-bold">Step 9 Test</h1>
                <p className="text-blue-100 mt-1">Simplified Contact Collection</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Step 9 of 9</div>
                <div className="w-32 bg-blue-500 rounded-full h-2 mt-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                  Where would you like us to send your report?
                </h3>
                <p className="text-gray-600 mb-2">
                  We'll send you a comprehensive market analysis and selling strategy for your property.
                </p>
                <p className="text-sm text-gray-500">
                  We respect your privacy and will NOT spam you. You'll only receive the report you requested.
                </p>
              </div>
              
              {/* Contact Method Selection */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, contactMethod: 'email', phone: '' })}
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.contactMethod === 'email'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">📧 Email</div>
                        <div className="text-sm text-gray-500">Send via email</div>
                      </div>
                      {formData.contactMethod === 'email' && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, contactMethod: 'phone', email: '' })}
                    className={`p-4 text-left border rounded-lg transition-all duration-200 ${
                      formData.contactMethod === 'phone'
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">📱 Text Message</div>
                        <div className="text-sm text-gray-500">Send via SMS</div>
                      </div>
                      {formData.contactMethod === 'phone' && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Email Input */}
                {formData.contactMethod === 'email' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="john.doe@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        emailError ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {emailError && (
                      <p className="text-red-600 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                )}

                {/* Phone Input */}
                {formData.contactMethod === 'phone' && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="555-123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      We'll send you a text message with a link to your report
                    </p>
                  </div>
                )}

                {/* Optional Price Updates Checkbox */}
                {(formData.contactMethod === 'email' || formData.contactMethod === 'phone') && (
                  <div className="animate-in slide-in-from-top-2 duration-300 delay-150">
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
                      <input
                        type="checkbox"
                        id="priceUpdates"
                        checked={formData.priceUpdates}
                        onChange={(e) => setFormData({ ...formData, priceUpdates: e.target.checked })}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="priceUpdates" className="text-sm text-gray-700">
                        <span className="font-medium">📈 Yes, I'd like to receive updates on price movements for my home</span>
                        <br />
                        <span className="text-gray-500">
                          Get notified when your home's estimated value changes (optional)
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-8 border-t border-gray-200">
            <div className="flex justify-between">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get My Report
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="p-4 bg-gray-100 border-t text-xs text-gray-600">
            <strong>Debug Info:</strong>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <p><strong>Form Valid:</strong> {isFormValid() ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
