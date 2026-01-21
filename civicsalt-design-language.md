# CivicSalt Design Language

**Codename:** Soft Transit  
**Version:** 1.0  
**Last Updated:** January 2026

---

## Overview

CivicSalt's visual identity fuses three distinct design traditions into a cohesive system optimized for clarity under stress, cross-language legibility, and emotional warmth in a high-stakes context.

### Source Influences

| Tradition | What We Take | What We Leave |
|-----------|--------------|---------------|
| **Isotype (Otto Neurath, 1930s)** | Geometric pictograms, universal communication, humanitarian intent | Strict black/white palette, paper-only constraints |
| **Transit Wayfinding** | Color-coded categorization, hierarchy under stress, tested legibility | Cold institutional sterility, pure utility |
| **Y2K Revival** | Translucent surfaces, optimistic color, bubble shapes, warmth | Irony, kitsch, maximalism |

### Design Philosophy

> "Calm urgency" — the interface should feel like a trusted friend who happens to know exactly what to do in a crisis.

The system must work for:
- Users under acute stress (ICE encounter in progress)
- Users with limited English literacy
- Users on older/cheaper devices
- Users in low-light or high-glare conditions

---

## Color System

### Primary Palette

Built from Y2K-era consumer electronics with saturation tuned for accessibility.

| Name | Hex | Usage |
|------|-----|-------|
| **Bondi Blue** | `#00A6B4` | Primary actions, links, interactive elements |
| **Tangerine** | `#FF8C42` | Warnings, urgent but not emergency |
| **Grape** | `#8B5CF6` | Community resources, support networks |
| **Lime** | `#84CC16` | Confirmations, safe/verified indicators |
| **Emergency Red** | `#DC2626` | Immediate action required, crisis mode only |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Slate 900** | `#0F172A` | Dark mode backgrounds, high-contrast text |
| **Slate 700** | `#334155` | Secondary text, borders |
| **Slate 100** | `#F1F5F9` | Light mode backgrounds, card surfaces |
| **White** | `#FFFFFF` | Card backgrounds, text on dark |

### Category Color Coding

Consistent across all UI to build muscle memory:

| Category | Color | Sidebar/Tag |
|----------|-------|-------------|
| Know Your Rights | Bondi Blue | Left bar |
| Legal Aid | Grape | Left bar |
| Emergency Contacts | Emergency Red | Left bar |
| Healthcare | Lime | Left bar |
| Housing | Tangerine | Left bar |
| Community Support | Grape | Left bar |
| Employment | Tangerine | Left bar |
| Education | Bondi Blue | Left bar |

### Glass & Surface Treatments

The Y2K translucency is achieved through layered surfaces:

