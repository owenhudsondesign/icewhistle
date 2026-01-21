import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Updates Near Me - Live Safety Alerts',
  description: 'View and share community safety updates in your area. Anonymous community reports, checkpoint information, and safety alerts. Free community safety resource. Actualizaciones de la comunidad cerca de mí.',
  keywords: [
    'community updates near me',
    'community safety alerts',
    'immigration community updates',
    'community reports',
    'safety information',
    'immigration checkpoint info',
    'community safety resource',
    'rapid response immigration',
    'actualizaciones de la comunidad',
    'información de seguridad',
  ],
  openGraph: {
    title: 'Community Updates Near Me | ICEwhistle',
    description: 'Community safety updates and information sharing. View reports and stay informed. Free community safety resource.',
  },
}

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
