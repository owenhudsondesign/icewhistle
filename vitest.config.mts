import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // The Next.js tsconfig uses `jsx: "preserve"` because Next runs its own
  // transform. Tests are compiled by oxc instead, which is told here to emit
  // the automatic JSX runtime itself.
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/lib/**', 'src/components/**', 'src/hooks/**', 'src/data/**'],
      exclude: [
        // Pure content: translation strings and the knowledge base articles.
        // These carry no branches, so counting their lines only dilutes the
        // number and hides which real logic is actually untested.
        'src/lib/translations.ts',
        'src/data/knowledge-base.ts',
        '**/*.test.{ts,tsx}',
        '**/.DS_Store',
      ],
      // Fails the run if coverage regresses below the project standard.
      thresholds: {
        statements: 80,
        lines: 80,
        functions: 78,
        branches: 74,
      },
    },
  },
})
