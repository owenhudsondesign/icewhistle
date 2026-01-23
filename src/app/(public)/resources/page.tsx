import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageWrapper } from '@/components/shared/PageWrapper'
import {
  FileText,
  Download,
  Phone,
  ExternalLink,
  BookOpen,
  Scale,
  Heart,
  Users,
  Baby,
  AlertTriangle,
  Briefcase,
  Globe,
  Shield,
  Building,
  MapPin,
  Smartphone
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Immigration Emergency Hotlines & Legal Resources',
  description: 'ICE hotline numbers, immigration emergency hotline, find someone in ICE detention (1-888-351-4024), immigration lawyer near me, free legal aid. Red card, family preparedness. Ayuda legal inmigración gratis.',
  keywords: [
    'ICE hotline',
    'immigration emergency hotline',
    'ICE detainee locator',
    'find someone in ICE detention',
    'immigration lawyer near me',
    'ayuda legal inmigración gratis',
    'red card immigration',
    'immigrant rights card',
    'family preparedness plan',
    'bond funds immigration',
    'legal aid immigration free',
  ],
  openGraph: {
    title: 'Immigration Emergency Hotlines & Legal Resources | ICEwhistle',
    description: 'Emergency hotlines, ICE detainee locator, immigration lawyers, free legal aid. Find someone in ICE detention.',
  },
}

const printableResources = [
  {
    title: 'Red Card / Tarjeta Roja (ILRC)',
    description: 'Wallet card explaining your rights - available in 39 languages',
    url: 'https://www.ilrc.org/red-cards',
    external: true,
  },
  {
    title: 'Know Your Rights (ACLU)',
    description: 'Comprehensive rights information when encountering immigration agents',
    url: 'https://www.aclu.org/know-your-rights/immigrants-rights',
    external: true,
  },
  {
    title: 'Conozca Sus Derechos (NILC)',
    description: 'Guía completa de derechos en español',
    url: 'https://www.nilc.org/get-involved/community-education-resources/know-your-rights/',
    external: true,
  },
  {
    title: 'Family Preparedness Plan (ILRC)',
    description: 'Worksheet to prepare your family for emergencies',
    url: 'https://www.ilrc.org/family-preparedness-plan',
    external: true,
  },
  {
    title: 'ICE Warrant Guide (CLINIC)',
    description: 'How to identify judicial vs. administrative warrants',
    url: 'https://www.cliniclegal.org/resources/enforcement-and-detention/ice-warrants',
    external: true,
  },
  {
    title: 'Power of Attorney Info (Informed Immigrant)',
    description: 'Guide to designating emergency childcare authority',
    url: 'https://www.informedimmigrant.com/guides/power-of-attorney/',
    external: true,
  },
  {
    title: 'ICE Raids Toolkit (IDP)',
    description: 'Step-by-step guidance during enforcement activities',
    url: 'https://www.immigrantdefenseproject.org/raids-toolkit/',
    external: true,
  },
  {
    title: 'DACA Renewal Guide (Informed Immigrant)',
    description: 'How to renew DACA and advance parole information',
    url: 'https://www.informedimmigrant.com/guides/daca/',
    external: true,
  },
  {
    title: '"We Have Rights" Videos',
    description: 'Know your rights videos in 8 languages',
    url: 'https://weareheretostay.org',
    external: true,
  },
]

