# ICEwhistle — Immigration Community Emergency Resources
## Technical Product Specification v2.0

> **Purpose**: This document describes the ICEwhistle web application architecture and features. Originally named CivicSALT, the app has been renamed and refocused for clarity and impact.

---

## Project Overview

ICEwhistle is an emergency assistance web application designed to help US residents and immigrants understand their legal rights, prepare for emergencies, and access emergency resources during ICE-related situations.

### Core Principles
- **Privacy-first**: Minimal data collection, all user data stored locally on device
- **Offline-capable**: Critical features work without internet
- **Accessible**: WCAG 2.1 AA compliant, 30 languages supported
- **Mobile-ready**: Progressive Web App (PWA) for cross-platform access

---

## Tech Stack

### Frontend
```
Framework:        Next.js 14+ (App Router)
Language:         TypeScript (strict mode)
Styling:          Tailwind CSS
UI Components:    shadcn/ui (accessible, customizable)
State Management: React hooks + Context
Forms:            React Hook Form + Zod validation
i18n:             Custom JSON-based translation system
```

### Infrastructure
```
Hosting:          Vercel
CDN:              Vercel Edge
PWA:              next-pwa with offline caching
```

### Mobile Strategy
```
Primary:          PWA (installable from browser)
Rationale:        Cannot be removed from app stores by government pressure
```

---

## Project Structure

```
icewhistle/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public routes
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── rights/         # Know Your Rights content
│   │   │   ├── hotlines/       # Emergency hotline directory
│   │   │   ├── emergency/      # Emergency quick-access page
│   │   │   ├── emergency-contacts/ # Trusted contacts management
│   │   │   ├── resources/      # Static legal resources
│   │   │   ├── faq/            # FAQ with AI chat
│   │   │   ├── encounter/      # ICE encounter guide
│   │   │   └── about/          # About the app
│   │   ├── (marketing)/        # Marketing pages
│   │   │   ├── landing/        # Landing page
│   │   │   ├── gateway/        # Language selection gateway
│   │   │   └── shop/           # Merchandise/support
│   │   ├── offline/            # Offline fallback page
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── hotlines/           # Hotline directory components
│   │   │   ├── HotlineDirectory.tsx
│   │   │   └── HotlineCard.tsx
│   │   ├── emergency-contacts/ # Emergency contacts components
│   │   │   └── EmergencyContactsManager.tsx
│   │   ├── onboarding/         # First-time user onboarding
│   │   │   ├── OnboardingFlow.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   ├── faq/                # FAQ components
│   │   │   └── FAQChat.tsx
│   │   └── shared/             # Shared components
│   │       ├── AppHeader.tsx
│   │       ├── BottomNav.tsx
│   │       ├── LanguageSelector.tsx
│   │       └── RecordingModal.tsx
│   ├── data/
│   │   ├── hotlines-directory.ts  # Emergency hotline data
│   │   └── know-your-rights.ts    # KYR content
│   ├── hooks/
│   │   ├── use-language.tsx       # i18n hook
│   │   └── use-emergency-contacts.ts
│   └── lib/
│       └── utils.ts
├── public/
│   ├── locales/                # Translation files (30 languages)
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── pt.json
│   │   ├── zh.json
│   │   └── ...
│   └── manifest.json           # PWA manifest
└── package.json
```

---

## Core Features

### 1. Know Your Rights (KYR)

**Architecture**: Static content with offline support

```typescript
// Key content areas
- What to do if ICE comes to your door
- Rights during traffic stops
- Rights at work
- Rights at school
- What is a warrant vs administrative warrant
- Right to remain silent
- Right to an attorney
```

**Key Files**:
- `src/app/(public)/rights/page.tsx` - Main KYR hub
- `src/app/(public)/encounter/page.tsx` - ICE encounter guide
- `src/data/know-your-rights.ts` - KYR content

### 2. Emergency Hotline Directory

**Architecture**: Local data with ZIP code matching

```typescript
// Hotline data structure
interface Hotline {
  id: string
  name: string
  phone: string
  description: string
  languages: string[]
  hours: string
  coverage: 'national' | 'state' | 'local'
  states?: string[]        // For state-level coverage
  zipPrefixes?: string[]   // For local coverage matching
  category: 'rapid-response' | 'legal-aid' | 'community'
}
```

**Privacy**: ZIP code stored only in localStorage, never sent to any server.

**Key Files**:
- `src/app/(public)/hotlines/page.tsx` - Hotline directory page
- `src/components/hotlines/HotlineDirectory.tsx` - Directory component
- `src/data/hotlines-directory.ts` - Hotline data

### 3. Emergency Contacts & One-Tap Alert

**Architecture**: Client-side only storage with native SMS integration

```typescript
// Contact stored in localStorage
interface EmergencyContact {
  id: string
  name: string
  phone: string  // digits only
}

// Alert message with location
defaultMessage = "URGENT: I may be in an ICE encounter right now.
My location: {google_maps_link}. If you don't hear from me in
30 minutes, please call the ICE detention hotline: 1-888-351-4024"
```

