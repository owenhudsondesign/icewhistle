import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ICE Activity Near Me - Live Community Alerts Map',
  description: 'Report and view real-time ICE activity alerts near you. Anonymous ICE sighting reports, ICE raid alerts, checkpoint warnings. Free ICE tracker app for community safety. Reportar actividad de ICE cerca de mí.',
  keywords: [
    'ICE activity near me',
    'ICE alerts',
    'ICE sighting app',
    'ICE tracker app',
    'ICE raid alerts',
    'report ICE activity',
    'ICE checkpoint alerts',
    'immigration enforcement alerts',
    'rapid response immigration',
    'alerta de ICE',
    'redada de ICE',
    'actividad de ICE cerca de mí',
  ],
  openGraph: {
    title: 'ICE Activity Near Me - Live Alerts | ICEwhistle',
    description: 'Real-time community alerts for ICE activity. Report raids, checkpoints, and ICE sightings anonymously. Free ICE tracker app.',
  },
}

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