// Updated with comprehensive hotline list from PDFs
const emergencyHotlines = [
  {
    name: 'ICE Detainee Locator',
    phone: '1-888-351-4024',
    description: 'Find someone in ICE custody',
    available: '24/7',
    url: 'https://locator.ice.gov',
    priority: true,
  },
  {
    name: 'United We Dream MigraWatch',
    phone: '1-844-363-1423',
    description: 'Immigration enforcement hotline',
    available: '24/7',
    priority: true,
  },
  {
    name: 'National Human Trafficking Hotline',
    phone: '1-888-373-7888',
    description: 'Help for trafficking victims (T-visa eligible)',
    available: '24/7',
    priority: true,
  },
  {
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    description: 'Support for survivors (VAWA eligible) - 200+ languages',
    available: '24/7',
    priority: true,
  },
  {
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    description: 'Mental health crisis support',
    available: '24/7',
    priority: true,
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Mental health support via text',
    available: '24/7',
    isText: true,
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Substance abuse and mental health',
    available: '24/7',
  },
  {
    name: 'RAICES',
    phone: '1-800-898-4424',
    description: 'Legal services and bond assistance',
    available: 'Mon-Fri 9am-5pm CT',
  },
  {
    name: 'National Immigrant Justice Center',
    phone: '312-660-1370',
    description: 'Legal assistance and referrals',
    available: 'Mon-Fri 9am-5pm CT',
  },
  {
    name: 'Immigration Equality (LGBTQ+)',
    phone: '917-654-9696',
    description: 'LGBTQ+ immigration legal services',
    available: 'Mon/Wed 9:30am-5:30pm, Tue 11am-5:30pm ET',
    url: 'https://immigrationequality.org',
    priority: true,
  },
  {
    name: 'RAICES Texas',
    phone: '1-833-372-4237',
    description: 'Legal services across 5 Texas cities',
    available: 'Mon-Fri 9am-5pm CT',
    url: 'https://raicestexas.org',
  },
  {
    name: 'Freedom for Immigrants',
    phone: '9233#',
    description: 'Call from detention (free)',
    available: '24/7',
    url: 'https://freedomforimmigrants.org',
    isDetention: true,
  },
]

const organizationCategories = [
  {
    id: 'legal',
    title: 'Legal Aid Organizations',
    icon: Scale,
    description: 'Free and low-cost legal help',
    organizations: [
      { name: 'Immigration Advocates Network', url: 'https://www.immigrationadvocates.org/nonprofit/legaldirectory/', description: 'National directory of free legal services' },
      { name: 'National Immigrant Justice Center (NIJC)', url: 'https://immigrantjustice.org', description: 'Direct legal services, nationwide' },
      { name: 'Catholic Legal Immigration Network (CLINIC)', url: 'https://cliniclegal.org', description: '400+ nonprofit programs' },
      { name: 'American Immigration Lawyers Association', url: 'https://aila.org', description: 'Find a licensed attorney' },
      { name: 'National Immigration Law Center', url: 'https://nilc.org', description: 'Policy and legal expertise' },
      { name: 'Immigrant Legal Resource Center (ILRC)', url: 'https://ilrc.org', description: 'Red Cards and training' },
      { name: 'Informed Immigrant', url: 'https://informedimmigrant.com', description: 'Find Legal Help directory' },
      { name: 'RAICES Texas', url: 'https://raicestexas.org', description: 'Texas legal services, 5 cities' },
    ],
  },
  {
    id: 'rapid-response',
    title: 'Rapid Response & Enforcement Tracking',
    icon: AlertTriangle,
    description: 'Real-time community support and tracking',
    organizations: [
      { name: 'Immigrant Defense Project', url: 'https://immigrantdefenseproject.org', description: 'Rapid response network, ICEWatch map' },
      { name: 'United We Dream MigraWatch', url: 'https://unitedwedream.org', description: 'Report enforcement: 1-844-363-1423' },
      { name: 'Freedom for Immigrants', url: 'https://freedomforimmigrants.org', description: 'Detention map, 200+ facilities tracked' },
    ],
  },
  {
    title: 'Children & Youth',
    icon: Baby,
    description: 'Support for minors and young people',
    organizations: [
      { name: 'Kids in Need of Defense (KIND)', url: 'https://supportkind.org', description: 'Free legal help for unaccompanied minors' },
      { name: 'Young Center for Immigrant Children\'s Rights', url: 'https://theyoungcenter.org', description: 'Child advocates' },
      { name: 'United We Dream', url: 'https://unitedwedream.org', description: 'Immigrant youth-led organization' },
    ],
  },
  {
    title: 'LGBTQ+ Support',
    icon: Heart,
    description: 'Resources for LGBTQ+ immigrants',
    organizations: [
      { name: 'Immigration Equality', url: 'https://immigrationequality.org', description: 'LGBTQ+ immigration legal services' },
      { name: 'Transgender Law Center', url: 'https://transgenderlawcenter.org', description: 'Transgender immigrant advocacy' },
      { name: 'LGBTQ Freedom Fund', url: 'https://lgbtqfund.org', description: 'Bond assistance for LGBTQ+ individuals' },
    ],
  },
  {
    id: 'bond',
    title: 'Bond Funds',
    icon: Building,
    description: 'Help paying immigration bonds (avg. $8,176)',
    organizations: [
      { name: 'National Bail Fund Network', url: 'https://communitybailout.org', description: 'Find local bond funds' },
      { name: 'Black Immigrants Bail Fund', url: 'https://blackimmigrantsbailfund.org', description: 'Support for Black immigrants' },
      { name: 'Freedom for Immigrants', url: 'https://freedomforimmigrants.org', description: 'Bond assistance and detention visitation' },
    ],
  },
  {
    title: 'Community Organizations',
    icon: Users,
    organizations: [
      { name: 'National Immigration Project', url: 'https://nipnlg.org', description: 'Criminal-immigration defense' },
      { name: 'Immigrant Defense Project', url: 'https://immigrantdefenseproject.org', description: 'Rapid response network' },
      { name: 'Informed Immigrant', url: 'https://informedimmigrant.com', description: 'Resource guides and toolkits' },
    ],
  },
  {
    title: 'Know Your Rights Resources',
    icon: BookOpen,
    organizations: [
      { name: 'ACLU Know Your Rights', url: 'https://aclu.org/know-your-rights', description: 'Constitutional rights guides' },
      { name: '"We Have Rights" Videos', url: 'https://weareheretostay.org', description: 'Available in 8 languages' },
      { name: 'National Immigration Forum', url: 'https://immigrationforum.org', description: 'Education and advocacy' },
    ],
  },
]

