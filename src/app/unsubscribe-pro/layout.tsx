import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Unsubscribe - Pro Newsletter",
  description: "Unsubscribe from NICHES HUNTER Pro newsletter emails.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function UnsubscribeProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
