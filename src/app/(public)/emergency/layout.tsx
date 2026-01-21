import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What to Do if ICE Stops You - Emergency Guide',
  description: 'Step-by-step emergency guidance: What to do if ICE is at your door, ICE pulled you over, or a family member was detained by ICE. Know your rights. Find someone in ICE detention. Qué hacer si llega ICE.',
  keywords: [
    'what to do if ICE stops you',
    'ICE at my door what to do',
    'ICE pulled me over',
    'ICE is near me',
    'family member detained by ICE',
    'what happens if ICE takes my family member',
    'ICE raid what are my rights',
    'how to find someone detained by ICE',
    'ICE emergency',
    'qué hacer si llega ICE',
    'redada de ICE qué hacer',
    'ICE en mi puerta',
  ],
  openGraph: {
    title: 'What to Do if ICE Stops You | Emergency Guide | ICEwhistle',
    description: 'Emergency guidance for ICE encounters. What to do if ICE is at your door, if you\'re pulled over, or if a family member is detained.',
  },
}

export default function EmergencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
