# CivicSALT — Sanctuary Aid & Legal Tools
## Technical Product Specification v1.0

> **Purpose**: This document serves as the initialization spec for building the CivicSALT web application. It is designed to be fed to Claude Code to bootstrap the codebase.

---

## Project Overview

CivicSALT is an emergency assistance web application designed to help US residents and immigrants understand their legal rights, prepare for emergencies, coordinate community response, and access legal support during ICE-related situations. It is part of the Civic product ecosystem.

### Core Principles
- **Privacy-first**: Minimal data collection, no immigration status storage
- **Offline-capable**: Critical features work without internet
- **Accessible**: WCAG 2.1 AA compliant, multilingual
- **Mobile-ready**: PWA from day one, native app architecture later

---

## Tech Stack

### Frontend
```
Framework:        Next.js 14+ (App Router)
Language:         TypeScript (strict mode)
Styling:          Tailwind CSS
UI Components:    shadcn/ui (accessible, customizable)
State Management: Zustand (lightweight, works with SSR)
Forms:            React Hook Form + Zod validation
Maps:             Mapbox GL JS or Leaflet
```

### Backend
```
API:              Next.js API Routes (App Router)
Backend:          Supabase (all-in-one platform)
                  - PostgreSQL database
                  - Supabase Storage (encrypted documents)
                  - Supabase Realtime (live alerts)
                  - Supabase Auth (optional, anonymous-first)
ORM:              Prisma (connects to Supabase PostgreSQL)
SMS:              Twilio (panic button, SMS alerts)
```

### Infrastructure
```
Hosting:          Vercel (primary) or self-hosted
CDN:              Vercel Edge / Cloudflare
Encryption:       libsodium (client-side E2E encryption)
```

### Mobile Strategy
```
Phase 1:          PWA (installable from browser)
Phase 2:          Capacitor wrapper for app stores
Phase 3:          React Native (if native features required)
```

---

## Project Structure

