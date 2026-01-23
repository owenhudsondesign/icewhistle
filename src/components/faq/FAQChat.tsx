'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Send, Phone, ChevronRight, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/hooks/use-language'
import { search, KnowledgeEntry } from '@/lib/search'
import { ChatMessage, categoryRoutes } from './types'

const faqTranslations = {
  en: {
    greeting: "Hi! I can help you find information about your rights. What would you like to know?",
    placeholder: 'Ask a question...',
    noResults: "I couldn't find specific info on that. Try the United We Dream hotline for help:",
    learnMore: 'Learn more',
    hotlineNumber: '1-844-363-1423',
    suggestedTitle: 'Common questions:',
  },
  es: {
    greeting: '¡Hola! Puedo ayudarte a encontrar información sobre tus derechos. ¿Qué te gustaría saber?',
    placeholder: 'Haz una pregunta...',
    noResults: 'No encontré información específica. Prueba la línea de ayuda de United We Dream:',
    learnMore: 'Saber más',
    hotlineNumber: '1-844-363-1423',
    suggestedTitle: 'Preguntas comunes:',
  },
  pt: {
    greeting: 'Olá! Posso ajudá-lo a encontrar informações sobre seus direitos. O que você gostaria de saber?',
    placeholder: 'Faça uma pergunta...',
    noResults: 'Não encontrei informações específicas. Tente a linha de ajuda do United We Dream:',
    learnMore: 'Saiba mais',
    hotlineNumber: '1-844-363-1423',
    suggestedTitle: 'Perguntas comuns:',
  },
}

const suggestedQuestions = {
  en: [
    'What if ICE comes to my door?',
    'How do I find a detained family member?',
    'What are my rights in a traffic stop?',
    'How do I find a free immigration lawyer?',
    'What should I do if arrested?',
    'How do I protect my children?',
  ],
  es: [
    '¿Qué hago si ICE llega a mi puerta?',
    '¿Cómo encuentro a un familiar detenido?',
    '¿Cuáles son mis derechos en una parada de tráfico?',
    '¿Cómo encuentro un abogado de inmigración gratis?',
    '¿Qué debo hacer si me arrestan?',
    '¿Cómo protejo a mis hijos?',
  ],
  pt: [
    'E se o ICE vier à minha porta?',
    'Como encontro um familiar detido?',
    'Quais são meus direitos em uma parada de trânsito?',
    'Como encontro um advogado de imigração gratuito?',
    'O que devo fazer se for preso?',
    'Como protejo meus filhos?',
  ],
}

export function FAQChat() {
  const { language } = useLanguage()
  const t = faqTranslations[language]
  const questions = suggestedQuestions[language]

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize with greeting
  useEffect(() => {
    setMessages([{
      id: 'greeting',
      type: 'bot',
      content: t.greeting,
      timestamp: new Date(),
    }])
  }, [t.greeting])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate brief typing delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 300))

    // Search knowledge base
    const results = search(query, { limit: 3, minScore: 0.05 })

    // Add bot response
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: results.length > 0 ? '' : t.noResults,
      timestamp: new Date(),
      results: results.map(r => r.entry),
    }
    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(input)
  }

  const handleSuggestionClick = (question: string) => {
    handleSearch(question)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-[#00A6B4]/20 text-[#00A6B4]'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <div className={`space-y-2 ${message.type === 'user' ? 'text-right' : ''}`}>
                {message.content && (
                  <div className={`inline-block p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}

                {/* Search Results */}
                {message.results && message.results.length > 0 && (
                  <div className="space-y-2">
                    {message.results.map((entry) => (
                      <ResultCard key={entry.id} entry={entry} learnMoreText={t.learnMore} />
                    ))}
                  </div>
                )}

                {/* No results - show hotline */}
                {message.results && message.results.length === 0 && (
                  <a
                    href={`tel:${t.hotlineNumber.replace(/-/g, '')}`}
                    className="inline-flex items-center gap-2 p-3 bg-[#DC2626]/10 rounded-lg text-[#DC2626] hover:bg-[#DC2626]/20 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-semibold">{t.hotlineNumber}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00A6B4]/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-[#00A6B4]" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">{t.suggestedTitle}</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-foreground transition-colors press-scale"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="rounded-full bg-[#00A6B4] hover:bg-[#00A6B4]/90 h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

// Result Card Component
function ResultCard({ entry, learnMoreText }: { entry: KnowledgeEntry; learnMoreText: string }) {
  const route = categoryRoutes[entry.category]

  return (
    <div className="bg-card border rounded-xl p-3 space-y-2 text-left">
      <h3 className="font-semibold text-sm">{entry.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-3">{entry.content}</p>

      <div className="flex flex-wrap gap-2 pt-1">
        {/* Phone numbers */}
        {entry.phones?.map((phone, i) => (
          <a
            key={i}
            href={`tel:${phone.replace(/[^0-9]/g, '')}`}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#00A6B4]/10 text-[#00A6B4] rounded-md hover:bg-[#00A6B4]/20 transition-colors"
          >
            <Phone className="h-3 w-3" />
            {phone}
          </a>
        ))}

        {/* Learn more link */}
        <Link
          href={route}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
        >
          {learnMoreText}
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

export default FAQChat
