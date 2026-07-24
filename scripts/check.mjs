import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../shreddit.user.js', import.meta.url), 'utf8');

const requiredFragments = [
  '// @name         Shreddit',
  '// @grant        none',
  '// @match        https://www.reddit.com/*',
  'document.documentElement.classList.add(CLASSES.enabled)',
  'data-shreddit-promoted',
  'shreddit-post',
  'shreddit-comment'
];

const forbiddenPatterns = [
  { label: 'fetch()', pattern: /\bfetch\s*\(/ },
  { label: 'XMLHttpRequest', pattern: /\bXMLHttpRequest\b/ },
  { label: 'WebSocket', pattern: /\bWebSocket\b/ },
  { label: 'sendBeacon', pattern: /\bsendBeacon\b/ },
  { label: 'service worker registration', pattern: /serviceWorker\s*\.\s*register/ },
  { label: 'modern-view toggle', pattern: /modern\s+view/i },
  { label: 'old.reddit redirect', pattern: /old\.reddit\.com/i }
];

const errors = [];

for (const fragment of requiredFragments) {
  if (!source.includes(fragment)) {
    errors.push(`Missing required fragment: ${fragment}`);
  }
}

for (const { label, pattern } of forbiddenPatterns) {
  if (pattern.test(source)) {
    errors.push(`Forbidden capability or wording found: ${label}`);
  }
}

if (errors.length > 0) {
  console.error('Shreddit validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Shreddit metadata and implementation boundaries validated.');
}
