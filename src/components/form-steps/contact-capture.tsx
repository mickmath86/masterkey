"use client";

import { useState, useEffect } from 'react';
import posthog from "posthog-js";

interface ImprovementDetail {
  improvement: string;
  yearsAgo?: number;
  cost?: number;
}

interface FormData {
  propertyAddress: string;
  sellingIntent: string;
  sellingTimeline: string;
  sellingMotivation: string;
  propertyCondition: string;
  propertyImprovements: string[];
  improvementDetails: ImprovementDetail[];
  priceExpectation: string;
  contactMethod: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  priceUpdates: boolean;
  privacyPolicyConsent: boolean;
}

interface ContactCaptureProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  emailError: string;
  handleEmailChange: (email: string) => void;
  handlePhoneChange: (phone: string) => void;
  handlePrivacyPolicyConsentChange: (consent: boolean) => void;
}

export default function ContactCapture({
  formData,
  setFormData,
  emailError,
  handleEmailChange,
  handlePhoneChange,
  handlePrivacyPolicyConsentChange
}: ContactCaptureProps) {
//   const [showTestVariant, setShowTestVariant] = useState(true);
  
//   useEffect(() => {
//     // Check PostHog feature flag after component mounts
//     if (typeof window !== 'undefined' && posthog) {
//       const flagValue = posthog.getFeatureFlag('form-field-test');
//       // 'test' variant shows alternative form, default shows control form
//       setShowTestVariant(flagValue === 'test');
//     }
//   }, []);


// posthog.featureFlags.overrideFeatureFlags({ flags: {'form-field-test': 'control'} })

    if (posthog.getFeatureFlag('form-field-test') === 'test') {
           return (
      <>
        <div>
          <h3 className="text-3xl font-semibold text-gray-900 mb-2">
            Let's get your contact information
          </h3>
          <p className="text-gray-600 mb-8">
            We'll use this information to provide you with a customized market analysis and selling strategy.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
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
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="555-123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Privacy Policy Consent */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="privacyConsent"
              checked={formData.privacyPolicyConsent}
              onChange={(e) => handlePrivacyPolicyConsentChange(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="privacyConsent" className="text-sm text-gray-700">
              I agree to the{' '}
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Privacy Policy
              </a>{' '}
              and consent to the collection and use of my personal information as described therein. *
            </label>
          </div>
        </div>
      </>
    );
   
    } else {
          return (
      <>
        <div>
          <h3 className="text-3xl font-semibold text-gray-900 mb-2">
            Where would you like us to send your report?
          </h3>
          <p className="text-gray-600 mb-2">
            We'll send you a comprehensive market analysis and selling strategy for your property.
          </p>
          {/* <p className="text-sm text-gray-500">
            We respect your privacy and will NOT spam you. You'll only receive the report you requested.
          </p> */}
        </div>
        
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-lg mr-2">🇺🇸</span>
                <span className="text-gray-500 text-sm">+1</span>
              </div>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="555-123-4567"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              We'll send you a text message with a link to your report
            </p>
          </div>

          {/* Optional Price Updates Checkbox */}
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
                  <span className="underline">We promise never to spam you.</span> Get notified when your home's estimated value changes (optional)
                </span>
              </label>
            </div>
          </div>
        </div>
      </>
    );
    }

//   if (showTestVariant) {
//     // Test Variant - Alternative form design
//     return (
//       <>
//         <div>
//           <h3 className="text-3xl font-semibold text-gray-900 mb-2">
//             Where would you like us to send your report?
//           </h3>
//           <p className="text-gray-600 mb-2">
//             We'll send you a comprehensive market analysis and selling strategy for your property.
//           </p>
//           <p className="text-sm text-gray-500">
//             We respect your privacy and will NOT spam you. You'll only receive the report you requested.
//           </p>
//         </div>
        
//         <div className="space-y-4">
//           {/* Contact Method Selection */}
//           <div className="grid grid-cols-2 gap-4">
//             <button
//               onClick={() => setFormData({ ...formData, contactMethod: 'email', phone: '' })}
//               className={`p-4 text-left border rounded-lg transition-all duration-200 ${
//                 formData.contactMethod === 'email'
//                   ? 'border-blue-500 bg-blue-50 text-blue-900'
//                   : 'border-gray-300 hover:border-gray-400 text-gray-900'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="font-medium">📧 Email</div>
//                   <div className="text-sm text-gray-500">Send via email</div>
//                 </div>
//                 {formData.contactMethod === 'email' && (
//                   <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                     <div className="w-2 h-2 bg-white rounded-full" />
//                   </div>
//                 )}
//               </div>
//             </button>

//             <button
//               onClick={() => setFormData({ ...formData, contactMethod: 'phone', email: '' })}
//               className={`p-4 text-left border rounded-lg transition-all duration-200 ${
//                 formData.contactMethod === 'phone'
//                   ? 'border-blue-500 bg-blue-50 text-blue-900'
//                   : 'border-gray-300 hover:border-gray-400 text-gray-900'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="font-medium">📱 Text Message</div>
//                   <div className="text-sm text-gray-500">Send via SMS</div>
//                 </div>
//                 {formData.contactMethod === 'phone' && (
//                   <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                     <div className="w-2 h-2 bg-white rounded-full" />
//                   </div>
//                 )}
//               </div>
//             </button>
//           </div>

//           {/* Email Input */}
//           {formData.contactMethod === 'email' && (
//             <div className="animate-in slide-in-from-top-2 duration-300">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={(e) => handleEmailChange(e.target.value)}
//                 placeholder="john.doe@example.com"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   emailError ? 'border-red-300' : 'border-gray-300'
//                 }`}
//               />
//               {emailError && (
//                 <p className="text-red-600 text-sm mt-1">{emailError}</p>
//               )}
//             </div>
//           )}

//           {/* Phone Input */}
//           {formData.contactMethod === 'phone' && (
//             <div className="animate-in slide-in-from-top-2 duration-300">
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number *
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <span className="text-lg mr-2">🇺🇸</span>
//                   <span className="text-gray-500 text-sm">+1</span>
//                 </div>
//                 <input
//                   type="tel"
//                   id="phone"
//                   value={formData.phone}
//                   onChange={(e) => handlePhoneChange(e.target.value)}
//                   placeholder="555-123-4567"
//                   className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 We'll send you a text message with a link to your report
//               </p>
//             </div>
//           )}

//           {/* Optional Price Updates Checkbox */}
//           {(formData.contactMethod === 'email' || formData.contactMethod === 'phone') && (
//             <div className="animate-in slide-in-from-top-2 duration-300 delay-150">
//               <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
//                 <input
//                   type="checkbox"
//                   id="priceUpdates"
//                   checked={formData.priceUpdates}
//                   onChange={(e) => setFormData({ ...formData, priceUpdates: e.target.checked })}
//                   className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="priceUpdates" className="text-sm text-gray-700">
//                   <span className="font-medium">📈 Yes, I'd like to receive updates on price movements for my home</span>
//                   <br />
//                   <span className="text-gray-500">
//                     <span className="underline">We promise never to spam you.</span> Get notified when your home's estimated value changes (optional)
//                   </span>
//                 </label>
//               </div>
//             </div>
//           )}
//         </div>
//       </>
//     );
//   } else {
//     // Control/Default - Standard form design
//     return (
//       <>
//         <div>
//           <h3 className="text-3xl font-semibold text-gray-900 mb-2">
//             Let's get your contact information
//           </h3>
//           <p className="text-gray-600 mb-8">
//             We'll use this information to provide you with a customized market analysis and selling strategy.
//           </p>
//         </div>
        
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name *
//               </label>
//               <input
//                 type="text"
//                 id="firstName"
//                 value={formData.firstName}
//                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                 placeholder="John"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name *
//               </label>
//               <input
//                 type="text"
//                 id="lastName"
//                 value={formData.lastName}
//                 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                 placeholder="Doe"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address *
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={(e) => handleEmailChange(e.target.value)}
//               placeholder="john.doe@example.com"
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                 emailError ? 'border-red-300' : 'border-gray-300'
//               }`}
//             />
//             {emailError && (
//               <p className="text-red-600 text-sm mt-1">{emailError}</p>
//             )}
//           </div>
          
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number *
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               value={formData.phone}
//               onChange={(e) => handlePhoneChange(e.target.value)}
//               placeholder="555-123-4567"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
          
//           {/* Privacy Policy Consent */}
//           <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
//             <input
//               type="checkbox"
//               id="privacyConsent"
//               checked={formData.privacyPolicyConsent}
//               onChange={(e) => handlePrivacyPolicyConsentChange(e.target.checked)}
//               className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="privacyConsent" className="text-sm text-gray-700">
//               I agree to the{' '}
//               <a 
//                 href="/privacy-policy" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-800 underline"
//               >
//                 Privacy Policy
//               </a>{' '}
//               and consent to the collection and use of my personal information as described therein. *
//             </label>
//           </div>
//         </div>
//       </>
//     );
//   }
}