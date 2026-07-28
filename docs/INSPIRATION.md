# Inspiration and naming

Shreddit grew from a conversation about preserving the dense, readable qualities of Old Reddit without depending on `old.reddit.com`, an alternate proxy, a local cache, or automated browser retrieval.

The excerpts below are lightly trimmed for length and punctuation. They are included with the repository owner's request and contain no account credentials or private browsing data.

## The original constraint

> “Can a Tampermonkey script perform the old-Reddit style renders using reddit.com modern interface ... with TOS adherence and not logging in?”

That established the key boundary: Reddit should remain responsible for access and rendering; the userscript should only alter the presentation already visible in the user's browser.

## The speedreader direction

> “Can the right column be removed and the center main div of articles be screen wide ... clear out all the Reddit BS and just speedreader mode?”

That became the full-width, square-edged, text-first interface.

## Permanent mode

> “Remove the ‘modern’ look option, it takes over and won't revert.”

That led to the current design: there is no modern-view control inside Shreddit. Disable the userscript to restore Reddit's native interface.

## The name

> “At what point ... was the term or variable ‘shreddit’? ... Can that be the name of this Tampermonkey script? That is a sick burn rename.”

`shreddit` was already present in Reddit's live custom-element names, including:

```html
<shreddit-feed>
<shreddit-post>
<shreddit-comment>
```

The name therefore works on three levels:

1. It references Reddit's actual frontend component vocabulary.
2. It describes stripping the modern interface down to readable essentials.
3. It is, admittedly, a satisfying critique of the current UX.

## The stay-on-domain fix

An early attempt just redirected the browser to `old.reddit.com`. That was
wrong for the same reason a proxy or cache would be wrong: it depends on a
Reddit-hosted path staying available rather than the presentation layer
described above. A debugging exchange with Grok (xAI), 2026-07-24, worked
through the correction:

> “nope, still tried to connect to old.reddit.com — i think the chatgpt was
> set to render new.reddit then wrap it in a view that is more aesthetic
> like old.reddit.com while not touching the subdomain or forcing login ...
> proper tm script that doesn't call old.reddit.com but presents the style
> to user without login?”

Grok's answer was a script that stays on `www.reddit.com`/`reddit.com` and
injects CSS to feel denser and older, with a `MutationObserver` watching for
Reddit's own re-renders stripping the injected `<style>` tag and re-applying
it — with the caveat that a pixel-perfect Old Reddit clone isn't realistic
against a frontend that changes class names often, but a "noticeably denser,
more classic feel" is. That `@match`/`document-start`/`MutationObserver`
shape is what `shreddit.user.js` ships with. ([chat](https://grok.com/c/773695e1-2153-4491-806c-55b293ff7fad))

## Why this exists beyond Reddit

This repo is small on purpose. It's a clean, fully checkable example of a
process I'm using on something a lot bigger, running in parallel: an
AI-orchestration project built around caregiving, developed while I've been
navigating my own life as a family caregiver working through PTSD. Shreddit
has nothing to do with caregiving directly — its value here is that anyone
can read the whole reasoning chain in one sitting: real recon into what a
platform's stated justification for a change actually holds up to, honest
separation of the stated reason from the likely real one, and a solution that
stays strictly inside the legal and ethical line the whole way through rather
than crossing it to get a result.

That's the same process the bigger project needs, just easier to verify here.
More on that project soon — consider this the tell before the reveal.
