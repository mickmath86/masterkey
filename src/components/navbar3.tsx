"use client";

import {
  ArrowUpRight,
  Building,
  Building2,
  ChevronLeft,
  ChevronRight,
  Home,
  Key,
  Menu,
  Search,
  DollarSign,
  FileText,
  Users,
  Award,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { useState } from "react";

import {
  Logo,
  LogoImageDesktop,
  LogoImageMobile,
} from "@/components/shadcnblocks/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const buyingSelling = [
  {
    title: "Home Buying Services",
    description: "Expert guidance through your home purchase journey.",
    href: "/real-estate-buy",
    icon: Home,
  },
  {
    title: "Home Selling Services", 
    description: "Maximize your property value with our selling expertise.",
    href: "/real-estate-sell",
    icon: Key,
  },
  {
    title: "Market Analysis",
    description: "Get comprehensive market insights and property valuations.",
    href: "/market-analysis",
    icon: Search,
  },
];

const propertyManagement = [
  {
    title: "Rental Management",
    href: "#",
    icon: Building2,
  },
  {
    title: "Tenant Screening",
    href: "#",
    icon: Users,
  },
  {
    title: "Maintenance Services",
    href: "#",
    icon: Building,
  },
  {
    title: "Financial Reporting",
    href: "#",
    icon: DollarSign,
  },
  {
    title: "Legal Compliance",
    href: "#",
    icon: FileText,
  },
  {
    title: "Property Marketing",
    href: "#",
    icon: Search,
  },
];

const aboutUs = [
  {
    title: "Our Team",
    href: "#",
    icon: Users,
  },
  {
    title: "Awards & Recognition",
    href: "#",
    icon: Award,
  },
  {
    title: "Service Areas",
    href: "#",
    icon: MapPin,
  },
  {
    title: "Contact Us",
    href: "#",
    icon: Phone,
  },
];

const documentationLinks = [
  {
    title: "External link",
    href: "#",
  },
  {
    title: "External link",
    href: "#",
  },
  {
    title: "External link",
    href: "#",
  },
  {
    title: "External link",
    href: "#",
  },
];

const resources = [
  {
    title: "Blog",
    description: "Vivamus ut risus accumsan, tempus sapien eget.",
    href: "#",
  },
  {
    title: "Guides",
    description: "In sapien tellus, sodales in pharetra a, mattis ac turpis.",
    href: "#",
  },
  {
    title: "News",
    description: "Maecenas eget orci ac nulla tempor tincidunt.",
    href: "#",
  },
];

