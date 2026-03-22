

# Implementation Plan: ViralHQ Production Overhaul

This is a large, multi-phase implementation. Below is the full plan organized by priority.

---

## Phase 1: Technical Fixes

### 1A. Domain Migration (sitemap + robots + canonicals)
- **`public/sitemap.xml`**: Replace all `https://niches.lovable.app` with `https://viralhq.vercel.app`. Deduplicate any repeated URLs. Add new routes for `/blog`, `/tools`, `/trending`, `/vs/nichepulse-vs-vidiq-vs-tubebuddy`.
- **`public/robots.txt`**: Update sitemap line to `Sitemap: https://viralhq.vercel.app/sitemap.xml`.
- **`src/components/SEOHead.tsx`**: Change `fullUrl` base from `https://niches.lovable.app` to `https://viralhq.vercel.app`.
- **All JSON-LD schemas** in `NicheResult.tsx`, `WikiIndex.tsx`, `WikiTerm.tsx`, `index.html`: Find-and-replace `niches.lovable.app` → `viralhq.vercel.app`.

### 1B. Remove Hallucinated Content
- **`src/pages/Index.tsx`** (results section): Remove the "Outlier Creators" section (lines 364-376) and "Viral Content Feed" section (lines 378-390) which render `OutlierCard` and `VideoCard` with AI-hallucinated data.
- Remove imports of `OutlierCard` and `VideoCard` from Index.tsx.
- Keep the files `OutlierCard.tsx` and `VideoCard.tsx` but they will no longer be rendered.
- Keep `ScorecardGrid` and `ContentBlueprint` as these show useful analysis data.

---

## Phase 2: Enhanced 53 Niche Pages

### 2A. Expand Niche Data (`src/data/niches.ts`)
Add new fields to `NicheData` interface:
- `whyGrowing: string[]` — 3 bullet points on why this niche is growing
- `videoIdeas: string[]` — 8 specific clickable video title ideas
- `platforms: ('YouTube' | 'TikTok' | 'Instagram')[]` — best platforms badge row

Populate all 53 niches with unique, varied content for each field. Verify the slug list matches exactly: the current database has ~53 entries already; confirm all 53 requested slugs exist, add any missing ones.

### 2B. Refactor `NicheResult.tsx`
Add the following new sections (all using static data from `niches.ts`):
1. **"Why This Niche is Growing"** — 3 bullet points from `whyGrowing`
2. **"Top 8 Video Ideas"** — list of 8 specific video titles
3. **"Best Platforms"** — badge row showing YouTube/TikTok/Instagram icons
4. **"You Might Also Like"** — 3 related niche links (deterministic, not random) at the bottom
5. **HowTo JSON-LD schema** on every niche page
6. Internal CTA button back to `/` (already exists as sticky CTA, keep it)

Reduce related niches from 6 random to 3 deterministic (based on same category).

---

## Phase 3: Structured Data

### 3A. Homepage FAQ JSON-LD
- Add FAQ schema to `Index.tsx` via `SEOHead` using the existing FAQ content from the Footer.

### 3B. HowTo Schema on Niche Pages
- Each niche page gets a HowTo JSON-LD: "How to succeed in [Niche]" with 3 steps derived from the page content.

### 3C. Article Schema on Blog Posts
- Each blog post gets Article JSON-LD (implemented in Phase 4).

---

## Phase 4: Blog Section

### 4A. Blog Data File (`src/data/blog.ts`)
Create a data file with 5 articles, each containing:
- `slug`, `title`, `metaDescription`, `targetKeyword`, `publishDate`
- `content`: Full 1500+ word article body with H2 subheadings, stored as structured sections
- `relatedNiches: string[]` — 3+ niche slugs for internal linking
- `relatedWikiSlugs: string[]` — wiki page links

Articles:
1. `best-youtube-niches-2026` — "Best YouTube Niches in 2026 That Are Still Untapped"
2. `find-youtube-niche-using-ai` — "How to Find Your YouTube Niche Using AI"
3. `tiktok-niche-ideas-low-competition-2026` — "Top TikTok Niche Ideas With Low Competition in 2026"
4. `start-faceless-youtube-channel` — "How to Start a Faceless YouTube Channel and Go Viral"
5. `how-to-go-viral-youtube` — "How to Go Viral on YouTube: What the Algorithm Actually Wants"

### 4B. Blog Pages
- **`src/pages/BlogIndex.tsx`** (`/blog`): Lists all 5 articles with title, excerpt, date. SEOHead with unique meta.
- **`src/pages/BlogPost.tsx`** (`/blog/:slug`): Renders full article with H2 structure, internal links to `/niche/` pages, `/tools`, and `/wiki/` pages. Article JSON-LD schema. Breadcrumbs.

### 4C. Routes
- Add `/blog` and `/blog/:slug` to `App.tsx`.

---

## Phase 5: Free Tools Section

