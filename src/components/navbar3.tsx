'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  PlayCircleIcon,
  PhoneIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline'
import { SparkleIcon } from 'lucide-react'



// Brokerage

// Buy Links
const buyLinks: Array<{
  name: string;
  description: string;
  href: string;
  icon: any;
  beta?: boolean;
}> = [
  {
    name: 'Overview',
    description: 'Step into the market with confidence using data-backed insights and expert guidance',
    href: '/buy',
    icon: ChartPieIcon,
  },
  {
    name: 'How We Buy',
    description: 'Search, analyze, negotiate, and close—we guide you through every step',
    href: '/buy#how-we-buy',
    icon: CursorArrowRaysIcon,
  },
  { 
    name: 'Buyer Services', 
    description: 'Market analysis, property tours, and contract-to-close support', 
    href: '/buy#buyer-services', 
    icon: FingerPrintIcon 
  },
  {
    name: 'Buyer FAQs',
    description: 'Common questions about financing, inspections, and closing',
    href: '/buy#faqs',
    icon: RectangleGroupIcon,
  },

  // {
  //   name: 'Investment Services',
  //   description: 'Expert guidance for real estate investment opportunities',
  //   href: '#',
  //   icon: SquaresPlusIcon,
  // },
]

// Sell Links
const sellLinks: Array<{
  name: string;
  description: string;
  href: string;
  icon: any;
  beta?: boolean;
}> = [
  {
    name: 'Overview',
    description: 'List smart and maximize your return with our pricing strategy',
    href: '/sell',
    icon: ChartPieIcon,
  },
  {
    name: 'How We Sell',
    description: 'Prep, market, negotiate, and close—transparent at every stage',
    href: '/sell#how-we-sell',
    icon: CursorArrowRaysIcon,
  },
  { 
    name: 'Seller Services', 
    description: 'Staging, marketing, offers, and contract-to-close support', 
    href: '/sell#seller-services', 
    icon: FingerPrintIcon 
  },
  {
    name: 'Seller FAQs',
    description: 'Common questions about timing, fees, and disclosures',
    href: '/sell#faqs',
    icon: RectangleGroupIcon,
    beta: false,
  },
  // {
  //   name: 'Investment Services',
  //   description: 'Expert guidance for real estate investment opportunities',
  //   href: '#',
  //   icon: SquaresPlusIcon,
  // },
]


const buyerCallsToAction = [
  { name: 'Get Started', href: '/questionnaire', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '/contact', icon: PhoneIcon },
  { name: 'View all services', href: '/buyer#services', icon: RectangleGroupIcon },
]

const sellerCallsToAction = [
  { name: 'Get Started', href: '/questionnaire', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '/contact', icon: PhoneIcon },
  { name: 'View all services', href: '/seller#services', icon: RectangleGroupIcon },
]


/// Property Management
const propertyManagementLinks = [
  {
    services: [
      { 
        name: 'Overview', 
        description: 'Comprehensive property management services for investors', 
        href: '/property-management', 
        icon: ChartPieIcon 
      },
      { 
        name: 'Single Family Management', 
        description: 'Thorough background checks and tenant verification services', 
        href: '#', 
        icon: CursorArrowRaysIcon 
      },
      { 
        name: 'Multifamily Management', 
        description: 'Vacancy reduction, turns, and building-level ops', 
        href: '#', 
        icon: FingerPrintIcon 
      },
      { 
        name: 'Pricing', 
        description: 'Simple, transparent pricing; what’s included at each tier', 
        href: '/property-management#pricing', 
        icon: SparkleIcon 
      },
      { 
        name: '24/7 Maintenance Services', 
        description: '24/7 maintenance coordination and emergency response', 
        href: '#', 
        icon: SquaresPlusIcon 
      },
      { 
        name: 'Owner Reporting & Statements', 
        description: 'Monthly statements, rent roll, year-end docs', 
        href: '#', 
        icon: ArrowPathIcon 
      },
   
    ],
    resources: [
      { 
        name: 'AI Rental Report', 
        description: 'Instant rent comps, vacancy trend, yield scenarios', 
        href: '/property-management', 
        icon: ChartPieIcon 
      },
      { 
        name: 'New Landlord Guide', 
        description: 'How to switch managers without disrupting tenants', 
        href: '#', 
        icon: CursorArrowRaysIcon 
      },
      { 
        name: 'Rent-Ready Checklist', 
        description: 'What to fix, clean, and document before listing', 
        href: '#', 
        icon: FingerPrintIcon 
      },
      { 
        name: 'PM FAQs', 
        description: 'Fees, pets, inspections, renewals, and notices—quick answers', 
        href: '#', 
        icon: SquaresPlusIcon 
      },
      { 
        name: 'Financial Reporting', 
        description: 'Detailed monthly reports and expense tracking', 
        href: '#', 
        icon: ArrowPathIcon 
      },
    ], 


  },
]
const propertyManagementCallsToAction = [
  { name: 'Get Started', href: '/questionnaire', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '/contact', icon: PhoneIcon },

]



