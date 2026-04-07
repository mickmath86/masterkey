const people = [
  {
    name: 'Michael Mathias',
    role: 'Broker',
    license:'01892427',
    imageUrl:
      '/images/mike.png',
    bio: "As a licensed real estate broker, Mike Mathias combines his expertise in real estate with a background in high-level marketing and production. Previously, he led major projects for global brands like Google, Nike, and Samsung, managing large-scale digital campaigns and platform redesigns. Now, he focuses on real estate, leveraging technology to streamline property management and investment strategies. Based in Ventura County with his wife, Dana, and their son, Ryan, Mike is dedicated to creating innovative solutions for investors and property owners.",
  },
  {
    name: 'Mark Mathias',
    role: 'Broker',
    license: '01963427',
    imageUrl:
      '/images/mark.png',
    bio: "A licensed real estate Broker who's sold +$20M worth of investment property, and as a property manager, he's managed several apartment complexes with Thrive Communities in Seattle, WA. Additionally, Mark was a Product Manager for a tech start-up, Enervee, preparing him to work cross-functionally with teams to meet deadlines, manage technically complex projects, and leverage technology to streamline systems and processes. Based in Ventura, CA with his wife, Courtney, of 7 years and their 1 year old son, Sawyer.",
  }
  
]

export default function OurTeam() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            Our team
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
            We're licensed real estate brokers who believe sellers deserve more than opinions and estimates. 
            Our approach combines independent appraisals, market data, and performance guarantees to deliver 
            certainty in an uncertain market.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none "
        >
          {people.map((person) => (
            <li key={person.name}>
              <img
                alt=""
                src={person.imageUrl}
                className="aspect-14/13 w-full rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
              />
              <h3 className="mt-6 text-lg/8 uppercase font-semibold tracking-tight text-gray-900 dark:text-white">
                {person.name}
              </h3>
              <div> 
                <p className="text-base/7 font-semibold text-gray-600 dark:text-gray-300">{person.role}</p>
                <p className="text-sm/7 text-gray-500">License: {person.license}</p>

              </div>
             
              <p className="text-md/6 text-gray-500">{person.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
