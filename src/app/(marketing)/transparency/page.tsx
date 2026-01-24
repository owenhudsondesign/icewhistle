'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import {
  ArrowLeft,
  ExternalLink,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Heart,
  Package,
  Truck,
  Wrench,
  Server,
  Receipt
} from 'lucide-react'

const pageTranslations = {
  en: {
    back: 'Back',
    title: 'Full Transparency',
    subtitle: 'Every dollar tracked. Every receipt public. This is how we build trust.',
    summaryTitle: 'Financial Summary',
    totalRevenue: 'Total Revenue',
    totalCosts: 'Total Costs',
    totalDonated: 'Total Donated',
    lastUpdated: 'Last Updated',
    costsBreakdown: 'Costs Breakdown',
    costManufacturing: 'Manufacturing',
    costShipping: 'Shipping',
    costHosting: 'App Hosting',
    costPayment: 'Payment Processing',
    donationsTitle: 'Donations Made',
    donationTo: 'to',
    viewReceipt: 'View Receipt',
    noDonationsYet: 'No donations yet - sales coming soon!',
    transactionsTitle: 'All Transactions',
    noTransactionsYet: 'No transactions yet - launching soon!',
    typeRevenue: 'Revenue',
    typeCost: 'Cost',
    typeDonation: 'Donation',
    bomTitle: 'Bill of Materials',
    bomDesc: 'What goes into each whistle:',
    bomItem: 'Item',
    bomCost: 'Cost',
    bomPlastic: 'Recycled Ocean Plastic (15g)',
    bomMold: 'Injection Molding (per unit)',
    bomLanyard: 'Breakaway Lanyard',
    bomCard: 'Rights Card (3-language)',
    bomPackaging: 'Recycled Packaging',
    bomLabel: 'QR Code Label',
    bomTotal: 'Total per Unit',
    commitmentTitle: 'Our Commitment',
    commitment1Title: 'Real-time Updates',
    commitment1Desc: 'This page updates automatically as transactions occur. No delays, no hiding.',
    commitment2Title: 'Verified Donations',
    commitment2Desc: 'Every donation includes a receipt link you can verify directly with the organization.',
    commitment3Title: 'Open Books',
    commitment3Desc: 'From raw material costs to shipping fees, everything is documented here.',
    ctaTitle: 'Questions about our finances?',
    ctaDesc: 'Reach out anytime. Accountability is the foundation of trust.',
    contact: 'Contact Us',
  },
  es: {
    back: 'Atrás',
    title: 'Transparencia Total',
    subtitle: 'Cada dólar rastreado. Cada recibo público. Así construimos confianza.',
    summaryTitle: 'Resumen Financiero',
    totalRevenue: 'Ingresos Totales',
    totalCosts: 'Costos Totales',
    totalDonated: 'Total Donado',
    lastUpdated: 'Última Actualización',
    costsBreakdown: 'Desglose de Costos',
    costManufacturing: 'Fabricación',
    costShipping: 'Envío',
    costHosting: 'Hosting de App',
    costPayment: 'Procesamiento de Pagos',
    donationsTitle: 'Donaciones Realizadas',
    donationTo: 'a',
    viewReceipt: 'Ver Recibo',
    noDonationsYet: '¡Aún no hay donaciones - ventas próximamente!',
    transactionsTitle: 'Todas las Transacciones',
    noTransactionsYet: '¡Aún no hay transacciones - lanzamiento pronto!',
    typeRevenue: 'Ingreso',
    typeCost: 'Costo',
    typeDonation: 'Donación',
    bomTitle: 'Lista de Materiales',
    bomDesc: 'Lo que compone cada silbato:',
    bomItem: 'Artículo',
    bomCost: 'Costo',
    bomPlastic: 'Plástico Oceánico Reciclado (15g)',
    bomMold: 'Moldeo por Inyección (por unidad)',
    bomLanyard: 'Cordón con Clip de Seguridad',
    bomCard: 'Tarjeta de Derechos (3 idiomas)',
    bomPackaging: 'Empaque Reciclado',
    bomLabel: 'Etiqueta con Código QR',
    bomTotal: 'Total por Unidad',
    commitmentTitle: 'Nuestro Compromiso',
    commitment1Title: 'Actualizaciones en Tiempo Real',
    commitment1Desc: 'Esta página se actualiza automáticamente cuando ocurren transacciones. Sin demoras, sin ocultar.',
    commitment2Title: 'Donaciones Verificadas',
    commitment2Desc: 'Cada donación incluye un enlace de recibo que puedes verificar directamente con la organización.',
    commitment3Title: 'Libros Abiertos',
    commitment3Desc: 'Desde costos de materia prima hasta tarifas de envío, todo está documentado aquí.',
    ctaTitle: '¿Preguntas sobre nuestras finanzas?',
    ctaDesc: 'Contáctanos en cualquier momento. La responsabilidad es la base de la confianza.',
    contact: 'Contáctanos',
  },
  pt: {
    back: 'Voltar',
    title: 'Transparência Total',
    subtitle: 'Cada dólar rastreado. Cada recibo público. É assim que construímos confiança.',
    summaryTitle: 'Resumo Financeiro',
    totalRevenue: 'Receita Total',
    totalCosts: 'Custos Totais',
    totalDonated: 'Total Doado',
    lastUpdated: 'Última Atualização',
    costsBreakdown: 'Detalhamento de Custos',
    costManufacturing: 'Fabricação',
    costShipping: 'Envio',
    costHosting: 'Hospedagem do App',
    costPayment: 'Processamento de Pagamentos',
    donationsTitle: 'Doações Realizadas',
    donationTo: 'para',
    viewReceipt: 'Ver Recibo',
    noDonationsYet: 'Ainda sem doações - vendas em breve!',
    transactionsTitle: 'Todas as Transações',
    noTransactionsYet: 'Ainda sem transações - lançamento em breve!',
    typeRevenue: 'Receita',
    typeCost: 'Custo',
    typeDonation: 'Doação',
    bomTitle: 'Lista de Materiais',
    bomDesc: 'O que compõe cada apito:',
    bomItem: 'Item',
    bomCost: 'Custo',
    bomPlastic: 'Plástico Oceânico Reciclado (15g)',
    bomMold: 'Moldagem por Injeção (por unidade)',
    bomLanyard: 'Cordão com Clipe de Segurança',
    bomCard: 'Cartão de Direitos (3 idiomas)',
    bomPackaging: 'Embalagem Reciclada',
    bomLabel: 'Etiqueta com Código QR',
    bomTotal: 'Total por Unidade',
    commitmentTitle: 'Nosso Compromisso',
    commitment1Title: 'Atualizações em Tempo Real',
    commitment1Desc: 'Esta página atualiza automaticamente quando transações ocorrem. Sem atrasos, sem esconder.',
    commitment2Title: 'Doações Verificadas',
    commitment2Desc: 'Cada doação inclui um link de recibo que você pode verificar diretamente com a organização.',
    commitment3Title: 'Livros Abertos',
    commitment3Desc: 'De custos de matéria-prima a taxas de envio, tudo está documentado aqui.',
    ctaTitle: 'Perguntas sobre nossas finanças?',
    ctaDesc: 'Entre em contato a qualquer momento. Responsabilidade é a base da confiança.',
    contact: 'Contate-nos',
  },
}

