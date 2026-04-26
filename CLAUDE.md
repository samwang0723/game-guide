# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Game Guide (攻略閱讀器) is a zero-dependency, single-file game guide reader. The entire app lives in `index.html` — HTML structure, CSS styles, and vanilla JS are all inlined. There is no build step, no framework, and no package manager.

## Development

Open `index.html` directly in a browser. No server required for basic testing, though CORS proxies only work when served over HTTP.

For local serving:
```bash
python3 -m http.server 8000
```

There are no tests, no linter, and no build commands.

## Architecture

### Single-File Structure

Everything is in `index.html` (~480 lines):
- **Lines 1–118**: CSS (minified inline `<style>`) — dark theme using CSS custom properties (`:root` vars)
- **Lines 120–167**: HTML skeleton — header, sidebar drawer, search bar, empty state, guide container, lightbox, focus mode overlay
- **Lines 168–477**: JavaScript (`<script>`) — all application logic

### CSS Conventions

- All classes are abbreviated (2-3 chars): `.hd` (header), `.sa` (search area), `.g` (guide), `.fb` (find bar), `.fm` (focus mode), `.pi` (history item), `.lb` (lightbox), `.tb` (top button)
- State toggling uses `.on` class (e.g., `.lb.on`, `.fm.on`, `.sidebar.on`)
- Max content width: `720px`, horizontal padding: `16px` on mobile, `24px` on desktop (`@media min-width:768px`)
- Font: Iansui (Google Fonts), loaded via CDN
- Color palette defined in `:root` — gold accent (`--ac:#c9a96e`), dark background (`--bg:#1a1a1f`)

### JS Architecture

No modules — all logic is in a single `<script>` block. Key sections:

1. **DOM refs** (line 170): `$()` helper, all elements cached at top
2. **History** (lines 177–212): `localStorage` key `guide_hist`, max 30 entries, renders `.pi` cards
3. **Focus Mode** (lines 215–275): Splits guide `h2`/`h3` into sections for paginated reading; supports swipe gestures and keyboard arrows
4. **Content Loading** (lines 282–318): `load(url)` — checks `localStorage` cache (`gc_` prefix), then tries CORS proxies in order: allorigins.win → corsproxy.io → direct fetch
5. **HTML Parser** (lines 320–453): `render(raw, srcUrl)` — `DOMParser` extracts content from common article selectors (`.article-content`, `article`, `.post-content`, etc.), recursive `walk()` function classifies nodes into headings, tips (`※`), route guides (`→`), collection progress, images, and paragraphs. Builds sidebar TOC from headings
6. **Search** (lines 474–476): TreeWalker-based text highlight with `<mark>` tags, debounced input

### Content Classification Rules (in `render()`)

- Headings starting with `【` → chapter (`h2`), shown in TOC as primary
- Other headings → sub-section (`h3`), shown in TOC as indented
- Meta headings (收集進度, 路線) → rendered as info blocks, excluded from TOC
- Text starting with `※` → tip block (`.tip`)
- Text containing `→` (>15 chars) → route guide block (`.rb`)
- Text containing 收集進度/總收集 → collection block (`.cb`)
- Junk text (ads, dates, boilerplate) filtered via regex + exact-match set

### localStorage Keys

- `guide_hist` — JSON array of browsing history (url, title, host, timestamp)
- `gc_{url}` — cached parsed HTML + TOC for each loaded guide

## Deployment

Static file deployment — just serve `index.html`. Designed for Cloudflare Pages but works on any static host (Vercel, Netlify, GitHub Pages, etc.). No build command needed; output directory is `/`.
