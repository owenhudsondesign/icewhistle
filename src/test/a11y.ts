import { axe } from 'vitest-axe'
import type { AxeResults, Result } from 'axe-core'
import { expect } from 'vitest'

/**
 * Rules that can only be judged for a whole page. A component rendered on its
 * own has no landmarks and no heading context, so these are checked by the
 * page-level audits instead.
 */
const PAGE_LEVEL_RULES = {
  region: { enabled: false },
  'page-has-heading-one': { enabled: false },
  'heading-order': { enabled: false },
  'landmark-one-main': { enabled: false },
}

const describeViolation = (violation: Result): string => {
  const targets = violation.nodes
    .slice(0, 3)
    .map((node) => `      ${node.target.join(' ')}`)
    .join('\n')

  return `  [${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help}\n${targets}`
}

/** Fails with a readable list of what axe found, rather than a bare boolean. */
export const expectNoViolations = (results: AxeResults) => {
  const { violations } = results
  if (violations.length === 0) return

  const summary = violations.map(describeViolation).join('\n')
  expect.fail(
    `Found ${violations.length} accessibility violation(s):\n${summary}`
  )
}

/** Audits a single component, skipping page-level structural rules. */
export const auditComponent = async (container: Element) =>
  expectNoViolations(await axe(container, { rules: PAGE_LEVEL_RULES }))

/** Audits a full page, including landmark and heading structure. */
export const auditPage = async (container: Element) =>
  expectNoViolations(await axe(container))
