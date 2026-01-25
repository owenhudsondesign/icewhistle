# ICEwhistle

A free, privacy-first app for immigrant communities in the United States. Know your rights, find emergency hotlines, and access critical resources - all without tracking or data collection.

**Live app: [icewhistle.app](https://icewhistle.app)**

## What It Does

- **Know Your Rights** - What to do if ICE comes to your door, during traffic stops, at work, and more
- **Emergency Hotlines** - Find rapid response hotlines, legal aid, and community support in your area by ZIP code
- **Emergency Contacts** - Save trusted contacts locally and alert them with one tap during an encounter (stored on your device only, never uploaded)
- **Works Offline** - All critical features work without internet
- **No Tracking** - No accounts, no personal data collection, ZIP code stored only on your device

Available in 30 languages including English, Spanish, Portuguese, Chinese, Vietnamese, Arabic, and more.

## Why It's Not in App Stores

In October 2025, Attorney General Pam Bondi pressured Apple and Google to remove ICEblock, a similar app with over 1 million users. ICEwhistle is distributed as a Progressive Web App (PWA) - install it directly from the website to your home screen. No app store means no one can pull it down.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **i18n**: Custom translation system with JSON locale files (30 languages)
- **Mobile**: Progressive Web App (PWA)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repo
```bash
git clone https://github.com/owenhudsondesign/icewhistle.git
cd icewhistle
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (public)/         # Public routes (rights, hotlines, resources, emergency)
│   └── (marketing)/      # Marketing pages (landing, shop)
├── components/           # React components
│   ├── hotlines/         # Hotline directory components
│   ├── emergency-contacts/ # Emergency contacts management
│   ├── onboarding/       # First-time user onboarding
│   └── shared/           # Shared UI components
├── data/                 # Hotline directory and static data
├── hooks/                # Custom React hooks
└── lib/                  # Utilities and helpers
public/
└── locales/              # Translation files for 30 languages
```

## Contributing

Contributions are welcome. This project exists to help protect immigrant communities.

Ways to help:
- Add emergency hotlines for your city/state (see `src/data/hotlines-directory.ts`)
- Improve translations (see `public/locales/`)
- Fix bugs
- Improve accessibility

Please open an issue first to discuss significant changes.

## Privacy Design

- **No accounts required** - Use the app anonymously
- **No database** - There is no server-side database. All user data stays on your device.
- **Local-only storage** - ZIP code, emergency contacts, and preferences stored in your browser's localStorage, never uploaded
- **No analytics** - No tracking scripts, no cookies, no user behavior collection
- **Offline-first** - Critical features cached locally including all 30 language translations

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

This means:
- You can use, modify, and distribute this code
- If you distribute modified versions, you must also use GPL-3.0
- You must make your source code available

## Support

- Report issues: [GitHub Issues](https://github.com/owenhudsondesign/icewhistle/issues)
- National Immigrant Aid Hotline: 1-888-624-4752
