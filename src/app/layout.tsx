import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://icewhistle.org'),
  title: {
    default: 'ICEwhistle - Immigration Safety & Know Your Rights',
    template: '%s | ICEwhistle',
  },
  description: 'Free, anonymous community alert system for immigrant safety. Know your rights during ICE encounters, access emergency hotlines, find legal aid. Available in English, Spanish, and Portuguese.',
  keywords: [
    'immigration rights',
    'ICE alerts',
    'know your rights',
    'immigrant safety',
    'derechos de inmigrantes',
    'alerta de ICE',
    'legal aid immigration',
    'emergency resources immigrants',
    'constitutional rights',
    'deportation defense',
    'community alerts',
    'sanctuary',
  ],
  authors: [{ name: 'ICEwhistle Community' }],
  creator: 'ICEwhistle',
  publisher: 'ICEwhistle',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ICEwhistle',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_US', 'pt_BR'],
    url: 'https://icewhistle.org',
    siteName: 'ICEwhistle',
    title: 'ICEwhistle - Immigration Safety & Know Your Rights',
    description: 'Free, anonymous community alert system for immigrant safety. Know your rights, access emergency resources, find legal aid.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ICEwhistle - Community Immigration Safety Resource',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICEwhistle - Immigration Safety & Know Your Rights',
    description: 'Free, anonymous community alert system for immigrant safety. Know your rights, access emergency resources, find legal aid.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://icewhistle.org',
    languages: {
      'en-US': 'https://icewhistle.org',
      'es-US': 'https://icewhistle.org',
      'pt-BR': 'https://icewhistle.org',
    },
  },
  category: 'public safety',
}

export const viewport: Viewport = {
  themeColor: '#0F172A', // Slate 900 for dark mode
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ICEwhistle',
  description: 'Free, anonymous community alert system for immigrant safety. Know your rights during ICE encounters, access emergency hotlines, find legal aid.',
  url: 'https://icewhistle.org',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  inLanguage: ['en', 'es', 'pt'],
  isAccessibleForFree: true,
  audience: {
    '@type': 'Audience',
    audienceType: 'Immigrant communities, legal aid workers, community organizers',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://icewhistle.org/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ICEwhistle',
  url: 'https://icewhistle.org',
  logo: 'https://icewhistle.org/images/icewhistle-logo-dark.svg',
  description: 'Community-maintained immigration safety resource providing know-your-rights information, emergency alerts, and legal aid connections.',
  sameAs: [
    'https://opencollective.com/icewhistle-app',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${plusJakarta.className} ${plusJakarta.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
