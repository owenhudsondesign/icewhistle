'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { PageWrapper } from '@/components/shared/PageWrapper'
import { useLanguage } from '@/hooks/use-language'
import {
  AlertTriangle,
  Home,
  Car,
  Briefcase,
  Users,
  ShieldAlert,
  Phone,
  FileX,
  Volume2,
  Shield,
  FileCheck,
  FileX2,
  Building,
  Flag,
  CheckCircle2,
  XCircle
} from 'lucide-react'

const translations = {
  en: {
    pageTitle: 'Know Your Rights',
    pageSubtitle: 'Understanding your constitutional rights during encounters with immigration enforcement',
    disclaimerTitle: 'Important Disclaimer',
    disclaimerText: 'This information is for educational purposes only and does not constitute legal advice. Every situation is different. For advice about your specific circumstances, please consult with a qualified immigration attorney.',

    coreRightsTitle: 'Your Core Rights',
    coreRights: [
      {
        title: 'Right to Remain Silent',
        description: 'You do not have to answer questions about where you were born, your immigration status, or how you entered the United States.',
        phrase: 'Say: "I am exercising my right to remain silent."',
      },
      {
        title: 'Right to an Attorney',
        description: 'You have the right to speak with a lawyer before answering any questions. If detained, you can make phone calls.',
        phrase: 'Say: "I want to speak to a lawyer."',
      },
      {
        title: 'Do Not Sign Documents',
        description: 'Do not sign anything without speaking to an attorney. Signing "voluntary departure" can waive your right to a hearing.',
        phrase: 'Say: "I do not want to sign anything until I speak with my attorney."',
      },
      {
        title: 'Do Not Lie',
        description: 'Never provide false information or fake documents. This can result in criminal charges and bars to future immigration relief.',
        phrase: 'Stay silent rather than make up answers.',
      },
    ],

    warrantTitle: 'Judicial vs. Administrative Warrant',
    warrantSubtitle: 'Understanding the difference can protect your rights. Only a JUDICIAL warrant allows entry into your home.',
    judicialWarrant: 'Judicial Warrant',
    judicialValid: 'VALID - Allows Entry',
    judicialPoints: [
      'Signed by a federal or state JUDGE',
      'Has court name (e.g., "United States District Court")',
      'Contains judge\'s signature',
      'Lists your correct name and address',
    ],
    judicialResponse: 'If valid: You should not physically resist, but you can still remain silent and request an attorney.',
    adminWarrant: 'Administrative Warrant (I-200, I-205)',
    adminInvalid: 'NOT VALID for Home Entry',
    adminPoints: [
      'Signed by an ICE officer, NOT a judge',
      'Says "Department of Homeland Security" at top',
      'Form I-200 (Warrant for Arrest) or I-205 (Warrant of Removal)',
      'Does NOT authorize entry into your home',
    ],
    adminResponse: 'Your response: "I do not consent to your entry." Keep the door closed.',

    rightsByLocation: 'Rights by Location',
    categories: [
      {
        id: 'at-home',
        title: 'At Home',
        description: 'If ICE comes to your door',
        rights: [
          'Do NOT open the door unless they show a JUDICIAL warrant signed by a JUDGE',
          'Ask "Do you have a warrant signed by a judge?" through the closed door',
          'Ask them to slide the warrant under the door or show it through a window',
          'An ICE administrative warrant (Form I-200 or I-205) does NOT give them permission to enter',
          'Say: "I do not consent to your entry"',
          'Do not sign anything or make statements',
          'Stay calm and do not run',
        ],
      },
      {
        id: 'in-public',
        title: 'In Public',
        description: 'Your rights in public spaces',
        rights: [
          'You have the right to remain silent',
          'You do not have to answer questions about your immigration status',
          'Say: "I am exercising my right to remain silent"',
          'You have the right to record the encounter in most states',
          'If you are not under arrest, ask "Am I free to go?" and calmly walk away if yes',
          'Do not run - stay calm',
        ],
      },
      {
        id: 'driving',
        title: 'While Driving',
        description: 'Traffic stops and checkpoints',
        rights: [
          'You must provide your license, registration, and proof of insurance if asked',
          'You have the right to remain silent beyond that',
          'You do not have to consent to a vehicle search',
          'At checkpoints, you can decline to answer questions about citizenship',
          'Say: "I do not consent to a search"',
          'Do not flee - stay calm and assert your rights respectfully',
        ],
      },
      {
        id: 'at-work',
        title: 'At Work',
        description: 'Workplace encounters',
        rights: [
          'ICE needs a judicial warrant to enter non-public areas of a workplace',
          'You have the right to remain silent',
          'Do not sign any documents without an attorney',
          'In California (AB 450), employers cannot allow ICE access without a warrant',
          'Employers cannot threaten to call ICE as retaliation for asserting your rights',
          'Document what happens - badge numbers, what was said',
        ],
      },
    ],

    detainedTitle: 'If You or a Loved One Is Detained',
    detainedSubtitle: 'Critical steps to take immediately',
    detainedSteps: [
      { number: '1', title: 'Get the A-Number', description: 'The Alien Registration Number is a 9-digit number starting with "A". This is critical for locating someone.' },
      { number: '2', title: 'Use ICE Detainee Locator', description: 'Go to locator.ice.gov or call 1-888-351-4024. It may take 24-72 hours for someone to appear in the system.' },
      { number: '3', title: 'Contact an Attorney', description: 'Contact an immigration attorney immediately. Many legal aid organizations provide free consultations.' },
      { number: '4', title: 'Know Your Consular Rights', description: 'Under the Vienna Convention, you have the right to contact your country\'s consulate. They can visit, help find a lawyer, and contact family.' },
      { number: '5', title: 'Do Not Sign Voluntary Departure', description: 'Signing can waive your right to a hearing before a judge. Say "I do not want to sign anything."' },
    ],
    emergencyContacts: 'Emergency Contacts:',

    consularTitle: 'Your Right to Contact Your Consulate',
    consularText: 'Under the Vienna Convention, if you are detained, you have the right to contact your country\'s consulate.',
    consularPoints: [
      'The consulate can visit you in detention',
      'They can help you find a lawyer',
      'They can contact your family',
      'They can ensure you are treated properly',
    ],
    consularPhrase: 'Say: "I want to contact my consulate."',

    searchButton: 'Search for Answers',
    cardsButton: 'Get Printable Cards',
  },
  es: {
    pageTitle: 'Conoce Tus Derechos',
    pageSubtitle: 'Entendiendo tus derechos constitucionales durante encuentros con agentes de inmigración',
    disclaimerTitle: 'Aviso Importante',
    disclaimerText: 'Esta información es solo para fines educativos y no constituye asesoría legal. Cada situación es diferente. Para consejos sobre tu situación específica, consulta con un abogado de inmigración calificado.',

    coreRightsTitle: 'Tus Derechos Fundamentales',
    coreRights: [
      {
        title: 'Derecho a Guardar Silencio',
        description: 'No tienes que responder preguntas sobre dónde naciste, tu estatus migratorio o cómo entraste a Estados Unidos.',
        phrase: 'Di: "Estoy ejerciendo mi derecho a guardar silencio."',
      },
      {
        title: 'Derecho a un Abogado',
        description: 'Tienes derecho a hablar con un abogado antes de responder cualquier pregunta. Si eres detenido, puedes hacer llamadas telefónicas.',
        phrase: 'Di: "Quiero hablar con un abogado."',
      },
      {
        title: 'No Firmes Documentos',
        description: 'No firmes nada sin hablar con un abogado. Firmar "salida voluntaria" puede renunciar a tu derecho a una audiencia.',
        phrase: 'Di: "No quiero firmar nada hasta hablar con mi abogado."',
      },
      {
        title: 'No Mientas',
        description: 'Nunca proporciones información falsa o documentos falsos. Esto puede resultar en cargos criminales y prohibiciones para futuros beneficios migratorios.',
        phrase: 'Guarda silencio en lugar de inventar respuestas.',
      },
    ],

    warrantTitle: 'Orden Judicial vs. Orden Administrativa',
    warrantSubtitle: 'Entender la diferencia puede proteger tus derechos. Solo una orden JUDICIAL permite la entrada a tu hogar.',
    judicialWarrant: 'Orden Judicial',
    judicialValid: 'VÁLIDA - Permite Entrada',
    judicialPoints: [
      'Firmada por un JUEZ federal o estatal',
      'Tiene nombre del tribunal (ej. "United States District Court")',
      'Contiene la firma del juez',
      'Lista tu nombre y dirección correctos',
    ],
    judicialResponse: 'Si es válida: No debes resistir físicamente, pero puedes guardar silencio y pedir un abogado.',
    adminWarrant: 'Orden Administrativa (I-200, I-205)',
    adminInvalid: 'NO VÁLIDA para Entrar al Hogar',
    adminPoints: [
      'Firmada por un oficial de ICE, NO por un juez',
      'Dice "Department of Homeland Security" arriba',
      'Formulario I-200 (Orden de Arresto) o I-205 (Orden de Deportación)',
      'NO autoriza la entrada a tu hogar',
    ],
    adminResponse: 'Tu respuesta: "No doy mi consentimiento para que entren." Mantén la puerta cerrada.',

    rightsByLocation: 'Derechos por Ubicación',
    categories: [
      {
        id: 'at-home',
        title: 'En Casa',
        description: 'Si ICE llega a tu puerta',
        rights: [
          'NO abras la puerta a menos que muestren una orden JUDICIAL firmada por un JUEZ',
          'Pregunta "¿Tiene una orden firmada por un juez?" a través de la puerta cerrada',
          'Pídeles que pasen la orden por debajo de la puerta o que la muestren por una ventana',
          'Una orden administrativa de ICE (Formulario I-200 o I-205) NO les da permiso para entrar',
          'Di: "No doy mi consentimiento para que entren"',
          'No firmes nada ni hagas declaraciones',
          'Mantén la calma y no corras',
        ],
      },
      {
        id: 'in-public',
        title: 'En Público',
        description: 'Tus derechos en espacios públicos',
        rights: [
          'Tienes derecho a guardar silencio',
          'No tienes que responder preguntas sobre tu estatus migratorio',
          'Di: "Estoy ejerciendo mi derecho a guardar silencio"',
          'Tienes derecho a grabar el encuentro en la mayoría de los estados',
          'Si no estás arrestado, pregunta "¿Soy libre de irme?" y vete calmadamente si dicen que sí',
          'No corras - mantén la calma',
        ],
      },
      {
        id: 'driving',
        title: 'Manejando',
        description: 'Paradas de tráfico y puntos de control',
        rights: [
          'Debes proporcionar tu licencia, registro y prueba de seguro si te lo piden',
          'Tienes derecho a guardar silencio más allá de eso',
          'No tienes que consentir a una búsqueda del vehículo',
          'En puntos de control, puedes negarte a responder preguntas sobre ciudadanía',
          'Di: "No doy mi consentimiento para una búsqueda"',
          'No huyas - mantén la calma y afirma tus derechos respetuosamente',
        ],
      },
      {
        id: 'at-work',
        title: 'En el Trabajo',
        description: 'Encuentros en el lugar de trabajo',
        rights: [
          'ICE necesita una orden judicial para entrar a áreas no públicas del lugar de trabajo',
          'Tienes derecho a guardar silencio',
          'No firmes ningún documento sin un abogado',
          'En California (AB 450), los empleadores no pueden permitir acceso a ICE sin orden judicial',
          'Los empleadores no pueden amenazar con llamar a ICE como represalia por hacer valer tus derechos',
          'Documenta lo que pasa - números de placa, lo que se dijo',
        ],
      },
    ],

    detainedTitle: 'Si Tú o un Ser Querido Es Detenido',
    detainedSubtitle: 'Pasos críticos a tomar inmediatamente',
    detainedSteps: [
      { number: '1', title: 'Obtén el Número A', description: 'El Número de Registro de Extranjero es un número de 9 dígitos que comienza con "A". Es crítico para localizar a alguien.' },
      { number: '2', title: 'Usa el Localizador de Detenidos de ICE', description: 'Ve a locator.ice.gov o llama al 1-888-351-4024. Puede tomar 24-72 horas para que alguien aparezca en el sistema.' },
      { number: '3', title: 'Contacta a un Abogado', description: 'Contacta a un abogado de inmigración inmediatamente. Muchas organizaciones de asistencia legal ofrecen consultas gratuitas.' },
      { number: '4', title: 'Conoce Tus Derechos Consulares', description: 'Bajo la Convención de Viena, tienes derecho a contactar al consulado de tu país. Pueden visitarte, ayudar a encontrar un abogado y contactar a tu familia.' },
      { number: '5', title: 'No Firmes Salida Voluntaria', description: 'Firmar puede renunciar a tu derecho a una audiencia ante un juez. Di "No quiero firmar nada."' },
    ],
    emergencyContacts: 'Contactos de Emergencia:',

    consularTitle: 'Tu Derecho a Contactar a Tu Consulado',
    consularText: 'Bajo la Convención de Viena, si eres detenido, tienes derecho a contactar al consulado de tu país.',
    consularPoints: [
      'El consulado puede visitarte en detención',
      'Pueden ayudarte a encontrar un abogado',
      'Pueden contactar a tu familia',
      'Pueden asegurarse de que te traten correctamente',
    ],
    consularPhrase: 'Di: "Quiero contactar a mi consulado."',

    searchButton: 'Buscar Respuestas',
    cardsButton: 'Obtener Tarjetas Imprimibles',
  },
  pt: {
    pageTitle: 'Conheça Seus Direitos',
    pageSubtitle: 'Entendendo seus direitos constitucionais durante encontros com agentes de imigração',
    disclaimerTitle: 'Aviso Importante',
    disclaimerText: 'Esta informação é apenas para fins educacionais e não constitui aconselhamento jurídico. Cada situação é diferente. Para conselhos sobre sua situação específica, consulte um advogado de imigração qualificado.',

    coreRightsTitle: 'Seus Direitos Fundamentais',
    coreRights: [
      {
        title: 'Direito de Permanecer em Silêncio',
        description: 'Você não precisa responder perguntas sobre onde nasceu, seu status imigratório ou como entrou nos Estados Unidos.',
        phrase: 'Diga: "Estou exercendo meu direito de permanecer em silêncio."',
      },
      {
        title: 'Direito a um Advogado',
        description: 'Você tem o direito de falar com um advogado antes de responder qualquer pergunta. Se detido, você pode fazer ligações.',
        phrase: 'Diga: "Quero falar com um advogado."',
      },
      {
        title: 'Não Assine Documentos',
        description: 'Não assine nada sem falar com um advogado. Assinar "saída voluntária" pode renunciar ao seu direito a uma audiência.',
        phrase: 'Diga: "Não quero assinar nada até falar com meu advogado."',
      },
      {
        title: 'Não Minta',
        description: 'Nunca forneça informações falsas ou documentos falsos. Isso pode resultar em acusações criminais e impedimentos para futuros benefícios imigratórios.',
        phrase: 'Fique em silêncio em vez de inventar respostas.',
      },
    ],

    warrantTitle: 'Mandado Judicial vs. Mandado Administrativo',
    warrantSubtitle: 'Entender a diferença pode proteger seus direitos. Apenas um mandado JUDICIAL permite entrada em sua casa.',
    judicialWarrant: 'Mandado Judicial',
    judicialValid: 'VÁLIDO - Permite Entrada',
    judicialPoints: [
      'Assinado por um JUIZ federal ou estadual',
      'Tem nome do tribunal (ex. "United States District Court")',
      'Contém assinatura do juiz',
      'Lista seu nome e endereço corretos',
    ],
    judicialResponse: 'Se válido: Você não deve resistir fisicamente, mas pode permanecer em silêncio e pedir um advogado.',
    adminWarrant: 'Mandado Administrativo (I-200, I-205)',
    adminInvalid: 'NÃO VÁLIDO para Entrada em Casa',
    adminPoints: [
      'Assinado por um oficial do ICE, NÃO por um juiz',
      'Diz "Department of Homeland Security" no topo',
      'Formulário I-200 (Mandado de Prisão) ou I-205 (Mandado de Deportação)',
      'NÃO autoriza entrada em sua casa',
    ],
    adminResponse: 'Sua resposta: "Não consinto com sua entrada." Mantenha a porta fechada.',

    rightsByLocation: 'Direitos por Local',
    categories: [
      {
        id: 'at-home',
        title: 'Em Casa',
        description: 'Se o ICE vier à sua porta',
        rights: [
          'NÃO abra a porta a menos que mostrem um mandado JUDICIAL assinado por um JUIZ',
          'Pergunte "Você tem um mandado assinado por um juiz?" através da porta fechada',
          'Peça que passem o mandado por baixo da porta ou mostrem pela janela',
          'Um mandado administrativo do ICE (Formulário I-200 ou I-205) NÃO dá permissão para entrar',
          'Diga: "Não consinto com sua entrada"',
          'Não assine nada nem faça declarações',
          'Mantenha a calma e não corra',
        ],
      },
      {
        id: 'in-public',
        title: 'Em Público',
        description: 'Seus direitos em espaços públicos',
        rights: [
          'Você tem o direito de permanecer em silêncio',
          'Você não precisa responder perguntas sobre seu status imigratório',
          'Diga: "Estou exercendo meu direito de permanecer em silêncio"',
          'Você tem o direito de gravar o encontro na maioria dos estados',
          'Se não estiver preso, pergunte "Estou livre para ir?" e vá embora calmamente se sim',
          'Não corra - mantenha a calma',
        ],
      },
      {
        id: 'driving',
        title: 'Dirigindo',
        description: 'Paradas de trânsito e pontos de controle',
        rights: [
          'Você deve fornecer sua carteira, registro e comprovante de seguro se solicitado',
          'Você tem o direito de permanecer em silêncio além disso',
          'Você não precisa consentir com uma busca no veículo',
          'Em pontos de controle, você pode recusar responder perguntas sobre cidadania',
          'Diga: "Não consinto com uma busca"',
          'Não fuja - mantenha a calma e afirme seus direitos respeitosamente',
        ],
      },
      {
        id: 'at-work',
        title: 'No Trabalho',
        description: 'Encontros no local de trabalho',
        rights: [
          'O ICE precisa de um mandado judicial para entrar em áreas não públicas do local de trabalho',
          'Você tem o direito de permanecer em silêncio',
          'Não assine nenhum documento sem um advogado',
          'Na Califórnia (AB 450), empregadores não podem permitir acesso ao ICE sem mandado',
          'Empregadores não podem ameaçar chamar o ICE como retaliação por fazer valer seus direitos',
          'Documente o que acontece - números de identificação, o que foi dito',
        ],
      },
    ],

    detainedTitle: 'Se Você ou um Ente Querido For Detido',
    detainedSubtitle: 'Passos críticos a tomar imediatamente',
    detainedSteps: [
      { number: '1', title: 'Obtenha o Número A', description: 'O Número de Registro de Estrangeiro é um número de 9 dígitos começando com "A". É crítico para localizar alguém.' },
      { number: '2', title: 'Use o Localizador de Detidos do ICE', description: 'Vá a locator.ice.gov ou ligue 1-888-351-4024. Pode levar 24-72 horas para alguém aparecer no sistema.' },
      { number: '3', title: 'Contate um Advogado', description: 'Contate um advogado de imigração imediatamente. Muitas organizações de assistência jurídica oferecem consultas gratuitas.' },
      { number: '4', title: 'Conheça Seus Direitos Consulares', description: 'Sob a Convenção de Viena, você tem o direito de contatar o consulado do seu país. Eles podem visitar, ajudar a encontrar um advogado e contatar sua família.' },
      { number: '5', title: 'Não Assine Saída Voluntária', description: 'Assinar pode renunciar ao seu direito a uma audiência perante um juiz. Diga "Não quero assinar nada."' },
    ],
    emergencyContacts: 'Contatos de Emergência:',

    consularTitle: 'Seu Direito de Contatar Seu Consulado',
    consularText: 'Sob a Convenção de Viena, se você for detido, tem o direito de contatar o consulado do seu país.',
    consularPoints: [
      'O consulado pode visitá-lo em detenção',
      'Eles podem ajudá-lo a encontrar um advogado',
      'Eles podem contatar sua família',
      'Eles podem garantir que você seja tratado corretamente',
    ],
    consularPhrase: 'Diga: "Quero contatar meu consulado."',

    searchButton: 'Buscar Respostas',
    cardsButton: 'Obter Cartões Imprimíveis',
  },
}

