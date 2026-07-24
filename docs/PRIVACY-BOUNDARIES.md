# Privacy and implementation boundaries

## Purpose

Shreddit is a local DOM presentation layer, not an alternate Reddit client.

## Allowed behavior

- Inject CSS into a Reddit tab.
- Observe DOM nodes that Reddit has already rendered.
- Add local attributes or wrappers used only for styling.
- Hide or compact nonessential interface chrome.
- Store local display preferences.
- Preserve normal links back to official Reddit pages.

## Explicit non-goals

Shreddit must not:

- Use `fetch`, `XMLHttpRequest`, WebSockets, GraphQL, or `.json` routes.
- Monkey-patch browser networking primitives.
- Register a service worker.
- Run Playwright, Puppeteer, Selenium, or another headless browser.
- Prefetch posts, comments, profiles, or subsequent pages.
- Circumvent login, CAPTCHA, consent, age, quarantine, safety, or rate-limit controls.
- Copy content into a local server, cache, search index, RSS feed, or export file.
- Rewrite Reddit links to a local or third-party hostname.
- Remove or disguise promoted content.
- Load remote scripts, stylesheets, fonts, analytics, or telemetry.

## Terms-of-service language

This architecture is intended to minimize risk by limiting the script to local visual customization. It is not a legal opinion or a guarantee that Reddit approves every interface modification.
