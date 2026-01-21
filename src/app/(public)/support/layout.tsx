import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support ICEwhistle - Keep Immigration Safety Resources Free',
  description: 'Support the free ICE alert app and immigration rights resource. Help keep know-your-rights information, ICE activity alerts, and legal aid connections available to everyone.',
  keywords: [
    'support immigration rights',
    'donate immigration safety',
    'support ICE alert app',
    'immigration community support',
  ],
  openGraph: {
    title: 'Support ICEwhistle | ICEwhistle',
    description: 'Support the free immigration safety resource. Help keep know-your-rights information and ICE alerts available to everyone.',
  },
}

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
