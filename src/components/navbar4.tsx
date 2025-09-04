"use client";

import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Book,
  Building,
  Building2,
  Calculator,
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  Computer,
  DollarSign,
  File,
  Flag,
  Gavel,
  Globe,
  Globe2,
  Lightbulb,
  Lock,
  Menu,
  Mic,
  Newspaper,
  Phone,
  PieChart,
  Play,
  PlayCircle,
  Puzzle,
  Pyramid,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  Speech,
  Table,
  UserPlus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const solutions = [
  {
    id: "solution-1",
    title: "Buy & Sell Services",
    description: "Expert guidance for buying and selling residential properties.",
    href: "/buy-and-sell",
    subpages: [
      {
        id: "subpage-1",
        title: "Home Buying",
        href: "/buy-house",
        icon: Building,
      },
      {
        id: "subpage-2",
        title: "Home Selling",
        href: "/sell-house",
        icon: DollarSign,
      },
      {
        id: "subpage-3",
        title: "Market Analysis",
        href: "/market-analysis",
        icon: Search,
      },
      {
        id: "subpage-4",
        title: "Property Valuation",
        href: "/property-valuation",
        icon: Calculator,
      },
      {
        id: "subpage-5",
        title: "Investment Properties",
        href: "/investment-properties",
        icon: PieChart,
      },
    ],
  },
  {
    id: "solution-2",
    title: "Property Management",
    description: "Comprehensive property management for landlords and investors.",
    href: "/property-management",
    subpages: [
      {
        id: "subpage-6",
        title: "Tenant Screening",
        href: "/tenant-screening",
        icon: Users,
      },
      {
        id: "subpage-7",
        title: "Rent Collection",
        href: "/rent-collection",
        icon: DollarSign,
      },
      {
        id: "subpage-8",
        title: "Maintenance Services",
        href: "/maintenance",
        icon: Building2,
      },
      {
        id: "subpage-9",
        title: "Financial Reporting",
        href: "/financial-reporting",
        icon: Table,
      },
      {
        id: "subpage-10",
        title: "Legal Compliance",
        href: "/legal-compliance",
        icon: Gavel,
      },
    ],
  },
  {
    id: "solution-3",
    title: "Commercial Real Estate",
    description: "Specialized services for commercial property transactions.",
    href: "/commercial",
    subpages: [
      {
        id: "subpage-11",
        title: "Office Leasing",
        href: "/office-leasing",
        icon: Building,
      },
      {
        id: "subpage-12",
        title: "Retail Spaces",
        href: "/retail-spaces",
        icon: Building2,
      },
      {
        id: "subpage-13",
        title: "Industrial Properties",
        href: "/industrial",
        icon: Building,
      },
      {
        id: "subpage-14",
        title: "Investment Analysis",
        href: "/investment-analysis",
        icon: Calculator,
      },
      {
        id: "subpage-15",
        title: "Portfolio Management",
        href: "/portfolio-management",
        icon: PieChart,
      },
    ],
  },
  {
    id: "solution-4",
    title: "Luxury Properties",
    description: "Exclusive services for high-end residential properties.",
    href: "/luxury",
    subpages: [
      {
        id: "subpage-16",
        title: "Luxury Listings",
        href: "/luxury-listings",
        icon: Building,
      },
      {
        id: "subpage-17",
        title: "Private Showings",
        href: "/private-showings",
        icon: UserRound,
      },
      {
        id: "subpage-18",
        title: "Concierge Services",
        href: "/concierge",
        icon: Phone,
      },
    ],
  },
];

const solutionTechnologies = [
  {
    id: "technology-1",
    title: "MLS Integration",
    href: "/mls-access",
    icon: Globe,
  },
  {
    id: "technology-2",
    title: "Virtual Tours",
    href: "/virtual-tours",
    icon: Play,
  },
  {
    id: "technology-3",
    title: "Client Portal",
    href: "/client-portal",
    icon: Computer,
  },
];

