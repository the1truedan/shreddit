# Security Policy

## Supported version

Only the latest version on the default branch is supported.

## Reporting

Because this is a private repository, report security or privacy concerns through a private GitHub issue or direct repository communication.

## Security posture

Shreddit is designed to:

- Run with `@grant none`.
- Execute only on `reddit.com` and `www.reddit.com`.
- Avoid external resources and remote code.
- Avoid network interception or additional content requests.
- Store only two local presentation preferences: media mode and toolbar visibility.

A report is especially important if a change causes the userscript to:

- Send data to any external host.
- Read or alter authentication material.
- suppress safety or consent interfaces.
- Load executable code at runtime.
- Create an alternate cache or mirror of Reddit content.
