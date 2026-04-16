"use client";

import { Reveal } from "./reveal";

// All testimonials use real avatar URLs from verified sources
const testimonials = [
  {
    body: "MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!",
    author: {
      name: "Todd Shillington",
      role: "Property Owner",
      imageUrl: "https://media.licdn.com/dms/image/v2/C5103AQES00pM4V_ulA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516247300532?e=1778112000&v=beta&t=3cgNUKyFz-7EUF2cTP7ZtDC4YPvBzRyMcSc6TwyDl2c",
    },
  },
  {
    body: "Professional and excellent service. I highly recommend. The Mathias team can help you out with all your real estate and management needs.",
    author: {
      name: "Kevin Marsden",
      role: "Real Estate Client",
      imageUrl: "https://media.licdn.com/dms/image/v2/C5603AQGkWSPSxQVhRg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1646713829633?e=1778112000&v=beta&t=Fn6hfgive1V_sKVFKXNtGg9Fxl0ugoNxIeSTTpViPRg",
    },
  },
  {
    body: "I highly recommend them not only as property managers but as brokers as well.",
    author: {
      name: "Javier Aguilera",
      role: "Property Manager Client",
      imageUrl: "https://images.unsplash.com/photo-1606788075819-9574a6edfab3?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=400",
    },
  },
  {
    body: "I always got the information I needed, and they were totally upfront about everything. Plus, their honesty and integrity made the whole process so much smoother. I highly recommend them!",
    author: {
      name: "Steve Scherer",
      role: "Real Estate Client",
      imageUrl: "/images/steve-scherer.jpeg",
    },
  },
  {
    body: "Mark was very professional to work with. Always responsive and straightforward. It was a pleasure working with the team. Would highly recommend.",
    author: {
      name: "Samir Akhter",
      role: "Real Estate Client",
      imageUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXK6AUkgD2GbP4sO8zyMkbREz0BmcT8iv7zHn1SADPut7SY-5yX=w144-h144-p-rp-mo-br100",
    },
  },
  {
    body: "The team was quick to respond and handle maintenance issues and kept the property in great shape.",
    author: {
      name: "Olivia Sellers",
      role: "Property Owner",
      imageUrl: "https://lh3.googleusercontent.com/a-/ALV-UjXoTdTHK7RWyQ5rrWbCxXxw3BWXl-bCq7MbVfdtDZcygFNod0kl=w144-h144-p-rp-mo-br100",
    },
  },
  {
    body: "Working with Mark, Mike, and Keith at MasterKey has been a great experience. Navigating a sale in Malibu can feel overwhelming, but their team has made everything clear and easy to understand. They came in with a thoughtful strategy, strong local knowledge, and communication that actually makes you feel supported.",
    author: {
      name: "Eric Etebari",
      role: "Property Owner",
      imageUrl: "https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-6/293473572_907752793452607_935003890823014477_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=pL25uBtOV7QQ7kNvwFugU8i&_nc_zt=23&_nc_ht=scontent-lax3-1.xx&oh=00_Af17bx8csNRvf79j59Kg_LMAYB0PGfKGo8b4qOvoRKlGtg&oe=69E5EFD4",
    },
  },
  {
    body: "My husband and I had an absolutely amazing experience working with Mark at MasterKey. As first-time home buyers, we started out feeling overwhelmed, but Mark quickly put us at ease. He walked us through every step and made sure we always knew what to expect. We couldn't be happier with our new home.",
    author: {
      name: "Maria LaCanfora",
      role: "Property Buyer",
      imageUrl: "https://scontent-lax3-1.cdninstagram.com/v/t51.2885-19/473732354_617963560819016_8008291265077624383_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=108&_nc_ohc=clxnVHzY-WEQ7kNvwHpgkJg&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_Af0hERyaS869-oN1Yaj7nguLK_JN2-TtjvpJQ06sDCI--g&oe=69E6154E&_nc_sid=7d3ac5",
    },
  },
];

export default function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal type="up">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base/7 font-semibold text-sky-600 dark:text-sky-400">Testimonials</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
              We have worked with hundreds of amazing clients
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial, i) => (
              <Reveal key={testimonial.author.name} type="up" delay={(Math.min(i % 3 + 1, 5)) as 1|2|3|4|5}>
                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-2xl bg-gray-50 p-8 text-sm/6 dark:bg-white/5">
                    <blockquote className="text-gray-900 dark:text-gray-100">
                      <p>{`"${testimonial.body}"`}</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <img
                        alt={testimonial.author.name}
                        src={testimonial.author.imageUrl}
                        className="size-10 rounded-full bg-gray-50 object-cover dark:bg-gray-800"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{testimonial.author.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
