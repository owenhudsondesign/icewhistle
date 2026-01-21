import { NextRequest, NextResponse } from 'next/server'
import { legalIntakeSchema } from '@/lib/validators'
import type { LegalResource, LegalMatch } from '@/types/legal'

// POST /api/matching - Find legal resources based on intake
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = legalIntakeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const intake = result.data

    // TODO: Replace with actual database query
    // const resources = await prisma.legalResource.findMany({
    //   where: {
    //     acceptingCases: true,
    //     jurisdictions: { has: intake.location.state },
    //     languages: { has: intake.language },
    //     ...(intake.canAffordAttorney === false && { proBonoAvailable: true }),
    //   },
    // })

    // Placeholder resources for development
    const sampleResources: LegalResource[] = [
      {
        id: '1',
        name: 'Immigration Legal Services',
        organizationType: 'legal_aid',
        jurisdictions: ['CA', 'TX', 'NY'],
        languages: ['en', 'es'],
        caseTypes: ['asylum', 'deportation_defense', 'daca'],
        website: 'https://example.org',
        phone: '1-800-555-0123',
        email: 'help@example.org',
        acceptingCases: true,
        proBonoAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Community Legal Center',
        organizationType: 'legal_aid',
        jurisdictions: ['CA', 'AZ'],
        languages: ['en', 'es', 'zh'],
        caseTypes: ['detention', 'deportation_defense'],
        website: 'https://example2.org',
        phone: '1-800-555-0456',
        acceptingCases: true,
        proBonoAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Score and rank resources
    const matches: LegalMatch[] = sampleResources
      .map((resource) => {
        let score = 0
        const matchReasons: string[] = []

        // Jurisdiction match
        if (resource.jurisdictions.includes(intake.location.state)) {
          score += 3
          matchReasons.push('Serves your state')
        }

        // Language match
        if (resource.languages.includes(intake.language)) {
          score += 2
          matchReasons.push(`Speaks ${intake.language}`)
        }

        // Case type match
        const situationToCaseType: Record<string, string[]> = {
          detained: ['detention', 'deportation_defense'],
          facing_deportation: ['deportation_defense', 'asylum'],
          status_question: ['general', 'daca'],
          family_separation: ['family_petition', 'detention'],
          work_authorization: ['work_visa', 'daca'],
          other: ['general'],
        }

        const relevantCaseTypes = situationToCaseType[intake.situationType] || []
        const matchingCaseTypes = resource.caseTypes.filter((ct) =>
          relevantCaseTypes.includes(ct)
        )
        if (matchingCaseTypes.length > 0) {
          score += matchingCaseTypes.length
          matchReasons.push('Handles your case type')
        }

        // Pro bono availability
        if (intake.canAffordAttorney === false && resource.proBonoAvailable) {
          score += 2
          matchReasons.push('Pro bono available')
        }

        // Accepting cases
        if (resource.acceptingCases) {
          score += 1
          matchReasons.push('Currently accepting cases')
        }

        return {
          resource,
          score,
          matchReasons,
        }
      })
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score)

    return NextResponse.json({
      matches,
      total: matches.length,
    })
  } catch (error) {
    console.error('Error matching legal resources:', error)
    return NextResponse.json(
      { error: 'Failed to find legal resources' },
      { status: 500 }
    )
  }
}