```
civicsalt/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public routes (no auth)
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── rights/         # Know Your Rights content
│   │   │   ├── alerts/         # Community alert map (view-only)
│   │   │   └── resources/      # Static legal resources
│   │   ├── (protected)/        # Routes requiring auth/session
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── plan/           # Emergency plan builder
│   │   │   ├── vault/          # Document vault
│   │   │   ├── network/        # Rapid response coordination
│   │   │   └── legal/          # Legal support connector
│   │   ├── api/                # API routes
│   │   │   ├── alerts/         # Alert CRUD + verification
│   │   │   ├── plans/          # Emergency plan storage
│   │   │   ├── documents/      # Encrypted document handling
│   │   │   └── matching/       # Legal matching system
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── kyr/                # Know Your Rights components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── WarrantComparison.tsx
│   │   │   ├── PracticeMode.tsx
│   │   │   └── RightsCard.tsx
│   │   ├── alerts/             # Alert network components
│   │   │   ├── AlertMap.tsx
│   │   │   ├── ReportForm.tsx
│   │   │   ├── AlertFeed.tsx
│   │   │   └── PanicButton.tsx
│   │   ├── plan/               # Emergency plan components
│   │   │   ├── PlanWizard.tsx
│   │   │   ├── ContactManager.tsx
│   │   │   └── EmergencyCard.tsx
│   │   ├── vault/              # Document vault components
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   └── EncryptionIndicator.tsx
│   │   └── shared/             # Shared components
│   │       ├── LanguageSwitcher.tsx
│   │       ├── OfflineIndicator.tsx
│   │       └── AccessibilityControls.tsx
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client (browser + server)
│   │   ├── db.ts               # Prisma client
│   │   ├── encryption.ts       # E2E encryption utilities
│   │   ├── i18n.ts             # Internationalization setup
│   │   ├── offline.ts          # Service worker utilities
│   │   └── validators.ts       # Zod schemas
│   ├── hooks/
│   │   ├── useGeolocation.ts
│   │   ├── useOffline.ts
│   │   ├── useEncryption.ts
│   │   └── usePanicButton.ts
│   ├── stores/
│   │   ├── alertStore.ts       # Alert state
│   │   ├── planStore.ts        # Emergency plan state
│   │   └── userStore.ts        # User preferences
│   └── types/
│       ├── alert.ts
│       ├── plan.ts
│       └── legal.ts
├── public/
│   ├── locales/                # Translation files
│   │   ├── en/
│   │   ├── es/
│   │   ├── zh/
│   │   └── ...
│   ├── kyr-cards/              # Printable PDF assets
│   └── manifest.json           # PWA manifest
├── prisma/
│   └── schema.prisma           # Database schema
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Anonymous user sessions (no PII required)
model Session {
  id            String    @id @default(cuid())
  createdAt     DateTime  @default(now())
  lastActiveAt  DateTime  @updatedAt
  deviceHash    String?   // Hashed device fingerprint for continuity
  preferences   Json?     // Language, notification settings, etc.
  
  plans         Plan[]
  documents     Document[]
  alerts        Alert[]   @relation("ReportedAlerts")
}

// Emergency preparedness plans
model Plan {
  id                  String    @id @default(cuid())
  sessionId           String
  session             Session   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  encryptedData       Bytes     // E2E encrypted plan content
  encryptionNonce     Bytes
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  lastReviewedAt      DateTime?
  
  trustedContacts     TrustedContact[]
}

model TrustedContact {
  id            String    @id @default(cuid())
  planId        String
  plan          Plan      @relation(fields: [planId], references: [id], onDelete: Cascade)
  
  encryptedData Bytes     // Name, phone, email, role - all encrypted
  nonce         Bytes
  accessLevel   String    // "emergency_only", "full_access"
  
  createdAt     DateTime  @default(now())
}

// Encrypted document storage (metadata only - files in Supabase Storage)
model Document {
  id              String    @id @default(cuid())
  sessionId       String
  session         Session   @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  encryptedName   Bytes     // Encrypted filename
  nonce           Bytes
  storagePath     String    // Supabase Storage path (file itself is E2E encrypted)
  fileType        String    // MIME type
  fileSize        Int
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// Community alerts (anonymized)
model Alert {
  id              String    @id @default(cuid())
  
  // Location (intentionally imprecise for privacy)
  latitude        Float
  longitude       Float
  neighborhoodHash String?  // Hashed neighborhood for clustering
  
  // Content
  alertType       String    // "ice_presence", "checkpoint", "raid", "all_clear"
  description     String?
  
  // Verification
  status          String    @default("unverified") // "unverified", "verified", "disputed", "resolved"
  verificationScore Float   @default(0)
  corroborations  Int       @default(0)
  
  // Timestamps
  reportedAt      DateTime  @default(now())
  occurredAt      DateTime
  resolvedAt      DateTime?
  expiresAt       DateTime  // Auto-expire old alerts
  
  // Anonymous reporter reference
  reporterSessionId String?
  reporterSession   Session?  @relation("ReportedAlerts", fields: [reporterSessionId], references: [id], onDelete: SetNull)
  
  @@index([latitude, longitude])
  @@index([status, reportedAt])
  @@index([neighborhoodHash])
}

// Legal resource directory (public data)
model LegalResource {
  id              String    @id @default(cuid())
  
  name            String
  organizationType String   // "attorney", "legal_aid", "bond_fund", "advocacy"
  
  // Service area
  jurisdictions   String[]  // State/county codes
  languages       String[]
  
  // Case types
  caseTypes       String[]  // "asylum", "daca", "detention", "deportation_defense"
  
  // Contact (public info)
  website         String?
  phone           String?
  email           String?
  intakeUrl       String?
  
  // Availability
  acceptingCases  Boolean   @default(true)
  proBonoAvailable Boolean  @default(false)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  verifiedAt      DateTime?
  
  @@index([jurisdictions])
  @@index([caseTypes])
}

// Volunteer network (for rapid response)
model Volunteer {
  id              String    @id @default(cuid())
  
  encryptedProfile Bytes    // Name, contact - encrypted
  nonce           Bytes
  
  roles           String[]  // "legal_observer", "driver", "translator", "childcare"
  languages       String[]
  
  // Service area (approximate)
  serviceAreaLat  Float
  serviceAreaLng  Float
  serviceRadiusMi Float     @default(10)
  
  // Availability
  isActive        Boolean   @default(true)
  availabilityJson Json?    // Weekly schedule
  
  createdAt       DateTime  @default(now())
  lastActiveAt    DateTime  @updatedAt
  
  @@index([serviceAreaLat, serviceAreaLng])
}
```