const productCategories = [
  {
    title: "Property Tools",
    products: [
      {
        id: "product-1",
        title: "Property Search",
        description: "Advanced search with MLS integration and custom filters.",
        href: "/property-search",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      },
      {
        id: "product-2",
        title: "Market Reports",
        description: "Comprehensive market analysis and trends.",
        href: "/market-reports",
        image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
      },
      {
        id: "product-3",
        title: "CMA Tool",
        description: "Comparative Market Analysis for accurate pricing.",
        href: "/cma-tool",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      },
    ],
  },
  {
    title: "Client Services",
    products: [
      {
        id: "product-4",
        title: "Client Portal",
        description: "Secure portal for document sharing and communication.",
        href: "/client-portal",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      },
      {
        id: "product-5",
        title: "Virtual Staging",
        description: "Professional virtual staging and photography services.",
        href: "/virtual-staging",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      },
    ],
  },
];

const globalCategories = [
  {
    title: "Investment Solutions",
    features: [
      {
        id: "feature-1",
        title: "Real Estate Investment",
        description: "Build wealth through strategic property investments.",
        href: "/investment",
        icon: Rocket,
      },
      {
        id: "feature-2",
        title: "Portfolio Diversification",
        description: "Expert guidance on building a diverse property portfolio.",
        href: "/portfolio",
        icon: Building2,
      },
      {
        id: "feature-3",
        title: "Market Expansion",
        description: "Expand your investments across multiple markets.",
        href: "/market-expansion",
        icon: Globe2,
      },
    ],
  },
  {
    title: "Professional Services",
    features: [
      {
        id: "feature-4",
        title: "Dedicated Agent",
        description: "Personal real estate agent for all your needs.",
        href: "/agents",
        icon: Phone,
      },
      {
        id: "feature-5",
        title: "Legal Support",
        description: "Real estate attorneys and legal compliance.",
        href: "/legal",
        icon: Gavel,
      },
      {
        id: "feature-6",
        title: "Investment Calculator",
        description: "Calculate potential returns on property investments.",
        href: "/calculator",
        icon: DollarSign,
      },
      {
        id: "feature-7",
        title: "Technology Platform",
        description: "Advanced tools for property search and management.",
        href: "/technology",
        icon: Computer,
      },
      {
        id: "feature-8",
        title: "Strategic Planning",
        description: "Long-term real estate investment strategies.",
        href: "/planning",
        icon: Flag,
      },
    ],
  },
];

const regions = [
  {
    title: "Metropolitan Areas",
    locations: [
      {
        title: "Downtown",
        href: "/areas/downtown",
        icon: "🏙️",
      },
      {
        title: "Suburbs",
        href: "/areas/suburbs",
        icon: "🏡",
      },
      {
        title: "Waterfront",
        href: "/areas/waterfront",
        icon: "🌊",
      },
      {
        title: "Historic District",
        href: "/areas/historic",
        icon: "🏛️",
      },
    ],
  },
  {
    title: "Property Types",
    locations: [
      {
        title: "Single Family",
        href: "/types/single-family",
        icon: "🏠",
      },
      {
        title: "Condominiums",
        href: "/types/condos",
        icon: "🏢",
      },
      {
        title: "Townhomes",
        href: "/types/townhomes",
        icon: "🏘️",
      },
      {
        title: "Luxury Estates",
        href: "/types/luxury",
        icon: "🏰",
      },
    ],
  },
  {
    title: "Investment Types",
    locations: [
      {
        title: "Rental Properties",
        href: "/investment/rental",
        icon: "🏠",
      },
      {
        title: "Commercial",
        href: "/investment/commercial",
        icon: "🏢",
      },
      {
        title: "Fix & Flip",
        href: "/investment/flip",
        icon: "🔨",
      },
      {
        title: "Land Development",
        href: "/investment/land",
        icon: "🌳",
      },
    ],
  },
  {
    title: "Price Ranges",
    locations: [
      {
        title: "Under $300K",
        href: "/price/under-300k",
        icon: "💰",
      },
      {
        title: "$300K - $600K",
        href: "/price/300k-600k",
        icon: "💵",
      },
      {
        title: "$600K - $1M",
        href: "/price/600k-1m",
        icon: "💸",
      },
      {
        title: "Luxury $1M+",
        href: "/price/luxury",
        icon: "💎",
      },
    ],
  },
];

