const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // Cache all language files for offline use
      // Pre-loaded in background so users can switch languages offline
      urlPattern: /\/locales\/.*\.json$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'translations',
        expiration: {
          maxEntries: 50, // Support all languages
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\/(rights|resources)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'kyr-content',
        expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 }, // 1 week
      },
    },
    {
      urlPattern: /^https:\/\/.*\/api\/alerts/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'alerts',
        networkTimeoutSeconds: 10,
      },
    },
  ],
  fallbacks: {
    document: '/offline',
  },
});

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
};

module.exports = withPWA(nextConfig);
