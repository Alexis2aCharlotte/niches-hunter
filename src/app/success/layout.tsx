import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payment Success",
  description: "Your payment was successful. Welcome to NICHES HUNTER Pro!",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
