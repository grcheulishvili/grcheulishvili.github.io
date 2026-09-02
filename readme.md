# G.R

Personal research & portfolio blog - offensive systems research, engineering, and projects.
Built with Hugo using the `pelican-bootstrap3` theme (`themes/pelican-bootstrap3`), a Hugo
re-implementation of the classic [Pelican pelican-bootstrap3](https://github.com/getpelican/pelican-themes/tree/master/pelican-bootstrap3)
theme: Bootstrap 3, a fixed top navbar, and a two-column layout with a sidebar
(about, social links, recent posts, categories, tags, archives).

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
description = "One-line summary (used in lists and OG tags)."
tags = ["Go", "Red Team"]
```

## Georgian (KA) translations

Add a `.ka.md` sibling next to any English file:

```
content/research/my-post.md      # English
content/research/my-post.ka.md   # Georgian
```

Pages without a `.ka.md` fall back to an "untranslated" notice page, with a
link back to the English original.

## Customising

- Layout & styling: `themes/pelican-bootstrap3/static/css/style.css` (small overrides on top of Bootstrap 3)
- Bootstrap / Font Awesome / pygments assets: `themes/pelican-bootstrap3/static/css`
- Templates: `themes/pelican-bootstrap3/layouts/`
- Hero text, social links, author: `hugo.toml` (`[params]`, `[languages.*.params.hero]`)
- UI strings: `themes/pelican-bootstrap3/i18n/{en,ka}.toml`
