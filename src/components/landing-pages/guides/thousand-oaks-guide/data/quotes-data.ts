export interface Quote {
  text: string
  author: string
  source: string
}

export const quotesData: Record<string, Quote[]> = {
  'Wildwood': [
    {
      text: "Families love this neighborhood for the numerous hiking trails, the beautiful greenbelts, and the highly rated Wildwood school.",
      author: "Local Resident",
      source: "Community Review"
    },
    {
      text: "There are plenty of amazing hiking trails all around, and because of this, it's very easy to stay active. The city is very clean and well kept, and the residents are great.",
      author: "Resident Review",
      source: "Niche.com"
    }
  ],
  'Conejo Oaks Area': [
    {
      text: "People like this neighborhood because it is very social. The Conejo Family Country Club is a popular spot for swimming, tennis, basketball, or just hanging out and barbecuing with your neighbors.",
      author: "Local Resident",
      source: "Community Review"
    },
    {
      text: "The yards are spacious with room for horses and/or other farm animals and the curb appeal is some of the best for custom neighborhoods.",
      author: "Local Resident",
      source: "ConejoValleyGuy"
    }
  ],
  'North Central TO': [
    {
      text: "I have lived in Thousand Oaks all of my life and it is an amazing place to raise a family. It is a small town with great elementary, middle, and high schools.",
      author: "Resident Review",
      source: "Niche.com"
    },
    {
      text: "Growing up in Thousand Oaks has been a wonderful experience. Having a quiet place to learn fundamentals such as riding a bike, while being just a short drive to the beach or the city, it was the best of both worlds!",
      author: "Resident Review",
      source: "Niche.com"
    }
  ],
  'Northeast TO': [
    {
      text: "As suburban as this neighborhood is, you still have easy access to Westlake Village right nearby for shopping, dining, and entertainment galore; it's truly the whole package!",
      author: "Local Resident",
      source: "Neighborhood Guide"
    },
    {
      text: "They leave the nest and they go out and they see what it's like in the big city. And then they come back here to our community to start a family.",
      author: "Local Resident",
      source: "Community Review"
    },
    {
      text: "Some of the best schools in the nation. And certainly in California.",
      author: "Local Resident",
      source: "Community Review"
    }
  ],
  'Hillcrest East': [
    {
      text: "This city was once ranked top 10 places to raise a family for a reason. Its safety is near unheard of in the U.S. and the public education is some of the best in the country.",
      author: "Resident Review",
      source: "Niche.com"
    }
  ],
  'Thousand Oaks South': [
    {
      text: "Rancho Conejo is a large guard gated community with about 1,000 homes that's a common landing spot for Thousand Oaks families.",
      author: "Local Resident",
      source: "ConejoValleyGuy"
    },
    {
      text: "Thousand Oaks is the largest city in the Conejo Valley and routinely makes the list as one of the safest cities in the country.",
      author: "Local Resident",
      source: "ConejoValleyGuy"
    }
  ],
  'Sunset Hills / Copperwood': [
    {
      text: "There are plenty of amazing hiking trails all around, and because of this, it's very easy to stay active. The city is very clean and well kept, and the residents are great.",
      author: "Resident Review",
      source: "Niche.com"
    }
  ],
  'Shadow Oaks / Eichler': [
    {
      text: "Sitting in this living room is my most favorite place to be. Whether it's raining or sunny, I like to sit in the corner, with my feet up, and have this view.",
      author: "Robyn Moshier",
      source: "Eichler Network Resident"
    },
    {
      text: "Most people have no idea that Thousand Oaks has Eichler homes! Owning one means you get to own a piece of California's architectural history.",
      author: "Local Resident",
      source: "Community Review"
    },
    {
      text: "Shadow Oaks enjoys the best of all worlds... Nestled in the community are Acacia Elementary School and Redwood Middle School.",
      author: "Local Resident",
      source: "Community Review"
    }
  ],
  'Kevington / New Meadows': [
    {
      text: "Here you will find larger lots and some of the best views in the city, with many homes being able to enjoy 4th of July fireworks without having to leave the property.",
      author: "Local Resident",
      source: "Community Review"
    },
    {
      text: "Almost all the homes were built between 1960–1970. The Kevington community shares an HOA and all view lots. Some of the best views in the whole city!",
      author: "Resident Comment",
      source: "Thousand Oaks Redistricting Survey"
    }
  ],
  'Lynn Ranch': [
    {
      text: "Lynn Ranch is seen as a more affluent area with big houses and lots of money. But anyone who can afford a home in the area wouldn't regret the investment.",
      author: "Jason Trejo",
      source: "Local Property Manager, Homes.com"
    },
    {
      text: "Lynn Ranch is a very charming neighborhood in Thousand Oaks featuring custom homes with larger lots and beautiful views. If you're looking for a horse property, you're likely to find it here.",
      author: "Local Resident",
      source: "Community Review"
    },
    {
      text: "Life in Lynn Ranch brings peaceful solitude and serene surroundings to anyone lucky enough to secure a spot in this coveted piece of Thousand Oaks.",
      author: "Neighborhood Guide",
      source: "Homes.com"
    }
  ]
}

export const nextdoorSummaries: Record<string, string> = {
  'Wildwood': 'Beautiful, clean, dog friendly, family friendly, hiking, neighbors, peaceful, quiet, safe, walkability.',
  'Shadow Oaks / Eichler': 'Community, dog friendly, family friendly, friendly, hiking, neighbors, parks, peaceful, safe, walking. Beautiful, clean, family friendly, hills, peaceful, pleasant, safe, trails, weather, wildlife.'
}
