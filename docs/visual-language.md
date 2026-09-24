# Visual language

One rule, and everything else follows from it:

> **Exactly one thing on a screen should be shouting, and it should be the most
> urgent action available.**

## Why

The app used five saturated hues at roughly equal weight. Red meant *press
this, it is an emergency* in the hero grid, and eight rows further down the
same red was a decorative heart icon beside "Bond Funds". Purple labelled a
set of scales. Lime, orange and teal took turns on content that was not an
action at all.

Once red is also decorative, red stops meaning emergency. That is not a
question of taste — it is the interface training people to ignore its own most
important signal, in a product people open while frightened.

Visual hierarchy is also cognitive accessibility. Someone scanning this page
under stress needs one obvious thing to press, not a wall of equally loud
options.

## The tiers

**Tier 1 — the urgent action.** Saturated red, `#DC2626`. One per screen. On
the home page that is "ICE Is Near Me". During a recording it is the live
indicator. Nothing else is ever this colour.

**Tier 2 — other actions.** Teal, `#00A6B4`. Search, Find, submit buttons,
phone numbers, links. Teal means *this does something*.

**Tier 3 — wayfinding.** The secondary emergency tiles keep their individual
hues, because a returning user learns that orange is "someone was taken". But
the hue lives in the icon and a top rule, not a full-bleed fill, so they stay
distinguishable without competing with Tier 1.

**Tier 4 — everything else.** Neutral. `text-muted-foreground`, `bg-muted`.
Section icons, category badges, explanatory steps, feature tags. If a colour
is not encoding something the reader needs, it is noise.

## The one exception

Green and red as *do / don't* is semantic, not decorative, and it stays — the
"You can say" and "Never" blocks on the home page, and the equivalent guidance
in the encounter flow. Those colours carry meaning a reader acts on. They are
tinted backgrounds rather than saturated fills, so they sit below Tier 1.

## Applying it

Before adding colour, ask what it encodes. If the honest answer is "it looks
nicer", use a neutral. Specifically:

- A numbered sequence does not need a coloured marker. The number is the
  sequence.
- A section heading icon is decoration. Neutral.
- A category badge labels; it does not act. Neutral.
- A tag listing a feature is not a button. Neutral.

## What is deliberately unchanged

The typeface. Plus Jakarta Sans covers the thirty languages the app ships,
including Arabic, Farsi, Urdu, Thai and Burmese. Changing display type for
visual interest would risk legibility in scripts that are harder to set well,
for a gain nobody in an encounter benefits from. Hierarchy here comes from
weight, size and colour discipline instead.

Accessibility contrast pairings are also unchanged: light brand surfaces keep
their dark foreground, and the brand hues used as text on dark chrome keep
their lightened variants. See `src/app/globals.css`.