---

## Core Features - Implementation Details

### 1. Know Your Rights (KYR) Assistant

**Architecture**: Static content + optional AI chat enhancement

```typescript
// Key components and their responsibilities

// Static content (works offline)
- Pre-written KYR guides in /public/locales/[lang]/kyr/
- Warrant comparison images and explanations
- Printable PDF cards generated at build time

// Interactive chat (requires connection)
- Integration with Claude API or similar LLM
- System prompt focused on immigration rights
- Clear disclaimers: "This is legal education, not legal advice"
- Conversation not stored (privacy)

// Practice Mode
- Pre-scripted scenario dialogues
- Multiple choice responses with feedback
- Works offline (all content pre-loaded)
```

**Key Files**:
- `src/app/(public)/rights/page.tsx` - Main KYR hub
- `src/components/kyr/ChatInterface.tsx` - AI chat component
- `src/components/kyr/PracticeMode.tsx` - Scenario practice
- `src/components/kyr/WarrantComparison.tsx` - Visual warrant explainer

### 2. Family Emergency Preparedness Hub

**Architecture**: Client-side encryption with encrypted cloud backup

```typescript
// Encryption flow
1. User creates plan in browser
2. Plan encrypted client-side with user's key (derived from PIN/passphrase)
3. Encrypted blob sent to server
4. Server stores encrypted data (cannot read it)
5. User can access from any device with their key

// Data structure (before encryption)
interface EmergencyPlan {
  childcare: {
    authorizedPickups: Contact[];
    schoolInfo: SchoolContact[];
    medicalAuth: string;
  };
  powerOfAttorney: {
    designee: Contact;
    documentRef?: string; // Reference to uploaded legal doc
  };
  finances: {
    accountAccess: string; // Instructions, not credentials
    billPayInfo: string;
  };
  pets: {
    careInstructions: string;
    vetInfo: Contact;
    authorizedCaretaker: Contact;
  };
  employer: {
    notifyOnEmergency: boolean;
    contactInfo: Contact;
    notificationMessage: string;
  };
  trustedContacts: TrustedContact[];
  additionalNotes: string;
}
```

**Key Files**:
- `src/app/(protected)/plan/page.tsx` - Plan dashboard
- `src/components/plan/PlanWizard.tsx` - Step-by-step builder
- `src/lib/encryption.ts` - Client-side encryption utilities
- `src/hooks/useEncryption.ts` - Encryption state management

### 3. Community Alert Network

**Architecture**: Real-time pub/sub with verification scoring

```typescript
// Alert submission flow
1. User taps "Report" → minimal form (type, location, description)
2. Location auto-detected or manually adjusted (privacy: ~0.5mi precision)
3. Alert saved as "unverified"
4. AI classifier scores initial credibility
5. Nearby users can corroborate → increases verification score
6. At threshold (e.g., 3 corroborations in 30min), status → "verified"
7. Push notifications sent to users in area
8. Alert auto-expires after 4 hours unless extended

// Verification scoring
score = (
  corroborations * 2 +
  (hasDescription ? 1 : 0) +
  (timeConsistency ? 1 : 0) +  // Multiple reports around same time
  (patternMatch ? 1 : 0)       // Matches known enforcement patterns
) / maxScore

// Real-time updates
- Supabase Realtime for live map updates
- Background sync for offline-submitted reports
- SMS gateway for users without smartphones
```

**Key Files**:
- `src/app/(public)/alerts/page.tsx` - Public alert map
- `src/components/alerts/AlertMap.tsx` - Mapbox/Leaflet map
- `src/components/alerts/ReportForm.tsx` - Quick report submission
- `src/app/api/alerts/route.ts` - Alert CRUD API
- `src/app/api/alerts/verify/route.ts` - Verification logic

### 4. Panic Button

**Architecture**: One-tap emergency broadcast

