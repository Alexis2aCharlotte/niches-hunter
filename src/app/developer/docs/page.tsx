'use client'

import Link from 'next/link'
import LiquidCard from '@/components/LiquidCard'

const BASE_URL = 'https://nicheshunter.com'

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/niches',
    description: 'List all analyzed niches with pagination.',
    cost: '5 credits',
    params: [
      { name: 'page', type: 'integer', desc: 'Page number (default: 1)' },
      { name: 'category', type: 'string', desc: 'Filter by category name' },
      { name: 'min_score', type: 'integer', desc: 'Minimum niche score' },
    ],
    response: `{
  "data": [
    {
      "display_code": "0042",
      "title": "AI Meditation Timer",
      "category": "Health & Fitness",
      "tags": ["meditation", "ai", "wellness"],
      "score": 87,
      "opportunity": "...",
      "source_type": "app_store",
      "published_at": "2026-02-20T..."
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 160,
    "total_pages": 8
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/niches/:code',
    description: 'Get full details for a specific niche including market analysis, risks, tech stack, and marketing strategies.',
    cost: '50 credits',
    params: [
      { name: 'code', type: 'string', desc: 'Niche display code (e.g. 0042)' },
    ],
    response: `{
  "data": {
    "code": "0042",
    "title": "AI Meditation Timer",
    "category": "Health & Fitness",
    "score": 87,
    "stats": { "competition": "Low", ... },
    "market_analysis": { ... },
    "key_learnings": [...],
    "risks": [...],
    "tech_stack": [...],
    "marketing_strategies": [...],
    "monetization": { ... },
    ...
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/opportunities',
    description: 'List App Store opportunities detected by our scraper. Ranked by score.',
    cost: '5 credits',
    params: [
      { name: 'page', type: 'integer', desc: 'Page number (default: 1)' },
      { name: 'category', type: 'string', desc: 'Filter by App Store category' },
      { name: 'min_score', type: 'number', desc: 'Minimum opportunity score' },
      { name: 'country', type: 'string', desc: 'Filter by country code (e.g. US, FR)' },
    ],
    response: `{
  "data": [
    {
      "app_id": "...",
      "name": "Example App",
      "developer": "Example Inc.",
      "category_name": "Health & Fitness",
      "best_rank": 3,
      "avg_rank": 12.5,
      "days_in_top": 14,
      "total_score": 92.3,
      ...
    }
  ],
  "pagination": { ... }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/rankings',
    description: 'Query raw App Store rankings data. At least one filter (country or category) is required.',
    cost: '3 credits',
    params: [
      { name: 'country', type: 'string', desc: 'Country code (e.g. US, FR, GB)' },
      { name: 'category', type: 'string', desc: 'App Store category name' },
      { name: 'date', type: 'string', desc: 'Filter by date (YYYY-MM-DD)' },
      { name: 'limit', type: 'integer', desc: 'Max results (default: 50, max: 100)' },
    ],
    response: `{
  "data": [
    {
      "app_id": "...",
      "name": "Top App",
      "rank": 1,
      "country": "US",
      "category": "Productivity",
      "run_date": "2026-02-24",
      ...
    }
  ],
  "count": 50
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/categories',
    description: 'List all tracked App Store categories with their opportunity bonus scores.',
    cost: '1 credit',
    params: [],
    response: `{
  "data": [
    {
      "category_name": "Health & Fitness",
      "bonus": 15,
      "tier": "gold"
    }
  ]
}`,
  },
]

function generateMarkdown() {
  let md = `# Niches Hunter API Documentation\n\n`
  md += `Base URL: ${BASE_URL}\n\n`
  md += `## Authentication\n\nAll requests require a valid API key sent via the Authorization header.\n\n\`\`\`\nAuthorization: Bearer nh_live_your_key_here\n\`\`\`\n\n`
  md += `## Rate Limits & Credits\n\n- **Rate limit:** 30 requests per minute per API key\n- **Credits:** Each endpoint costs a specific number of credits (1 credit = $0.01)\n- **Minimum top-up:** $10 (1,000 credits)\n\nResponse headers include \`X-Credits-Remaining\` and \`X-Credits-Used\` after each call.\n\n`
  md += `## Error Codes\n\n| Code | Description |\n|------|-------------|\n| 401 | Invalid or missing API key |\n| 402 | Insufficient credits - top up your balance |\n| 429 | Rate limit exceeded - wait 60 seconds |\n| 400 | Bad request - missing required parameters |\n| 404 | Resource not found |\n| 500 | Server error |\n\n`
  md += `## Endpoints\n\n`

  for (const ep of endpoints) {
    md += `### ${ep.method} ${ep.path}\n\n`
    md += `${ep.description}\n\n`
    md += `**Cost:** ${ep.cost}\n\n`
    if (ep.params.length > 0) {
      md += `**Parameters:**\n\n| Name | Type | Description |\n|------|------|-------------|\n`
      for (const p of ep.params) {
        md += `| ${p.name} | ${p.type} | ${p.desc} |\n`
      }
      md += `\n`
    }
    md += `**Example Response:**\n\n\`\`\`json\n${ep.response}\n\`\`\`\n\n---\n\n`
  }

  return md
}

function handleDownload() {
  const md = generateMarkdown()
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'nicheshunter-api-docs.md'
  a.click()
  URL.revokeObjectURL(url)
}

export default function DocsPage() {
  return (
    <main className="min-h-screen text-white font-sans selection:bg-[var(--primary)] selection:text-black pt-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[150px] rounded-full" />
      </div>

      <section className="relative pt-8 pb-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <Link href="/developer" className="text-white/40 text-sm hover:text-white transition-colors">
                ← Back to Dashboard
              </Link>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download .md
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              API <span className="text-[var(--primary)]">Documentation</span>
            </h1>
            <p className="text-white/50 mt-3">
              Base URL: <code className="text-[var(--primary)]">{BASE_URL}</code>
            </p>
          </div>

          {/* Authentication */}
          <LiquidCard className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">Authentication</h2>
            <p className="text-white/60 text-sm mb-4">
              All requests require a valid API key sent via the <code className="text-[var(--primary)]">Authorization</code> header.
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-sm">
              Authorization: Bearer nh_live_your_key_here
            </div>
          </LiquidCard>

          {/* Rate Limits */}
          <LiquidCard className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">Rate Limits & Credits</h2>
            <div className="space-y-3 text-sm text-white/60">
              <p><strong className="text-white">Rate limit:</strong> 30 requests per minute per API key</p>
              <p><strong className="text-white">Credits:</strong> Each endpoint costs a specific number of credits (1 credit = $0.01)</p>
              <p><strong className="text-white">Minimum top-up:</strong> $10 (1,000 credits)</p>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/50">
              Response headers include <code className="text-[var(--primary)]">X-Credits-Remaining</code> and <code className="text-[var(--primary)]">X-Credits-Used</code> after each call.
            </div>
          </LiquidCard>

          {/* Error Codes */}
          <LiquidCard className="p-8 mb-6">
            <h2 className="text-xl font-bold mb-4">Error Codes</h2>
            <div className="space-y-2">
              {[
                { code: '401', desc: 'Invalid or missing API key' },
                { code: '402', desc: 'Insufficient credits - top up your balance' },
                { code: '429', desc: 'Rate limit exceeded - wait 60 seconds' },
                { code: '400', desc: 'Bad request - missing required parameters' },
                { code: '404', desc: 'Resource not found' },
                { code: '500', desc: 'Server error' },
              ].map((err, i) => (
                <div key={i} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-white/5">
                  <code className={`text-sm font-bold w-12 ${
                    err.code === '401' || err.code === '402' ? 'text-red-400' :
                    err.code === '429' ? 'text-amber-400' : 'text-white/60'
                  }`}>{err.code}</code>
                  <span className="text-sm text-white/60">{err.desc}</span>
                </div>
              ))}
            </div>
          </LiquidCard>

          {/* Endpoints */}
          <h2 className="text-2xl font-bold mb-6 mt-12">Endpoints</h2>

          {endpoints.map((ep, i) => (
            <LiquidCard key={i} className="p-8 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold">
                  {ep.method}
                </span>
                <code className="text-lg font-bold">{ep.path}</code>
                <span className="ml-auto text-xs text-white/40">{ep.cost}</span>
              </div>
              <p className="text-white/60 text-sm mb-4">{ep.description}</p>

              {ep.params.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Parameters</p>
                  <div className="space-y-1">
                    {ep.params.map((p, j) => (
                      <div key={j} className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-white/5">
                        <code className="text-sm text-[var(--primary)] w-24">{p.name}</code>
                        <span className="text-xs text-white/30 w-16">{p.type}</span>
                        <span className="text-sm text-white/50">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Example Response</p>
                <pre className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-white/70 overflow-x-auto whitespace-pre">
                  {ep.response}
                </pre>
              </div>
            </LiquidCard>
          ))}

        </div>
      </section>
    </main>
  )
}
