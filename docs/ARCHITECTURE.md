# Architecture

## Data flow

```text
User opens reddit.com
        │
        ▼
Reddit loads and renders its own page
        │
        ▼
Shreddit injects local CSS
        │
        ├── hides navigation and recommendation chrome
        ├── removes side-rail layout reservations
        ├── flattens visible posts and comments
        └── applies the selected local media mode
        │
        ▼
MutationObserver notices newly rendered feed items
        │
        ▼
Shreddit decorates only those DOM nodes
```

## Main components

### Metadata block

The userscript runs at `document-start` with `@grant none` and only matches Reddit's primary web origins.

### CSS layer

The stylesheet is scoped beneath `html.shreddit-enabled`. It:

- Sets square corners and removes shadows.
- Hides sidebars, headers, recommendations, and decorative controls.
- Forces feed and comment containers to full width.
- Compacts `shreddit-post` and `shreddit-comment` components.
- Implements text-only and compact-media modes.

### DOM decoration

JavaScript adds two data attributes to rendered post components:

- `data-shreddit-rank`
- `data-shreddit-promoted`

These attributes support rank display and explicit promoted-post styling. They do not copy or export post content.

### Mutation handling

Reddit uses client-side navigation and infinite feed insertion. A single `MutationObserver` schedules one refresh per animation frame. The refresh:

1. Ensures the local toolbar exists.
2. Decorates visible `shreddit-post` elements.
3. Removes width constraints from recognized containers.
4. Reapplies local presentation state.

## Persistence

Shreddit stores only:

- `shreddit-media-mode`
- `shreddit-toolbar-visible`

Both are stored in Reddit's origin-local `localStorage`. No post, account, browsing, or engagement data is stored.

## Failure behavior

When Reddit changes its markup, unmatched elements remain in Reddit's normal rendered state. Shreddit does not compensate by fetching alternate endpoints or reconstructing missing content.