```typescript
// Panic button behavior
1. User configures trusted contacts in advance
2. On activation (long-press or triple-tap):
   - Captures current location
   - Sends SMS to all trusted contacts via Twilio/similar
   - Message: "[Name] activated emergency alert. Location: [link]. Time: [timestamp]"
   - Optionally starts background recording (if enabled)
3. Confirmation vibration (silent visual/haptic only)
4. No on-screen indication (in case device is observed)

// Implementation
- Service worker for background operation
- Twilio or similar for SMS delivery
- Location via Geolocation API with fallback to IP
```

**Key Files**:
- `src/components/shared/PanicButton.tsx` - UI component
- `src/hooks/usePanicButton.ts` - Activation logic
- `src/app/api/panic/route.ts` - SMS dispatch

### 5. Legal Support Connector

**Architecture**: Intake form → matching algorithm → secure messaging

```typescript
// Matching flow
1. User completes intake (situation, location, case type, language)
2. System queries LegalResource table with filters
3. Results ranked by:
   - Jurisdiction match
   - Case type expertise
   - Language match
   - Availability (accepting cases)
   - Pro bono availability (if needed)
4. User can message matched orgs through app
5. Messages stored encrypted, auto-delete after 30 days

// No PII stored long-term
- Intake responses not saved after matching
- User can save matches to their encrypted plan
```

**Key Files**:
- `src/app/(protected)/legal/page.tsx` - Legal connector hub
- `src/app/(protected)/legal/intake/page.tsx` - Intake questionnaire
- `src/app/api/matching/route.ts` - Matching algorithm
- `src/components/legal/ResourceCard.tsx` - Resource display

---

## PWA Configuration

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
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

module.exports = withPWA({
  // Next.js config
});
```

```json
// public/manifest.json
{
  "name": "CivicSALT - Sanctuary Aid & Legal Tools",
  "short_name": "CivicSALT",
  "description": "Emergency resources for immigrant communities",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

---

## Internationalization (i18n)

```typescript
// Using next-intl for App Router compatibility

// src/lib/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'zh', 'vi', 'tl', 'ko', 'ar', 'ht', 'pt', 'fr'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../public/locales/${locale}/common.json`)).default
}));

// Usage in components
import { useTranslations } from 'next-intl';

export function RightsCard() {
  const t = useTranslations('kyr');
  return <h1>{t('title')}</h1>; // "Know Your Rights" / "Conozca Sus Derechos" / etc.
}
```

**Translation file structure**:
```
public/locales/
├── en/
│   ├── common.json       # Shared UI strings
│   ├── kyr.json          # Know Your Rights content
│   ├── alerts.json       # Alert-related strings
│   └── plan.json         # Emergency plan strings
├── es/
│   ├── common.json
│   └── ...
└── ...
```

---

## Security Requirements

### Client-Side Encryption
```typescript
// src/lib/encryption.ts
import { secretbox, randomBytes } from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

export function deriveKey(passphrase: string, salt: Uint8Array): Uint8Array {
  // Use Argon2 or PBKDF2 for key derivation
  // Implementation depends on chosen library
}

export function encrypt(data: string, key: Uint8Array): { ciphertext: string; nonce: string } {
  const nonce = randomBytes(secretbox.nonceLength);
  const messageUint8 = new TextEncoder().encode(data);
  const encrypted = secretbox(messageUint8, nonce, key);
  
  return {
    ciphertext: encodeBase64(encrypted),
    nonce: encodeBase64(nonce),
  };
}

