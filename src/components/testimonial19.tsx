'use client'

import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

interface Testimonial19Props {
  className?: string
  heading?: string
  description?: string
  testimonials?: Testimonial[]
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Eric Etebari",
    role: "Property Owner",
    company: "Malibu / Ventura County, CA",
    content: "Working with Mark, Mike, and Keith at Mathias Real Estate Group has been a great experience. Navigating a sale in Malibu can feel overwhelming, but their team has made everything clear and easy to understand. They came in with a thoughtful strategy, strong local knowledge, and communication that actually makes you feel supported.",
    rating: 5,
    avatar: "/testimonials/eric-etibari.jpeg",
  },
  {
    name: "Todd Shillington",
    role: "Property Owner",
    company: "Ventura County, CA",
    content: "Mathias Real Estate Group is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!",
    rating: 5,
    avatar: "/testimonials/todd-shillington.png",
  },
  {
    name: "Kevin Marsden",
    role: "Real Estate Client",
    company: "Ventura County, CA",
    content: "Professional and excellent service. I highly recommend. The Mathias team can help you out with all your real estate and management needs.",
    rating: 5,
    avatar: "https://media.licdn.com/dms/image/v2/C5603AQGkWSPSxQVhRg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1646713829633?e=1778112000&v=beta&t=Fn6hfgive1V_sKVFKXNtGg9Fxl0ugoNxIeSTTpViPRg",
  },
  {
    name: "Steve Scherer",
    role: "Real Estate Client",
    company: "Ventura County, CA",
    content: "I always got the information I needed, and they were totally upfront about everything. Plus, their honesty and integrity made the whole process so much smoother. I highly recommend them!",
    rating: 5,
    avatar: "/testimonials/steve-scherer.jpeg",
  },
  {
    name: "Samir Akhter",
    role: "Real Estate Client",
    company: "Ventura County, CA",
    content: "Mark was very professional to work with. Always responsive and straightforward. It was a pleasure working with the team. Would highly recommend.",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXK6AUkgD2GbP4sO8zyMkbREz0BmcT8iv7zHn1SADPut7SY-5yX=w144-h144-p-rp-mo-br100",
  },
  
  
  {
    name: "Olivia Sellers",
    role: "Property Owner",
    company: "Ventura County, CA",
    content: "The team was quick to respond and handle maintenance issues and kept the property in great shape.",
    rating: 5,
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXoTdTHK7RWyQ5rrWbCxXxw3BWXl-bCq7MbVfdtDZcygFNod0kl=w144-h144-p-rp-mo-br100",
  },
  {
    name: "Javier Aguilera",
    role: "Property Management Client",
    company: "Ventura County, CA",
    content: "I highly recommend them not only as property managers but as brokers as well.",
    avatar: "/testimonials/javier-aguilera.png",
    rating: 5,
  },
  {
    name: "Mark Foley",
    role: "Property Management Client",
    company: "Ventura, CA",
    content: "Mark was incredibly kind and helpful during our long stay in Ventura. He was quick to answer any questions we had and offer suggestions for areas to explore. The Hilltop Drive apartment was clean and well-stocked with all we could need for a 6-month stay. I highly recommend working with Mark!",
    rating: 5,
  },
  {
    name: "Maria LaCanfora",
    role: "First-Time Buyer",
    company: "Ventura County, CA",
    content: "My husband and I had an absolutely amazing experience working with Mark at Mathias Real Estate Group. As first-time home buyers, we started out feeling overwhelmed, but Mark quickly put us at ease. He walked us through every step and made sure we always knew what to expect. We couldn't be happier with our new home.",
    rating: 5,
    
  },
]

const Testimonial19 = ({
  className,
  heading = "What Our Clients Say",
  description = "Don't just take our word for it. Here's what real estate professionals and homeowners have to say about their experience with Mathias Real Estate Group.",
  testimonials = defaultTestimonials,
}: Testimonial19Props) => {
  return (
    <section className={cn("py-16 px-4 md:px-0", className)}>
      <div className="container mx-auto">
        <div className="mb-14 flex flex-col items-center text-center">
          <h2 className="mb-3 text-4xl font-semibold lg:text-5xl">
            {heading}
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex h-full flex-col rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  
                  <p className="mb-6 flex-grow text-base leading-relaxed text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-lg font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-center gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

export { Testimonial19 }
