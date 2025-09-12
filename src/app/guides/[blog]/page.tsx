import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import Navbar3 from '@/components/navbar3'
import { Footer } from '@/components/footer'
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'

// MDX Components
const components = {
  h1: (props: any) => (
    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mt-16 text-3xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mt-12 text-2xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white" {...props} />
  ),
  p: (props: any) => (
    <div className="mt-6 text-gray-600 dark:text-gray-400" {...props} />
  ),
  ul: (props: any) => (
    <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600 dark:text-gray-400" {...props} />
  ),
  li: (props: any) => (
    <li className="flex gap-x-3" {...props} />
  ),
  blockquote: (props: any) => (
    <figure className="mt-10 border-l border-green-600 pl-9 dark:border-green-400">
      <blockquote className="font-semibold text-gray-900 dark:text-white" {...props} />
    </figure>
  ),
  img: (props: any) => (
    <div className="mt-16">
      <img
        className="aspect-video rounded-xl bg-gray-50 object-cover dark:bg-gray-800 w-full"
        {...props}
      />
      {props.alt && (
        <div className="mt-4 flex gap-x-2 text-sm/6 text-gray-500 dark:text-gray-400">
          <InformationCircleIcon
            aria-hidden="true"
            className="mt-0.5 size-5 flex-none text-gray-300 dark:text-gray-600"
          />
          {props.alt}
        </div>
      )}
    </div>
  ),
  CheckCircleIcon: () => (
    <CheckCircleIcon
      aria-hidden="true"
      className="mt-1 size-5 flex-none text-green-600 dark:text-green-400"
    />
  ),
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    blog: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { blog: string } }) {
  const post = getPostBySlug(params.blog)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <Navbar3 />
      <div className="bg-white px-6 py-32 lg:px-8 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl text-base/7 text-gray-700 dark:text-gray-300">
          <p className="text-base/7 font-semibold text-green-600 dark:text-green-400">
            {post.category.title}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            {post.title}
          </h1>
          <p className="mt-6 text-xl/8 text-gray-600 dark:text-gray-400">
            {post.description}
          </p>
          
          {/* Author and Date */}
          <div className="mt-8 flex items-center gap-x-4">
            <img
              alt=""
              src={post.author.imageUrl}
              className="size-10 rounded-full bg-gray-100 dark:bg-gray-800"
            />
            <div className="text-sm/6">
              <p className="font-semibold text-gray-900 dark:text-white">
                {post.author.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {post.author.role} • {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Featured Image */}
          {post.imageUrl && (
            <figure className="mt-16">
              <img
                alt={post.title}
                src={post.imageUrl}
                className="aspect-video w-full rounded-xl bg-gray-50 object-cover dark:bg-gray-800"
              />
            </figure>
          )}

          {/* MDX Content */}
          <div className="mt-10 max-w-2xl">
            <MDXRemote source={post.content} components={components} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
