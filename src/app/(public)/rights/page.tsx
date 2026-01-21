import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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

export const metadata: Metadata = {
  title: 'Know Your Rights with ICE - 4th Amendment, Warrants & More',
  description: 'Know your rights during ICE encounters: Can ICE enter my home? Do I have to show ID to ICE? ICE warrant vs judicial warrant explained. 4th Amendment rights. Red card immigration. Mis derechos con inmigración.',
  keywords: [
    'know your rights ICE',
    'immigrant rights card',
    'red card immigration',
    '4th amendment ICE',
    'do I have to show ID to ICE',
    'can ICE enter my home',
    'ICE warrant vs judicial warrant',
    'constitutional rights immigrants',
    'right to remain silent ICE',
    'mis derechos con inmigración',
    'derechos constitucionales inmigrantes',
  ],
  openGraph: {
    title: 'Know Your Rights with ICE | ICEwhistle',
    description: 'Your constitutional rights during ICE encounters. Can ICE enter your home? ICE warrant vs judicial warrant. 4th Amendment protection.',
  },
}

const coreRights = [
  {
    icon: Volume2,
    title: 'Right to Remain Silent',
    description: 'You do not have to answer questions about where you were born, your immigration status, or how you entered the United States.',
    phrase: 'Say: "I am exercising my right to remain silent."',
  },
  {
    icon: Phone,
    title: 'Right to an Attorney',
    description: 'You have the right to speak with a lawyer before answering any questions. If detained, you can make phone calls.',
    phrase: 'Say: "I want to speak to a lawyer."',
  },
  {
    icon: FileX,
    title: 'Do Not Sign Documents',
    description: 'Do not sign anything without speaking to an attorney. Signing "voluntary departure" can waive your right to a hearing.',
    phrase: 'Say: "I do not want to sign anything until I speak with my attorney."',
  },
  {
    icon: ShieldAlert,
    title: 'Do Not Lie',
    description: 'Never provide false information or fake documents. This can result in criminal charges and bars to future immigration relief.',
    phrase: 'Stay silent rather than make up answers.',
  },
]

const rightsCategories = [
  {
    id: 'at-home',
    title: 'At Home',
    icon: Home,
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
    icon: Users,
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
    icon: Car,
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
    icon: Briefcase,
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
]

const ifDetainedSteps = [
  {
    number: '1',
    title: 'Get the A-Number',
    description: 'The Alien Registration Number is a 9-digit number starting with "A". This is critical for locating someone.',
  },
  {
    number: '2',
    title: 'Use ICE Detainee Locator',
    description: 'Go to locator.ice.gov or call 1-888-351-4024. It may take 24-72 hours for someone to appear in the system.',
  },
  {
    number: '3',
    title: 'Contact an Attorney',
    description: 'Contact an immigration attorney immediately. Many legal aid organizations provide free consultations.',
  },
  {
    number: '4',
    title: 'Know Your Consular Rights',
    description: 'Under the Vienna Convention, you have the right to contact your country\'s consulate. They can visit, help find a lawyer, and contact family.',
  },
  {
    number: '5',
    title: 'Do Not Sign Voluntary Departure',
    description: 'Signing can waive your right to a hearing before a judge. Say "I do not want to sign anything."',
  },
]

export default function RightsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Know Your Rights</h1>
        <p className="text-lg text-muted-foreground">
          Understanding your constitutional rights during encounters with immigration enforcement
        </p>
      </div>

      <Alert className="mb-8 border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-700">Important Disclaimer</AlertTitle>
        <AlertDescription>
          This information is for educational purposes only and does not constitute legal advice.
          Every situation is different. For advice about your specific circumstances, please
          consult with a qualified immigration attorney.
        </AlertDescription>
      </Alert>

      {/* Core Rights */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Your Core Rights</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {coreRights.map((right) => (
            <Card key={right.title}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <right.icon className="h-5 w-5 text-primary" />
                  {right.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{right.description}</p>
                <p className="text-sm font-medium text-primary">{right.phrase}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Warrant Comparison - Enhanced */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Judicial vs. Administrative Warrant</h2>
        <p className="text-muted-foreground mb-6">
          Understanding the difference can protect your rights. Only a JUDICIAL warrant allows entry into your home.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Judicial Warrant */}
          <Card className="border-green-500/30">
            <CardHeader className="bg-green-50 dark:bg-green-900/10">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <FileCheck className="h-5 w-5" />
                Judicial Warrant
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-500">
                VALID - Allows Entry
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Signed by a federal or state <strong>JUDGE</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Has court name (e.g., "United States District Court")</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Contains judge's signature</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span className="text-sm">Lists your correct name and address</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <strong>If valid:</strong> You should not physically resist, but you can still remain silent and request an attorney.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Administrative Warrant */}
          <Card className="border-red-500/30">
            <CardHeader className="bg-red-50 dark:bg-red-900/10">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <FileX2 className="h-5 w-5" />
                Administrative Warrant (I-200, I-205)
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-500">
                NOT VALID for Home Entry
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                  <span className="text-sm">Signed by an <strong>ICE officer</strong>, NOT a judge</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                  <span className="text-sm">Says "Department of Homeland Security" at top</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                  <span className="text-sm">Form I-200 (Warrant for Arrest) or I-205 (Warrant of Removal)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                  <span className="text-sm">Does NOT authorize entry into your home</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Your response:</strong> "I do not consent to your entry." Keep the door closed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rights by Location */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Rights by Location</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {rightsCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
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
          ))}
        </div>
      </section>

      {/* If Detained Section */}
      <section className="mb-12">
        <Card>
          <CardHeader className="bg-destructive/5">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-destructive" />
              If You or a Loved One Is Detained
            </CardTitle>
            <CardDescription>
              Critical steps to take immediately
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ifDetainedSteps.map((step) => (
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
              <p className="font-medium mb-2">Emergency Contacts:</p>
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
              Your Right to Contact Your Consulate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Under the Vienna Convention, if you are detained, you have the right to contact your country's consulate.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">The consulate can visit you in detention</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">They can help you find a lawyer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">They can contact your family</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-sm">They can ensure you are treated properly</span>
              </li>
            </ul>
            <p className="text-sm font-medium text-primary">
              Say: "I want to contact my consulate."
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/search">Search for Answers</Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/resources">Get Printable Cards</Link>
        </Button>
      </div>
    </div>
  )
}
