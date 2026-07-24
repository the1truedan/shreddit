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
