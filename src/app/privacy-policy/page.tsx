"use client";

import { Gradient } from '@/components/gradient';
import { Button } from '@/components/button';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-white">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-inset ring-black/5" />
      
      <div className="relative">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="mx-auto max-w-4xl">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  use our services, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Property information (addresses, property details, preferences)</li>
                  <li>Communication preferences and marketing consent</li>
                  <li>Usage data and analytics information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>With your consent or at your direction</li>
                  <li>With third-party vendors, consultants, and service providers</li>
                  <li>To comply with laws, regulations, or legal requests</li>
                  <li>To protect the rights, property, and safety of MasterKey and others</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We take reasonable measures to help protect your personal information from loss, 
                  theft, misuse, and unauthorized access, disclosure, alteration, and destruction. 
                  However, no internet or electronic storage system is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We store your information for as long as necessary to provide our services, 
                  comply with legal obligations, resolve disputes, and enforce our agreements. 
                  We may retain certain information even after you close your account if required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
                <p className="text-gray-700 mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Access and update your information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to collect and track information 
                  about your use of our services. You can control cookies through your browser settings, 
                  but disabling cookies may affect the functionality of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
                <p className="text-gray-700 mb-4">
                  Our services may contain links to third-party websites or integrate with third-party 
                  services. We are not responsible for the privacy practices of these third parties. 
                  We encourage you to read their privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our services are not intended for children under 13 years of age. We do not 
                  knowingly collect personal information from children under 13. If we become 
                  aware that we have collected such information, we will take steps to delete it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this privacy policy from time to time. We will notify you of any 
                  changes by posting the new privacy policy on this page and updating the "Last updated" 
                  date. Your continued use of our services after any changes constitutes acceptance 
                  of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this privacy policy or our privacy practices, 
                  please contact us at:
                </p>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>MasterKey</strong><br />
                    Email: info@masterkey.com<br />
                    Phone: 805-262-9707<br />
                    Address: 1000 Business Circle, Suite 112, Newbury Park, CA 91320
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