```css
/* Frosted glass card */
.card-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
}

/* Dark mode variant */
.card-glass-dark {
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

### Bubble Shapes

Soft, floating bubble shapes appear in backgrounds to add Y2K warmth without distracting from content. Rules:
- Always at 8-15% opacity
- Never overlap with text or interactive elements
- Subtle animation (0.5-2s drift) acceptable on non-critical screens
- Disable animation in "crisis mode" for focus

---

## Typography

### Font Stack

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| **Headlines** | Plus Jakarta Sans | system-ui | 700 (Bold) |
| **Body** | Plus Jakarta Sans | system-ui | 400 (Regular), 500 (Medium) |
| **Monospace** | JetBrains Mono | monospace | 400 |

Plus Jakarta Sans is chosen for: geometric construction with softened terminals (aligns with Y2K warmth), excellent legibility, open-source availability via Google Fonts, and good multilingual support. Its slightly rounded character complements the frosted glass surfaces without feeling childish.

### Type Scale

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| **Display** | 32px / 2rem | 1.1 | Hero headlines, emergency alerts |
| **Title** | 24px / 1.5rem | 1.2 | Screen titles, section headers |
| **Headline** | 18px / 1.125rem | 1.3 | Card titles, list headers |
| **Body** | 16px / 1rem | 1.5 | Primary content |
| **Caption** | 14px / 0.875rem | 1.4 | Secondary info, timestamps |
| **Small** | 12px / 0.75rem | 1.4 | Labels, metadata |

### Typography Rules

1. **Headlines are bold, body is regular** — never use semi-bold, it muddies hierarchy
2. **Minimum touch-target text: 16px** — anything smaller is for non-interactive labels only
3. **Max line length: 65 characters** — improves readability, especially for non-native readers
4. **Left-align everything** — no centered text except in modals or empty states
5. **Use sentence case** — "Know your rights" not "Know Your Rights" (less aggressive, more human)

### Multilingual Considerations

- All type containers must accommodate 30% text expansion (German, Spanish)
- RTL support built into grid system from day one
- Avoid icon-only buttons; always pair with text label
- Test all screens in Spanish, Chinese (Simplified), and Arabic before shipping

---

## Iconography

### Isotype Principles

Icons follow Otto Neurath's Isotype philosophy, updated for digital:

1. **Geometric construction** — circles, rectangles, triangles only
2. **Universal recognition** — a person is a person anywhere in the world
3. **Reducible** — must read clearly at 24px
4. **No cultural specificity** — no flags, religious symbols, or region-specific gestures
5. **Action-oriented** — icons show what to DO, not abstract concepts

### Icon Specifications

| Context | Size | Stroke | Corner Radius |
|---------|------|--------|---------------|
| Navigation | 24px | 2px | 2px |
| Card icon | 32px | 2.5px | 3px |
| Hero/Feature | 48px | 3px | 4px |
| Illustration | 64px+ | 4px | 6px |

### Icon Style

- **Filled icons** for active/selected states
- **Outlined icons** for inactive/default states
- **Duotone** (primary + 50% opacity) for decorative/illustration contexts
- **Single color only** — icon color matches text color or category color
- **No gradients, no shadows within icons**

### Core Icon Set

| Icon | Meaning | Usage |
|------|---------|-------|
| Person (standing) | Individual/You | Profile, personal info |
| People (2-3) | Family/Community | Group resources |
| Shield | Protection/Rights | Know your rights |
| Scale | Legal | Legal aid |
| Phone | Call | Emergency contacts |
| Document | Papers | Documents, forms |
| Home | Housing | Shelter, housing |
| Cross (medical) | Healthcare | Medical resources |
| Briefcase | Employment | Jobs, work permits |
| Graduation cap | Education | Schools, ESL |
| Speech bubble | Communication | Interpretation, language |
| Hand (raised) | Stop/Silence | Right to remain silent |
| Door | Entry/Exit | What to do at door |

---

## Components

### Card Anatomy

The primary UI unit is the **resource card**:

```
┌─────────────────────────────────────┐
│ ▌                                   │  ← Category color bar (4px)
│ ▌  [Icon]                           │
│ ▌                                   │
│ ▌  Headline Text                    │  ← 18px bold
│ ▌  Supporting description text      │  ← 14px regular, Slate 700
│ ▌  that can wrap to two lines max   │
│ ▌                                   │
│ ▌                    [Action →]     │  ← Text button or chevron
└─────────────────────────────────────┘
```

### Card Variants

| Variant | Use Case | Visual Treatment |
|---------|----------|------------------|
| **Default** | Standard resource link | Glass surface, subtle shadow |
| **Urgent** | Time-sensitive info | Tangerine left bar, pulsing dot |
| **Emergency** | Active crisis | Red left bar, solid background, no glass |
| **Completed** | User has viewed/saved | Checkmark overlay, reduced opacity |

### Button Hierarchy

| Level | Style | Usage |
|-------|-------|-------|
| **Primary** | Solid Bondi fill, white text | One per screen max, main CTA |
| **Secondary** | Bondi outline, Bondi text | Supporting actions |
| **Tertiary** | Text only, Bondi | Inline links, minor actions |
| **Destructive** | Solid red fill, white text | Delete, cancel (use sparingly) |
| **Ghost** | White/transparent | Dark backgrounds only |

All buttons: 48px minimum height, 16px horizontal padding, 8px border radius.

### Navigation

**Bottom tab bar** (4-5 items max):
- Home / Resources / Saved / Emergency / Settings
- Active state: filled icon + label + Bondi underline
- Inactive state: outlined icon + label at 60% opacity

**No hamburger menus** — everything must be reachable in 2 taps or fewer.

### Emergency Mode

When user indicates active crisis (taps emergency button or shakes device):

1. Interface shifts to high-contrast mode (Slate 900 background)
2. All non-essential UI elements hidden
3. Large, tappable buttons for: Call Lawyer, Record Audio, Show Rights Card
4. Bubble animations disabled
5. Screen brightness locked to max

---

## Layout & Grid

### Spacing Scale

Based on 4px unit:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight padding, icon gaps |
| `space-2` | 8px | Inline element spacing |
| `space-3` | 12px | Card internal padding |
| `space-4` | 16px | Standard padding, card gaps |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Major section breaks |
| `space-12` | 48px | Screen-level padding top/bottom |

### Bento Grid

Cards arrange in a responsive bento layout:

```
Mobile (375px):
┌─────────────────┐
│     Full        │
├────────┬────────┤
│  Half  │  Half  │
├────────┴────────┤
│     Full        │
└─────────────────┘

