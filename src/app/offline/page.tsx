'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WifiOff, BookOpen, FileText, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

export default function OfflinePage() {
  const { t } = useLanguage()
  const offline_t = t.offline || {}
  const nav_t = t.nav || {}

  return (
    <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <WifiOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{offline_t.title || "You're Offline"}</h1>
        <p className="text-lg text-muted-foreground">
          {offline_t.description || 'Some features require an internet connection, but you can still access cached content.'}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{offline_t.availableOffline || 'Available Offline'}</CardTitle>
          <CardDescription>
            {offline_t.availableOfflineDesc || 'These features work without an internet connection'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link
            href="/rights"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">{nav_t.rights || 'Know Your Rights'}</div>
              <div className="text-sm text-muted-foreground">
                {offline_t.accessCachedRights || 'Access cached rights information'}
              </div>
            </div>
          </Link>
          <Link
            href="/resources"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">{offline_t.printableResources || 'Printable Resources'}</div>
              <div className="text-sm text-muted-foreground">
                {offline_t.viewDownloaded || 'View downloaded PDF materials'}
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {offline_t.tryAgain || 'Try Again'}
        </Button>
      </div>
    </main>
  )
}
