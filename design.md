# Design — Rivalium website

A locked design system for the site. Every page reads this before changing UI.
Extend or amend this file when the system needs to grow; don't override per page.
Brand rules come from `.agents/skills/rivalium-ui` (they win on brand); this file
records how the site applies them, audited with Hallmark (anti-slop) on 2026-10-14.

## Genre
Atmospheric — a dark arena game. Night-navy canvas, splash art behind a dark scrim,
one warm accent (ember) on small surfaces.

## Macrostructure family
- Marketing (landing `/`): **Feature Stack** — full-screen centred poster hero (owner's choice), then a pinned
  "play a round" sequence (sticky left pane, scroll-synced right pane), the rival
  roster, an irregular bento of systems, an index of updates.
- Marketing (download `/download`): **Split Studio** — text half / proof half,
  alternating direction.
- Content (wiki, legal, patch-note detail): **Long Document** — one readable column
  (≤ 72ch), inline headings, links inside prose.
- Index (patch-notes list, wiki home): **Index-First** — the list is the page.
- App (account, portal): functional layout, no enrichment.

## Theme
Tokens live in `tokens.css` (OKLCH). Summary:
- `--color-paper` oklch(13.6% 0.064 272) · `--color-paper-2..4` +5% lightness per level
- `--color-ink` oklch(96% 0.012 275) · `--color-ink-2` lavender oklch(80.4% 0.079 280)
- `--color-accent` ember oklch(58.9% 0.151 50) — primary action only
- `--color-frost` oklch(79.5% 0.103 261) — every other interactive fill
- `--color-focus` ice oklch(86.4% 0.069 252)

## Typography
- Display: Motion Control (self-hosted `mainFont`), roman, uppercase, tracking −0.01em at display sizes.
- Body: Bahnschrift (`secondaryFont`), 400, line-height 1.6.
- Scale: fluid major third, `--step--1` … `--step-6` (rem + clamp).
- Titles are **solid ink**. The brand gradient appears only on the logo/wordmark and as a
  short drawn underline (`.title-mark`) under page titles. No gradient text, no italic headings.

## Surfaces
- Translucent navy glass (`.glass` content, `.glass-strong` structure, `.glass-raised`), matching the
  game client — kept by the owner over Hallmark's solid-surface default (2026-10-14).
- Elevation still reads by lightness (`paper-2` < `paper-3` < `paper-4`). Never stack glass on glass;
  use `.panel-inset` (flat) inside a glass panel.
- Splash art always sits under `.page-scrim`; text never sits on raw art.
- No glow halos on dark. Accent shows as a 1–2px border, never a coloured shadow.

## Buttons (CTA voice)
- Flat and calm (reference: Riot / Blizzard sites): solid fill, 4px corners, uppercase, no glow,
  no inner highlight; the brand two-tone survives only as a faint 4% step.
- Primary: ember, 56px, one per viewport. The single hero CTA adds a thin offset frame (`framed`).
- Secondary: royal, 52px. Quiet: outlined (`no-back`) 48px. Secondary hero actions are text links.
- Minimum hit area 48px; small buttons 40px only inside dense rows. Labels never wrap.
- Feedback on press (`scale(.97)` in 120ms); focus ring 2px ice, instant.

## Navigation
- Full-width top bar (near-opaque), wordmark left, links centred, Play + account right.
- Only **Game ▾** is a menu (Rivals, Gameplay, Mechanics, Ranks, Controls, Wiki home). Patch notes,
  Support and Discord ↗ are plain links (external links marked with ↗).
- Play (ember) hides while a page's own hero CTA is on screen.
- Menus open on click/Enter/Space, close on Esc/outside click, arrow keys move inside.
- Footer: four columns (brand + Game / Account / Help) with social links — owner's choice over Ft5.

## Hero parallax (landing)
- The landing splash is split into `public/images/parallax/hero-far.webp` (inpainted background)
  and `hero-near.webp` (character cutout), made with rembg (isnet-general-use) + OpenCV.
- A CSS view timeline moves far 38% / near 10% of the hero height as it scrolls out.
  Off below 640px, off for reduced motion, static where scroll timelines aren't supported.

## References studied (2026-10-14, Hallmark `study` + SkillUI token extraction, public sites, DNA only)
League of Legends, VALORANT, Brawlhalla, Overwatch, Marvel Rivals. Extracted token notes live in
`../.ai/design-references/` (local study material, not skills; never copy their art or fonts).
Measured: controls use 2–4px radii, cards ≤ 8–10px, condensed heavy display at 80–128px, 14–16px body,
4px spacing grid. Marvel Rivals' angled/skewed chrome was noted but not adopted (owner wants calm buttons). Adopted: single-menu nav with plain links,
one framed hero CTA, flat square-ish buttons, character art separated from its background.
Skipped: light content bands (brand is dark), press-quote rows (no real quotes to cite).

## Motion
- Easings `--ease-out` / `--ease-in` / `--ease-in-out`; durations 120 / 220 / 420ms.
- One orchestrated entrance per page; no reveal-on-every-section.
- Scroll-driven motion only where scroll is the information (the round sequence) or as
  subtle depth on the hero art, via CSS scroll timelines with static fallback.
- No infinite loops except functional loaders. Reduced motion: opacity only.

## Per-page allowances
- Landing may use video slots and the pinned round sequence.
- App pages (account, portal) use no enrichment.
- Content pages are typography-first; inline video slots only in wiki articles.

## What pages MUST share
The wordmark, ember/frost roles, display + body fonts, button voice, nav pill, Ft5 footer.

## What pages MAY differ on
Macrostructure within the family above; hero archetype; enrichment on marketing pages.
