# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KOTOSIO Wedding LP — single-page landing page for wedding photography service (Shonan, Yokohama, Komagane, Toyohashi).

- **Stack**: Static HTML + inline CSS/JS (no build step, no framework, no package.json)
- **Deploy**: Netlify via GitHub Actions → push to `main` triggers deploy
- **URL**: https://kotosio-wedding-lp.netlify.app

## Development

```bash
python3 -m http.server 8000
```

No build tools, no linting. The entire LP is `index.html` with inline `<style>` and `<script>`.

## Architecture

### `index.html`
Single-file LP with all HTML/CSS/JS inline. Read the file to see section structure.

### Key Patterns
- **Mobile-first**: SP-first CSS, PC breakpoint at `@media (min-width: 1024px)`
- **Carousels**: Pure vanilla JS per location section
- **Hamburger menu**: Color changes white→black on scroll (IntersectionObserver)
- **Q&A**: Vanilla JS accordion

### Other Files
- `index-figma.html` — Static version for Figma import
- `figma-sections/` — Section HTML files (numbered 00-19) for Figma Studio
- `fonts/` — Local font files

### Images
Photos by area: `yokohama/`, `komagane/`, `toyohashi/`, `shonan/`
High-quality originals: `本番高画質/` / Test versions: `テスト用低画質/`

## Deploy

GitHub Actions (`.github/workflows/deploy-lp.yml`): push to `main` → Netlify.
Secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_KOTOSIO_SITE_ID`

## Design Rules

- **Colors**: Primary #1a1a1a, Secondary #f5f0eb, Accent #8b7355, Text #333333
- **Fonts**: Headings = Noto Serif JP, Body = Noto Sans JP
- **Tone**: Emotional, cinematic, refined modern
- **Core copy**: 「ただいま、と言える場所で、家族が生まれる。」
