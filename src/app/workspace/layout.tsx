import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Workspace",
  description: "Your personal NICHES HUNTER workspace.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
