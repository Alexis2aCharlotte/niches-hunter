import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { fetchPostBySlug, fetchAllSlugs } from "../data"

// Generate static paths for all posts
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Dynamic metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)
  
  if (!post) {
    return {
      title: "Article Not Found | NICHES HUNTER",
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || `Read ${post.title} on NICHES HUNTER Blog`

  return {
    title: `${title} | NICHES HUNTER Blog`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      images: post.cover_image ? [post.cover_image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  }
}

// Revalidate every hour
export const revalidate = 3600

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  // JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.meta_description,
    image: post.cover_image,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "NICHES HUNTER",
      logo: {
        "@type": "ImageObject",
        url: "https://nicheshunter.app/og-image.png",
      },
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nicheshunter.app/blog/${post.slug}`,
    },
  }

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
        </div>

        {/* Article */}
        <article className="relative pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white/60 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
              {/* Category & Date */}
              <div className="flex items-center gap-4 mb-6">
                {post.category && (
                  <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-xs text-[var(--primary)] font-bold uppercase">
                    {post.category}
                  </span>
                )}
                {publishedDate && (
                  <span className="text-sm text-white/40">{publishedDate}</span>
                )}
                <span className="text-sm text-white/30">·</span>
                <span className="text-sm text-white/40">{post.views} views</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-white/60 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                  <span className="text-lg">✍️</span>
                </div>
                <div>
                  <div className="font-medium">{post.author}</div>
                  <div className="text-xs text-white/40">NICHES HUNTER</div>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {post.cover_image && (
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-10">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-white
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-white/70 prose-p:leading-relaxed
                prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-white/70 prose-ol:text-white/70
                prose-li:marker:text-[var(--primary)]
                prose-blockquote:border-[var(--primary)] prose-blockquote:text-white/60
                prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/10">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-purple-500/10 border border-white/10 text-center">
              <h3 className="text-2xl font-bold mb-3">Find Your Next App Idea</h3>
              <p className="text-white/50 mb-6">
                Discover profitable iOS niches with our daily market analysis.
              </p>
              <Link
                href="/niches"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-black text-sm font-bold rounded-xl hover:bg-[#00E847] transition-all"
              >
                Explore Niches →
              </Link>
            </div>

            {/* Back to Blog */}
            <div className="mt-10 text-center">
              <Link 
                href="/blog"
                className="text-white/40 hover:text-white transition-colors"
              >
                ← Back to all articles
              </Link>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="relative px-6 py-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="font-bold text-sm tracking-widest text-white/40">NICHES HUNTER</span>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <Link href="/niches" className="hover:text-white transition-colors">Niches</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </div>
            <span className="text-xs text-white/20">© 2026 Niches Hunter. All rights reserved.</span>
          </div>
        </footer>
      </main>
    </>
  )
}