const Navbar3 = () => {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<
    "buying-selling" | "property-management" | "about-us" | "resources" | null
  >(null);
  return (
    <section className=" inset-x-0 top-0 py-4 z-20">
      <div className="container">
        <NavigationMenu className="min-w-full">
          <div className="flex w-full items-center justify-between gap-12 py-4">
            {/* Logo */}
            <div>
              {(!open || !submenu) && (
                <>
                  <Logo url="https://shadcnblocks.com">
                    {/* <LogoImageDesktop
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo-word.svg"
                      className="h-7"
                      alt="Shadcn UI Navbar"
                    /> */}
                    <h1 className="text-2xl font-bold capitalize">MASTERKEY</h1>
                    <LogoImageMobile
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg"
                      className="h-7"
                      alt="Shadcn UI Navbar"
                    />
                  </Logo>
                </>
              )}
              {open && submenu && (
                <Button variant="outline" onClick={() => setSubmenu(null)}>
                  Back
                  <ChevronLeft className="ml-2 size-4" />
                </Button>
              )}
            </div>

            <NavigationMenuList className="hidden lg:flex">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Buying & Selling</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-8 lg:p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex items-start justify-between gap-8 lg:gap-x-12">
                    <NavigationMenuLink
                      href="#"
                      className="group w-1/3 max-w-[398px] p-0 hover:bg-transparent"
                    >
                      <div className="border-input bg-background overflow-clip rounded-lg border">
                        <div>
                          <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop"
                            alt="Real estate services"
                            className="h-[190px] w-[398px] object-cover object-center"
                          />
                        </div>
                        <div className="p-5 xl:p-8">
                          <div className="mb-2 text-base">
                            Real Estate Services
                          </div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Comprehensive buying and selling solutions for your property needs.
                          </div>
                        </div>
                      </div>
                    </NavigationMenuLink>
                    <div className="max-w-[760px] flex-1">
                      <div className="text-muted-foreground mb-6 text-xs uppercase tracking-widest">
                        Our Services
                      </div>
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                        {buyingSelling.map((service, index) => (
                          <NavigationMenuLink
                            key={index}
                            href={service.href}
                            className="group block p-4"
                          >
                            <div className="mb-5 group-hover:opacity-60">
                              <service.icon
                                className="text-foreground size-6"
                                strokeWidth={1.5}
                              />
                            </div>
                            <div className="text-foreground mb-2 text-base font-medium">
                              {service.title}
                            </div>
                            <div className="text-muted-foreground text-sm font-normal">
                              {service.description}
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Property Management</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-8 lg:p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex justify-between gap-8 lg:gap-x-[52px]">
                    <div className="w-1/2 max-w-[510px]">
                      <div className="text-muted-foreground mb-6 text-xs uppercase tracking-widest">
                        Management Services
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {propertyManagement.map((service, index) => (
                          <NavigationMenuLink
                            key={index}
                            href={service.href}
                            className="group flex flex-row items-center gap-5"
                          >
                            <div className="group-hover:opacity-60">
                              <service.icon
                                className="size-4 text-black"
                                strokeWidth={1}
                              />
                            </div>
                            <div className="text-base">{service.title}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                    <NavigationMenuLink
                      href="#"
                      className="group max-w-[604px] flex-1 p-0 hover:bg-transparent"
                    >
                      <div className="border-input bg-background flex h-full rounded-lg border p-0 hover:bg-transparent">
                        <div className="w-2/5 max-w-[310px] shrink-0 overflow-clip rounded-bl-lg rounded-tl-lg">
                          <img
                            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=300&h=200&fit=crop"
                            alt="Property management"
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-col p-5 xl:p-8">
                          <div className="text-muted-foreground mb-8 text-xs uppercase tracking-widest">
                            For Property Owners
                          </div>
                          <div className="mt-auto">
                            <div className="mb-4 text-xl">
                              Full-Service Property Management
                            </div>
                            <div className="text-muted-foreground text-sm font-normal">
                              Let us handle the day-to-day management of your investment properties.
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-8 lg:p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex justify-between gap-8 lg:gap-x-12">
                    <div className="w-1/2 max-w-[510px]">
                      <div className="text-muted-foreground mb-6 text-xs uppercase tracking-widest">
                        Learn About Us
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {aboutUs.map((item, index) => (
                          <NavigationMenuLink
                            key={index}
                            href={item.href}
                            className="group flex flex-row items-center gap-5"
                          >
                            <div className="group-hover:opacity-60">
                              <item.icon
                                className="size-4 text-black"
                                strokeWidth={1}
                              />
                            </div>
                            <div className="text-base">{item.title}</div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                    <div className="max-w-[604px] flex-1 space-y-6">
                      <NavigationMenuLink
                        href="#"
                        className="border-input bg-background flex flex-row items-center overflow-clip rounded-lg border p-0 hover:bg-transparent"
                      >
                        <div className="flex-1 p-5 xl:p-8">
                          <div className="mb-2 text-base">Our Story</div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Learn about our journey and commitment to exceptional real estate service.
                          </div>
                        </div>
                        <div className="h-[154px] max-w-[264px] shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=250&h=150&fit=crop"
                            alt="Our team"
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="#"
                        className="border-input bg-background flex flex-row items-center overflow-clip rounded-lg border p-0 hover:bg-transparent"
                      >
                        <div className="flex-1 p-5 xl:p-8">
                          <div className="mb-2 text-base">
                            Awards & Recognition
                          </div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Discover the awards and recognition we've received for our outstanding service.
                          </div>
                        </div>
                        <div className="h-[154px] max-w-[264px] shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=250&h=150&fit=crop"
                            alt="Awards"
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-8 lg:p-12 2xl:min-w-[calc(1400px-4rem)]">
                  <div className="flex gap-8 lg:gap-12">
                    <div className="flex flex-1 flex-col">
                      <div className="text-muted-foreground mb-6 text-xs uppercase tracking-widest">
                        Resources
                      </div>
                      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource, index) => (
                          <NavigationMenuLink
                            key={index}
                            href={resource.href}
                            className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex h-full flex-col overflow-clip rounded-lg border p-5 xl:p-8"
                          >
                            <div className="mt-auto">
                              <div className="mb-2 text-base">
                                {resource.title}
                              </div>
                              <div className="text-muted-foreground text-sm font-normal">
                                {resource.description}
                              </div>
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                    <div className="w-1/3 max-w-[404px]">
                      <div className="text-muted-foreground mb-6 text-xs uppercase tracking-widest">
                        Customers
                      </div>
                      <NavigationMenuLink
                        href="#"
                        className="border-input bg-background mb-6 flex flex-row overflow-clip rounded-lg border p-0 hover:bg-transparent"
                      >
                        <div className="flex-1 p-5 xl:p-8">
                          <div className="mb-2 text-base">Customers</div>
                          <div className="text-muted-foreground text-sm font-normal">
                            Integer a ipsum quis nisi posuere lobortis at id
                            tellus.
                          </div>
                        </div>
                        <div className="w-1/3 max-w-[130px] shrink-0">
                          <img
                            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                            alt="Placeholder image"
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="#"
                        className="bg-secondary/30 hover:bg-secondary/80 focus:bg-secondary/80 flex flex-row items-center gap-3 rounded-lg p-3"
                      >
                        <Badge variant="secondary">NEW</Badge>
                        <span className="text-secondary-foreground text-ellipsis text-sm">
                          Proin volutpat at felis in vehicula
                        </span>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <div className="hidden items-center gap-2 lg:flex">
              <Button variant="ghost">Login</Button>
              <Button variant="outline">
                Start now
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 lg:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label="Main Menu"
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

          {/* Mobile Menu (Root) */}
          {open && (
            <div className="border-border bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll border-t lg:hidden">
              <div>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu("buying-selling")}
                >
                  <span className="flex-1">Buying & Selling</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu("property-management")}
                >
                  <span className="flex-1">Property Management</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu("about-us")}
                >
                  <span className="flex-1">About Us</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
                <button
                  type="button"
                  className="border-border flex w-full items-center border-b px-8 py-7 text-left"
                  onClick={() => setSubmenu("resources")}
                >
                  <span className="flex-1">Resources</span>
                  <span className="shrink-0">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
              </div>
              <div className="mx-[2rem] mt-auto flex flex-col gap-4 py-12">
                <Button variant="outline" className="relative" size="lg">
                  Login
                </Button>
                <Button className="relative" size="lg">
                  Start now
                </Button>
              </div>
            </div>
          )}
          {/* Mobile Menu > Buying & Selling */}
          {open && submenu === "buying-selling" && (
            <div className="border-border bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll border-t lg:hidden">
              <a href="#" className="block space-y-6 px-8 py-8">
                <div className="w-full overflow-clip rounded-lg">
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                    alt="Placeholder image"
                    className="aspect-2/1 h-full w-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="mb-2 text-base">Platform Overview</div>
                  <div className="text-muted-foreground text-sm font-normal">
                    Pellentesque nec odio id elit dapibus rutrum.
                  </div>
                </div>
              </a>
              <div className="text-muted-foreground px-8 py-3.5 text-xs uppercase tracking-widest">
                Solutions
              </div>
              <div className="border-border border-t pb-16">
                {buyingSelling.map((service, index) => (
                  <a
                    key={index}
                    href={service.href}
                    className="border-border hover:bg-accent group flex w-full items-start gap-x-4 border-b px-8 py-7 text-left"
                  >
                    <div className="shrink-0">
                      <service.icon className="size-6" />
                    </div>
                    <div>
                      <div className="mb-1.5 text-base">{service.title}</div>
                      <div className="text-muted-foreground text-sm font-normal">
                        {service.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* Mobile Menu > Property Management */}
          {open && submenu === "property-management" && (
            <div className="bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll lg:hidden">
              <div className="text-muted-foreground px-8 py-3.5 text-xs uppercase tracking-widest">
                Property Management
              </div>
              <div>
                {propertyManagement.map((service, index) => (
                  <a
                    key={index}
                    href={service.href}
                    className="border-border hover:bg-accent group flex w-full items-start gap-x-4 border-t px-8 py-7 text-left"
                  >
                    <div className="shrink-0">
                      <service.icon className="size-6" />
                    </div>
                    <div className="text-base">{service.title}</div>
                  </a>
                ))}
              </div>
              <div className="bg-secondary/30 px-8 pb-16 pt-8">
                <div className="text-muted-foreground mb-7 text-xs uppercase tracking-widest">
                  For user persona
                </div>
                <a href="#" className="block space-y-6">
                  <div className="overflow-clip rounded-lg">
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                      alt="Placeholder image"
                      className="aspect-2/1 h-full w-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base">
                      Call to action for user persona
                    </div>
                    <div className="text-muted-foreground text-sm font-normal">
                      Etiam ornare venenatis neque, sit amet suscipit diam
                      pulvinar a.
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}
          {/* Mobile Menu > About Us */}
          {open && submenu === "about-us" && (
            <div className="border-border bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll border-t lg:hidden">
              <a href="#" className="block space-y-6 px-8 py-8">
                <div className="w-full overflow-clip rounded-lg">
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                    alt="Placeholder image"
                    className="aspect-2/1 h-full w-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="mb-2 text-base">Start with our API</div>
                  <div className="text-muted-foreground text-sm font-normal">
                    Head to our developer documentation for all the help you
                    need to embed our payments API.
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="border-border block space-y-6 border-t px-8 py-8"
              >
                <div className="w-full overflow-clip rounded-lg">
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                    alt="Placeholder image"
                    className="aspect-2/1 h-full w-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="mb-2 text-base">Quick Start</div>
                  <div className="text-muted-foreground text-sm font-normal">
                    Check out our quick-start guides, where you&apos;ll find
                    tips and tricks for everything payments.
                  </div>
                </div>
              </a>
              <div className="text-muted-foreground px-8 py-3.5 text-xs uppercase tracking-widest">
                Documentation
              </div>
              <div className="-mx-2.5 space-y-2.5 px-8 pb-16">
                {documentationLinks.map((documentationLink, index) => (
                  <NavigationMenuLink
                    key={index}
                    href={documentationLink.href}
                    className="py-[18px]focus:text-accent-foreground group flex flex-row items-center gap-2.5 rounded-md px-2.5"
                  >
                    <div className="flex size-5 items-center justify-center rounded">
                      <ArrowUpRight className="size-3" />
                    </div>
                    <div className="text-sm">{documentationLink.title}</div>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          )}
          {/* Mobile Menu > Resources */}
          {open && submenu === "resources" && (
            <div className="bg-background fixed inset-0 top-[72px] flex h-[calc(100vh-72px)] w-full flex-col overflow-scroll lg:hidden">
              <div className="text-muted-foreground px-8 py-3.5 text-xs uppercase tracking-widest">
                Resources
              </div>
              <div>
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.href}
                    className="border-border hover:bg-accent group flex w-full items-start gap-x-4 border-t px-8 py-7 text-left"
                  >
                    <div>
                      <div className="mb-1.5 text-base">{resource.title}</div>
                      <div className="text-muted-foreground text-sm font-normal">
                        {resource.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="px-8 pb-16 pt-8">
                <div className="text-muted-foreground mb-7 text-xs uppercase tracking-widest">
                  Customers
                </div>
                <a href="#" className="block space-y-6">
                  <div className="overflow-clip rounded-lg">
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                      alt="Placeholder image"
                      className="aspect-2/1 h-full w-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 text-base">Customers</div>
                    <div className="text-muted-foreground text-sm font-normal">
                      Meet the product teams changing how they process payments.
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}
        </NavigationMenu>
      </div>
    </section>
  );
};

export { Navbar3 };
