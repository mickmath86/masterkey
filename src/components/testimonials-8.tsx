import Image from 'next/image'
import { useState } from 'react'

const TESTIMONIALS = [
    {
        name: 'Todd Shillington',
        role: 'Property Owner',
        avatar: 'https://media.licdn.com/dms/image/v2/C5103AQES00pM4V_ulA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516247300532?e=1778112000&v=beta&t=3cgNUKyFz-7EUF2cTP7ZtDC4YPvBzRyMcSc6TwyDl2c',
        testimonial: 'MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!',
    },
    {
        name: 'Kevin Marsden',
        role: 'Real Estate Client',
        avatar: 'https://media.licdn.com/dms/image/v2/C5603AQGkWSPSxQVhRg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1646713829633?e=1778112000&v=beta&t=Fn6hfgive1V_sKVFKXNtGg9Fxl0ugoNxIeSTTpViPRg',
        testimonial: 'Professional and excellent service. I highly recommend. The Mathias team can help you out with all you real estate and management needs.',
    },
    {
        name: 'Javier Aguilera',
        role: 'Property Manager Client',
        avatar: 'https://images.unsplash.com/photo-1606788075819-9574a6edfab3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2368',
        testimonial: 'I highly recommend them not only as property managers but as brokers as well.',
    },
    {
        name: 'Steve Scherer',
        role: 'Real Estate Client',
        avatar: '/images/steve-scherer.jpeg',
        testimonial: 'I always got the information I needed, and they were totally upfront about everything. Plus, their honesty and integrity made the whole process so much smoother. I highly recommend them!',
    },
    {
        name: 'Samir Akhter',
        role: 'Real Estate Client',
        avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXK6AUkgD2GbP4sO8zyMkbREz0BmcT8iv7zHn1SADPut7SY-5yX=w144-h144-p-rp-mo-br100',
        testimonial: 'Mark was very professional to work with. Always responsive and straightforward. It was a pleasure working with the team. Would highly recommend.',
    },
    {
        name: 'Olivia Sellers',
        role: 'Property Owner',
        avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXoTdTHK7RWyQ5rrWbCxXxw3BWXl-bCq7MbVfdtDZcygFNod0kl=w144-h144-p-rp-mo-br100',
        testimonial: 'The team was quick to respond and handle maintenance issues and kept the property in great shape.',
    },
    {
        name: 'Eric Etebari', 
        role: 'Property Owner', 
        avatar: 'https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/293473572_907752793452607_935003890823014477_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=pL25uBtOV7QQ7kNvwFugU8i&_nc_oc=Ado_V622ltL0-791rSSDZxpgsGEurU_7r5IOMpMEyqWWV3i4O4VQhvDn_6iYHS6aAJI&_nc_zt=23&_nc_ht=scontent-lax3-1.xx&_nc_gid=LJ8IENdPwGD-tHzIBJsYjQ&_nc_ss=7a3a8&oh=00_Af17bx8csNRvf79j59Kg_LMAYB0PGfKGo8b4qOvoRKlGtg&oe=69E5EFD4',
        testimonial: "Working with Mark, Mike, and Keith at MasterKey has been a great experience so far. Navigating a sale in Malibu can feel overwhelming, but their team has made everything clear and easy to understand. They came in with a thoughtful strategy, strong local knowledge, and communication that actually makes you feel supported. They know what they're doing and genuinely care about getting the best outcome. The process has been smooth up to this point and would absolutely recommend MasterKey to anyone considering selling in Malibu or Ventura County.",
    },
    {
        name: 'Maria LaCanfora', 
        role: 'Property Buyer', 
        avatar: 'https://scontent-lax3-1.cdninstagram.com/v/t51.2885-19/473732354_617963560819016_8008291265077624383_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2gFXBv2wa1dgf6aVfqT_XFYANUYt2dAFbCpu11vnTfBzSP4bEuzbdFzBlkewDZy0_hY&_nc_ohc=clxnVHzY-WEQ7kNvwHpgkJg&_nc_gid=uQeUelU6GLGeLVwZ_4TC0Q&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_Af0hERyaS869-oN1Yaj7nguLK_JN2-TtjvpJQ06sDCI--g&oe=69E6154E&_nc_sid=7d3ac5', 
        testimonial: "My husband and I had an absolutely amazing experience working with Mark at MasterKey Property Management. From the very beginning, Mark went above and beyond to understand our needs and find a home that was the perfect fit for us. His professionalism, attention to detail, and understanding of the market made the entire process so smooth. As first-time home buyers, we started out feeling overwhelmed by the process, but Mark quickly put us at ease. He walked us through every step, explaining things clearly and thoughtfully, and made sure we always knew what to expect next. Thanks to his guidance, what could have been a stressful experience turned into an exciting and positive journey. He handled every question and concern with patience and expertise, which really made us feel confident in our decisions. We really couldn't be happier with our new home and the top-notch service we received. Mark and the team at MasterKey genuinely cared about finding the right home for us — and it showed in everything they did. If you're looking for a property management company that genuinely puts clients first, look no further!",
    },
    {
        name: 'Mark Foley', 
        role: 'Property Management Client', 
        avatar: 'https://scontent-lax3-1.cdninstagram.com/v/t51.2885-19/473732354_617963560819016_8008291265077624383_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2gFXBv2wa1dgf6aVfqT_XFYANUYt2dAFbCpu11vnTfBzSP4bEuzbdFzBlkewDZy0_hY&_nc_ohc=clxnVHzY-WEQ7kNvwHpgkJg&_nc_gid=uQeUelU6GLGeLVwZ_4TC0Q&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_Af0hERyaS869-oN1Yaj7nguLK_JN2-TtjvpJQ06sDCI--g&oe=69E6154E&_nc_sid=7d3ac5', 
        testimonial: "Mark was incredibly kind and helpful during our long stay in Ventura. He was quick to answer any questions we had and offer suggestions for areas to explore while we visited. The Hilltop Drive apartment was clean and well-stocked with all we could need for a 6-month stay. I highly recommend working with Mark!",
    }
]

