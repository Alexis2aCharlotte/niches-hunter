import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Revenue Estimator - Calculate Your App's MRR Potential | NICHES HUNTER",
  description: "Estimate your iOS app's revenue potential before writing code. Get realistic MRR projections based on market data from 40,000+ apps.",
  keywords: [
    "app revenue calculator",
    "mrr estimator",
    "app revenue potential",
    "how much can my app make",
    "ios app revenue estimate",
    "saas revenue calculator",
    "app monetization calculator",
  ],
  openGraph: {
    title: "Revenue Estimator - Calculate Your App's MRR | NICHES HUNTER",
    description: "Estimate your app's revenue potential. Get realistic MRR projections based on 40,000+ apps data.",
    type: "website",
    url: "https://nicheshunter.app/revenue-estimator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revenue Estimator - Calculate Your App's MRR | NICHES HUNTER",
    description: "Estimate your app's revenue potential. Get realistic MRR projections based on 40,000+ apps data.",
  },
  alternates: {
    canonical: "https://nicheshunter.app/revenue-estimator",
  },
}

// FAQ Schema for rich snippets
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much money can an iOS app make?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "iOS app revenue varies widely based on niche, business model, and target market. A well-positioned subscription app can generate $5,000 to $50,000+ MRR. Utility apps with one-time purchases typically earn $3,000 to $15,000/month. The key factors are market size, competition level, pricing strategy, and user acquisition costs."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best monetization model for iOS apps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Subscription models typically generate the highest lifetime value for iOS apps, with average revenue 40% higher than one-time purchases. Freemium works well for apps with strong viral potential. One-time purchases suit utility apps. Ads-based models require massive scale (100K+ users) to be profitable for indie developers."
      }
    },
    {
      "@type": "Question",
      "name": "How many users do I need to make $10K/month with my iOS app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "With a subscription model at $9.99/month and 3-5% conversion rate, you need approximately 25,000-35,000 free users to generate $10K MRR. With a one-time purchase at $29.99, you need about 350 sales per month. The exact number depends on your pricing, conversion rate, and business model."
      }
    },
    {
      "@type": "Question",
      "name": "Which iOS app categories make the most money?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The highest revenue iOS app categories for indie developers are: Business and productivity apps (high willingness to pay), Health and fitness apps (strong subscription retention), Finance apps (premium pricing accepted), and Education apps (growing market). Avoid oversaturated categories like casual games where user acquisition costs are prohibitive."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate are app revenue estimates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our revenue estimates are based on real App Store data from 40,000+ iOS apps. We analyze similar apps in your niche, their pricing, download estimates, and revenue patterns. While no estimate can guarantee results, our projections provide realistic ranges based on actual market performance in your target category."
      }
    }
  ]
}

export default function RevenueEstimatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
