import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your NICHES HUNTER account.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
