import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your NICHES HUNTER password.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
