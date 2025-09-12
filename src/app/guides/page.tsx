
import Navbar3 from "@/components/navbar3";
import { Footer } from "@/components/footer";
import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
  
function Hero({ posts }: { posts: any[] }) {
    return (
      <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
              Real Estate & Property Management Guides
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-300">
              Expert insights and practical guides to help you succeed in real estate and property management.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post: any) => (
              <article key={post.slug} className="flex flex-col items-start justify-between">
                <div className="relative w-full">
                  <img
                    alt=""
                    src={post.imageUrl}
                    className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2 dark:bg-gray-800"
                  />
                  <div className="absolute inset-0 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />
                </div>
                <div className="flex max-w-xl grow flex-col justify-between">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={post.date} className="text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString()}
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800">
                      {post.category.title}
                    </span>
                  </div>
                  <div className="group relative grow">
                    <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                      <Link href={`/guides/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">{post.description}</p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
                    <img
                      alt=""
                      src={post.author.imageUrl}
                      className="size-10 rounded-full bg-gray-100 dark:bg-gray-800"
                    />
                    <div className="text-sm/6">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {post.author.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">{post.author.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  }
  


export default function Guides() {
    const posts = getAllPosts()
    
    return (
        <div>
            <Navbar3/>
            <Hero posts={posts} />
            <Footer />  
        </div>
    )
}