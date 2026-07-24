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

## What it changes

- Removes the left and right rails.
- Forces the central feed and comments to use the full viewport width.
- Removes rounded cards, shadows, large gutters, app prompts, chat buttons, award controls, footer clutter, and recommendation modules.
- Flattens posts into compact, Old Reddit-inspired rows.
- Uses a permanent speedreader layout while the userscript is enabled.
- Defaults to text-only reading while preserving links and metadata.
- Supports compact-media and normal-media modes.
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

## Controls

| Control | Action |
|---|---|
| Toolbar media button | Cycles text-only → compact media → normal media |
| `Alt+Shift+M` | Cycles media modes |
| `Alt+Shift+T` | Hides or restores the Shreddit toolbar |
| Disable userscript | Returns to Reddit's original interface |

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

No open-source license has been selected yet. Until one is added, normal copyright restrictions apply.