const resources = [
  {
    id: "resource-1",
    title: "Market Events",
    description: "Real estate seminars and networking events.",
    href: "/events",
    icon: Calendar,
  },
  {
    id: "resource-2",
    title: "Property Podcast",
    description: "Weekly insights on real estate trends and investing.",
    href: "/podcast",
    icon: Mic,
  },
  {
    id: "resource-3",
    title: "Market Blog",
    description: "Latest market updates and real estate news.",
    href: "/blog",
    icon: Newspaper,
  },
  {
    id: "resource-4",
    title: "How-To Videos",
    description: "Step-by-step guides for buyers and sellers.",
    href: "/videos",
    icon: PlayCircle,
  },
  {
    id: "resource-5",
    title: "Buyer's Guide",
    description: "Complete guide to purchasing your first home.",
    href: "/buyers-guide",
    icon: Book,
  },
  {
    id: "resource-6",
    title: "Success Stories",
    description: "Client testimonials and case studies.",
    href: "/testimonials",
    icon: Lightbulb,
  },
];

const topicGroups = [
  {
    title: "First-Time Buyers",
    topics: [
      {
        id: "topic-1",
        title: "Home Buying Process",
        href: "/first-time-buyers",
        icon: Globe,
      },
      {
        id: "topic-2",
        title: "Mortgage Pre-Approval",
        href: "/mortgage-preapproval",
        icon: Rocket,
      },
      {
        id: "topic-3",
        title: "Home Inspection Tips",
        href: "/inspection-tips",
        icon: Pyramid,
      },
      {
        id: "topic-4",
        title: "Closing Process",
        href: "/closing-process",
        icon: ArrowRightLeft,
      },
      {
        id: "topic-5",
        title: "Moving Checklist",
        href: "/moving-checklist",
        icon: AppWindow,
      },
    ],
  },
  {
    title: "Community",
    topics: [
      {
        id: "topic-6",
        title: "Client Reviews",
        href: "/reviews",
        icon: Play,
      },
    ],
  },
];

