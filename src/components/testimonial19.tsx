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
    name: "Sarah Johnson",
    role: "Homeowner",
    company: "Thousand Oaks, CA",
    content: "MasterKey made selling my home incredibly easy. The AI valuation was spot-on, and I received multiple offers within days. Highly recommend!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Real Estate Investor",
    company: "Los Angeles, CA",
    content: "The market insights and property analysis tools are game-changing. I've made smarter investment decisions and increased my portfolio value significantly.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "First-Time Buyer",
    company: "Ventura, CA",
    content: "As a first-time buyer, I was nervous about the process. MasterKey's platform gave me confidence with accurate valuations and transparent market data.",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Property Manager",
    company: "Santa Barbara, CA",
    content: "The rental estimate tools have been invaluable for pricing our properties competitively. We've reduced vacancy rates and maximized rental income.",
    rating: 5,
  },
  {
    name: "Jennifer Martinez",
    role: "Homeowner",
    company: "Camarillo, CA",
    content: "I was skeptical about AI valuations, but MasterKey proved me wrong. The detailed market analysis helped me price my home perfectly and sell quickly.",
    rating: 5,
  },
  {
    name: "Robert Kim",
    role: "Real Estate Agent",
    company: "Simi Valley, CA",
    content: "I use MasterKey for all my client presentations. The comprehensive property reports and market insights give my clients confidence in their decisions.",
    rating: 5,
  },
]

const Testimonial19 = ({
  className,
  heading = "What Our Clients Say",
  description = "Don't just take our word for it. Here's what real estate professionals and homeowners have to say about their experience with MasterKey.",
  testimonials = defaultTestimonials,
}: Testimonial19Props) => {
  return (
    <section className={cn("py-32 px-4 md:px-0", className)}>
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
