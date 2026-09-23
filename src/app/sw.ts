/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching } from 'serwist'
import { CacheFirst, ExpirationPlugin, NetworkFirst, Serwist } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const DAY = 60 * 60 * 24

/**
 * Offline caching for ICEwhistle.
 *
 * This app is used by people who may have no signal - in a basement, a
 * detention waiting room, or on a prepaid plan that has run out - so the
 * rights guidance, the translations and the offline page all have to survive
 * without a network.
 *
 * Migrated from next-pwa, which is unmaintained and does not work past
 * Next 14. The caching rules below are carried over one for one.
 */
const appCache: RuntimeCaching[] = [
  {
    // Every language file, so someone can switch language with no connection.
    matcher: ({ url }) => /\/locales\/.*\.json$/.test(url.pathname),
    handler: new CacheFirst({
      cacheName: 'translations',
      plugins: [
        new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * DAY }),
      ],
    }),
  },
  {
    // Know-your-rights and resources pages.
    matcher: ({ url }) => /\/(rights|resources)/.test(url.pathname),
    handler: new CacheFirst({
      cacheName: 'kyr-content',
      plugins: [new ExpirationPlugin({ maxAgeSeconds: 7 * DAY })],
    }),
  },
  {
    // Alerts are time sensitive, so the network wins when it is reachable.
    matcher: ({ url }) => /\/api\/alerts/.test(url.pathname),
    handler: new NetworkFirst({
      cacheName: 'alerts',
      networkTimeoutSeconds: 10,
    }),
  },
  ...defaultCache,
]

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: appCache,
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },
})

serwist.addEventListeners()
