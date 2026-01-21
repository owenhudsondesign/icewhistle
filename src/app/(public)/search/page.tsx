'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBox from '@/components/search/SearchBox'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  return <SearchBox initialQuery={initialQuery} />
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Search Resources</h1>
        <p className="text-lg text-muted-foreground">
          Find information about your rights, legal resources, and emergency help
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          All searches work offline - no internet required
        </p>
      </div>

      <Suspense fallback={<div className="text-center">Loading search...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  )
}
