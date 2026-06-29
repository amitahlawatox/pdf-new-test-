# PDF Genius Pro — Redesign Manifesto & Session Ledger

## Project North Stars
1. Eliminate user confusion via explicit state machine UI
2. Maximize AdSense viewability with 0 CLS ad wrappers
3. Scale to 10K DAU — privacy-first, client-side only, no backend

## Design System (ui-ux-pro-max Output)
- **Style:** Premium Dark Minimalism + Glassmorphism accents
- **Background:** #0F172A (slate-950)
- **Primary:** #1E3A5F (navy)
- **Accent/CTA:** #22C55E (green — trust + action)
- **Text:** #F8FAFC (slate-50)
- **Muted Text:** #94A3B8 (slate-400)
- **Font:** Plus Jakarta Sans (400, 500, 700)
- **Corners:** rounded-[24px] / rounded-[32px] (squircles)
- **Surfaces:** backdrop-blur-md with border border-white/8

## Architecture
- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind v4
- **Processing:** 100% client-side WASM/JS — zero server data capture
- **Routing:** /tool/[slug] dynamic pages per tool
- **Ad Strategy:** Pre-allocated fixed-dimension containers (0 CLS)

## File Registry

### Session 1 — 2026-06-29
**STATUS: IN PROGRESS**

#### Created
- [x] manifesto.md (this file)
- [x] src/app/globals.css — full design token system
- [x] src/app/layout.tsx — root shell with Plus Jakarta Sans, metadata, ad leaderboard slots
- [x] src/app/page.tsx — homepage: hero dropzone + tool grid + privacy section
- [x] src/lib/tools.ts — complete tool definitions (31+ tools, 5 categories)
- [x] src/components/layout/Navbar.tsx — sticky nav with dark bg, logo, tools dropdown, dark toggle
- [x] src/components/layout/Footer.tsx — categorized links footer
- [x] src/components/layout/AdUnit.tsx — 0-CLS ad wrapper component (leaderboard + rectangle variants)
- [x] src/components/home/HeroDropzone.tsx — massive center dropzone with microinteractions
- [x] src/components/home/ToolGrid.tsx — categorized tool grid
- [x] src/components/home/ToolCard.tsx — premium tool card with hover states
- [x] src/components/home/PrivacySection.tsx — trust section
- [x] src/components/tool/DropZone.tsx — per-tool file drop zone
- [x] src/components/tool/StateDisplay.tsx — explicit state machine display
- [x] src/components/tool/FileQueue.tsx — file queue with reorder
- [x] src/app/tool/[slug]/page.tsx — dynamic tool page

#### UX Fixes Applied
- Hero dropzone is THE primary action — no multi-step click confusion
- State machine shows real-time LOCAL ENGINE status inline
- Privacy badge pinned to dropzone ("100% local — never uploaded")
- Ad units pre-sized with min-h to prevent CLS on hydration
- Tool categories clearly separated, not dumped in one grid

## Next Steps (Session 2)
- [ ] Wire real PDF-lib / pdf.js WASM engines to tool actions
- [ ] Add tool-specific configuration (split range, compression level, etc.)
- [ ] Add sitemap.xml + robots.txt for SEO
- [ ] Connect Google AdSense script (replace placeholder divs)
- [ ] Run Lighthouse audit — target CLS < 0.1, Performance > 90
- [ ] Add blog section with SEO-optimized content stubs
- [ ] Deploy to Vercel, point pdfgeniuspro.com DNS
