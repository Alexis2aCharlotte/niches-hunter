import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { fetchAllPosts, BlogPost, BLOG_CATEGORIES } from "./data"

export const metadata: Metadata = {
  title: "Blog | NICHES HUNTER - iOS App Market Insights",
  description: "Discover strategies, market analysis, and success stories to help you build profitable iOS apps. Expert insights on App Store opportunities.",
  openGraph: {
    title: "Blog | NICHES HUNTER",
    description: "Discover strategies, market analysis, and success stories to help you build profitable iOS apps.",
    type: "website",
  },
}

// Revalidate every hour
export const revalidate = 3600

function PostCard({ post }: { post: BlogPost }) {
  const publishedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="liquid-card overflow-hidden h-full flex flex-col transition-all duration-300 hover:scale-[1.02]">
        {/* Cover Image */}
        {post.cover_image ? (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-[var(--primary)]/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-6xl opacity-50">📝</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-3">
            {post.category && (
              <span className="px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[10px] text-[var(--primary)] font-bold uppercase">
                {post.category}
              </span>
            )}
            {publishedDate && (
              <span className="text-xs text-white/40">{publishedDate}</span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-white/50 leading-relaxed line-clamp-3 flex-grow">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-white/30">{post.author}</span>
            <span className="text-[var(--primary)] text-sm font-medium group-hover:translate-x-1 transition-transform">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function BlogPage() {
  const posts = await fetchAllPosts()

  return (
    <main className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-[#00CC3D] selection:text-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-[var(--primary)]/3 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <section className="relative pt-32 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">Insights & Strategies</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                The Niche <span className="text-flashy-green">Blog</span>
              </h1>
              <p className="text-lg text-white/50 max-w-xl">
                Market analysis, strategies, and success stories to help you build profitable iOS apps.
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs font-mono text-white/70">{posts.length} ARTICLES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                <span className="text-4xl">✍️</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Coming Soon</h2>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                We're working on quality content to help you find and build profitable iOS apps. Check back soon!
              </p>
              <Link 
                href="/niches"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-black text-sm font-bold rounded-xl hover:bg-[#00E847] transition-all"
              >
                Explore Niches →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="liquid-card p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Get niche ideas in your inbox
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto">
              Join indie developers who receive our daily iOS market insights. Free, no spam.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-black font-bold rounded-xl hover:bg-[#00E847] transition-all shadow-[0_0_30px_rgba(0,204,61,0.3)]"
            >
              Subscribe to Newsletter →
            </Link>
          </div>
        </div>
      </section>

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
  )
}
