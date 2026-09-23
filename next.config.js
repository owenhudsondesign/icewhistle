const withSerwistInit = require('@serwist/next').default

// Serwist replaces next-pwa, which is unmaintained and breaks on Next 15.
// The caching rules themselves live in src/app/sw.ts.
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
  reloadOnOnline: true,
  // The App Router does not emit /offline into the precache manifest, so the
  // navigation fallback had nothing to fall back to and an unvisited page
  // showed the browser's own error page instead. Precaching it explicitly is
  // what makes the offline page work.
  additionalPrecacheEntries: [{ url: '/offline', revision: null }],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(self)' },
      ],
    },
  ],
}

module.exports = withSerwist(nextConfig)
