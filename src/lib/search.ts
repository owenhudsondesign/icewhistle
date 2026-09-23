/**
 * Local Semantic Search for ICEwhistle
 * Uses TF-IDF based search for offline functionality
 * No external API calls - all processing happens locally
 */

import { knowledgeBase, type KnowledgeEntry, type CategoryId } from '@/data/knowledge-base'

export type { KnowledgeEntry, CategoryId }

// Stopwords to exclude from search
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what',
  'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'if', 'my',
  'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'us', 'them'
])

// Synonyms for better matching
const SYNONYMS: Record<string, string[]> = {
  'lawyer': ['attorney', 'counsel', 'legal aid', 'abogado'],
  'attorney': ['lawyer', 'counsel', 'legal aid', 'abogado'],
  'detained': ['arrested', 'custody', 'jail', 'held', 'locked up'],
  'arrested': ['detained', 'custody', 'jail', 'held'],
  'ice': ['immigration', 'enforcement', 'dhs'],
  'rights': ['constitutional', 'legal', 'protections'],
  'help': ['assistance', 'support', 'aid', 'resources'],
  'child': ['minor', 'kid', 'children', 'youth', 'young'],
  'door': ['home', 'house', 'residence', 'apartment'],
  'warrant': ['order', 'document', 'paper'],
  'call': ['phone', 'contact', 'reach'],
  'silent': ['quiet', 'not talk', 'refuse to answer'],
  'scared': ['afraid', 'fear', 'worried', 'anxious'],
  'money': ['pay', 'fund', 'bail', 'bond', 'cost'],
  'find': ['locate', 'search', 'look for', 'where'],
  'family': ['relative', 'parent', 'children', 'spouse'],
}

interface SearchResult {
  entry: KnowledgeEntry
  score: number
  matchedTerms: string[]
}

interface DocumentIndex {
  id: string
  terms: Map<string, number> // term -> frequency
  magnitude: number
}

// Pre-computed document index
let documentIndex: DocumentIndex[] | null = null
let idfScores: Map<string, number> | null = null

/**
 * Tokenize and normalize text
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOPWORDS.has(word))
}

/**
 * Expand query with synonyms
 */
function expandQuery(terms: string[]): string[] {
  const expanded = new Set(terms)

  for (const term of terms) {
    const synonyms = SYNONYMS[term]
    if (synonyms) {
      synonyms.forEach(syn => expanded.add(syn))
    }

    // Also check if term is a synonym of something
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (syns.includes(term)) {
        expanded.add(key)
      }
    }
  }

  return Array.from(expanded)
}

/**
 * Build the document index for TF-IDF search
 */
function buildIndex(): void {
  if (documentIndex) return

  documentIndex = []
  const documentFrequency = new Map<string, number>()

  // First pass: build term frequencies for each document
  for (const entry of knowledgeBase) {
    const text = [
      entry.title,
      entry.content,
      ...entry.keywords,
    ].join(' ')

    const tokens = tokenize(text)
    const termFreq = new Map<string, number>()

    for (const token of tokens) {
      termFreq.set(token, (termFreq.get(token) || 0) + 1)
    }

    // Track which terms appear in this document
    Array.from(termFreq.keys()).forEach(term => {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1)
    })

    // Calculate magnitude for cosine similarity
    let magnitude = 0
    Array.from(termFreq.values()).forEach(freq => {
      magnitude += freq * freq
    })

    documentIndex.push({
      id: entry.id,
      terms: termFreq,
      magnitude: Math.sqrt(magnitude),
    })
  }

  // Calculate IDF scores
  const newIdfScores = new Map<string, number>()
  const numDocs = knowledgeBase.length

  Array.from(documentFrequency.entries()).forEach(([term, docFreq]) => {
    newIdfScores.set(term, Math.log((numDocs + 1) / (docFreq + 1)) + 1)
  })

  idfScores = newIdfScores
}

/**
 * Search the knowledge base
 */
export function search(
  query: string,
  options: {
    category?: CategoryId
    limit?: number
    minScore?: number
  } = {}
): SearchResult[] {
  const { category, limit = 10, minScore = 0.1 } = options

  buildIndex()

  if (!documentIndex || !idfScores) return []

  const queryTerms = tokenize(query)
  const expandedTerms = expandQuery(queryTerms)

  const results: SearchResult[] = []

  for (let i = 0; i < knowledgeBase.length; i++) {
    const entry = knowledgeBase[i]
    const doc = documentIndex[i]

    // Filter by category if specified
    if (category && entry.category !== category) continue

    // Calculate TF-IDF score
    let score = 0
    const matchedTerms: string[] = []

    for (const term of expandedTerms) {
      const termFreq = doc.terms.get(term) || 0
      if (termFreq > 0) {
        const idf = idfScores.get(term) || 1
        score += termFreq * idf
        if (queryTerms.includes(term)) {
          matchedTerms.push(term)
        }
      }
    }

    // Normalize by document magnitude
    if (doc.magnitude > 0) {
      score = score / doc.magnitude
    }

    // Boost exact keyword matches
    for (const keyword of entry.keywords) {
      const keywordLower = keyword.toLowerCase()
      if (expandedTerms.some(t => keywordLower.includes(t))) {
        score *= 1.5
        if (!matchedTerms.includes(keyword)) {
          matchedTerms.push(keyword)
        }
      }
    }

    // Boost by priority
    if (entry.priority) {
      score *= (1 + entry.priority / 20)
    }

    // Boost title matches
    const titleLower = entry.title.toLowerCase()
    for (const term of queryTerms) {
      if (titleLower.includes(term)) {
        score *= 1.8
      }
    }

    if (score >= minScore) {
      results.push({ entry, score, matchedTerms })
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, limit)
}

/**
 * Get entries by category
 */
export function getByCategory(category: CategoryId): KnowledgeEntry[] {
  return knowledgeBase.filter(entry => entry.category === category)
}

/**
 * Get a specific entry by ID
 */
export function getById(id: string): KnowledgeEntry | undefined {
  return knowledgeBase.find(entry => entry.id === id)
}

/**
 * Get suggested searches based on common needs
 */
export function getSuggestedSearches(): string[] {
  return [
    'What are my rights if ICE comes to my door?',
    'How do I find a detained family member?',
    'What is the difference between judicial and administrative warrants?',
    'How do I find a free immigration lawyer?',
    'What should I do if I am arrested?',
    'How can I protect my children if I am detained?',
    'What are my rights at work?',
    'How do I pay immigration bond?',
  ]
}

/**
 * Get emergency contacts
 */
export function getEmergencyContacts(): KnowledgeEntry[] {
  return knowledgeBase.filter(
    entry => entry.phones && entry.phones.length > 0 && entry.priority && entry.priority >= 9
  )
}

/**
 * Escapes regex metacharacters so a term is matched literally.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Highlight matched terms in text
 */
export function highlightMatches(text: string, matchedTerms: string[]): string {
  if (matchedTerms.length === 0) return text

  let result = text
  for (const term of matchedTerms) {
    // Matched terms come from entry keywords, which are content rather than
    // patterns. An unescaped metacharacter would throw and take the whole
    // search results page down with it.
    const regex = new RegExp(`\\b(${escapeRegExp(term)})\\b`, 'gi')
    result = result.replace(regex, '**$1**')
  }
  return result
}
