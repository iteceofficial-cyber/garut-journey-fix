# Garut City Tour — Roadmap

1. **Landing page (done)** — full single-page site: hero with live search, Why Garut, filterable destinations, signature city tours, Choose Your Experience, culinary, itinerary builder, filterable packages, masonry gallery, brand story, placeholder testimonials, travel guide cards, booking CTA, inquiry form + newsletter (Netlify Forms), floating WhatsApp, sticky/mobile nav.
2. **Detail pages (next)** — add `src/routes/destinations/$slug.tsx` and `src/routes/guide/$slug.tsx` using `getDestination` / `getArticle` from `src/data/*`. Cards already link there. Show "Information coming soon." (`COMING_SOON`) for null facts; use `ShareButtons`, `useSavedDestinations` ("Add to My Itinerary"), maps embed and nearby destinations.
3. **Real content** — replace placeholders in `src/data/site.ts` (WhatsApp, email, address, socials), prices, testimonials.
4. **Marketplace foundations** — Netlify Database (Drizzle) for tours, bookings, reviews; Netlify Identity for accounts; operator dashboard.
5. **Payments, availability calendar, coupons, automated WhatsApp/email notifications.**
