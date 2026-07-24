# Manual testing

Run `npm test` first, then test in a clean browser profile with Violentmonkey or Tampermonkey.

## Page matrix

- Logged-out home page.
- `/r/popular/`.
- `/r/all/`.
- A public subreddit feed.
- A text post discussion.
- An image post discussion.
- A video post discussion.
- A deeply nested comment thread.
- Infinite-scroll insertion.
- Client-side navigation between two Reddit pages.
- Narrow mobile-sized viewport.
- Browser print preview.

## Expected behavior

- No right or left sidebar remains.
- Main feed and comment trees span the viewport.
- Cards are square and shadow-free.
- Text-only mode is the default.
- Media mode cycles using the toolbar or `Alt+Shift+M`.
- Toolbar hides and restores using `Alt+Shift+T`.
- No modern-view control exists.
- Promoted posts remain visible and labeled.
- Login, consent, safety, reporting, and age-gate dialogs are not intentionally suppressed.
- Disabling the userscript restores Reddit's native interface after reload.

## Network check

Open browser developer tools and filter the Network panel by `shreddit`. There should be no Shreddit-originated request. All observed Reddit requests should originate from Reddit's own application behavior.
