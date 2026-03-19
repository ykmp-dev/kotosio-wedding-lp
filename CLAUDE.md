# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KOTOSIO Wedding LP — single-page landing page for wedding photography service (Shonan, Yokohama, Komagane, Toyohashi).

- **Stack**: Static HTML + inline CSS/JS (no build step, no framework, no package.json)
- **Deploy**: Cloudflare Pages（GitHub連携、mainにpushで自動デプロイ）
- **URL**: TBD（Cloudflare Pages移行後に更新）

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

Cloudflare Pages（GitHub直接連携）。mainへのpushで自動デプロイ。
ビルド不要（静的HTML）。セットアップ手順は `HANDOVER.md` を参照。

## Design Rules

- **Colors**: Primary #1a1a1a, Secondary #f5f0eb, Accent #8b7355, Text #333333
- **Fonts**: Headings = Noto Serif JP, Body = Noto Sans JP
- **Tone**: Emotional, cinematic, refined modern
- **Core copy**: 「ただいま、と言える場所で、家族が生まれる。」

## Key Documents

- `HANDOVER.md` — プロジェクト引き継ぎ資料。経緯・現状・次のアクション
- `LP-issues.md` — コンセプトレベルの課題整理。LP作業前に必ず読むこと