export function decrypt(ciphertext: string, nonce: string, key: Uint8Array): string {
  const decrypted = secretbox.open(
    decodeBase64(ciphertext),
    decodeBase64(nonce),
    key
  );
  if (!decrypted) throw new Error('Decryption failed');
  return new TextDecoder().decode(decrypted);
}
```

### Data Minimization Checklist
- [ ] No immigration status fields anywhere
- [ ] Location precision limited to ~0.5mi for alerts
- [ ] Session IDs are random, not tied to identity
- [ ] Logs exclude request bodies and PII
- [ ] Analytics are privacy-preserving (Plausible/Fathom, not GA)
- [ ] Document filenames encrypted
- [ ] Auto-delete old data (alerts: 30 days, messages: 30 days)

### Security Headers
```typescript
// next.config.js headers
{
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(self)' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; ..." },
      ],
    },
  ],
}
```

---

## Development Phases

### Phase 1: Foundation (Weeks 1-6)
**Goal**: Core KYR content + basic PWA

- [ ] Next.js project setup with TypeScript
- [ ] Tailwind + shadcn/ui configuration
- [ ] PWA manifest and service worker
- [ ] Static KYR content pages (English + Spanish)
- [ ] Warrant comparison visual tool
- [ ] Printable KYR cards (PDF generation)
- [ ] Basic offline support
- [ ] Deploy to Vercel

**Deliverable**: Usable KYR reference that works offline

### Phase 2: Emergency Planning (Weeks 7-10)
**Goal**: Encrypted personal emergency plans

- [ ] Supabase Storage bucket setup
- [ ] Client-side encryption implementation
- [ ] Emergency plan wizard UI
- [ ] Trusted contact management
- [ ] Document vault (encrypted upload to Supabase Storage)
- [ ] Printable emergency card generator
- [ ] PIN/passphrase-based access

**Deliverable**: Users can create and securely store emergency plans

### Phase 3: Alert Network (Weeks 11-16)
**Goal**: Real-time community alerts

- [ ] Supabase project setup (database + storage + realtime)
- [ ] Prisma schema → Supabase PostgreSQL
- [ ] Alert API endpoints
- [ ] Map component (Mapbox or Leaflet)
- [ ] Report submission flow
- [ ] Verification scoring system
- [ ] Real-time updates (Supabase Realtime)
- [ ] Push notifications
- [ ] SMS alert option (Twilio)
- [ ] Panic button

**Deliverable**: Functional community alert system

### Phase 4: Legal Network (Weeks 17-22)
**Goal**: Connect users with legal resources

- [ ] Legal resource database + admin seeding
- [ ] Intake questionnaire
- [ ] Matching algorithm
- [ ] Resource directory UI
- [ ] Secure messaging (encrypted)
- [ ] Integration with legal aid APIs (if available)

**Deliverable**: Working legal resource connector

### Phase 5: Expansion (Weeks 23+)
**Goal**: Scale and polish

- [ ] Additional languages (8 more)
- [ ] Volunteer coordination features
- [ ] AI chat enhancement for KYR
- [ ] Capacitor mobile wrapper
- [ ] Performance optimization
- [ ] Security audit
- [ ] Community partnerships integration

---

## Environment Variables

```bash
# .env.example

# ===================
# SUPABASE (all-in-one: database, storage, realtime, auth)
# ===================
# Get these from: https://supabase.com/dashboard/project/[your-project]/settings/api
NEXT_PUBLIC_SUPABASE_URL="https://[your-project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."  # Safe to expose (RLS protects data)
SUPABASE_SERVICE_ROLE_KEY="eyJ..."      # Server-only, never expose to client

# Database connection (for Prisma - same Supabase PostgreSQL)
# Get from: Supabase Dashboard > Settings > Database > Connection string
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# ===================
# EXTERNAL SERVICES
# ===================
# SMS (Twilio) - for panic button and SMS alerts
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN="pk...."

# AI (optional, for KYR chat enhancement)
ANTHROPIC_API_KEY="sk-ant-..."

# ===================
# APP CONFIG
# ===================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Analytics (privacy-preserving)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="civicsalt.app"
```

---

## Testing Strategy

```bash
# Unit tests (Vitest)
- Encryption/decryption functions
- Validation schemas
- Matching algorithm logic

# Integration tests (Playwright)
- KYR content loads correctly
- Plan wizard completes successfully
- Alert submission flow
- Offline mode functionality

# E2E tests (Playwright)
- Full user journeys
- PWA installation
- Push notification flow

# Security tests
- Penetration testing (external)
- Dependency vulnerability scanning (Snyk/Dependabot)
- Content Security Policy validation
```

---

## Accessibility Checklist

- [ ] Semantic HTML throughout
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation for all features
- [ ] Focus management in modals/wizards
- [ ] Color contrast ratios (WCAG AA)
- [ ] Text scaling up to 200%
- [ ] Screen reader testing (VoiceOver, NVDA)
- [ ] Reduced motion support
- [ ] High contrast mode toggle
- [ ] Audio descriptions for visual content

---

## Commands for Claude Code Initialization

```bash
# Initialize the project
npx create-next-app@latest civicsalt --typescript --tailwind --eslint --app --src-dir

