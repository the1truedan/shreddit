# Contributing

Shreddit is a small, deliberately narrow project. Contributions should preserve its role as a local presentation layer.

## Ground rules

A change should not:

- Add scraping, crawling, background pagination, or headless-browser behavior.
- Call Reddit APIs, `.json` routes, GraphQL endpoints, or internal service endpoints.
- Intercept cookies, login flows, CAPTCHA, telemetry, service workers, or network requests.
- Cache, export, index, mirror, or redistribute Reddit content.
- Hide or disguise promoted posts.
- Reintroduce an in-page switch to Reddit's modern layout.

## Development workflow

```bash
npm test
```

Then manually test the pages listed in [`docs/TESTING.md`](./docs/TESTING.md).

## Selector changes

Reddit frequently changes web-component names, attributes, and internal wrappers. Prefer:

1. Stable custom-element names such as `shreddit-post`.
2. Semantic attributes such as `role`, `aria-label`, or `data-testid`.
3. Conservative fallback selectors.
4. Fail-open behavior when a selector no longer matches.

Avoid broad selectors that could hide consent, safety, login, age-gate, report, or moderation dialogs.

## AI-assisted development

This repo is developed with AI-assisted tooling (Claude Code and others)
alongside manual work. Commits produced primarily by an AI agent under human
direction carry a trailer identifying the assisting model:

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

This is a provenance note, not a claim of autonomous authorship — every such
commit was directed, reviewed, and approved by a human before merging. Same
ground rules above still apply regardless of who or what proposed a change.
