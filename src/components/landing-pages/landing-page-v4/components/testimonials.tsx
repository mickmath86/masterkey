const testimonials = [
  {
    body: "MasterKey is an amazing company. Their talent extends well past property management into construction and Real Estate Brokerage as well. They gave me all the consulting I needed to help me get the highest return I could ask for on my property. Highly recommend!!",
    author: {
      name: 'Todd Shillington',
      handle: 'toddshillington',
      imageUrl: 'https://images.unsplash.com/photo-1560170412-0f7df0eb0fb1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2296',
    },
  },
  {
    body: "Professional and excellent service. I highly recommend. The Mathias team can help you out with all you real estate and management needs.",
    author: {
      name: 'Kevin Marsden',
      handle: 'kevinmarsden',
      imageUrl: 'https://images.unsplash.com/photo-1526363269865-60998e11d82d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370',
    },
  },
  {
    body: "I highly recommend them not only as property managers but as brokers as well.",
    author: {
      name: 'Javier Aguilera',
      handle: 'javieraguilera',
      imageUrl: 'https://images.unsplash.com/photo-1606788075819-9574a6edfab3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2368',
    },
  },
  {
    body: "I always got the information I needed, and they were totally upfront about everything. Plus, their honesty and integrity made the whole process so much smoother. I highly recommend them!",
    author: {
      name: 'Steve Scherer',
      handle: 'stevescherer',
      imageUrl: 'https://images.unsplash.com/photo-1542644425-bc949ec841a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287',
    },
  },
  {
    body: "Mark was very professional to work with. Always responsive and straightforward. It was a pleasure working with the team. Would highly recommend.",
    author: {
      name: 'Samir Akhter',
      handle: 'samirakhter',
      imageUrl: 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370',
    },
  },
  {
    body: "The team was quick to respond and handle maintenance issues and kept the property in great shape.",
    author: {
      name: 'Olivia Sellers',
      handle: 'oliviasellers',
      imageUrl: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370',
    },
  },
]

export default function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-sky-600 dark:text-indigo-400">Testimonials</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
            We have worked with hundreds of amazing clients
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-gray-50 p-8 text-sm/6 dark:bg-white/2.5">
                  <blockquote className="text-gray-900 dark:text-gray-100">
                    <p>{`“${testimonial.body}”`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img
                      alt=""
                      src={testimonial.author.imageUrl}
                      className="size-10 rounded-full bg-gray-50 dark:bg-gray-800"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author.name}</div>
                      <div className="text-gray-600 dark:text-gray-400">{`@${testimonial.author.handle}`}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
