import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Building
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Resources | ICEwhistle',
  description: 'Legal resources, printable materials, emergency contacts, and support organizations',
}

const printableResources = [
  {
    title: 'Red Card / Tarjeta Roja (ILRC)',
    description: 'Wallet card explaining your rights - available in 39 languages',
    filename: 'red-card.pdf',
    url: 'https://ilrc.org/red-cards',
    external: true,
  },
  {
    title: 'Know Your Rights Card (English)',
    description: 'Pocket-sized card with essential rights information',
    filename: 'kyr-card-en.pdf',
  },
  {
    title: 'Tarjeta de Derechos (Español)',
    description: 'Tarjeta de bolsillo con información esencial sobre sus derechos',
    filename: 'kyr-card-es.pdf',
  },
  {
    title: 'Family Emergency Plan Template',
    description: 'Printable worksheet to help organize your emergency plan',
    filename: 'emergency-plan-template.pdf',
  },
  {
    title: 'Warrant Comparison Guide',
    description: 'Visual guide to identify judicial vs. administrative warrants (I-200, I-205)',
    filename: 'warrant-guide.pdf',
  },
  {
    title: 'Power of Attorney Template',
    description: 'Template for designating emergency childcare and financial authority',
    filename: 'poa-template.pdf',
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
]

const organizationCategories = [
  {
    title: 'Legal Aid Organizations',
    icon: Scale,
    description: 'Free and low-cost legal help',
    organizations: [
      { name: 'National Immigrant Justice Center (NIJC)', url: 'https://immigrantjustice.org', description: 'Direct legal services, nationwide' },
      { name: 'Catholic Legal Immigration Network (CLINIC)', url: 'https://cliniclegal.org', description: '400+ nonprofit programs' },
      { name: 'American Immigration Lawyers Association', url: 'https://aila.org', description: 'Find a licensed attorney' },
      { name: 'National Immigration Law Center', url: 'https://nilc.org', description: 'Policy and legal expertise' },
      { name: 'Immigrant Legal Resource Center (ILRC)', url: 'https://ilrc.org', description: 'Red Cards and training' },
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
            <Card key={resource.filename}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 mr-4">
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
                <Button variant="outline" size="icon" asChild>
                  {resource.external ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download ${resource.title}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <a
                      href={`/kyr-cards/${resource.filename}`}
                      download
                      aria-label={`Download ${resource.title}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Organization Directory */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Organization Directory</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {organizationCategories.map((category) => (
            <Card key={category.title}>
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
              <Link href="/legal">Find Legal Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/rights">Know Your Rights</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
