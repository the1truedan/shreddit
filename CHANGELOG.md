# Changelog

All notable changes to Shreddit are documented here.

## Unreleased

## 0.6.4 - 2026-07-31

### Fixed

- README: the "Inspired by" / discussion links were jammed directly onto the intro blockquote as bare, unspaced URLs — reflowed into a proper spaced sentence with markdown link text, and converted the footer sig's `linktr.ee`/`ko-fi` links to markdown links as well.
- CONTRIBUTING.md and SECURITY.md still described the repo as private after yesterday's public release — updated both to reflect the current public status.

## 0.6.3 - 2026-07-31

### Added

- `docs/LEGAL.md`: standalone privacy statement (no analytics, telemetry, remote code, content export, or external network requests) and non-affiliation statement, per the original design chat.

### Released

- First public release: repository visibility changed from private to public on GitHub (`github.com/the1truedan/shreddit`), 2026-07-31.

## 0.6.2 - 2026-07-29

### Added

- Dark mode: an old-reddit-night-mode-inspired palette (dark blue-gray header, `#0f1010` page background, light-blue links) toggled via a new toolbar button, `Alt+Shift+D`, or automatically on first run from the OS `prefers-color-scheme`. Persisted in `localStorage` alongside the existing media-mode and toolbar-visibility state.
- All previously hardcoded colors (post/comment text, borders, muted meta text, promoted-post labeling) now route through CSS custom properties so the dark theme covers every element, not just the toolbar.
- `docs/MOBILE.md`: iOS (Safari + the free Userscripts app, or Tampermonkey for Safari) and Android (Firefox + Tampermonkey directly) install instructions with screenshots — added after a request to get Shreddit running on an iPhone for a cousin.

## 0.6.1 - 2026-07-29

### Changed

- Raised every declared font size by 2px (base 12px→14px, post titles 15px→17px, comment/post body 14px→16px, meta/footer text 11px→13px, brand mark 17px→19px) for better mobile readability.

## 0.6.0 - 2026-07-27

### Changed

- Raised the base type scale from 10px to an old.reddit-accurate 12px, and scaled post titles, comment bodies, meta text, and the toolbar proportionally so density stays close to classic old Reddit without the previous cramped size.
- Made normal-media mode actually full-bleed: post images and video now fill the full row width at native resolution instead of being left at Reddit's own constrained, letterboxed sizing.
- Flattened the subreddit header to a solid-color bar: banner images/textures are hidden and header title text is forced to full opacity, matching old Reddit's plain colored community strip instead of the washed-out placeholder look.
- Suppressed the scroll-triggered sign-in nudge (`rpl-modal-card`) and guarded body/html scroll so its scroll-lock can't leave the page stuck. This hides a marketing interstitial, not an actual access gate — Shreddit still does not touch login, CAPTCHA, consent, or rate-limit controls.

### Added

- MIT license (`LICENSE`), restoring what was set on the original repo before it was overwritten.
- README credits section (ChatGPT for the original prototype, Claude/Anthropic for this release's styling pass) and an author sig with linktr.ee/ko-fi links.

## 0.5.0 - 2026-07-24

### Added

- Renamed the project to **Shreddit** after identifying Reddit's own `shreddit-*` web components in the live DOM.
- Added Violentmonkey and Tampermonkey metadata.
- Added permanent full-width speedreader styling.
- Added text-only, compact-media, and normal-media modes.
- Added local toolbar and keyboard shortcuts.
- Added promoted-post detection and visible labeling.
- Added repository documentation, validation, architecture notes, and testing guidance.

### Changed

- Removed the internal "modern view" toggle entirely.
- Made disabling the userscript the only way to restore Reddit's native presentation.
- Corrected text-only image selector chaining from the earlier prototype.

### Security

- Confirmed the script contains no `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, service-worker registration, or external resource loading.
