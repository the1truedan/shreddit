# Shreddit

**Shreddit** is an unofficial Violentmonkey/Tampermonkey userscript that shreds modern Reddit's visual clutter into a flat, fast, full-width reading interface.

It is deliberately a **local presentation layer**:

- Reddit loads and renders the page normally.
- Shreddit observes only the DOM already present in the browser tab.
- Shreddit does not call Reddit APIs or internal JSON endpoints.
- Shreddit does not proxy, cache, archive, index, export, or redistribute Reddit content.
- Shreddit does not intercept authentication, cookies, CAPTCHA, telemetry, or network traffic.
- Promoted posts remain visible and clearly labeled.

> Unofficial project. Not affiliated with, endorsed by, or sponsored by Reddit, Inc.
Inspired by https://www.cole-k.com/2026/07/21/reddit/
discussion here - https://lobste.rs/s/gqdvdt/so_reddit_has_decided_plain_html_is_unsafe

## What it changes

- Removes the left and right rails.
- Forces the central feed and comments to use the full viewport width.
- Removes rounded cards, shadows, large gutters, app prompts, chat buttons, award controls, footer clutter, and recommendation modules.
- Flattens posts into compact, Old Reddit-inspired rows.
- Uses a permanent speedreader layout while the userscript is enabled.
- Defaults to text-only reading while preserving links and metadata.
- Supports compact-media and normal-media modes.
- Dark mode with an old-reddit-night-mode-inspired palette.
- Compacts nested comment threads and limits runaway indentation.

## Installation

### Violentmonkey

1. Install Violentmonkey in your browser.
2. Open the Violentmonkey dashboard.
3. Choose **New**.
4. Replace the template with [`shreddit.user.js`](./shreddit.user.js).
5. Save and reload `https://www.reddit.com/`.

### Tampermonkey

1. Install Tampermonkey in your browser.
2. Open the Tampermonkey dashboard.
3. Choose **Create a new script**.
4. Replace the template with [`shreddit.user.js`](./shreddit.user.js).
5. Save and reload Reddit.

### On a phone

Firefox + Tampermonkey works directly on Android. iOS needs Safari plus a
userscript app (Firefox can't run extensions on iOS at all). See
[`docs/MOBILE.md`](./docs/MOBILE.md) for both, with screenshots.

## Controls

| Control | Action |
|---|---|
| Toolbar media button | Cycles text-only → compact media → normal media |
| `Alt+Shift+M` | Cycles media modes |
| Toolbar dark mode button | Toggles the dark theme |
| `Alt+Shift+D` | Toggles the dark theme |
| `Alt+Shift+T` | Hides or restores the Shreddit toolbar |
| Disable userscript | Returns to Reddit's original interface |

Dark mode defaults to your OS's `prefers-color-scheme` on first run, then remembers your choice.

There is intentionally **no “modern view” toggle** inside the script. Earlier prototypes included one, but Reddit's client-side navigation could leave the page in an inconsistent state after switching. The userscript itself is now the single on/off boundary.

## Repository layout

```text
.
├── shreddit.user.js              # Installable userscript
├── README.md                     # Project overview and setup
├── CHANGELOG.md                  # Version history
├── CONTRIBUTING.md               # Contribution guidance
├── SECURITY.md                   # Security and privacy reporting
├── package.json                  # Dependency-free validation commands
├── scripts/check.mjs             # Metadata and boundary checks
└── docs/
    ├── ARCHITECTURE.md           # Technical design
    ├── INSPIRATION.md            # Origin and conversation excerpts
    ├── MOBILE.md                 # iOS and Android install instructions
    ├── PRIVACY-BOUNDARIES.md     # Explicit non-goals and guardrails
    └── TESTING.md                # Manual test matrix
```

## Development

Requires Node.js 18 or newer only for local checks. The userscript itself has no package or runtime dependencies.

```bash
npm test
```

The validation command checks:

- JavaScript syntax.
- Required userscript metadata.
- Absence of network-fetching primitives.
- Absence of a modern-view toggle.
- Presence of permanent Shreddit mode and promoted-post labeling.

## Design boundary

Shreddit is intended to remain closer to a browser stylesheet than to an alternate Reddit client. See [`docs/PRIVACY-BOUNDARIES.md`](./docs/PRIVACY-BOUNDARIES.md) before adding features.

## Project status

Private prototype. Reddit's frontend markup changes frequently, so selectors may need maintenance. 

## License

MIT — see [`LICENSE`](./LICENSE).

## Credits

Original prototype built through ChatGPT; this release's full-width media, type scale, banner, and login-nudge-suppression pass done with Claude (Anthropic). The core architecture decision — stay on `www.reddit.com`/`reddit.com` rather than redirect to `old.reddit.com`, and use a `MutationObserver` to re-apply styling when Reddit's own re-renders strip it — came out of a debugging exchange with Grok (xAI), 2026-07-24: an initial redirect-based script was tried and rejected as the wrong approach, and Grok's follow-up CSS-injection-plus-observer pattern is what the shipped script's `@match`/`document-start`/`MutationObserver` structure is built on. See [`docs/INSPIRATION.md`](./docs/INSPIRATION.md) for the excerpt.

---

> prepare for the care when we cannot be there
> DAN THE MAN ADAMS!
> https://linktr.ee/the1truedan · https://ko-fi.com/the1truedan