const SolutionsMenu = () => (
  <div className="grid gap-8 sm:grid-cols-2">
    <a
      href="/buy-and-sell"
      className="bg-primary text-primary-foreground group relative flex h-full flex-row overflow-hidden rounded-lg px-0 pt-8 lg:rounded-xl lg:px-6"
    >
      <div className="relative flex w-full flex-col space-y-12 text-left md:space-y-8 lg:w-full lg:flex-row lg:justify-between lg:space-x-6 lg:space-y-0 xl:space-x-8">
        <div className="relative flex flex-col px-6 lg:mb-6 lg:px-0">
          <span className="mb-6 text-xs font-medium uppercase tracking-wider md:mb-8">
            Your Real Estate Journey
          </span>
          <div className="mt-auto flex items-center space-x-1 text-xs">
            Explore Our Services
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
          </div>
          <p className="text-primary-foreground/85 mt-2 text-xs">
            Expert guidance for buying, selling, and managing properties with cutting-edge technology and personalized service.
          </p>
        </div>
        <div className="aspect-2/1 relative overflow-clip rounded-t pl-6 lg:max-w-64 lg:pl-0 xl:max-w-96">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop"
            alt="Modern luxury home exterior"
            className="aspect-2/1 h-full w-full translate-y-px object-cover object-center"
          />
        </div>
      </div>
    </a>

    <div className="order-last mt-3 sm:order-none sm:mt-0 sm:py-2 md:p-6">
      <div className="mb-4 text-left leading-none md:col-span-2 lg:col-span-4 lg:mb-6">
        <strong className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wider">
          Technology Platform
        </strong>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {solutionTechnologies.map((technology) => (
          <NavigationMenuLink
            key={technology.id}
            href={technology.href}
            className="group flex flex-row items-center gap-4"
          >
            <technology.icon className="size-4" />
            <div className="flex-1 text-sm font-medium">{technology.title}</div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </div>
    </div>
    <div className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {solutions.map((solution) => (
        <div key={solution.id} className="border-border rounded-md border p-5">
          <div className="border-border border-b pb-4">
            <a href={solution.href} className="group flex flex-col text-left">
              <div className="flex items-center">
                <strong className="text-sm font-medium">
                  {solution.title}
                </strong>
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {solution.description}
              </p>
            </a>
          </div>
          <menu className="mt-6 grid gap-y-4">
            {solution.subpages.map((subpage) => (
              <NavigationMenuLink
                key={subpage.id}
                href={subpage.href}
                className="text-foreground/85 hover:text-foreground group flex flex-row items-center space-x-4 text-left lg:space-x-4 lg:border-0"
              >
                <subpage.icon className="size-4" />
                <div className="flex-1 text-sm font-medium">
                  {subpage.title}
                </div>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
              </NavigationMenuLink>
            ))}
          </menu>
        </div>
      ))}
    </div>
  </div>
);

const ProductsMenu = () => (
  <div className="grid gap-y-12 lg:flex lg:space-x-8">
    <div className="w-full shrink-0 lg:max-w-[18rem]">
      <a
        href="#"
        className="text-primary-foreground group relative flex h-full flex-row overflow-hidden rounded-lg px-0 lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col text-left">
          <div className="aspect-2/1 relative flex max-h-[11rem] w-full flex-1 justify-center">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg"
              alt="placeholder"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="bg-primary relative z-20 flex flex-col rounded-b-xl p-6">
            <div className="flex items-center space-x-1 text-xs">
              Enterprise Solutions
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-primary-foreground/70 mt-2 text-xs">
              Scale your business with enterprise-grade features and support.
            </p>
          </div>
        </div>
      </a>
    </div>
    <div className="grid w-full gap-y-12 lg:gap-y-6">
      {productCategories.map((category) => (
        <div key={category.title} className="grid gap-y-2 lg:gap-y-6">
          <div className="border-border text-left lg:border-b lg:pb-3">
            <strong className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wider">
              {category.title}
            </strong>
          </div>
          <menu className="grid md:grid-cols-3 md:gap-x-5 lg:gap-y-7">
            {category.products.map((product) => (
              <NavigationMenuLink
                key={product.id}
                href="#"
                className="border-border group flex flex-row items-center space-x-6 border-b py-5 text-left sm:py-7 lg:space-x-4 lg:border-0 lg:py-2"
              >
                <div className="relative flex aspect-square w-6 shrink-0 items-center justify-center overflow-clip rounded md:size-9 md:p-2">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="dark:invert"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-foreground/85 group-hover:text-foreground text-sm font-medium">
                    {product.title}
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground mt-1 text-xs">
                    {product.description}
                  </p>
                </div>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
              </NavigationMenuLink>
            ))}
          </menu>
        </div>
      ))}
    </div>
  </div>
);

const GlobalGuidanceMenu = () => (
  <div>
    <div className="space-y-6 lg:flex lg:space-x-8 lg:space-y-0">
      <div className="w-full shrink-0 lg:max-w-[18rem]">
        <a
          href="#"
          className="text-primary-foreground group relative flex h-full flex-row overflow-hidden rounded-lg p-0 lg:rounded-xl"
        >
          <div className="relative z-10 flex w-full flex-col-reverse text-left lg:flex-col">
            <div className="aspect-4/3 relative flex max-h-[18rem] w-full flex-1 justify-center">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg"
                alt="placeholder"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="bg-primary relative z-20 flex flex-col rounded-b-xl p-6">
              <div className="flex items-center space-x-1 text-xs">
                Enterprise Solutions
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-primary-foreground/85 mt-2 text-xs">
                Scale your business with enterprise-grade features and support.
              </p>
            </div>
          </div>
        </a>
      </div>
      <div className="grid w-full gap-y-12 lg:gap-y-6">
        {globalCategories.map((category) => (
          <div key={category.title} className="grid gap-y-2 lg:gap-y-6">
            <div className="border-border text-left lg:border-b lg:pb-3">
              <strong className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wider">
                {category.title}
              </strong>
            </div>
            <menu className="grid md:grid-cols-3 md:gap-x-6 lg:gap-y-6">
              {category.features.map((feature) => (
                <NavigationMenuLink
                  key={feature.id}
                  href="#"
                  className="border-border group flex flex-row items-center space-x-4 border-b py-5 text-left sm:py-7 lg:border-0 lg:py-0"
                >
                  <div className="flex aspect-square size-9 shrink-0 items-center justify-center">
                    <feature.icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground/85 group-hover:text-foreground text-sm font-medium">
                      {feature.title}
                    </div>
                    <p className="text-muted-foreground group-hover:text-foreground mt-1 text-xs">
                      {feature.description}
                    </p>
                  </div>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
                </NavigationMenuLink>
              ))}
            </menu>
          </div>
        ))}
      </div>
    </div>
    <div className="mt-8">
      <div className="border-border mb-6 pb-1 text-left lg:border-b">
        <strong className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wider">
          Popular Locations
        </strong>
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {regions.map((region) => (
          <div
            key={region.title}
            className="border-border space-y-6 rounded-md border p-6 lg:border-0 lg:p-0"
          >
            <div className="text-muted-foreground text-left text-xs">
              {region.title}
            </div>
            <menu className="border-border grid gap-y-3 border-t pt-6 lg:border-0 lg:pt-0">
              {region.locations.map((location) => (
                <NavigationMenuLink
                  key={location.title}
                  href={location.href}
                  className="text-foreground/85 hover:text-foreground group flex flex-row items-center space-x-4 text-left lg:space-x-4 lg:border-0 lg:py-0"
                >
                  <div className="flex size-4 items-center justify-center">
                    {location.icon}
                  </div>
                  <div className="flex-1 text-sm font-medium">
                    {location.title}
                  </div>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
                </NavigationMenuLink>
              ))}
            </menu>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PartnersMenu = () => (
  <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
    <div className="md:col-span-2">
      <a
        href="#"
        className="bg-primary text-primary-foreground group relative flex h-full flex-row overflow-hidden rounded-lg p-0 lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col-reverse text-left">
          <div className="relative z-20 flex flex-col px-6 pb-[14rem] pt-6 md:pb-6 md:pt-40">
            <div className="mt-auto flex items-center space-x-1 text-xs font-medium">
              Partner Program
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-xs">
              Join our partner network and grow your business with our leading
              productivity platform.
            </p>
          </div>
          <div className="bg-accent absolute inset-0 top-[32%] invert md:top-0">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
              alt="placeholder"
              className="object-fit object-top-right h-full w-full opacity-100 md:h-2/3 md:object-top"
            />
          </div>
        </div>
      </a>
    </div>
    <div className="md:col-span-1">
      <a
        href="#"
        className="bg-accent text-accent-foreground group relative flex h-full flex-row overflow-hidden rounded-lg p-0 lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col-reverse text-left">
          <div className="relative z-20 flex flex-col px-6 pb-[14rem] pt-6 md:pb-6 md:pt-40">
            <div className="mt-auto flex items-center space-x-1 text-xs font-medium">
              Solution Partners
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Build and deliver solutions that help customers achieve more.
            </p>
          </div>
          <div className="absolute inset-0 top-[32%] md:top-0">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg"
              alt="placeholder"
              className="object-fit object-top-right h-full w-full md:h-2/3 md:object-top"
            />
          </div>
        </div>
      </a>
    </div>
    <div className="grid gap-4 md:col-span-1">
      <NavigationMenuLink
        href="#"
        className="border-border group flex w-full flex-row items-center rounded-lg border lg:rounded-xl"
      >
        <div className="flex items-start p-6 text-left">
          <Users className="size-8" />
          <div className="ml-4">
            <div className="text-foreground/85 hover:text-foreground mb-1 mt-auto text-sm font-bold">
              Implementation Partners
            </div>
            <p className="text-muted-foreground group-hover:text-foreground text-xs">
              Velit incididunt duis id consequat elit.
            </p>
          </div>
        </div>
      </NavigationMenuLink>
      <NavigationMenuLink
        href="#"
        className="border-border group flex w-full flex-row items-center rounded-lg border lg:rounded-xl"
      >
        <div className="flex items-start p-6 text-left">
          <Computer className="size-8" />
          <div className="ml-4">
            <div className="text-foreground/85 hover:text-foreground mb-1 mt-auto text-sm font-bold">
              Technology Partners
            </div>
            <p className="text-muted-foreground group-hover:text-foreground text-xs">
              Consequat nulla ex culpa aliquip ad.
            </p>
          </div>
        </div>
      </NavigationMenuLink>
    </div>
  </div>
);

const ResourcesMenu = () => (
  <div className="grid gap-y-12 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-6">
    <div className="col-span-1">
      <a
        href="#"
        className="bg-primary text-primary-foreground group relative flex h-full flex-row overflow-hidden rounded-lg p-0 lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col-reverse text-left">
          <div className="relative z-20 flex flex-col px-6 pb-[14rem] pt-6 md:pb-6 md:pt-40">
            <div className="mt-auto flex items-center space-x-1 text-xs">
              Resource Center
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-xs">
              Access guides, tutorials, and best practices to maximize your
              success.
            </p>
          </div>
          <div className="absolute inset-0">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg"
              alt="placeholder"
              className="h-full w-full object-cover object-center invert"
            />
          </div>
          <div className="absolute inset-x-0 top-0 z-10 h-[60%] bg-[linear-gradient(hsl(var(--color-primary))_50%,transparent)] md:bottom-[-10%] md:top-auto md:h-[50%] md:bg-[linear-gradient(transparent,hsl(var(--color-primary))_50%)]"></div>
        </div>
      </a>
    </div>
    <div className="lg:col-span-2 lg:flex lg:flex-col">
      <div>
        <div className="border-border mb-4 pb-3 text-left md:mb-6 lg:border-b">
          <strong className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wider">
            Featured Resources
          </strong>
        </div>
      </div>
      <menu className="grid gap-y-4 lg:h-full lg:grid-cols-2 lg:gap-6">
        {resources.map((resource) => (
          <NavigationMenuLink
            key={resource.id}
            href={resource.href}
            className="border-border bg-accent lg:bg-background group flex flex-row items-center space-x-4 rounded-md px-6 py-5 text-left md:space-x-5 lg:border lg:p-5"
          >
            <resource.icon className="size-6 sm:size-7" />
            <div className="ml-4 flex-1">
              <div className="text-foreground/85 group-hover:text-foreground text-sm font-medium">
                {resource.title}
              </div>
              <p className="text-muted-foreground group-hover:text-foreground mt-1 text-xs">
                {resource.description}
              </p>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </menu>
    </div>
    <div className="col-span-1 md:col-span-2 lg:col-span-1">
      {topicGroups.map((group) => (
        <Fragment key={group.title}>
          <div className="border-border mb-4 pb-3 text-left md:col-span-2 md:mb-7 lg:border-b">
            <strong className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wider">
              Learning & Support
            </strong>
          </div>
          <menu className="mb-7 grid md:grid-cols-2 md:gap-x-6 lg:grid-cols-1 lg:gap-x-0">
            {group.topics.map((topic) => (
              <NavigationMenuLink
                key={topic.id}
                href={topic.href}
                className="border-border group flex flex-row items-center space-x-6 border-b py-5 text-left sm:py-8 lg:space-x-4 lg:border-0 lg:py-0"
              >
                <div className="flex aspect-square size-9 shrink-0 items-center justify-center">
                  <topic.icon className="size-5" />
                </div>
                <div className="text-foreground/85 group-hover:text-foreground flex-1 text-xs font-medium md:text-sm">
                  {topic.title}
                </div>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
              </NavigationMenuLink>
            ))}
          </menu>
        </Fragment>
      ))}
    </div>
  </div>
);

const navigationMenuItems = [
  {
    key: "solutions",
    label: "Solutions",
    component: SolutionsMenu,
  },
  {
    key: "products",
    label: "Products",
    component: ProductsMenu,
  },
  {
    key: "global",
    label: "Company",
    component: GlobalGuidanceMenu,
  },
  {
    key: "partners",
    label: "Partners",
    component: PartnersMenu,
  },
  {
    key: "resources",
    label: "Resources",
    component: ResourcesMenu,
  },
] as const;

const Navbar4 = () => {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<
    "solutions" | "products" | "global" | "partners" | "resources" | null
  >(null);

  return (
    <section className="bg-background inset-x-0 top-0 z-20">
      <div className="container">
        <NavigationMenu className="min-w-full [&>div:last-child]:left-auto">
          <div className="flex w-full justify-between gap-2 py-4">
            <a
              href="https://www.shadcnblocks.com"
              className="flex items-center gap-2"
            >
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                className="max-h-8 dark:invert"
                alt="Shadcn UI Navbar"
              />
              <span className="text-lg font-semibold tracking-tighter">
                Shadcnblocks.com
              </span>
            </a>
            <div className="flex items-center gap-2 xl:gap-8">
              <NavigationMenuList className="hidden gap-0 lg:flex">
                {navigationMenuItems.map((item) => (
                  <NavigationMenuItem key={item.key}>
                    <NavigationMenuTrigger className="text-xs xl:text-sm">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-12 2xl:min-w-[calc(1400px-4rem)]">
                      <item.component />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </div>
            <div className="flex items-center gap-2">
              <Button className="hidden md:block">Login</Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Main Menu"
                className="lg:hidden"
                onClick={() => {
                  if (open) {
                    setOpen(false);
                    setSubmenu(null);
                  } else {
                    setOpen(true);
                  }
                }}
              >
                {!open && <Menu className="size-4" />}
                {open && <X className="size-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {open && (
            <div className="border-border bg-background container fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-auto border-t lg:hidden">
              {submenu && (
                <div className="mt-3">
                  <Button
                    variant="link"
                    onClick={() => setSubmenu(null)}
                    className="relative -left-4"
                  >
                    <ArrowLeft className="size-4 text-xs" />
                    Go back
                  </Button>
                </div>
              )}
              {submenu === null && (
                <div>
                  {navigationMenuItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className="border-border flex w-full items-center border-b py-6 text-left"
                      onClick={() => setSubmenu(item.key)}
                    >
                      <span className="flex-1 text-sm font-medium">
                        {item.label}
                      </span>
                      <span className="shrink-0">
                        <ArrowRight className="size-4" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {navigationMenuItems.map(
                (item) =>
                  submenu === item.key && (
                    <div key={item.key}>
                      <h2 className="pb-6 pt-4 text-lg font-medium">
                        {item.label}
                      </h2>
                      <item.component />
                    </div>
                  ),
              )}
              {/* Mobile menu footer */}
              <div className="mx-[2rem] mt-auto flex flex-col items-center gap-8 py-24">
                <Button>Login</Button>
              </div>
            </div>
          )}
        </NavigationMenu>
      </div>
    </section>
  );
};

export { Navbar4 };
