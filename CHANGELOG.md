# Changelog

All notable changes to Shreddit are documented here.

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