Tablet (768px):
┌──────┬──────┬──────┐
│      │      │      │
├──────┼──────┴──────┤
│      │             │
├──────┴─────────────┤
│                    │
└────────────────────┘
```

### Safe Areas

- Always respect device safe areas (notch, home indicator)
- Emergency button must never be in bottom 80px (thumb zone conflict)
- Critical information never in top 60px (status bar overlap)

---

## Motion & Animation

### Principles

1. **Purposeful** — animation clarifies relationships, never decorates
2. **Calm** — no bouncy or elastic easing (reads as playful, wrong tone)
3. **Fast** — 150-250ms for micro-interactions, 300-400ms for transitions
4. **Reducible** — respect `prefers-reduced-motion`, disable in emergency mode

### Easing

| Type | Curve | Usage |
|------|-------|-------|
| **Enter** | `ease-out` | Elements appearing |
| **Exit** | `ease-in` | Elements disappearing |
| **Move** | `ease-in-out` | Position changes |

### Standard Animations

| Animation | Duration | Usage |
|-----------|----------|-------|
| Card press | 100ms scale to 0.98 | Touch feedback |
| Page transition | 300ms slide | Navigation |
| Modal enter | 250ms fade + slide up | Overlays |
| Loading pulse | 1.5s infinite | Skeleton screens |
| Bubble drift | 3-8s infinite | Background decoration |

---

## Voice & Tone

### Content Principles

| Principle | Do | Don't |
|-----------|-----|-------|
| **Direct** | "You have the right to remain silent." | "It's important to know that you may have certain rights..." |
| **Calm** | "Take a breath. Here's what to do." | "URGENT: Act now!!!" |
| **Human** | "This is scary. You're not alone." | "CivicSalt provides resources for..." |
| **Actionable** | "Tap to call a lawyer now" | "Legal resources are available" |
| **Honest** | "We can't guarantee outcomes" | "Everything will be okay" |

### Reading Level

All content targets 6th-grade reading level (Flesch-Kincaid). This isn't dumbing down — it's clarity under stress.

### Error Messages

```
Bad:  "Error 403: Authentication failed"
Good: "We couldn't sign you in. Check your password and try again."

Bad:  "Network request timeout"
Good: "No internet connection. Your saved info is still available offline."
```

---

## Accessibility

### Requirements (WCAG 2.1 AA minimum)

- **Color contrast:** 4.5:1 for body text, 3:1 for large text and icons
- **Touch targets:** 48x48px minimum
- **Focus indicators:** 2px Bondi outline, visible in all modes
- **Screen reader:** All icons have aria-labels, all images have alt text
- **Zoom:** Interface functional at 200% zoom

### Testing Checklist

- [ ] VoiceOver (iOS) full flow
- [ ] TalkBack (Android) full flow
- [ ] Color blindness simulation (all types)
- [ ] High contrast mode
- [ ] Reduced motion mode
- [ ] Keyboard-only navigation (tablet + keyboard)

---

## Implementation Notes

### Tech Stack Alignment

For Next.js + Tailwind:

```javascript
// tailwind.config.js additions
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'bondi': '#00A6B4',
        'tangerine': '#FF8C42',
        'grape': '#8B5CF6',
        'lime': '#84CC16',
        'emergency': '#DC2626',
      },
      borderRadius: {
        'card': '16px',
        'button': '8px',
      },
      backdropBlur: {
        'glass': '16px',
      }
    }
  }
}
```

### Asset Exports

- Icons: SVG (production), PNG @1x, @2x, @3x (fallback)
- Illustrations: SVG preferred, WebP fallback
- App icon: 1024x1024 master, all platform variants

---

## Appendix: Mood Board References

- Apple iMac G3 product photography (color, translucency)
- NYC MTA signage system (wayfinding logic)
- Red Cross / UNHCR emergency communications (hierarchy under stress)
- Isotype chart archives (pictogram language)
- Stripe Press book covers (modern editorial meets system)
- Tokyo Metro signage (dense information, clear hierarchy)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial design language document |

---

*CivicSalt Design Language — Soft Transit*
