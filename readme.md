# G.R

Personal research & portfolio blog - offensive systems research, engineering, and projects.
Built with Hugo using the bespoke **`G.R`** theme (`themes/G.R`).

## Theme: `G.R`

A self-contained editorial-terminal theme. No external Hugo modules required.

**Features**
- Dark / light themes (no-flash, persisted to `localStorage`, respects system preference)
- Bilingual EN / KA (Georgian) - UI strings, menus, hero, and translated pages
- ⌘K / `/` client-side search over a generated `/index.json`
- Article TOC with scrollspy, reading time, code copy buttons
- Syntax highlighting for both themes (GitHub dark / light)
- OpenGraph + Twitter cards + LinkedIn share, RSS
- Monospace display (JetBrains Mono) + Inter body, with Noto Sans Georgian fallback

## Run

```bash
hugo server -D            # local preview at http://localhost:1313
hugo --gc --minify        # production build into ./public
```

## Writing

Posts live under `content/<section>/`. Sections: `research`, `engineering`, `projects`, `archive`.

```bash
hugo new research/my-post.md
```

Frontmatter:

```toml
title = "..."
date  = 2026-01-01
description = "One-line summary (used in lists, search, OG tags)."
tags = ["Go", "Red Team"]
images = ["/images/cover.png"]   # optional, used for LinkedIn/OG preview
```

## Georgian (KA) translations

Add a `.ka.md` sibling next to any English file:

```
content/research/my-post.md      # English
content/research/my-post.ka.md   # Georgian
```

Pages without a `.ka.md` simply stay English; the language switcher falls back
to the Georgian home. Translated so far: home, about, manifesto, and all section indexes.

## Customising

- Palette / type / spacing: `themes/G.R/assets/css/main.css` (CSS variables at the top)
- Syntax colors: `themes/G.R/assets/css/chroma.css`
- Hero text, social links, author: `hugo.toml` (`[params]`, `[languages.*.params.hero]`)
- UI strings: `themes/G.R/i18n/{en,ka}.toml`
