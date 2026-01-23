import { KnowledgeEntry, CategoryId } from '@/lib/search'

export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'suggestions'
  content: string
  timestamp: Date
  results?: KnowledgeEntry[]
  category?: CategoryId
}

export const categoryRoutes: Record<CategoryId, string> = {
  rights: '/rights',
  emergency: '/emergency',
  legal: '/resources#legal',
  detention: '/emergency?type=taken',
  resources: '/resources',
  vulnerable: '/resources',
  workplace: '/resources',
}
