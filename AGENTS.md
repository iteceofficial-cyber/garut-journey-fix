# AGENTS.md

Garut City Tour tourism site on TanStack Start + Tailwind 4, deployed to Netlify. **Continue from PLAN.md** (next: detail routes `/destinations/$slug` and `/guide/$slug`, already linked from cards).

## Layout
- `src/routes/__root.tsx` — SEO meta, fonts (Fraunces + Plus Jakarta Sans), header/footer/WhatsApp FAB.
- `src/routes/index.tsx` — composes sections from `src/components/home/*`.
- `src/components/` — shared: `Img` (CDN via `src/lib/img.ts`), `Reveal`/`SectionHeading`, `BookLink`/`btn`, `ShareButtons`, `DestinationCard`.
- `src/data/` — all content as typed objects; single source of truth. Never invent prices/hours/facilities; leave `null` → "Information coming soon."
- `src/lib/forms.ts` — Netlify Forms AJAX posts to `/__forms.html`; keep `public/__forms.html` fields in sync (forms: `newsletter`, `inquiry`).
- `src/lib/trip.ts` — browser-storage state: selected tour pre-fills inquiry form, saved destinations, built itinerary summary.

## Conventions
Theme tokens in `styles.css` `@theme` (forest, leaf, cream, ember, ink). Animations are CSS (`.reveal`, `.fade-up`, `useParallax`) and respect reduced motion. Images always through `Img`.
