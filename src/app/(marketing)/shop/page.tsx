'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import {
  ArrowLeft,
  Heart,
  Recycle,
  Shield,
  Package,
  Truck,
  Check,
  ExternalLink
} from 'lucide-react'

const pageTranslations = {
  en: {
    back: 'Back',
    shop: 'Shop',
    heroTitle: 'THE WHISTLE',
    heroSubtitle: 'Made from recycled ocean plastic. 100% of profits fund immigrant bail and legal aid.',
    price: '$15',
    shipping: '+ Free Shipping',
    buyNow: 'Buy Now',
    comingSoon: 'Coming Soon',
    comingSoonDesc: 'Sign up to be notified when the whistle is available.',
    emailPlaceholder: 'Enter your email',
    notify: 'Notify Me',
    whyBuy: 'Why Buy a Whistle?',
    reason1Title: '100% Profits Donated',
    reason1Desc: 'Every dollar of profit goes directly to immigrant bail funds and legal aid organizations. We publish all receipts.',
    reason2Title: 'Ocean Plastic',
    reason2Desc: 'Each whistle is made from recycled ocean plastic, helping clean our waters while supporting communities.',
    reason3Title: 'Symbol of Solidarity',
    reason3Desc: 'Carry it as a reminder that we protect each other. A whistle can alert others during enforcement actions.',
    transparencyTitle: 'Full Transparency',
    transparencyDesc: 'We publish every transaction, every cost, every donation. See exactly where your money goes.',
    viewFinances: 'View All Finances',
    specs: 'Product Specs',
    specMaterial: 'Material',
    specMaterialValue: '100% Recycled Ocean Plastic',
    specSize: 'Size',
    specSizeValue: '5cm x 2cm',
    specWeight: 'Weight',
    specWeightValue: '12g',
    specSound: 'Sound',
    specSoundValue: '115+ decibels',
    specColor: 'Color',
    specColorValue: 'Ocean Blue / Safety Red',
    includes: 'Each whistle includes:',
    includesItem1: 'Recycled plastic whistle',
    includesItem2: 'Know Your Rights card (EN/ES/PT)',
    includesItem3: 'App download QR code',
    includesItem4: 'Lanyard with breakaway clip',
    faqTitle: 'Questions',
    faq1Q: 'Where does the money go?',
    faq1A: 'After covering production and shipping costs, 100% of profits are donated to organizations like the National Bail Fund Network, RAICES, and Freedom for Immigrants. All donations are posted publicly.',
    faq2Q: 'How is it made?',
    faq2A: 'Our whistles are manufactured from certified recycled ocean plastic, collected from coastal cleanup efforts. Each whistle removes approximately 15g of plastic from marine ecosystems.',
    faq3Q: 'When will it ship?',
    faq3A: 'Orders ship within 5-7 business days. Free shipping within the US. International shipping available at checkout.',
    footerCta: 'Every purchase protects a family.',
  },
  es: {
    back: 'Atrás',
    shop: 'Tienda',
    heroTitle: 'EL SILBATO',
    heroSubtitle: 'Hecho de plástico oceánico reciclado. 100% de las ganancias financian fianzas y ayuda legal para inmigrantes.',
    price: '$15',
    shipping: '+ Envío Gratis',
    buyNow: 'Comprar Ahora',
    comingSoon: 'Próximamente',
    comingSoonDesc: 'Regístrate para ser notificado cuando el silbato esté disponible.',
    emailPlaceholder: 'Ingresa tu email',
    notify: 'Notificarme',
    whyBuy: '¿Por qué comprar un silbato?',
    reason1Title: '100% Ganancias Donadas',
    reason1Desc: 'Cada dólar de ganancia va directamente a fondos de fianza para inmigrantes y organizaciones de ayuda legal. Publicamos todos los recibos.',
    reason2Title: 'Plástico Oceánico',
    reason2Desc: 'Cada silbato está hecho de plástico oceánico reciclado, ayudando a limpiar nuestras aguas mientras apoya a comunidades.',
    reason3Title: 'Símbolo de Solidaridad',
    reason3Desc: 'Llévalo como recordatorio de que nos protegemos mutuamente. Un silbato puede alertar a otros durante acciones de aplicación.',
    transparencyTitle: 'Transparencia Total',
    transparencyDesc: 'Publicamos cada transacción, cada costo, cada donación. Ve exactamente a dónde va tu dinero.',
    viewFinances: 'Ver Todas las Finanzas',
    specs: 'Especificaciones',
    specMaterial: 'Material',
    specMaterialValue: '100% Plástico Oceánico Reciclado',
    specSize: 'Tamaño',
    specSizeValue: '5cm x 2cm',
    specWeight: 'Peso',
    specWeightValue: '12g',
    specSound: 'Sonido',
    specSoundValue: '115+ decibeles',
    specColor: 'Color',
    specColorValue: 'Azul Océano / Rojo Seguridad',
    includes: 'Cada silbato incluye:',
    includesItem1: 'Silbato de plástico reciclado',
    includesItem2: 'Tarjeta Conoce Tus Derechos (EN/ES/PT)',
    includesItem3: 'Código QR para descargar la app',
    includesItem4: 'Cordón con clip de seguridad',
    faqTitle: 'Preguntas',
    faq1Q: '¿A dónde va el dinero?',
    faq1A: 'Después de cubrir costos de producción y envío, 100% de las ganancias se donan a organizaciones como National Bail Fund Network, RAICES y Freedom for Immigrants. Todas las donaciones se publican públicamente.',
    faq2Q: '¿Cómo está hecho?',
    faq2A: 'Nuestros silbatos se fabrican con plástico oceánico reciclado certificado, recolectado de esfuerzos de limpieza costera. Cada silbato remueve aproximadamente 15g de plástico de ecosistemas marinos.',
    faq3Q: '¿Cuándo se envía?',
    faq3A: 'Los pedidos se envían dentro de 5-7 días hábiles. Envío gratis dentro de EE.UU. Envío internacional disponible al pagar.',
    footerCta: 'Cada compra protege a una familia.',
  },
  pt: {
    back: 'Voltar',
    shop: 'Loja',
    heroTitle: 'O APITO',
    heroSubtitle: 'Feito de plástico oceânico reciclado. 100% dos lucros financiam fiança e ajuda jurídica para imigrantes.',
    price: '$15',
    shipping: '+ Frete Grátis',
    buyNow: 'Comprar Agora',
    comingSoon: 'Em Breve',
    comingSoonDesc: 'Cadastre-se para ser notificado quando o apito estiver disponível.',
    emailPlaceholder: 'Digite seu email',
    notify: 'Notificar-me',
    whyBuy: 'Por que comprar um apito?',
    reason1Title: '100% Lucros Doados',
    reason1Desc: 'Cada dólar de lucro vai diretamente para fundos de fiança para imigrantes e organizações de ajuda jurídica. Publicamos todos os recibos.',
    reason2Title: 'Plástico Oceânico',
    reason2Desc: 'Cada apito é feito de plástico oceânico reciclado, ajudando a limpar nossas águas enquanto apoia comunidades.',
    reason3Title: 'Símbolo de Solidariedade',
    reason3Desc: 'Carregue-o como lembrete de que nos protegemos mutuamente. Um apito pode alertar outros durante ações de aplicação.',
    transparencyTitle: 'Transparência Total',
    transparencyDesc: 'Publicamos cada transação, cada custo, cada doação. Veja exatamente para onde vai seu dinheiro.',
    viewFinances: 'Ver Todas as Finanças',
    specs: 'Especificações',
    specMaterial: 'Material',
    specMaterialValue: '100% Plástico Oceânico Reciclado',
    specSize: 'Tamanho',
    specSizeValue: '5cm x 2cm',
    specWeight: 'Peso',
    specWeightValue: '12g',
    specSound: 'Som',
    specSoundValue: '115+ decibéis',
    specColor: 'Cor',
    specColorValue: 'Azul Oceano / Vermelho Segurança',
    includes: 'Cada apito inclui:',
    includesItem1: 'Apito de plástico reciclado',
    includesItem2: 'Cartão Conheça Seus Direitos (EN/ES/PT)',
    includesItem3: 'Código QR para baixar o app',
    includesItem4: 'Cordão com clipe de segurança',
    faqTitle: 'Perguntas',
    faq1Q: 'Para onde vai o dinheiro?',
    faq1A: 'Após cobrir custos de produção e envio, 100% dos lucros são doados a organizações como National Bail Fund Network, RAICES e Freedom for Immigrants. Todas as doações são publicadas publicamente.',
    faq2Q: 'Como é feito?',
    faq2A: 'Nossos apitos são fabricados com plástico oceânico reciclado certificado, coletado de esforços de limpeza costeira. Cada apito remove aproximadamente 15g de plástico de ecossistemas marinhos.',
    faq3Q: 'Quando será enviado?',
    faq3A: 'Pedidos são enviados dentro de 5-7 dias úteis. Frete grátis dentro dos EUA. Envio internacional disponível no checkout.',
    footerCta: 'Cada compra protege uma família.',
  },
}