const vulnerablePopulationResources = [
  {
    title: 'Trafficking Victims',
    description: 'T-visa protection for human trafficking survivors. You may not need to cooperate with law enforcement if under 18 or traumatized.',
    phone: '1-888-373-7888',
    icon: AlertTriangle,
  },
  {
    title: 'Crime Victims (U-Visa)',
    description: 'Victims of domestic violence, assault, or other serious crimes who assist law enforcement may qualify for U-visa protection.',
    icon: Shield,
  },
  {
    title: 'VAWA Self-Petition',
    description: 'Domestic violence survivors can self-petition for status without abuser knowing. Male survivors also eligible.',
    phone: '1-800-799-7233',
    icon: Heart,
  },
  {
    title: 'Unaccompanied Minors',
    description: 'Special protections for children. Contact KIND for free legal services.',
    url: 'https://supportkind.org',
    icon: Baby,
  },
]

export default function ResourcesPage() {
  return (
    <PageWrapper title="Resources">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resources</h1>
        <p className="text-lg text-muted-foreground">
          Legal resources, emergency contacts, and support organizations
        </p>
      </div>

      {/* Search CTA */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Need Quick Answers?</h2>
              <p className="text-muted-foreground">
                Search our knowledge base for rights information, legal resources, and guidance.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/search">Search Resources</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Hotlines */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-6 w-6 text-destructive" />
          Emergency Hotlines
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emergencyHotlines.map((hotline) => (
            <Card key={hotline.phone} className={hotline.priority ? 'border-destructive/30' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {hotline.name}
                  {hotline.priority && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                      Priority
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{hotline.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {hotline.isText ? (
                  <p className="text-lg font-semibold text-primary">{hotline.phone}</p>
                ) : (
                  <a
                    href={`tel:${hotline.phone.replace(/[^0-9]/g, '')}`}
                    className="text-xl font-semibold text-primary hover:underline block"
                  >
                    {hotline.phone}
                  </a>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {hotline.available}
                </p>
                {hotline.url && (
                  <a
                    href={hotline.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    <Globe className="h-3 w-3" />
                    Online locator
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Vulnerable Populations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Special Protections
        </h2>
        <p className="text-muted-foreground mb-4">
          Some individuals may qualify for special immigration protections
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {vulnerablePopulationResources.map((resource) => (
            <Card key={resource.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <resource.icon className="h-5 w-5 text-primary" />
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {resource.description}
                </p>
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                    className="text-primary font-medium hover:underline flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    {resource.phone}
                  </a>
                )}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Get Help
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Printable Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Printable Materials
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {printableResources.map((resource) => (
            <Card key={resource.url}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 mr-4">
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${resource.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Location Sharing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Live Location Sharing
        </h2>
        <p className="text-muted-foreground mb-4">
          During an emergency, share your real-time location with trusted family members or friends using apps you already have. We recommend setting this up <strong>before</strong> an emergency happens.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* WhatsApp */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                WhatsApp
              </CardTitle>
              <CardDescription>Share for 15 min, 1 hr, or 8 hrs</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open a chat with your trusted contact</li>
                <li>Tap the <strong>+</strong> (attach) button</li>
                <li>Select <strong>Location</strong> → <strong>Share live location</strong></li>
                <li>Choose duration and tap <strong>Send</strong></li>
              </ol>
            </CardContent>
          </Card>

          {/* Signal */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Signal
              </CardTitle>
              <CardDescription>Most private option - encrypted</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open a chat with your trusted contact</li>
                <li>Tap the <strong>+</strong> button next to the message field</li>
                <li>Select <strong>Location</strong></li>
                <li>Choose to share once or as live location</li>
              </ol>
            </CardContent>
          </Card>

          {/* Google Maps */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-red-500" />
                Google Maps
              </CardTitle>
              <CardDescription>Works on Android & iPhone</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open Google Maps and tap your profile picture</li>
                <li>Select <strong>Location sharing</strong></li>
                <li>Tap <strong>Share location</strong> and choose duration</li>
                <li>Select contacts to share with via text or email</li>
              </ol>
            </CardContent>
          </Card>

          {/* Find My */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-gray-600" />
                Find My (Apple)
              </CardTitle>
              <CardDescription>iPhone, iPad, Mac only</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open the <strong>Find My</strong> app</li>
                <li>Go to the <strong>People</strong> tab</li>
                <li>Tap <strong>Start Sharing Location</strong></li>
                <li>Enter contact name and tap <strong>Send</strong></li>
              </ol>
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Go to Settings → [Your Name] → Find My to enable "Share My Location"
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm">
            <strong>Tip:</strong> Set up location sharing with a trusted contact <em>now</em> so it's ready when you need it. Practice with a family member so everyone knows how to use it.
          </p>
        </div>
      </section>

      {/* Organization Directory */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Organization Directory</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {organizationCategories.map((category) => (
            <Card key={category.title} id={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <category.icon className="h-5 w-5 text-primary" />
                  {category.title}
                </CardTitle>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.organizations.map((org) => (
                    <li key={org.url}>
                      <a
                        href={org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="flex items-start gap-2">
                          <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          <div>
                            <span className="font-medium text-sm group-hover:text-primary transition-colors">
                              {org.name}
                            </span>
                            {org.description && (
                              <p className="text-xs text-muted-foreground">
                                {org.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Workplace Rights */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Workplace Rights
            </CardTitle>
            <CardDescription>
              All workers have rights regardless of immigration status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Right to minimum wage, overtime pay, and safe working conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Workers' compensation for workplace injuries</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Protection from discrimination</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Employers cannot threaten to call ICE as retaliation</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>In California (AB 450) employers cannot allow ICE access without a warrant</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Fraud Warning */}
      <section className="mb-12">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Warning: Notario Fraud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              In the U.S., "notarios" are <strong>NOT attorneys</strong> and cannot give legal advice.
              Only hire licensed attorneys for immigration help.
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Verify any attorney at your state bar association website</li>
              <li>• Report fraud to your state attorney general or the FTC</li>
              <li>• Use AILA's lawyer search to find qualified attorneys</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Find Legal Help CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Need Legal Help?</h2>
          <p className="text-muted-foreground mb-4">
            Use our legal support connector to find immigration attorneys and
            legal aid organizations in your area.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="#legal">Find Legal Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/rights">Know Your Rights</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </PageWrapper>
  )
}
