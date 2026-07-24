# Contributing

Shreddit is currently a private prototype. Contributions should preserve its narrow role as a local presentation layer.

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
