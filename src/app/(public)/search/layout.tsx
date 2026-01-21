import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Immigration Rights Resources',
  description: 'Search for immigration rights information, ICE encounter guidance, legal resources, and emergency hotlines. Find answers about your rights with ICE. Works offline.',
  keywords: [
    'immigration rights search',
    'ICE rights information',
    'immigration lawyer near me',
    'legal aid immigration',
    'immigration emergency hotline',
    'know your rights ICE',
    'ayuda legal inmigración gratis',
    'immigration resources',
  ],
  openGraph: {
    title: 'Search Immigration Rights Resources | ICEwhistle',
    description: 'Search for immigration rights information, legal resources, and emergency guidance. Works offline.',
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
