import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Developer API - Access App Store Data Programmatically',
  description:
    'Get programmatic access to App Store rankings, trending niches, and market analysis. Pay-as-you-go API with $1 free credit. Generate your API key in seconds.',
  keywords: [
    'app store api',
    'app store data api',
    'mobile app data api',
    'app rankings api',
    'niche research api',
    'app store trends api',
    'ios app data',
    'app market research api',
  ],
  openGraph: {
    title: 'Developer API - Access App Store Data Programmatically',
    description:
      'Get programmatic access to App Store rankings, trending niches, and market analysis. Pay-as-you-go API with $1 free credit.',
    url: 'https://nicheshunter.app/developer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer API - Access App Store Data Programmatically',
    description:
      'Get programmatic access to App Store rankings, trending niches, and market analysis. Pay-as-you-go API with $1 free credit.',
  },
  alternates: {
    canonical: 'https://nicheshunter.app/developer',
  },
}

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