function PropertyManagementNav({ onMouseEnter, onMouseLeave, isActive }: { onMouseEnter: () => void, onMouseLeave: () => void, isActive: boolean }) {
  return (
    <Popover className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <PopoverButton className="group inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white">
        <span>Property Management</span>
        <ChevronDownIcon aria-hidden="true" className="size-5 transition-transform duration-200 group-hover:rotate-180" />
      </PopoverButton>

      {isActive && (
        <PopoverPanel
          static
          className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 bg-transparent px-4 animate-in slide-in-from-top-1 duration-200"
        >
        <div className="w-screen max-w-4xl flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 p-10">
            <div className="grid space-y-1 gap-6 grid-cols-1 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">Services</h3>
              {propertyManagementLinks[0].services.map((item, index) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-white/5 animate-in slide-in-from-right-2 duration-300"
                >
                  <div className="mt-1 flex size-4 flex-none items-center justify-center rounded-sm bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
                    <item.icon
                      aria-hidden="true"
                      className="size-6 text-gray-600 group-hover:text-emerald-600 dark:text-gray-400 dark:group-hover:text-white"
                    />
                  </div>
                  <div>
                    <a href={item.href} className=" text-gray-900 dark:text-white">
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    {/* <p className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</p> */}
                  </div>
                </div>
              ))}
              </div>
              <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              {propertyManagementLinks[0].resources.map((item, index) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-sm p-4 hover:bg-gray-50 dark:hover:bg-white/5 animate-in slide-in-from-right-2 duration-300"
                >
                  <div className="mt-1 flex size-4 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
                    <item.icon
                      aria-hidden="true"
                      className="size-6 text-gray-600 group-hover:text-emerald-600 dark:text-gray-400 dark:group-hover:text-white"
                    />
                  </div>
                  <div>
                    <a href={item.href} className=" text-gray-900 dark:text-white">
                      {item.name}
                      <span className="absolute inset-0" />
                    </a>
                    {/* <p className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</p> */}
                  </div>
                </div>
              ))}
              </div>
              
            </div>
            
            {/* Client Portal Featured Section */}
            <div className="flex flex-col gap-4">
              <a href="#" className="relative overflow-hidden rounded-2xl bg-gray-700 hover:bg-gradient-to-br from-emerald-400 via-green-500 to-green-600  ease-in-out p-6 text-white animate-in slide-in-from-left-2 transition-all duration-300">
                <div className="relative z-10">
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                      Owner Access
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Owner Portal
                  </h3>
                  <p className="text-sm text-white/90 mb-4">
                    Access your property documents, maintenance requests, and financial reports securely.
                  </p>
                  <div className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors">
                    Login Now →
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-20">
                  <div className="size-24 rounded-full bg-white/10"></div>
                </div>
                <div className="absolute -top-2 -left-2 opacity-10">
                  <div className="size-16 rounded-full bg-white/20"></div>
                </div>
              </a>
              <a href="#" className="relative overflow-hidden rounded-2xl bg-gray-700 hover:bg-gradient-to-br from-emerald-400 via-green-500 to-green-600 p-6 text-white animate-in slide-in-from-left-2 duration-300">
                <div className="relative z-10">
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                      Resident Access
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Resident Portal
                  </h3>
                  <p className="text-sm text-white/90 mb-4">
                    Access your property documents, maintenance requests, and financial reports securely.
                  </p>
                  <div className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors">
                    Login Now →
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-20">
                  <div className="size-24 rounded-full bg-white/10"></div>
                </div>
                <div className="absolute -top-2 -left-2 opacity-10">
                  <div className="size-16 rounded-full bg-white/20"></div>
                </div>
              </a>

            </div>
         
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 dark:divide-white/10 dark:bg-gray-700/50 animate-in slide-in-from-bottom-2 duration-300">
            {propertyManagementCallsToAction.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50 animate-in slide-in-from-bottom-1 duration-200"
              >
                <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400 dark:text-gray-500" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
        </PopoverPanel>
      )}
    </Popover>
  )
}