export default function ShopPage() {
  const { language } = useLanguage()
  const t = pageTranslations[language as keyof typeof pageTranslations] || pageTranslations.en
  const [email, setEmail] = useState('')

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[#0A0A0B] text-white">
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
          <Link href="/transparency" className="text-sm text-white/70 hover:text-white transition-colors">
            {t.viewFinances}
          </Link>
        </div>
      </nav>

      {/* Hero Product Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="relative">
              <div className="relative aspect-square bg-gradient-to-br from-white/5 to-transparent rounded-3xl overflow-hidden">
                <Image
                  src="/icewhistle-render-01.png"
                  alt="ICEwhistle"
                  fill
                  className="object-contain p-8"
                />
              </div>
              {/* Packaging thumbnail */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/icewhistle-packaging-01.png"
                  alt="Packaging"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#84CC16]/10 text-[#84CC16] rounded-full text-sm font-medium mb-4">
                <Recycle className="h-4 w-4" />
                100% Recycled Ocean Plastic
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
                {t.heroTitle}
              </h1>

              <p className="text-lg text-white/60 mb-8">
                {t.heroSubtitle}
              </p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-5xl font-black">{t.price}</span>
                <span className="text-white/60">{t.shipping}</span>
              </div>

              {/* Coming Soon State */}
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-8">
                <p className="text-lg font-semibold mb-2">{t.comingSoon}</p>
                <p className="text-white/60 text-sm mb-4">{t.comingSoonDesc}</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-[#DC2626]"
                  />
                  <Button className="bg-[#DC2626] hover:bg-[#DC2626]/90 rounded-full px-6">
                    {t.notify}
                  </Button>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <p className="text-sm text-white/60 mb-3">{t.includes}</p>
                <ul className="space-y-2">
                  {[t.includesItem1, t.includesItem2, t.includesItem3, t.includesItem4].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-[#84CC16]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy Section */}
      <section className="py-16 sm:py-24 bg-[#111113]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-12">
            {t.whyBuy}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, color: '#DC2626', title: t.reason1Title, desc: t.reason1Desc },
              { icon: Recycle, color: '#00A6B4', title: t.reason2Title, desc: t.reason2Desc },
              { icon: Shield, color: '#FF8C42', title: t.reason3Title, desc: t.reason3Desc },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon className="h-6 w-6" style={{ color: item.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              {t.transparencyTitle}
            </h2>
            <p className="text-white/60 mb-8">
              {t.transparencyDesc}
            </p>
            <Link href="/transparency">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg gap-2">
                {t.viewFinances}
                <ExternalLink className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section className="py-16 sm:py-24 bg-[#111113]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black mb-8">{t.specs}</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: t.specMaterial, value: t.specMaterialValue },
              { label: t.specSize, value: t.specSizeValue },
              { label: t.specWeight, value: t.specWeightValue },
              { label: t.specSound, value: t.specSoundValue },
              { label: t.specColor, value: t.specColorValue },
            ].map((spec, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs text-white/40 mb-1">{spec.label}</p>
                <p className="text-sm font-medium">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-black mb-8">{t.faqTitle}</h2>

          <div className="space-y-6 max-w-2xl">
            {[
              { q: t.faq1Q, a: t.faq1A },
              { q: t.faq2Q, a: t.faq2A },
              { q: t.faq3Q, a: t.faq3A },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h3 className="font-bold mb-2">{item.q}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl font-bold text-white/60">
            <Heart className="inline h-6 w-6 text-[#DC2626] mr-2" />
            {t.footerCta}
          </p>
        </div>
      </section>
    </main>
  )
}