**Features**:
- Add up to 5 trusted contacts
- Customize alert message (or use default)
- One-tap "Alert My Contacts" button during encounters
- Opens native SMS app with all contacts and pre-filled message
- Includes current location (if user permits)

**Privacy**: All contacts stored only on the user's device. Never transmitted. Location only captured at moment of alert.

**Key Files**:
- `src/app/(public)/emergency-contacts/page.tsx` - Contacts management page
- `src/components/emergency-contacts/EmergencyContactsManager.tsx` - Add/edit/delete contacts
- `src/components/emergency-contacts/AlertContactsButton.tsx` - One-tap alert button
- `src/hooks/use-emergency-contacts.ts` - localStorage persistence + SMS URL generation

### 4. FAQ with AI Chat

**Architecture**: Static FAQ content + optional AI-powered chat

**Key Files**:
- `src/app/(public)/faq/page.tsx` - FAQ page
- `src/components/faq/FAQChat.tsx` - AI chat component

---

## Internationalization (i18n)

### Supported Languages (30)

```typescript
// Primary (shown prominently)
'en', 'es', 'pt'

// Chinese
'zh', 'zh-TW'

// Southeast Asian
'vi', 'tl', 'ko', 'th', 'my', 'lo', 'ja'

// Middle Eastern (RTL)
'ar', 'fa'

// South Asian
'hi', 'pa', 'ur', 'bn', 'gu', 'ne'

// French & Creole
'fr', 'ht'

// Eastern European
'ru', 'uk', 'pl'

// East African
'am', 'so', 'sw'

// Western European
'de', 'it'
```

### Translation System

```typescript
// src/hooks/use-language.tsx
export function useLanguage() {
  // Returns: { language, setLanguage, t, isLoading }
}

// Translation files: public/locales/{lang}.json
// Pre-loaded for offline access
```

### RTL Support

Languages with RTL text direction: Arabic (ar), Farsi (fa), Urdu (ur)

---

## PWA Configuration

```javascript
// next.config.js (with next-pwa)
- Service worker for offline access
- All 30 translation files cached for offline language switching
- Rights content cached for offline reading
- Offline fallback page
```

```json
// public/manifest.json
{
  "name": "ICEwhistle",
  "short_name": "ICEwhistle",
  "description": "Emergency resources for immigrant communities",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#00A6B4"
}
```

---

## Privacy Design

**There is no server-side database.** All user data is stored locally in the browser's localStorage and never leaves the device.

### Data Storage

| Data | Storage Location | Server Access |
|------|-----------------|---------------|
| ZIP code | localStorage | Never sent |
| Emergency contacts | localStorage | Never sent |
| Custom alert message | localStorage | Never sent |
| Language preference | localStorage | Never sent |
| Onboarding state | localStorage | Never sent |

### No Server-Side Data Collection

- No database - the app has no backend data storage
- No user accounts
- No analytics tracking
- No cookies (except essential PWA service worker)
- No personal data transmitted to any server

---

## Accessibility

### Requirements (WCAG 2.1 AA)

- Color contrast: 4.5:1 for body text, 3:1 for large text
- Touch targets: 48x48px minimum
- Focus indicators: Visible in all modes
- Screen reader: All interactive elements labeled
- RTL: Full support for Arabic, Farsi, Urdu

### Testing Checklist

- [ ] VoiceOver (iOS) full flow
- [ ] TalkBack (Android) full flow
- [ ] Color blindness simulation
- [ ] Keyboard-only navigation
- [ ] RTL language testing

---

## Development

### Getting Started

```bash
# Clone and install
git clone https://github.com/owenhudsondesign/icewhistle.git
cd icewhistle
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Adding a New Language

1. Create `public/locales/{lang}.json` with all translation keys
2. Add language code to `SUPPORTED_LANGUAGES` in `src/hooks/use-language.tsx`
3. Add metadata to `LANGUAGE_META` (label, name, nativeName, dir)

### Adding Hotlines

Edit `src/data/hotlines-directory.ts`:

```typescript
{
  id: 'unique-id',
  name: 'Organization Name',
  phone: '1-800-XXX-XXXX',
  description: 'Brief description',
  languages: ['en', 'es'],
  hours: '24/7',
  coverage: 'national', // or 'state' or 'local'
  category: 'rapid-response',
}
```

---

## Legal Disclaimer (Required in App)

```
IMPORTANT: ICEwhistle provides legal education and resources, not legal advice.
The information in this app is for educational purposes only and does not
constitute legal advice or create an attorney-client relationship.

Immigration law is complex and varies by situation. For advice about your
specific circumstances, please consult with a qualified immigration attorney.

If you are in immediate danger, call 911.
```

---

## Contact

Project: ICEwhistle
Repository: https://github.com/owenhudsondesign/icewhistle
License: GPL-3.0

---

*Know your rights. Protect your neighbors.*
