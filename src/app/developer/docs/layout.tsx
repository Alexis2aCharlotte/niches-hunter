import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation - Endpoints, Authentication & Pricing',
  description:
    'Complete documentation for the Niches Hunter Developer API. Learn about authentication, rate limits, credit costs, and endpoints for niches, rankings, opportunities, and categories.',
  keywords: [
    'niches hunter api docs',
    'app store api documentation',
    'app data api endpoints',
    'app store rankings api',
    'niche analysis api',
    'mobile app market data',
  ],
  openGraph: {
    title: 'API Documentation - Niches Hunter Developer API',
    description:
      'Complete documentation for the Niches Hunter Developer API. Endpoints, authentication, rate limits, and credit pricing.',
    url: 'https://nicheshunter.app/developer/docs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation - Niches Hunter Developer API',
    description:
      'Complete documentation for the Niches Hunter Developer API. Endpoints, authentication, rate limits, and credit pricing.',
  },
  alternates: {
    canonical: 'https://nicheshunter.app/developer/docs',
  },
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
