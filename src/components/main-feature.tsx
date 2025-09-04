


import { Container } from "./container";
import { GradientBackground } from "./gradient";
import { Heading, Lead, Subheading } from '@/components/text'
import Link from 'next/link'
import { FadeIn, FadeInStagger } from '@/components/animations'
import { ArrowLongRightIcon } from "@heroicons/react/16/solid";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import { ChartRadialStacked } from "./ui/chart-radial-stacked";



const services = [
    {
        slug: 'buy-and-sell',
        title: 'Buy and Sell',
        excerpt: 'Track your performance with instant insights. Our powerful analytics engine processes data in real-time, providing actionable metrics and customizable dashboards for informed decision-making.',
        mainImage: {
            alt: 'Modern home for sale',
            url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&crop=center',
        },
        link: '/buy-and-sell',
        cta: 'Check My Home Value',
    },
    {
        slug: 'property-management',
        title: 'Property Management',
        excerpt: 'Streamline your workflow with intelligent automation. Our AI system learns from your patterns to automate repetitive tasks and suggest optimizations for improved efficiency.',
        mainImage: {
            alt: 'Beautiful residential property',
            url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center',
        },
        link: '/property-management',
        cta: 'See Rental Potenial'
    },
]
const MainFeature = () => {
    return (
      <section className="py-32 gap-16 flex flex-col">
       {/* <GradientBackground /> */}
     
        
        <Container>
        <FadeIn>
            <Subheading className="mt-16">Two Paths. One Partner.</Subheading>
            <Heading as="h1" className="mt-2">
           Buy, Sell, or Lease with Confidence
            </Heading>
            <Lead className="mt-6 max-w-3xl">
            Stay informed with product updates, company news, and insights on how
            to sell smarter at your company.
            </Lead>
            </FadeIn>
        </Container>
     
      <Container>
    
       
        <FadeIn>
        {/* <div className="relative h-96 overflow-hidden rounded-xl border border-border">
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/full-width-backgrounds/andrew-kliatskyi-LYZxo7oVFOI-unsplash.webp"
            alt="placeholder"
            className="hidden h-full w-full object-cover dark:block"
          />
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/full-width-backgrounds/denis96-gmsf4Zo2-rY-unsplash.webp"
            alt="placeholder"
            className="h-full w-full object-cover dark:hidden"
          />
          <div className="absolute inset-0 bg-radial from-background to-background/50 lg:to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-5xl">
                Try it free
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl">
                Experience our platform and discover how it can transform your
                workflow
              </p>
            </div>
            <Button size="lg">
              Get started
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </div>
         */}
           <div className="flex w-full flex-col overflow-hidden rounded-lg bg-muted md:rounded-xl lg:flex-row lg:items-center">
          <div className="w-full shrink-0 self-stretch lg:w-1/2">
            {/* <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg"
              alt="placeholder hero"
              className="aspect-3/2 w-full rounded-t-md object-cover md:rounded-t-none md:rounded-l-md"
            /> */}
            <div className="w-full border-0 border-gray-200 p-10">
                <FadeIn>
                 <ChartRadialStacked />
                </FadeIn>
              
            </div>
          </div>
          <div className="w-full shrink-0 px-4 py-6 md:p-8 lg:w-1/2 lg:px-16">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              Call to Action
            </h3>
            <p className="mb-8 text-muted-foreground lg:text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
              doloremque mollitia fugiat omnis! Porro facilis quo animi
              consequatur. Explicabo.
            </p>
            <Button>Get Started <ArrowUpRight/></Button>
          </div>
        </div>
        </FadeIn>
        
        <FadeInStagger 
          staggerDelay={0.2}
          className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
            
          {services.map((post) => (
            <a
              key={post.slug}
              className="relative flex group flex-col rounded-sm bg-white p-2 shadow-md ring-1 shadow-black/5 ring-black/5 hover:bg-gray-50 trasition-colors"
              href={post.link}
            >
              {post.mainImage && (
                <img
                  alt={post.mainImage.alt || ''}
                  src={post.mainImage.url}
                  className="aspect-3/2 w-full rounded-sm object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-8">
             
                <h1 className="text-xl font-medium">{post.title}</h1>
                <div className="mt-2 flex-1 text-sm/6 text-gray-500">
                  {post.excerpt}
                </div>
                 <div className="mt-2">
                       <p   
                         
                         className="inline-flex items-center gap-2 text-sm/6 font-medium text-pink-600 hover:text-pink-500"
                       >
                         {post.cta}
                         <ArrowLongRightIcon className="size-5" />
                       </p  >
                     </div>
              </div>
            
            </a>
          ))}
        </FadeInStagger>
   
      </Container>

      </section>
    );
  };
  
  export { MainFeature };
  