const iconMap = {
  'at-home': Home,
  'in-public': Users,
  'driving': Car,
  'at-work': Briefcase,
}

export default function RightsPage() {
  const { language } = useLanguage()
  const t = translations[language]

  const coreRightIcons = [Volume2, Phone, FileX, ShieldAlert]

  return (
    <PageWrapper title={t.pageTitle}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.pageTitle}</h1>
        <p className="text-lg text-muted-foreground">
          {t.pageSubtitle}
        </p>
      </div>

      <Alert className="mb-8 border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-700">{t.disclaimerTitle}</AlertTitle>
        <AlertDescription>
          {t.disclaimerText}
        </AlertDescription>
      </Alert>

      {/* Core Rights */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t.coreRightsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.coreRights.map((right, index) => {
            const Icon = coreRightIcons[index]
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {right.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{right.description}</p>
                  <p className="text-sm font-medium text-primary">{right.phrase}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Warrant Comparison */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{t.warrantTitle}</h2>
        <p className="text-muted-foreground mb-6">
          {t.warrantSubtitle}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Judicial Warrant */}
          <Card className="border-green-500/30">
            <CardHeader className="bg-green-50 dark:bg-green-900/10">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <FileCheck className="h-5 w-5" />
                {t.judicialWarrant}
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-500">
                {t.judicialValid}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {t.judicialPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span className="text-sm" dangerouslySetInnerHTML={{ __html: point.replace(/JUDGE|JUEZ|JUIZ/g, '<strong>$&</strong>') }} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <strong>{t.judicialResponse.split(':')[0]}:</strong>{t.judicialResponse.split(':').slice(1).join(':')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Administrative Warrant */}
          <Card className="border-red-500/30">
            <CardHeader className="bg-red-50 dark:bg-red-900/10">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <FileX2 className="h-5 w-5" />
                {t.adminWarrant}
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-500">
                {t.adminInvalid}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {t.adminPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                    <span className="text-sm" dangerouslySetInnerHTML={{ __html: point.replace(/ICE officer|oficial de ICE|oficial do ICE/g, '<strong>$&</strong>') }} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>{t.adminResponse.split(':')[0]}:</strong>{t.adminResponse.split(':').slice(1).join(':')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rights by Location */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{t.rightsByLocation}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {t.categories.map((category) => {
            const Icon = iconMap[category.id as keyof typeof iconMap]
            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.rights.map((right, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span className="text-sm">{right}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* If Detained Section */}
      <section className="mb-12">
        <Card>
          <CardHeader className="bg-destructive/5">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-destructive" />
              {t.detainedTitle}
            </CardTitle>
            <CardDescription>
              {t.detainedSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.detainedSteps.map((step) => (
                <div key={step.number} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="font-medium mb-2">{t.emergencyContacts}</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:18883514024"
                  className="text-primary font-medium hover:underline flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  ICE Locator: 1-888-351-4024
                </a>
                <a
                  href="https://locator.ice.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline"
                >
                  locator.ice.gov
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Consular Rights */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              {t.consularTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t.consularText}
            </p>
            <ul className="space-y-2 mb-4">
              {t.consularPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium text-primary">
              {t.consularPhrase}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/faq">{t.searchButton}</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/resources">{t.cardsButton}</Link>
        </Button>
      </div>
    </div>
    </PageWrapper>
  )
}