### 5A. Tools Data & Pages
- **`src/pages/ToolsIndex.tsx`** (`/tools`): Landing page listing 3 tools with descriptions.
- **Tool 1: YouTube Niche Score Calculator** — Form input (niche topic) → calls `analyze-niche` edge function → displays scored breakdown (competition, growth, monetization).
- **Tool 2: Viral Hook Generator** — Form input (niche) → calls `generate-viral-ideas` edge function → displays 5 hook ideas.
- **Tool 3: Platform Match Quiz** — 5 multiple-choice questions, client-side scoring logic, recommends YouTube/TikTok/Instagram.

All tools live on the `/tools` page as tabbed sections (no separate routes needed). They reuse existing edge functions.

---

## Phase 6: Comparison Page

- **`src/pages/Comparison.tsx`** (`/vs/nichepulse-vs-vidiq-vs-tubebuddy`): Static page with:
  - SEO title and meta
  - Feature comparison table (HTML `<table>`)
  - Pros/cons section for each tool
  - CTA button to niche finder
  - Article JSON-LD

---

## Phase 7: Weekly Trending Page

- **`src/pages/Trending.tsx`** (`/trending`): Static page "Top 10 Trending YouTube Niches This Week" with:
  - Manually curated list of 10 niches (linking to existing `/niche/` pages)
  - Week date displayed, structured for easy weekly updates
  - SEOHead with unique meta
  - Added to sitemap

---

## Phase 8: Email Capture

### 8A. Database
- Create `subscribers` table via migration: `id uuid PK`, `email text NOT NULL UNIQUE`, `created_at timestamptz DEFAULT now()`, `source text` (tracks which page).
- RLS: Allow anonymous inserts (public signup), no select/update/delete for anon.

### 8B. Component
- **`src/components/EmailCapture.tsx`**: Simple form with email input + submit button. Calls `supabase.from('subscribers').insert(...)`. Shows success/error toast.
- Add to Homepage (above Footer) and every NicheResult page footer.

---

## Phase 9: Navigation & Internal Linking

### 9A. Main Navigation
- Update the header in `Index.tsx`, `NicheResult.tsx`, `WikiIndex.tsx`, `WikiTerm.tsx` (and all new pages) to include nav links: Blog, Tools, Trending, Wiki.
- Extract a shared `NavBar` component to avoid duplication.

### 9B. Internal Linking
- **Niche pages**: "You might also like" section with 3 related niches (deterministic by category).
- **Homepage**: Add a "Popular Niches" section linking to 6 top niches (highest viral scores).
- **Blog articles**: Each links to `/tools` and at least one `/wiki/` page (embedded in article content).

### 9C. Footer Updates
- Add Blog, Tools, Trending to footer nav.
- Replace `niches.lovable.app` references with `viralhq.vercel.app`.

---

## Files to Create
| File | Purpose |
|------|---------|
| `src/data/blog.ts` | 5 blog articles (1500+ words each) |
| `src/pages/BlogIndex.tsx` | Blog listing page |
| `src/pages/BlogPost.tsx` | Individual blog post page |
| `src/pages/ToolsIndex.tsx` | Free tools page (3 tools) |
| `src/pages/Comparison.tsx` | vs VidIQ vs TubeBuddy |
| `src/pages/Trending.tsx` | Weekly trending niches |
| `src/components/EmailCapture.tsx` | Email signup form |
| `src/components/NavBar.tsx` | Shared navigation bar |

## Files to Modify
| File | Changes |
|------|---------|
| `src/data/niches.ts` | Add `whyGrowing`, `videoIdeas`, `platforms` fields to all 53 entries |
| `src/pages/NicheResult.tsx` | Add new sections, HowTo schema, fix domain, remove random linking |
| `src/pages/Index.tsx` | Remove Outlier/Video sections, add Popular Niches, add FAQ JSON-LD, add EmailCapture |
| `src/components/SEOHead.tsx` | Change base URL to viralhq.vercel.app |
| `src/components/Footer.tsx` | Update links, domain references |
| `src/App.tsx` | Add routes for /blog, /blog/:slug, /tools, /vs/*, /trending |
| `public/sitemap.xml` | Domain migration + new routes |
| `public/robots.txt` | Update sitemap URL |
| `index.html` | Update domain in JSON-LD schemas |
| `src/pages/WikiIndex.tsx` | Fix domain in JSON-LD |
| `src/pages/WikiTerm.tsx` | Fix domain in JSON-LD |

## Database Migration
```sql
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  source text
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON public.subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated inserts" ON public.subscribers FOR INSERT TO authenticated WITH CHECK (true);
```

---

## Implementation Order
1. Technical fixes (domain, remove hallucinated sections) — immediate impact, low risk
2. Niche page enhancements (new fields + sections) — SEO core
3. Structured data (JSON-LD) — rich snippets
4. Blog section — long-tail SEO
5. Tools page — engagement + dwell time
6. Comparison + Trending pages — competitive SEO
7. Email capture — conversion
8. Navigation + internal linking — tie everything together

