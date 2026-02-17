'use client'

import { useState } from 'react'
import OurTeam from '../components/our-team'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


const timeline = [
  {
    name: 'Founded company',
    description:
      'Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.',
    date: 'Aug 2021',
    dateTime: '2021-08',
  },
  {
    name: 'Secured $65m in funding',
    description:
      'Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.',
    date: 'Dec 2021',
    dateTime: '2021-12',
  },
  {
    name: 'Released beta',
    description:
      'Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.',
    date: 'Feb 2022',
    dateTime: '2022-02',
  },
  {
    name: 'Global launch of product',
    description:
      'Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.',
    date: 'Dec 2022',
    dateTime: '2022-12',
  },
]


export default function AboutUsSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-900">
  

      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10 overflow-hidden bg-linear-to-b from-sky-100/20 pt-14 dark:from-sky-950/10">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-sky-600/10 ring-sky-50 sm:-mr-80 lg:-mr-96 dark:bg-gray-800/30 dark:shadow-sky-400/10 dark:ring-white/5"
          />
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl lg:col-span-2 xl:col-auto dark:text-white">
                We’re a passionate group of people building the future of real estate
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                  We believe selling your home should be backed by data, not guesswork. That's why we created the 
                  Verified Value Guarantee — a comprehensive approach that combines professional appraisals, strategic 
                  pricing, and performance-based accountability to deliver results you can trust.
                </p>
              </div>
              <img
                alt="Beautiful homes in Thousand Oaks"
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80"
                className="mt-10 aspect-6/5 w-full max-w-lg rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5 sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36 dark:outline-white/10"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32 dark:from-gray-900" />
        </div>

        {/* Timeline section */}
        <div className="mx-auto -mt-8 max-w-7xl px-6 lg:px-8">
          {/* <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {timeline.map((item) => (
              <div key={item.name}>
                <time
                  dateTime={item.dateTime}
                  className="flex items-center text-sm/6 font-semibold text-sky-600 dark:text-sky-400"
                >
                  <svg viewBox="0 0 4 4" aria-hidden="true" className="mr-4 size-1 flex-none">
                    <circle r={2} cx={2} cy={2} fill="currentColor" />
                  </svg>
                  {item.date}
                  <div
                    aria-hidden="true"
                    className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0 dark:bg-white/15"
                  />
                </time>
                <p className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900 dark:text-white">{item.name}</p>
                <p className="mt-1 text-base/7 text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div> */}
        </div>

        

        
        <OurTeam />
   

        {/* Stats */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
              We approach work as a place to make the world better
            </h2>
            <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-300">
              Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est non placerat nam arcu.
              Cras purus nibh cursus sit eu in id. Integer vel nibh.
            </p>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10">
              <p className="flex-none text-3xl font-bold tracking-tight text-gray-900 dark:text-white">6</p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                  States we've conducted real estate transactions
                </p>
                <p className="mt-2 text-base/7 text-gray-600 dark:text-gray-300">
                  Combined expertise across real estate, construction, and property management.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44 dark:bg-gray-700 dark:inset-ring dark:inset-ring-white/10">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">$150 Million</p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-white">
                 Total Transaction Volume
                </p>
                <p className="mt-2 text-base/7 text-gray-400 dark:text-gray-300">
                  Successfully closed deals representing over $150 million in real estate value.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-sky-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28 dark:inset-ring dark:inset-ring-white/10">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">70+</p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-white">Years of combined real estate experience</p>
                <p className="mt-2 text-base/7 text-sky-200 dark:text-sky-100">
                  Decades of market knowledge, negotiation expertise, and proven results across residential and commercial properties.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Logo cloud */}
        <div className="mx-auto my-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:inset-ring dark:after:inset-ring-white/10 dark:after:sm:rounded-3xl">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our customers love us
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg/8 text-gray-300">
              Sellers choose us because we remove the uncertainty from the process. Our Verified Value Guarantee 
              means you know exactly what to expect — no guessing, no hoping, just results.
            </p>
          
            <div aria-hidden="true" className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl">
              <div
                style={{
                  clipPath:
                    'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                }}
                className="aspect-1404/767 w-351 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-25"
              />
            </div>
          </div>
        </div>   
     </main>
    </div>
  )
}
