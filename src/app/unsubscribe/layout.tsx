import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from NICHES HUNTER newsletter.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
