# Changelog

All notable changes to Shreddit are documented here.

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

- Removed the internal “modern view” toggle entirely.
- Made disabling the userscript the only way to restore Reddit's native presentation.
- Corrected text-only image selector chaining from the earlier prototype.

### Security

- Confirmed the script contains no `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, service-worker registration, or external resource loading.
