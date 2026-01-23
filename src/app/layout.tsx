import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { BottomNav, AppWrapper } from '@/components/shared/BottomNav'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://icewhistle.app'),
  title: {
    default: 'ICEwhistle - Know Your Rights App | ICE Alert & Immigration Safety',
    template: '%s | ICEwhistle',
  },
  description: 'Free immigration rights app: What to do if ICE stops you, ICE at your door, or ICE pulled you over. Find someone detained by ICE. Know your rights with ICE. 4th Amendment protection. Available in English and Spanish. Qué hacer si llega ICE.',
  keywords: [
    // High-Intent Action Keywords
    'what to do if ICE stops you',
    'ICE at my door what to do',
    'ICE pulled me over',
    'how to find someone detained by ICE',
    'ICE raid what are my rights',
    'family member detained by ICE',
    // Know Your Rights Keywords
    'immigration rights app',
    'know your rights ICE',
    'immigrant rights card',
    'red card immigration',
    '4th amendment ICE',
    'do I have to show ID to ICE',
    'can ICE enter my home',
    'ICE warrant vs judicial warrant',
    // Tool/App Keywords (App Store compliant)
    'community safety app',
    'immigration emergency app',
    'community updates immigration',
    'rapid response immigration app',
    'immigration rights resource',
    // Location + Crisis Keywords
    'ICE activity near me',
    'immigration lawyer near me',
    'ICE hotline',
    'immigration emergency hotline',
    // Spanish Keywords
    'qué hacer si llega ICE',
    'mis derechos con inmigración',
    'actualizaciones de la comunidad',
    'redada de ICE qué hacer',
    'ayuda legal inmigración gratis',
    // Long-Tail / FAQ-Style
    'can ICE arrest me at a traffic stop',
    'do passengers have to show ID to ICE',
    'what happens if ICE takes my family member',
    'how to find someone in ICE detention',
    'how long can ICE hold you',
    // Original keywords
    'immigration rights',
    'community alerts',
    'know your rights',
    'immigrant safety',
    'derechos de inmigrantes',
    'constitutional rights',
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
    url: 'https://icewhistle.app',
    siteName: 'ICEwhistle',
    title: 'ICEwhistle - Know Your Rights App | What to Do if ICE Stops You',
    description: 'Free ICE alert app: Know your rights if ICE is at your door, find detained family members, report ICE activity near you. Immigration emergency hotline & legal aid. Qué hacer si llega ICE.',
    images: [
      {
        url: 'https://icewhistle.app/images/og-image.png',
        secureUrl: 'https://icewhistle.app/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ICEwhistle - Immigration Rights App & ICE Alert System',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICEwhistle - Know Your Rights | ICE Alert App',
    description: 'Free app: What to do if ICE stops you. Find someone in ICE detention. Report ICE activity near you. Know your 4th Amendment rights. Qué hacer si llega ICE.',
    images: ['https://icewhistle.app/images/og-image.png'],
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
    canonical: 'https://icewhistle.app',
    languages: {
      'en-US': 'https://icewhistle.app',
      'es-US': 'https://icewhistle.app',
      'pt-BR': 'https://icewhistle.app',
    },
  },
  category: 'reference',
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
  alternateName: ['Know Your Rights App', 'Immigration Rights App', 'Community Safety App'],
  description: 'Free immigration rights app: What to do if ICE stops you, ICE at your door, find someone detained by ICE. Know your rights with ICE. Community updates near you. Qué hacer si llega ICE.',
  url: 'https://icewhistle.app',
  applicationCategory: 'ReferenceApplication',
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
    target: 'https://icewhistle.app/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  keywords: 'immigration rights app, know your rights ICE, community safety, what to do if ICE stops you, ICE at my door, find someone detained by ICE, qué hacer si llega ICE',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ICEwhistle',
  url: 'https://icewhistle.app',
  logo: 'https://icewhistle.app/images/icewhistle-logo-dark.svg',
  description: 'Community-maintained immigration safety resource: know your rights with ICE, emergency alerts, find someone in ICE detention, immigration lawyer connections.',
  sameAs: [
    'https://opencollective.com/icewhistle-app',
  ],
}

// FAQ Schema for long-tail keywords and GEO
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What should I do if ICE stops me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Stay calm and do not run. You have the right to remain silent - say "I am exercising my right to remain silent." Do not sign any documents without an attorney. You have the right to speak with a lawyer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do I do if ICE is at my door?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Do NOT open the door unless they show a JUDICIAL warrant signed by a JUDGE. Ask "Do you have a warrant signed by a judge?" through the closed door. An ICE administrative warrant (Form I-200 or I-205) does NOT allow them to enter your home. Say "I do not consent to your entry."',
      },
    },
    {
      '@type': 'Question',
      name: 'Can ICE enter my home without permission?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ICE cannot enter your home without your consent or a judicial warrant signed by a judge. An ICE administrative warrant (I-200, I-205) is NOT a judicial warrant and does NOT authorize entry. Your 4th Amendment rights protect you from unreasonable searches.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find someone detained by ICE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the ICE Detainee Locator at locator.ice.gov or call 1-888-351-4024 (24/7). You will need the person\'s A-Number (Alien Registration Number) or full name and country of birth. It may take 24-72 hours for someone to appear in the system.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I have to show ID to ICE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You do NOT have to show identification to ICE agents. You have the right to remain silent and do not have to answer questions about your immigration status, where you were born, or how you entered the United States.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do passengers have to show ID to ICE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Passengers in a vehicle do NOT have to show identification to ICE. Only the driver must provide license, registration, and insurance. Passengers can remain completely silent and do not have to answer any questions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between an ICE warrant and a judicial warrant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A judicial warrant is signed by a JUDGE and allows ICE to enter your home. An ICE administrative warrant (Form I-200 or I-205) is signed by an ICE officer, NOT a judge, and does NOT authorize entry into your home. Always ask to see the warrant through a window or under the door.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long can ICE hold you?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ICE can hold you while your immigration case is processed. You may be eligible for bond. The average immigration bond is approximately $8,176. Contact an immigration attorney immediately to understand your options.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if ICE takes my family member?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Act quickly: 1) Get their A-Number if possible, 2) Search the ICE Detainee Locator at locator.ice.gov or call 1-888-351-4024, 3) Contact an immigration attorney, 4) Tell them NOT to sign any documents, especially "voluntary departure" forms, 5) Contact their country\'s consulate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qué hacer si llega ICE a mi casa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NO abra la puerta a menos que muestren una orden JUDICIAL firmada por un JUEZ. Pregunte "¿Tiene una orden firmada por un juez?" a través de la puerta cerrada. Una orden administrativa de ICE (Formulario I-200 o I-205) NO les permite entrar. Diga "No doy mi consentimiento para que entren."',
      },
    },
    {
      '@type': 'Question',
      name: 'Cuáles son mis derechos si ICE me detiene?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tiene derecho a permanecer en silencio. Diga "Estoy ejerciendo mi derecho a permanecer en silencio." No firme ningún documento sin un abogado. Tiene derecho a hablar con un abogado. No tiene que responder preguntas sobre su estatus migratorio.',
      },
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className={`${plusJakarta.className} ${plusJakarta.variable} antialiased`}>
        <Providers>
          <AppWrapper>
            {children}
          </AppWrapper>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
