import { Hulu } from './logos/hulu'
import { TailwindCSS } from './logos/tailwindcss'
import { Stripe } from './logos/stripe'


const TESTIMONIALS = [
    {
        name: 'Todd Shillington',
        role: 'Property Owner',
        avatar: 'https://images.unsplash.com/photo-1560170412-0f7df0eb0fb1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2296',
        testimonial: 'MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!',
    },
    {
        name: 'Kevin Marsden',
        role: 'Real Estate Client',
        avatar: 'https://images.unsplash.com/photo-1526363269865-60998e11d82d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370',
        testimonial: 'Professional and excellent service. I highly recommend. The Mathias team can help you out with all you real estate and management needs.',
    },
    {
        name: 'Javier Aguilera',
        role: 'Property Owner',
        avatar: 'https://images.unsplash.com/photo-1606788075819-9574a6edfab3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2368',
        testimonial: 'I highly recommend them not only as property managers but as brokers as well.',
    },
    {
        name: 'Steve Scherer',
        role: 'Real Estate Client',
        avatar: 'https://images.unsplash.com/photo-1542644425-bc949ec841a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287',
        testimonial: 'I always got the information I needed, and they were totally upfront about everything. Plus, their honesty and integrity made the whole process so much smoother. I highly recommend them!',
    },
    {
        name: 'Samir Akhter',
        role: 'Property Owner',
        avatar: 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370',
        testimonial: 'Mark was very professional to work with. Always responsive and straightforward. It was a pleasure working with the team. Would highly recommend.',
    },
    {
        name: 'Olivia Sellers',
        role: 'Property Owner',
        avatar: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370',
        testimonial: 'The team was quick to respond and handle maintenance issues and kept the property in great shape.',
    },
]

export function Testimonials() {
    return (
        <section
            id="reviews"
            className="bg-muted/50 py-12 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-balance text-center">
                    <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">What our clients are saying about MasterKey</h2>
                    <p className="text-muted-foreground mb-6 md:mb-12 lg:mb-16">Join the growing number of property owners who trust MasterKey for their real estate and property management needs.</p>
                </div>
                <div className="rounded-(--radius) border-border/50 relative lg:border">
                    <div className="lg:*:nth-4:rounded-r-none lg:*:nth-5:rounded-br-none lg:*:nth-6:rounded-b-none lg:*:nth-5:rounded-tl-none lg:*:nth-3:rounded-l-none lg:*:nth-2:rounded-tl-none lg:*:nth-2:rounded-br-none lg:*:nth-1:rounded-t-none grid gap-4 sm:grid-cols-2 sm:grid-rows-4 lg:grid-cols-3 lg:grid-rows-3 lg:gap-px">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <TestimonialCard
                                key={index}
                                name={testimonial.name}
                                role={testimonial.role}
                                avatar={testimonial.avatar}
                                testimonial={testimonial.testimonial}
                            />
                        ))}

                        <div className="max-lg:rounded-(--radius) lg:rounded-tl-(--radius) lg:rounded-br-(--radius) bg-card ring-foreground/5 row-start-1 flex flex-col justify-between gap-6 border border-transparent p-8 shadow-lg shadow-black/10 ring-1 lg:col-start-1">
                            <div className="space-y-6">
                                <TailwindCSS
                                    height={20}
                                    width={136}
                                />
                                <p>"MasterKey transformed our property investment strategy. Their comprehensive market analysis and professional guidance helped us maximize our returns while minimizing our stress throughout the entire process."</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                                    <img
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=460&h=460&q=80"
                                        alt="Michael Thompson"
                                        className="h-full w-full object-cover"
                                        width={460}
                                        height={460}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="space-y-px">
                                    <p className="text-sm font-medium">Michael Thompson</p>
                                    <p className="text-muted-foreground text-xs">Property Investor</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-(--radius) bg-card ring-foreground/5 row-start-3 flex flex-col justify-between gap-6 border border-transparent p-8 shadow-lg shadow-black/10 ring-1 sm:col-start-2 lg:row-start-2">
                            <div className="space-y-6">
                                <Hulu
                                    height={20}
                                    width={56}
                                />
                                <p>"Working with MasterKey was a game-changer for our property portfolio. Their expertise in both management and sales helped us make informed decisions that significantly increased our property values."</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=460&h=460&q=80"
                                        alt="David Rodriguez"
                                        className="h-full w-full object-cover"
                                        width={460}
                                        height={460}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="space-y-px">
                                    <p className="text-sm font-medium">David Rodriguez</p>
                                    <p className="text-muted-foreground text-xs">Real Estate Investor</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-(--radius) bg-card ring-foreground/5 flex flex-col justify-between gap-6 border border-transparent p-8 shadow-lg shadow-black/10 ring-1 sm:row-start-2 lg:col-start-3 lg:row-start-3 lg:rounded-bl-none lg:rounded-tr-none">
                            <div className="space-y-6">
                                <Stripe
                                    height={24}
                                    width={56}
                                />
                                <p>"MasterKey's market analysis tools gave us unprecedented insight into local property trends. We were able to time our sale perfectly and achieved 15% above our initial asking price."</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=460&h=460&q=80"
                                        alt="Sarah Chen"
                                        className="h-full w-full object-cover"
                                        width={460}
                                        height={460}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="space-y-px">
                                    <p className="text-sm font-medium">Sarah Chen</p>
                                    <p className="text-muted-foreground text-xs">Property Owner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

type TestimonialCardProps = {
    name: string
    role: string
    avatar: string
    testimonial: string
}

const TestimonialCard = ({ name, role, avatar, testimonial }: TestimonialCardProps) => {
    return (
        <div className="bg-card/25 rounded-(--radius) ring-foreground/[0.07] flex flex-col justify-end gap-6 border border-transparent p-8 ring-1">
            <p className='text-foreground self-end text-balance before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"]'>{testimonial}</p>
            <div className="flex items-center gap-3">
                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                    <img
                        src={avatar}
                        alt={name}
                        className="h-full w-full object-cover"
                        width={460}
                        height={460}
                        loading="lazy"
                    />
                </div>
                <div className="space-y-px">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-muted-foreground text-xs">{role}</p>
                </div>
            </div>
        </div>
    )
}