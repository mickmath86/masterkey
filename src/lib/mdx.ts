import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'src/content/guides')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: {
    name: string
    role: string
    imageUrl: string
  }
  category: {
    title: string
    href: string
  }
  imageUrl: string
  content: string
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(contentDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(contentDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || {
          name: 'MasterKey Team',
          role: 'Real Estate Experts',
          imageUrl: '/images/team-default.jpg'
        },
        category: data.category || {
          title: 'Real Estate',
          href: '#'
        },
        imageUrl: data.imageUrl || '/images/default-blog.jpg',
        content
      } as BlogPost
    })

  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || {
        name: 'MasterKey Team',
        role: 'Real Estate Experts',
        imageUrl: '/images/team-default.jpg'
      },
      category: data.category || {
        title: 'Real Estate',
        href: '#'
      },
      imageUrl: data.imageUrl || '/images/default-blog.jpg',
      content
    } as BlogPost
  } catch (error) {
    return null
  }
}
