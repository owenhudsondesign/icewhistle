'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBox from '@/components/search/SearchBox'
import { useLanguage } from '@/hooks/use-language'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  return <SearchBox initialQuery={initialQuery} />
}

export default function SearchPage() {
  const { t } = useLanguage()
  const search_t = t.search || {}
  const common_t = t.common || {}

  return (
    <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{search_t.pageTitle || 'Search Resources'}</h1>
        <p className="text-lg text-muted-foreground">
          {search_t.searchDesc || 'Find information about your rights, legal resources, and emergency help'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {search_t.offlineNote || 'All searches work offline - no internet required'}
        </p>
      </div>

      <Suspense fallback={<div className="text-center">{common_t.loading || 'Loading...'}</div>}>
        <SearchContent />
      </Suspense>
    </main>
  )
}