// Placeholder data - will be replaced with real data
const financialData = {
  totalRevenue: 0,
  totalCosts: 0,
  totalDonated: 0,
  lastUpdated: '2025-01-22',
  costs: [
    { category: 'manufacturing', amount: 0 },
    { category: 'shipping', amount: 0 },
    { category: 'hosting', amount: 0 },
    { category: 'payment', amount: 0 },
  ],
  donations: [],
  transactions: [],
}

const bomData = [
  { item: 'bomPlastic', cost: 1.20 },
  { item: 'bomMold', cost: 0.80 },
  { item: 'bomLanyard', cost: 0.50 },
  { item: 'bomCard', cost: 0.30 },
  { item: 'bomPackaging', cost: 0.40 },
  { item: 'bomLabel', cost: 0.10 },
]

export default function TransparencyPage() {
  const { language } = useLanguage()
  const t = pageTranslations[language as keyof typeof pageTranslations] || pageTranslations.en

  const bomTotal = bomData.reduce((sum, item) => sum + item.cost, 0)

  const getCostIcon = (category: string) => {
    switch (category) {
      case 'manufacturing': return Package
      case 'shipping': return Truck
      case 'hosting': return Server
      case 'payment': return DollarSign
      default: return DollarSign
    }
  }

  const getCostLabel = (category: string) => {
    switch (category) {
      case 'manufacturing': return t.costManufacturing
      case 'shipping': return t.costShipping
      case 'hosting': return t.costHosting
      case 'payment': return t.costPayment
      default: return category
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>{t.back}</span>
          </Link>
          <Link href="/landing">
            <Image
              src="/images/icewhistle-logo-white.svg"
              alt="ICEwhistle"
              width={120}
              height={28}
              className="h-6 w-auto"
            />
          </Link>
          <Link href="/shop" className="text-sm text-white/70 hover:text-white transition-colors">
            Shop
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 sm:py-24 border-b border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Financial Summary */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">{t.summaryTitle}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/20">
              <div className="flex items-center gap-2 text-[#84CC16] mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">{t.totalRevenue}</span>
              </div>
              <p className="text-3xl font-black">${financialData.totalRevenue.toFixed(2)}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FF8C42]/10 border border-[#FF8C42]/20">
              <div className="flex items-center gap-2 text-[#FF8C42] mb-2">
                <TrendingDown className="h-5 w-5" />
                <span className="text-sm">{t.totalCosts}</span>
              </div>
              <p className="text-3xl font-black">${financialData.totalCosts.toFixed(2)}</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20">
              <div className="flex items-center gap-2 text-[#DC2626] mb-2">
                <Heart className="h-5 w-5" />
                <span className="text-sm">{t.totalDonated}</span>
              </div>
              <p className="text-3xl font-black">${financialData.totalDonated.toFixed(2)}</p>
            </div>
          </div>

          <p className="text-sm text-white/40">
            {t.lastUpdated}: {financialData.lastUpdated}
          </p>
        </div>
      </section>

      {/* Costs Breakdown */}
      <section className="py-16 bg-[#111113]">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">{t.costsBreakdown}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {financialData.costs.map((cost, i) => {
              const Icon = getCostIcon(cost.category)
              return (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <Icon className="h-5 w-5 text-white/40 mb-2" />
                  <p className="text-xs text-white/40 mb-1">{getCostLabel(cost.category)}</p>
                  <p className="text-xl font-bold">${cost.amount.toFixed(2)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bill of Materials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-2">{t.bomTitle}</h2>
          <p className="text-white/60 mb-8">{t.bomDesc}</p>

          <div className="overflow-x-auto">
            <table className="w-full max-w-lg">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-sm text-white/40 font-medium">{t.bomItem}</th>
                  <th className="text-right py-3 text-sm text-white/40 font-medium">{t.bomCost}</th>
                </tr>
              </thead>
              <tbody>
                {bomData.map((item, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 text-sm">{t[item.item as keyof typeof t]}</td>
                    <td className="py-3 text-sm text-right font-mono">${item.cost.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-white/[0.02]">
                  <td className="py-3 text-sm font-bold">{t.bomTotal}</td>
                  <td className="py-3 text-sm text-right font-mono font-bold">${bomTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Donations */}
      <section className="py-16 bg-[#111113]">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">{t.donationsTitle}</h2>

          {financialData.donations.length > 0 ? (
            <div className="space-y-4">
              {/* Donations would be listed here */}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <Heart className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">{t.noDonationsYet}</p>
            </div>
          )}
        </div>
      </section>

      {/* All Transactions */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">{t.transactionsTitle}</h2>

          {financialData.transactions.length > 0 ? (
            <div className="space-y-2">
              {/* Transactions would be listed here */}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <Receipt className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">{t.noTransactionsYet}</p>
            </div>
          )}
        </div>
      </section>

      {/* Commitment */}
      <section className="py-16 bg-[#111113]">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">{t.commitmentTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t.commitment1Title, desc: t.commitment1Desc },
              { title: t.commitment2Title, desc: t.commitment2Desc },
              { title: t.commitment3Title, desc: t.commitment3Desc },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-2">{t.ctaTitle}</h2>
          <p className="text-white/60 mb-6">{t.ctaDesc}</p>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8">
            {t.contact}
          </Button>
        </div>
      </section>
    </div>
  )
}
