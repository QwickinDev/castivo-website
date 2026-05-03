# Castivo Website (v2)

The complete Castivo marketing website — eight pages, built with the actual brand identity (purple/blue cast icon + tangerine accent + Satoshi typography).

## What's new in v2

- **New logo system** — purple/blue gradient cast-TV icon mark + bold "castivo" wordmark with the orange dot on the "i". Light, dark, and tangerine variants.
- **Satoshi typography** (from Fontshare) replacing Bricolage Grotesque
- **Demo video section** on the home page with custom-styled play button and modal player
- **Booking widget** (calendar + time slots + form) on home and resources page
- **Floating AI assistant "Cassie"** on every page with quick-reply chips and mock responses
- **Multi-step signup page** (signup.html) — 4 steps
- **Filterable testimonials page** (testimonials.html) — 15 testimonials, 8 industry filters
- **SEO**: meta tags, Open Graph, Twitter cards, JSON-LD, sitemap.xml, robots.txt, OG image

## Files

```
castivo-website/
├── index.html            Home — hero, demo video, how-it-works, features, industries, wedge, booking, testimonials
├── products.html         Product deep-dive
├── solutions.html        12 industries with case studies
├── pricing.html          4 tiers + comparison table + FAQ
├── resources.html        Help, guides, compatible TVs, FAQ, about, contact, booking, legal
├── login.html            Customer portal sign-in
├── signup.html           Multi-step account creation
├── testimonials.html     Filterable customer stories
├── sitemap.xml           SEO sitemap
├── robots.txt            Crawler rules
├── css/castivo.css       All shared styles (~2,400 lines)
├── js/castivo.js         All interaction logic (~440 lines)
└── assets/               Logos, favicons, OG image
```

## Quick start

```bash
# Open in a browser
open index.html
# Or serve locally
python3 -m http.server 8000
```

## Pending: tone-update headlines (your pick required)

Three headlines to update — I've drafted alternatives but haven't applied them yet. Reply with your preferred numbers and I'll apply across all pages.

**Hero** (currently: "Digital signage that just works")
1. "Digital signage. Without the headaches."
2. "Your screens, sorted."
3. "Sign up. Plug in. Done."

**"Everything you need" section** (currently: "Everything you need. Nothing you don't.")
1. "The whole platform. None of the bloat."
2. "Built lean. Built right."
3. "All the tools you'll actually use."

**Bottom CTA** (currently: "Ready to ditch the paper signs?")
1. "Stop printing. Start broadcasting."
2. "Your signs deserve better."
3. "One screen. Free forever. Why wait?"

Format: e.g. "Hero: 2, Section: 1, CTA: 3"

## Customisation cheatsheet

### Colours (in `css/castivo.css`)
```css
--tangerine:   #F26B1F;   /* primary brand / CTA */
--ink:         #14110F;   /* dark text + sections */
--indigo:      #5B5FE8;   /* icon mark gradient start */
--violet:      #8B5CF6;   /* icon mark gradient end */
--cyan:        #22D3EE;   /* cast wave gradient */
```

### Fonts
Currently **Satoshi** (Fontshare). To swap, update both:
- `<link>` tag in each HTML file
- `--font-display` and `--font-body` in `css/castivo.css`

Alternatives that pair well: Switzer, Geist, General Sans, PP Neue Montreal.

### Wire forms to real backends
Currently all forms show demo alerts. To go live:
1. **Login** — replace handler in `js/castivo.js` with fetch to `/api/auth/login`
2. **Signup** — replace alert in step-4 confirmation with fetch to `/api/signup`
3. **Contact** — replace inline `onsubmit` in `resources.html`
4. **Booking** — replace form submit in `js/castivo.js` with calendar API (Cal.com, Calendly)
5. **Testimonials** — replace handler with fetch to your CMS
6. **AI assistant** — replace `findResponse()` in `js/castivo.js` with a fetch to your LLM endpoint

### SEO domain
Before going live, update `https://castivo.com.au` in:
- All canonical/og:url meta tags across HTML files
- JSON-LD blocks (Organization logo URL, etc.)
- `sitemap.xml`
- `robots.txt`

## Performance

Total page weight ~150–200KB. No frameworks. Lighthouse 90+ out of the box.

## What's not built (production scope)

This is the marketing website. To ship Castivo for real, you also need:
1. Customer portal app (what login.html leads to)
2. Android TV native app
3. Backend API (auth, content, Stripe billing, pairing)
4. Real LLM behind Cassie
5. Help-centre article content
6. Actual product walkthrough video for the modal
