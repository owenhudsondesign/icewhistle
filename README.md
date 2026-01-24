# ICEwhistle

A free, privacy-first app for immigrant communities in the United States. Know your rights, share community alerts, and access emergency resources - all without tracking or data collection.

**Live app: [icewhistle.app](https://icewhistle.app)**

## What It Does

- **Know Your Rights** - What to do if ICE comes to your door, during traffic stops, at work, and more
- **Community Alerts** - Real-time, anonymous reports of ICE activity in your area
- **Emergency Resources** - Hotlines, legal aid organizations, rapid response networks
- **Works Offline** - All critical features work without internet
- **No Tracking** - No accounts, no personal data collection, location rounded for privacy

Available in English, Spanish, and Portuguese.

## Why It's Not in App Stores

In October 2025, Attorney General Pam Bondi pressured Apple and Google to remove ICEblock, a similar app with over 1 million users. ICEwhistle is distributed as a Progressive Web App (PWA) - install it directly from the website to your home screen. No app store means no one can pull it down.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS
- **Mobile**: PWA + Capacitor for native builds

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account (free tier works)
- A Mapbox account (free tier works)

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

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Supabase and Mapbox credentials.

4. Set up the database
```bash
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (public)/         # Public routes (alerts, rights, resources)
│   ├── (marketing)/      # Marketing pages (landing, shop)
│   └── api/              # API routes
├── components/           # React components
├── data/                 # Knowledge base and static data
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
└── stores/               # Zustand state stores
```

## Contributing

Contributions are welcome. This project exists to help protect immigrant communities.

Ways to help:
- Add resources for your city/state
- Improve translations
- Fix bugs
- Improve accessibility

Please open an issue first to discuss significant changes.

## Privacy Design

- **No accounts required** - Use the app anonymously
- **Location rounding** - Coordinates rounded to ~500m grid with random offset
- **Auto-deletion** - Alerts expire after 8 hours
- **No analytics** - No tracking scripts, no user behavior collection
- **Offline-first** - Critical features cached locally

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

This means:
- You can use, modify, and distribute this code
- If you distribute modified versions, you must also use GPL-3.0
- You must make your source code available

## Support

- Report issues: [GitHub Issues](https://github.com/owenhudsondesign/icewhistle/issues)
- National Immigrant Aid Hotline: 1-888-624-4752