export default function Testimonials8() {
    return (
        <section
            id="reviews"
            className="bg-background py-12 md:py-24">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-balance text-center">
                    <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">What our clients are saying about MasterKey</h2>
                    <p className="text-muted-foreground mb-6 md:mb-12 lg:mb-16">Join hundreds of satisfied property owners who trust MasterKey for expert real estate guidance and property management.</p>
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
                                <p>"MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!"</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                                    <Image
                                        src="https://media.licdn.com/dms/image/v2/C5103AQES00pM4V_ulA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516247300532?e=1778112000&v=beta&t=3cgNUKyFz-7EUF2cTP7ZtDC4YPvBzRyMcSc6TwyDl2c"
                                        alt="Todd Shillington"
                                        className="h-full w-full object-cover"
                                        width={120}
                                        height={120}
                                    />
                                </div>
                                <div className="space-y-px">
                                    <p className="text-sm font-medium">Todd Shillington</p>
                                    <p className="text-muted-foreground text-xs">Property Owner</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-(--radius) bg-card ring-foreground/5 row-start-3 flex flex-col justify-between gap-6 border border-transparent p-8 shadow-lg shadow-black/10 ring-1 sm:col-start-2 lg:row-start-2">
                            <div className="space-y-6">
                                <p>"I always got the information I needed, and they were totally upfront about everything. Plus, their honesty and integrity made the whole process so much smoother. I highly recommend them!"</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                                    <Image
                                        src="/images/steve-scherer.jpeg"
                                        alt="Steve Scherer"
                                        className="h-full w-full object-cover"
                                        width={120}
                                        height={120}
                                    />
                                </div>
                                <div className="space-y-px">
                                    <p className="text-sm font-medium">Steve Scherer</p>
                                    <p className="text-muted-foreground text-xs">Real Estate Client</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-(--radius) bg-card ring-foreground/5 flex flex-col justify-between gap-6 border border-transparent p-8 shadow-lg shadow-black/10 ring-1 sm:row-start-2 lg:col-start-3 lg:row-start-3 lg:rounded-bl-none lg:rounded-tr-none">
                            <div className="space-y-6">
                                <p>"Mark was very professional to work with. Always responsive and straightforward. It was a pleasure working with the team. Would highly recommend."</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                                    <Image
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjXK6AUkgD2GbP4sO8zyMkbREz0BmcT8iv7zHn1SADPut7SY-5yX=w144-h144-p-rp-mo-br100"
                                        alt="Samir Akhter"
                                        className="h-full w-full object-cover"
                                        width={120}
                                        height={120}
                                    />
                                </div>
                                <div className="space-y-px">
                                    <p className="text-sm font-medium">Samir Akhter</p>
                                    <p className="text-muted-foreground text-xs">Real Estate Client</p>
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
    const [isExpanded, setIsExpanded] = useState(false)
    const shouldTruncate = testimonial.length > 300
    const displayText = shouldTruncate && !isExpanded 
        ? testimonial.slice(0, 300) + '...' 
        : testimonial

    return (
        <div className="bg-card/25 rounded-(--radius) ring-foreground/[0.07] flex flex-col justify-end gap-6 border border-transparent p-8 ring-1">
            <div className="space-y-2">
                <p className='text-foreground self-end text-balance before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"]'>
                    {displayText}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-primary hover:underline font-medium"
                    >
                        {isExpanded ? 'Show Less' : 'Read Full Review'}
                    </button>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className="ring-foreground/10 aspect-square size-9 overflow-hidden rounded-lg border border-transparent shadow-md shadow-black/15 ring-1">
                    <Image
                        src={avatar}
                        alt={name}
                        className="h-full w-full object-cover"
                        width={120}
                        height={120}
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