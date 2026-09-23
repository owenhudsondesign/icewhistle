'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, X, ExternalLink, Phone, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { search, getSuggestedSearches, type KnowledgeEntry } from '@/lib/search'
import { categories, CategoryId } from '@/data/knowledge-base'

interface SearchResult {
  entry: KnowledgeEntry
  score: number
  matchedTerms: string[]
}

interface SearchBoxProps {
  initialQuery?: string
}

export function SearchBox({ initialQuery = '' }: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | undefined>()
  const [showSuggestions, setShowSuggestions] = useState(!initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialSearchDone = useRef(false)

  const suggestedSearches = getSuggestedSearches()

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowSuggestions(true)
      return
    }

    setIsSearching(true)
    setShowSuggestions(false)

    // Small delay for UX
    setTimeout(() => {
      const searchResults = search(searchQuery, {
        category: selectedCategory,
        limit: 8,
        minScore: 0.05,
      })
      setResults(searchResults)
      setIsSearching(false)
    }, 100)
  }, [selectedCategory])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, handleSearch])

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowSuggestions(true)
    inputRef.current?.focus()
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for information about your rights, resources, legal help..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 py-6 text-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant={selectedCategory === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(undefined)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.id as CategoryId)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Suggested Searches */}
      {showSuggestions && !query && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Common Questions
          </h2>
          <div className="space-y-2">
            {suggestedSearches.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors flex items-center justify-between group"
              >
                <span>{suggestion}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="mt-6 text-center text-muted-foreground">
          Searching...
        </div>
      )}

      {/* Search Results */}
      {!isSearching && results.length > 0 && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          {results.map((result) => (
            <SearchResultCard key={result.entry.id} result={result} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isSearching && query && results.length === 0 && (
        <div className="mt-6 text-center">
          <p className="text-muted-foreground mb-4">
            No results found for "{query}"
          </p>
          <p className="text-sm text-muted-foreground">
            Try different keywords or browse by category above.
          </p>
        </div>
      )}
    </div>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const { entry } = result
  const [expanded, setExpanded] = useState(false)

  const categoryInfo = categories.find(c => c.id === entry.category)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{entry.title}</CardTitle>
            <CardDescription>
              {categoryInfo?.name || entry.category}
            </CardDescription>
          </div>
          {entry.priority && entry.priority >= 9 && (
            <span className="px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded">
              Important
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm text-muted-foreground ${!expanded && 'line-clamp-3'}`}>
          {entry.content}
        </p>

        {entry.content.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary mt-2 hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Phone Numbers */}
        {entry.phones && entry.phones.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.phones.map((phone, index) => (
              <a
                key={index}
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            ))}
          </div>
        )}

        {/* URLs */}
        {entry.urls && entry.urls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.urls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2"
              >
                <ExternalLink className="h-3 w-3" />
                {new URL(url).hostname.replace('www.', '')}
              </a>
            ))}
          </div>
        )}

        {/* Languages */}
        {entry.languages && entry.languages.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Available in: {entry.languages.join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default SearchBox
