import { ArrowRight, ArrowUpRight, Link } from "lucide-react"
import { Container } from "./container"
import { Subheading } from "./text"
import { Heading } from "./text"
import { Lead } from "./text"
import { FadeIn, FadeInStagger } from "./animations"

const featredPosts = [
    {
        title: "Buy and Sell Real Estate",
        link:"/buy-and-sell", 
        slug: "modern-luxury-home-beverly-hills",
        mainImage: {
            alt: "Modern luxury home with clean lines and large windows",
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1170&h=780&fit=crop&crop=center"
        },
        publishedAt: "2025-09-01T00:00:00.000Z",
        author: {
            name: "Sarah Johnson",
            image: {
                alt: "Sarah Johnson",
                url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
            }
        }, 
        excerpt: "Discover this stunning contemporary home featuring floor-to-ceiling windows, open-concept living, and premium finishes throughout."
    },
    {
        title: "Property Management",
        link:"property-management", 
        slug: "charming-victorian-estate",
        mainImage: {
            alt: "Beautiful Victorian style house with ornate details",
            url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1170&h=780&fit=crop&crop=center"
        },
        publishedAt: "2025-08-28T00:00:00.000Z",
        author: {
            name: "Michael Chen",
            image: {
                alt: "Michael Chen",
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
            }
        }, 
        excerpt: "Step back in time with this meticulously restored Victorian home, complete with original hardwood floors and period details."
    },
   
]

async function FeaturedPosts() {


  return (
    <div className="mt-16  pb-14">
      <div>
        <h2 className="text-2xl font-medium tracking-tight">Services</h2>
        <FadeInStagger className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
           
          {featredPosts.map((post) => (
            <a
              key={post.slug}
              href={post.link}
              className="relative flex flex-col rounded-sm bg-white p-2 shadow-md ring-1 hover:bg-gray-50 transition-all duration-300 ease-in-out shadow-black/5 ring-black/5"
            >
              {post.mainImage && (
                <img
                  alt={post.mainImage.alt || ''}
                  src={post.mainImage.url}
                  className="aspect-3/2 w-full rounded-sm object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-8">
    
                <div className="mt-2 text-base/7 font-medium">
                  {post.title}
                </div>
                <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                  {post.excerpt}
                </div>
                <div className="flex items-center gap-1 text-pink-500 mt-2">
                    Get Started 
                    <ArrowRight />
                </div>
              </div>
            </a>
          ))}
         
            </FadeInStagger>
      </div>
    </div>
  )
}

export default function HeroFeature1() {
    return(
        <FadeIn>
        <section className="my-16">
        <Container>
          <Subheading className="mt-16">Technology-Driven Real-Estate Solutions</Subheading>
          <Heading as="h1" className="mt-2">
            MASTERKEY Real Estate Services
          </Heading>
          <Lead className="mt-6 max-w-3xl">
          <span className=" text-sky-500">MasterKey</span> combines cutting-edge technology with expert real estate knowledge to deliver comprehensive brokerage and property management solutions. Our AI-powered platform transforms how you buy, sell, and manage properties.
          </Lead>
         <FeaturedPosts/>
        </Container>
        </section>
        </FadeIn>
    )
}