# Install core dependencies
cd civicsalt
npm install @prisma/client zustand zod react-hook-form @hookform/resolvers
npm install next-intl next-pwa tweetnacl tweetnacl-util
npm install -D prisma @types/node

# Install Supabase client
npm install @supabase/supabase-js @supabase/ssr

# Install UI components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog form input label select textarea toast

# Install map library (choose one)
npm install mapbox-gl @types/mapbox-gl
# OR for open-source alternative:
# npm install leaflet react-leaflet @types/leaflet

# Initialize Prisma (connects to Supabase PostgreSQL)
npx prisma init

# After setting DATABASE_URL in .env:
npx prisma db push    # Push schema to Supabase (dev)
# OR
npx prisma migrate dev --name init  # Create migration (production)

# Generate Prisma client
npx prisma generate
```

### Supabase Setup Checklist

1. **Create project** at [supabase.com](https://supabase.com)

2. **Configure Storage bucket**:
   ```sql
   -- Run in Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('documents', 'documents', false);
   
   -- RLS policy: users can only access their own files
   CREATE POLICY "Users can upload to their session folder"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   CREATE POLICY "Users can read their own files"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   CREATE POLICY "Users can delete their own files"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

3. **Enable Realtime** for alerts table:
   - Dashboard → Database → Replication
   - Enable for `Alert` table

4. **Copy credentials** to `.env.local`:
   - Dashboard → Settings → API
   - Copy URL, anon key, service role key

### Supabase Client Setup

```typescript
// src/lib/supabase.ts

import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Browser client (for client components)
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server client (for API routes and server components)
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
```

### Document Upload Example (with E2E Encryption)

```typescript
// src/lib/storage.ts

import { createBrowserSupabaseClient } from './supabase'
import { encrypt } from './encryption'

export async function uploadEncryptedDocument(
  sessionId: string,
  file: File,
  encryptionKey: Uint8Array
) {
  const supabase = createBrowserSupabaseClient()
  
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const fileData = new Uint8Array(arrayBuffer)
  
  // Encrypt file content client-side
  const { ciphertext, nonce } = encrypt(
    Buffer.from(fileData).toString('base64'),
    encryptionKey
  )
  
  // Upload encrypted blob to Supabase Storage
  const filePath = `${sessionId}/${crypto.randomUUID()}`
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, new Blob([ciphertext]), {
      contentType: 'application/octet-stream', // Always octet-stream (encrypted)
      upsert: false
    })
  
  if (error) throw error
  
  return {
    storagePath: filePath,
    nonce,
    originalType: file.type,
    originalSize: file.size
  }
}
```

### Realtime Alerts Subscription

```typescript
// src/hooks/useRealtimeAlerts.ts

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { Alert } from '@/types/alert'

export function useRealtimeAlerts(boundingBox: {
  north: number; south: number; east: number; west: number
}) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  
  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    
    // Subscribe to new alerts in the area
    const channel = supabase
      .channel('alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Alert',
          filter: `latitude=gte.${boundingBox.south}&latitude=lte.${boundingBox.north}`
        },
        (payload) => {
          setAlerts(current => [payload.new as Alert, ...current])
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [boundingBox])
  
  return alerts
}
```

---

## Legal Disclaimer (Required in App)

```
IMPORTANT: CivicSALT provides legal education and resources, not legal advice. 
The information in this app is for educational purposes only and does not 
constitute legal advice or create an attorney-client relationship. 

Immigration law is complex and varies by situation. For advice about your 
specific circumstances, please consult with a qualified immigration attorney.

If you are in immediate danger, call 911.
```

---

## Contact

Project: CivicSALT (Sanctuary Aid & Legal Tools)
Part of the Civic product ecosystem
Repository: [TBD]
License: Open source (MIT or similar)

---

*Know your rights. Protect your neighbors.*
