"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Gradient } from '@/components/gradient';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { Home, Key, Building, Users } from "lucide-react";

const serviceOptions = [
  {
    title: "Sell Real Estate",
    description: "Get top dollar for your property with expert pricing and marketing",
    icon: Key,
    href: "/questionnaire/real-estate-sell",
    color: "bg-green-500"
  },
  {
    title: "Buy Real Estate", 
    description: "Find your dream home with our expert agents and technology",
    icon: Home,
    href: "/real-estate-buy",
    color: "bg-blue-500"
  },
  {
    title: "Buy and Sell",
    description: "Complete solution for buying your next home while selling current",
    icon: Building,
    href: "/buy-and-sell",
    color: "bg-purple-500"
  },
  {
    title: "Property Management",
    description: "Professional management services for your investment properties",
    icon: Users,
    href: "/property-management", 
    color: "bg-orange-500"
  }
];

export default function QuestionnairePage() {
  const router = useRouter();

  const handleServiceSelection = (href: string) => {
    router.push(href);
  };

  return (
    <div className="h-screen flex">
      <div className="hidden md:flex w-1/2 justify-center items-center relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-bg.webp)'
          }}
        />
        <Gradient className="absolute inset-0 opacity-90" />
        
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="text-center text-white max-w-lg">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to MasterKey
            </h1>
            <p className="text-lg text-white/90">
              Your trusted partner for all real estate needs. Let us help you achieve your property goals.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              What can we help you with?
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Select the service you're interested in to get started
            </p>
          </div>

          <div className="space-y-4">
            {serviceOptions.map((option, index) => (
              <button
                key={option.title}
                onClick={() => handleServiceSelection(option.href)}
                className="w-full p-6 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${option.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {option.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Free consultation • Expert guidance • Trusted service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}