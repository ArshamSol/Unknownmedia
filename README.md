# Personal Website

A single-page portfolio site structured like a minimal artist/designer catalog: two fixed left columns (brand + section nav, and a scrollable project index) beside a main content pane, with a full-bleed project detail view. All client-side, no build step.

## Structure

- `index.html` — page shell (rail, list column, main pane)
- `css/style.css` — all styling and layout/breakpoints
- `js/data.js` — your content: work items, serendipitous browsing links, about, contact
- `js/app.js` — view rendering + hash-based routing (`#browsing`, `#about`, `#work-project-one`, ...)

## Layout

- **Left rail** — brand/logo, tag filters, section nav (Portfolio / Serendipitous Browsing / About / Contact) pinned to the bottom
- **List column** — scrollable numbered index of portfolio items, filtered by the active tag
- **Main pane** — renders the current view: a masonry grid on Portfolio, a dated link list on Serendipitous Browsing, bio + CV on About, contact links on Contact
- **Project detail** — clicking a work item slides the sidebars out and shows a full-bleed two-column project page (body text + metadata) with prev/next navigation and a close bar on the left edge

Below 860px, the sidebars collapse: the rail becomes a slide-out drawer (hamburger button, top right), and the list column stacks above the main content.

## Customize

1. Edit `js/data.js` — that's the only file you need to touch to change content (work items, browsing links, bio, contact links).
2. Replace "Your Name" (`brand` field) and the placeholder email/social links.
3. Swap the gray `.thumb` / `.shot` placeholder blocks for real `<img>` tags pointing into `images/` once you have real photos.
4. Colors and fonts live at the top of `css/style.css` (`:root` variables) if you want to change the accent palette (currently coral / teal / indigo per column) or typefaces (Inter + JetBrains Mono).

## Publish with GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, go to **Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/`.