export default function Navbar3() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<'buy' | 'sell' | 'property-mgmt' | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMenuEnter = (menu: 'buy' | 'sell' | 'property-mgmt') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveMenu(menu)
  }

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 100)
  }

  return (
    <header className="relative isolate z-10 ">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">MasterKey</span>
            {/* <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=600"
              className="h-8 w-auto dark:hidden"
            />
            */}
            <h1 className="text-3xl font-bold capitalize">MasterKey</h1> 
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=500"
              className="h-8 w-auto not-dark:hidden"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover onMouseEnter={() => handleMenuEnter('buy')} onMouseLeave={handleMenuLeave}>
            <PopoverButton className="group flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white">
              Buy
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
            </PopoverButton>

            {activeMenu === 'buy' && (
              <PopoverPanel
                static
                className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 bg-transparent px-4 animate-in slide-in-from-top-1 duration-200"
              >
        <div className="w-screen max-w-6xl flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
          <div className="grid grid-cols-4 gap-x-4 p-6 lg:grid-cols-4 xl:gap-x-6">
                  {buyLinks.map((item, index) => (
                    <div
                      key={item.name}
                      className="group relative rounded-lg p-6 text-sm/6 hover:bg-gray-50 dark:hover:bg-white/5 animate-in slide-in-from-left-2 duration-300"
                    >
                      <div className="flex size-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
                        <item.icon
                          aria-hidden="true"
                          className="size-6 text-gray-600 group-hover:text-sky-600 dark:text-gray-400 dark:group-hover:text-white"
                        />
                      </div>
                      <a href={item.href} className="mt-6 block font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {item.name}
                          {item.beta && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              Beta
                            </span>
                          )}
                        </div>
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  ))}
                  
                  {/* Featured Section */}
                  {/* <a href="/questionnaire" className="relative overflow-hidden rounded-2xl group bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-6 text-white animate-in slide-in-from-right-2 duration-300 hover:bg-blue-900 hover:text-white">
                    <div className="relative z-10">
                      <div className="mb-4">
                        <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                          New Feature
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <SparkleIcon className="w-5 h-5 group-hover:rotate-90 group-hover:text-white transition-transform duration-300" />
                        AI Property Insights
                      </h3>
                      <p className="text-sm text-white/90 mb-4">
                        Get instant market analysis and property recommendations powered by advanced AI.
                      </p>
                      <div  className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors">
                        Learn more →
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 opacity-20">
                      <div className="size-24 rounded-full bg-white/10"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 opacity-10">
                      <div className="size-16 rounded-full bg-white/20"></div>
                    </div>
                  </a> */}
                </div>
          <div className="grid grid-cols-3 divide-x divide-gray-900/5 bg-gray-50 dark:divide-white/10 dark:bg-gray-700/50 animate-in slide-in-from-bottom-2 duration-300">
            {buyerCallsToAction.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50 animate-in slide-in-from-bottom-1 duration-200"
              >
                <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400 dark:text-gray-500" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
              </PopoverPanel>
            )}
          </Popover>

          {/* Sell Nav Group */}
          <Popover onMouseEnter={() => handleMenuEnter('sell')} onMouseLeave={handleMenuLeave}>
            <PopoverButton className="group flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white">
              Sell
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
            </PopoverButton>

            {activeMenu === 'sell' && (
              <PopoverPanel
                static
                className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 bg-transparent px-4 animate-in slide-in-from-top-1 duration-200"
              >
        <div className="w-screen max-w-6xl flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 shadow-lg outline-1 outline-gray-900/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
          <div className="grid grid-cols-4 gap-x-4 p-6 lg:grid-cols-5 xl:gap-x-6">
                  {sellLinks.map((item, index) => (
                    <div
                      key={item.name}
                      className="group relative rounded-lg p-6 text-sm/6 hover:bg-gray-50 dark:hover:bg-white/5 animate-in slide-in-from-left-2 duration-300"
                    >
                      <div className="flex size-11 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
                        <item.icon
                          aria-hidden="true"
                          className="size-6 text-gray-600 group-hover:text-sky-600 dark:text-gray-400 dark:group-hover:text-white"
                        />
                      </div>
                      <a href={item.href} className="mt-6 block font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {item.name}
                          {item.beta && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              Beta
                            </span>
                          )}
                        </div>
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  ))}
                  
                  {/* Featured Section */}
                  <a href="/questionnaire" className="relative overflow-hidden rounded-2xl group bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-6 text-white animate-in slide-in-from-right-2 duration-300 hover:bg-blue-900 hover:text-white">
                    <div className="relative z-10">
                      <div className="mb-4">
                        <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                          New Feature
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <SparkleIcon className="w-5 h-5 group-hover:rotate-90 group-hover:text-white transition-transform duration-300" />
                        AI Property Insights
                      </h3>
                      <p className="text-sm text-white/90 mb-4">
                        Get instant market analysis and property recommendations powered by advanced AI.
                      </p>
                      <div  className="inline-flex items-center text-sm font-medium text-white hover:text-white/80 transition-colors">
                        Learn more →
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 opacity-20">
                      <div className="size-24 rounded-full bg-white/10"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 opacity-10">
                      <div className="size-16 rounded-full bg-white/20"></div>
                    </div>
                  </a>
                </div>
          <div className="grid grid-cols-3 divide-x divide-gray-900/5 bg-gray-50 dark:divide-white/10 dark:bg-gray-700/50 animate-in slide-in-from-bottom-2 duration-300">
            {sellerCallsToAction.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700/50 animate-in slide-in-from-bottom-1 duration-200"
              >
                <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400 dark:text-gray-500" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
              </PopoverPanel>
            )}
          </Popover>
          <PropertyManagementNav 
            onMouseEnter={() => handleMenuEnter('property-mgmt')} 
            onMouseLeave={handleMenuLeave}
            isActive={activeMenu === 'property-mgmt'}
          />
           <a href="/company" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
            Company
          </a>
          <a href="/contact" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
            Contact
          </a>
         
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=600"
                className="h-8 w-auto dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=sky&shade=500"
                className="h-8 w-auto not-dark:hidden"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                    Buy
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...buyLinks, ...buyerCallsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                    Sell
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...sellLinks, ...sellerCallsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Company
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}






