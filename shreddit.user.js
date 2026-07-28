// ==UserScript==
// @name         Shreddit
// @namespace    https://github.com/the1truedan/shreddit
// @version      0.6.0
// @description  Shreds modern Reddit's visual clutter into a permanent, full-width, square-edged, text-first speedreader.
// @author       the1truedan
// @license      MIT
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

(() => {
  'use strict';

  const IDS = Object.freeze({
    style: 'shreddit-style',
    toolbar: 'shreddit-toolbar',
    mediaButton: 'shreddit-media-button',
    toolbarButton: 'shreddit-toolbar-button'
  });

  const CLASSES = Object.freeze({
    enabled: 'shreddit-enabled',
    textOnly: 'shreddit-text-only',
    compactMedia: 'shreddit-compact-media',
    hideToolbar: 'shreddit-hide-toolbar'
  });

  const STORAGE_KEYS = Object.freeze({
    mediaMode: 'shreddit-media-mode',
    toolbarVisible: 'shreddit-toolbar-visible'
  });

  const MEDIA_MODES = Object.freeze(['text', 'compact', 'normal']);

  const state = {
    mediaMode: getStoredMediaMode(),
    toolbarVisible: readStoredBoolean(STORAGE_KEYS.toolbarVisible, true)
  };

  const CSS = String.raw`
    html.shreddit-enabled {
      --shreddit-header-bg: #cee3f8;
      --shreddit-header-border: #5f99cf;
      --shreddit-link: #0000ee;
      --shreddit-visited: #551a8b;
      --shreddit-text: #222;
      --shreddit-muted: #777;
      --shreddit-border: #d3d3d3;
      --shreddit-row: #fff;
      --shreddit-row-alt: #f7f7f7;
      --shreddit-comment-alt: #fafafa;
      --shreddit-promoted: #fff7df;

      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      color: var(--shreddit-text) !important;
      font-family: Verdana, Arial, Helvetica, sans-serif !important;
      font-size: 12px !important;
    }

    html.shreddit-enabled body {
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      background: #fff !important;
      color: var(--shreddit-text) !important;
      font-family: Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled *,
    html.shreddit-enabled *::before,
    html.shreddit-enabled *::after {
      box-sizing: border-box !important;
    }

    html.shreddit-enabled :is(
      main,
      article,
      section,
      aside,
      shreddit-post,
      shreddit-comment,
      shreddit-feed,
      button,
      img,
      video,
      figure,
      dialog,
      [role="dialog"]
    ) {
      border-radius: 0 !important;
    }

    html.shreddit-enabled :is(
      main,
      article,
      section,
      aside,
      shreddit-post,
      shreddit-comment,
      shreddit-feed
    ) {
      box-shadow: none !important;
    }

    /* Local navigation; does not fetch or proxy content. */
    html.shreddit-enabled #shreddit-toolbar {
      position: sticky !important;
      top: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      width: 100% !important;
      min-height: 32px !important;
      margin: 0 !important;
      padding: 3px 6px !important;
      border: 0 !important;
      border-bottom: 1px solid var(--shreddit-header-border) !important;
      background: var(--shreddit-header-bg) !important;
      color: #222 !important;
      font: 12px/1.2 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled.shreddit-hide-toolbar #shreddit-toolbar {
      display: none !important;
    }

    html.shreddit-enabled #shreddit-toolbar .shreddit-brand {
      margin-right: 5px !important;
      color: #ff4500 !important;
      font-size: 17px !important;
      font-weight: bold !important;
      letter-spacing: -1px !important;
      text-decoration: none !important;
    }

    html.shreddit-enabled #shreddit-toolbar a {
      color: #000 !important;
      font-weight: bold !important;
      text-decoration: none !important;
    }

    html.shreddit-enabled #shreddit-toolbar a:hover {
      text-decoration: underline !important;
    }

    html.shreddit-enabled #shreddit-toolbar button {
      min-width: 0 !important;
      min-height: 24px !important;
      margin: 0 !important;
      padding: 2px 7px !important;
      cursor: pointer !important;
      border: 1px solid #888 !important;
      border-radius: 0 !important;
      background: #fff !important;
      color: #222 !important;
      font: 12px/1 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled #shreddit-toolbar button:hover {
      background: #eee !important;
    }

    html.shreddit-enabled #shreddit-toolbar button[data-active="true"] {
      background: #5f99cf !important;
      color: #fff !important;
      font-weight: bold !important;
    }

    html.shreddit-enabled #shreddit-toolbar .shreddit-spacer {
      flex: 1 1 auto !important;
    }

    html.shreddit-enabled #shreddit-toolbar .shreddit-status {
      color: #555 !important;
      white-space: nowrap !important;
    }

    /* Suppress the scroll-triggered "sign in" nudge modal (rpl-modal-card). This is a
       marketing interstitial, not a safety/consent dialog, so it's excluded here rather
       than in the generic dialog rules above. */
    html.shreddit-enabled rpl-modal-card,
    html.shreddit-enabled div:has(> rpl-modal-card),
    html.shreddit-enabled shreddit-signup-drawer,
    html.shreddit-enabled [data-testid="login-modal"],
    html.shreddit-enabled [data-testid="signup-modal"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* Remove page chrome and recommendation rails, but not safety dialogs. */
    html.shreddit-enabled reddit-header-large,
    html.shreddit-enabled shreddit-header,
    html.shreddit-enabled header[role="banner"],
    html.shreddit-enabled faceplate-tracker[noun="header"],
    html.shreddit-enabled #left-sidebar-container,
    html.shreddit-enabled #right-sidebar-container,
    html.shreddit-enabled reddit-sidebar-nav,
    html.shreddit-enabled reddit-recent-pages,
    html.shreddit-enabled left-nav,
    html.shreddit-enabled nav[aria-label="Primary navigation"],
    html.shreddit-enabled aside,
    html.shreddit-enabled [data-testid="left-sidebar"],
    html.shreddit-enabled [data-testid="right-sidebar"],
    html.shreddit-enabled [data-testid="sidebar-container"],
    html.shreddit-enabled [aria-label="Community information"],
    html.shreddit-enabled [aria-label="Related communities"],
    html.shreddit-enabled [aria-label="Trending communities"],
    html.shreddit-enabled [aria-label="Popular communities"],
    html.shreddit-enabled [aria-label="Recent posts"],
    html.shreddit-enabled shreddit-app-selector,
    html.shreddit-enabled [data-testid="get-app"],
    html.shreddit-enabled [data-testid="app-download"],
    html.shreddit-enabled [aria-label="Chat"],
    html.shreddit-enabled [data-testid="chat-button"],
    html.shreddit-enabled [data-testid="footer"],
    html.shreddit-enabled footer,
    html.shreddit-enabled shreddit-recommendation,
    html.shreddit-enabled shreddit-recommended-posts,
    html.shreddit-enabled shreddit-community-recommendation,
    html.shreddit-enabled shreddit-related-posts,
    html.shreddit-enabled community-highlight-carousel,
    html.shreddit-enabled trending-today,
    html.shreddit-enabled recent-posts,
    html.shreddit-enabled related-community-list {
      display: none !important;
    }

    /* Kill centered columns and side-rail grid reservations. */
    html.shreddit-enabled :is(
      .grid-container,
      .main-container,
      .page-container,
      .content-container,
      .reddit-page-container,
      .main-content
    ) {
      display: block !important;
      grid-template-columns: 1fr !important;
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      transform: none !important;
    }

    html.shreddit-enabled main,
    html.shreddit-enabled [role="main"],
    html.shreddit-enabled #main-content,
    html.shreddit-enabled shreddit-feed,
    html.shreddit-enabled shreddit-posts-page,
    html.shreddit-enabled shreddit-comment-tree,
    html.shreddit-enabled div[class*="main-container"],
    html.shreddit-enabled div[class*="content-container"] {
      position: relative !important;
      left: auto !important;
      right: auto !important;
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      transform: none !important;
    }

    html.shreddit-enabled main > div,
    html.shreddit-enabled [role="main"] > div,
    html.shreddit-enabled #main-content > div,
    html.shreddit-enabled shreddit-feed > div {
      width: 100% !important;
      max-width: none !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    /* Flat, full-width feed. */
    html.shreddit-enabled shreddit-feed {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
    }

    html.shreddit-enabled shreddit-feed > article,
    html.shreddit-enabled article:has(shreddit-post),
    html.shreddit-enabled div[data-testid="post-container"] {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      border-bottom: 1px solid var(--shreddit-border) !important;
      background: #fff !important;
    }

    html.shreddit-enabled shreddit-post {
      position: relative !important;
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      min-width: 0 !important;
      min-height: 48px !important;
      margin: 0 !important;
      padding: 5px 8px 5px 77px !important;
      overflow: visible !important;
      border: 0 !important;
      background: var(--shreddit-row) !important;
      font-family: Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled shreddit-feed > article:nth-of-type(even) shreddit-post {
      background: var(--shreddit-row-alt) !important;
    }

    html.shreddit-enabled shreddit-post::before {
      content: attr(data-shreddit-rank);
      position: absolute !important;
      top: 16px !important;
      left: 2px !important;
      width: 27px !important;
      color: #aaa !important;
      text-align: right !important;
      font: normal 14px/1 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled shreddit-post [data-post-click-location="vote"],
    html.shreddit-enabled shreddit-post [data-testid="vote-arrows"],
    html.shreddit-enabled shreddit-post shreddit-post-vote-button {
      position: absolute !important;
      top: 4px !important;
      left: 32px !important;
      width: 39px !important;
      max-width: 39px !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      text-align: center !important;
    }

    html.shreddit-enabled shreddit-post > div,
    html.shreddit-enabled shreddit-post article,
    html.shreddit-enabled shreddit-post section {
      max-width: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    html.shreddit-enabled shreddit-post :is(
      [slot="title"],
      a[id^="post-title"],
      h1[id^="post-title"],
      h2[id^="post-title"],
      h3[id^="post-title"]
    ) {
      display: inline !important;
      margin: 0 !important;
      padding: 0 !important;
      color: var(--shreddit-link) !important;
      font: normal 15px/1.28 Verdana, Arial, Helvetica, sans-serif !important;
      overflow-wrap: anywhere !important;
      text-decoration: none !important;
    }

    html.shreddit-enabled shreddit-post a[id^="post-title"]:visited {
      color: var(--shreddit-visited) !important;
    }

    html.shreddit-enabled shreddit-post a[id^="post-title"]:hover {
      text-decoration: underline !important;
    }

    html.shreddit-enabled shreddit-post :is(
      [slot="credit-bar"],
      [data-testid="credit-bar"],
      [data-post-click-location="author"],
      [data-testid="subreddit-name"],
      [data-testid="post-meta"]
    ) {
      display: block !important;
      margin: 1px 0 !important;
      padding: 0 !important;
      color: var(--shreddit-muted) !important;
      font: normal 11px/1.3 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled shreddit-post a {
      text-decoration: none !important;
    }

    html.shreddit-enabled shreddit-post a:hover {
      text-decoration: underline !important;
    }

    html.shreddit-enabled shreddit-post :is(
      [slot="text-body"],
      [data-testid="post-text-container"],
      .md,
      .usertext-body,
      shreddit-post-text-body
    ) {
      width: 100% !important;
      max-width: none !important;
      margin: 4px 0 !important;
      padding: 3px 6px !important;
      border: 0 !important;
      border-left: 2px solid #ddd !important;
      background: transparent !important;
      color: #222 !important;
      font: normal 14px/1.45 Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled :is(shreddit-post, shreddit-comment) :is(p, ul, ol, blockquote, pre) {
      max-width: none !important;
      margin-top: 4px !important;
      margin-bottom: 4px !important;
    }

    html.shreddit-enabled :is(shreddit-post, shreddit-comment) :is(pre, code) {
      border-radius: 0 !important;
      white-space: pre-wrap !important;
      overflow-wrap: anywhere !important;
    }

    html.shreddit-enabled shreddit-post :is(
      [slot="post-footer"],
      shreddit-post-action-row,
      [data-testid="post-action-row"]
    ) {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 3px !important;
      min-height: 0 !important;
      margin: 2px 0 0 !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      color: #777 !important;
      font: bold 11px/1.2 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled shreddit-post :is(
      [slot="post-footer"],
      shreddit-post-action-row,
      [data-testid="post-action-row"]
    ) button {
      min-width: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 1px 3px !important;
      border: 0 !important;
      background: transparent !important;
      color: #777 !important;
      font: bold 11px/1.2 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled awards-bar,
    html.shreddit-enabled shreddit-award-button,
    html.shreddit-enabled [data-testid="award-button"],
    html.shreddit-enabled [aria-label*="Award"],
    html.shreddit-enabled [aria-label*="Give Award"] {
      display: none !important;
    }

    /* Default text-only mode. Links and captions remain available. */
    html.shreddit-enabled.shreddit-text-only shreddit-post :is(
      shreddit-player,
      shreddit-post-media,
      shreddit-gallery,
      gallery-carousel,
      reddit-video,
      video,
      picture,
      figure,
      canvas,
      iframe,
      [data-post-click-location="media"],
      [data-testid="post-media"],
      [slot="post-media-container"]
    ) {
      display: none !important;
    }

    html.shreddit-enabled.shreddit-text-only shreddit-post img:not([width="16"]):not([width="20"]):not([width="24"]):not([width="32"]) {
      display: none !important;
    }

    html.shreddit-enabled.shreddit-compact-media shreddit-feed shreddit-post :is(
      shreddit-player,
      shreddit-post-media,
      shreddit-gallery,
      gallery-carousel,
      reddit-video,
      figure,
      [data-post-click-location="media"],
      [data-testid="post-media"],
      [slot="post-media-container"]
    ) {
      width: auto !important;
      max-width: 420px !important;
      max-height: 180px !important;
      margin: 3px 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 0 !important;
      background: transparent !important;
    }

    html.shreddit-enabled.shreddit-compact-media shreddit-feed shreddit-post :is(img, video) {
      width: auto !important;
      max-width: 420px !important;
      max-height: 180px !important;
      object-fit: contain !important;
    }

    html.shreddit-enabled:not(.shreddit-text-only):not(.shreddit-compact-media) shreddit-post :is(
      shreddit-player,
      shreddit-post-media,
      shreddit-gallery,
      gallery-carousel,
      reddit-video,
      picture,
      figure,
      [data-post-click-location="media"],
      [data-testid="post-media"],
      [slot="post-media-container"]
    ) {
      width: 100% !important;
      max-width: none !important;
      height: auto !important;
      max-height: none !important;
      margin: 3px 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      border: 0 !important;
      background: transparent !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    html.shreddit-enabled:not(.shreddit-text-only):not(.shreddit-compact-media) shreddit-post :is(img, video) {
      width: 100% !important;
      max-width: none !important;
      height: auto !important;
      max-height: none !important;
      object-fit: contain !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    /* Promoted units stay visible and labeled. */
    html.shreddit-enabled shreddit-ad-post,
    html.shreddit-enabled shreddit-post[data-shreddit-promoted="true"] {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      background: var(--shreddit-promoted) !important;
      outline: 1px solid #d8b35c !important;
      outline-offset: -1px !important;
    }

    html.shreddit-enabled shreddit-post[data-shreddit-promoted="true"]::after {
      content: "promoted";
      position: absolute !important;
      top: 3px !important;
      right: 5px !important;
      color: #7c5700 !important;
      font: normal 11px/1 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled shreddit-comment-tree,
    html.shreddit-enabled [data-testid="comment-tree"] {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 2px 4px !important;
      border: 0 !important;
      background: #fff !important;
    }

    html.shreddit-enabled shreddit-comment {
      display: block !important;
      width: auto !important;
      max-width: none !important;
      margin: 1px 0 1px 3px !important;
      padding: 4px 5px !important;
      border: 0 !important;
      border-left: 2px solid #c7c7c7 !important;
      background: var(--shreddit-comment-alt) !important;
      color: #222 !important;
      font: normal 14px/1.42 Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled shreddit-comment:nth-of-type(even) {
      background: #fff !important;
    }

    html.shreddit-enabled shreddit-comment :is(
      [slot="commentMeta"],
      [data-testid="comment-meta"],
      [data-testid="comment-header"]
    ) {
      margin: 0 0 2px !important;
      padding: 0 !important;
      color: #777 !important;
      font: normal 11px/1.25 Verdana, Arial, Helvetica, sans-serif !important;
    }

    html.shreddit-enabled shreddit-comment :is(
      [slot="comment"],
      [data-testid="comment"],
      .md
    ) {
      max-width: none !important;
      color: #222 !important;
    }

    html.shreddit-enabled shreddit-comment shreddit-comment {
      margin-left: 7px !important;
    }

    html.shreddit-enabled :is(
      community-header,
      shreddit-subreddit-header,
      subreddit-header,
      [data-testid="subreddit-header"]
    ) {
      width: 100% !important;
      max-width: none !important;
      height: auto !important;
      max-height: none !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 4px 7px !important;
      border: 0 !important;
      border-bottom: 1px solid var(--shreddit-header-border) !important;
      background: var(--shreddit-header-bg) !important;
      background-image: none !important;
      opacity: 1 !important;
    }

    html.shreddit-enabled :is(
      community-header,
      shreddit-subreddit-header,
      subreddit-header,
      [data-testid="subreddit-header"]
    ) * {
      background-image: none !important;
    }

    html.shreddit-enabled :is(
      shreddit-subreddit-header,
      subreddit-header,
      [data-testid="subreddit-header"]
    ) :is(
      img,
      picture,
      svg,
      shreddit-subreddit-icon,
      faceplate-img,
      [class*="banner" i],
      [data-testid*="banner" i],
      [style*="background-image"]
    ) {
      display: none !important;
    }

    html.shreddit-enabled :is(
      shreddit-subreddit-header,
      subreddit-header,
      [data-testid="subreddit-header"]
    ) :is(h1, h2, span, p, a, faceplate-text) {
      opacity: 1 !important;
      color: #222 !important;
      text-shadow: none !important;
      -webkit-text-fill-color: #222 !important;
    }

    @media (max-width: 700px) {
      html.shreddit-enabled shreddit-post {
        padding-left: 55px !important;
      }

      html.shreddit-enabled shreddit-post::before {
        display: none !important;
      }

      html.shreddit-enabled shreddit-post [data-post-click-location="vote"],
      html.shreddit-enabled shreddit-post [data-testid="vote-arrows"] {
        left: 5px !important;
      }

      html.shreddit-enabled #shreddit-toolbar .shreddit-status {
        display: none !important;
      }
    }

    @media print {
      html.shreddit-enabled #shreddit-toolbar {
        display: none !important;
      }

      html.shreddit-enabled shreddit-post {
        padding-left: 0 !important;
      }

      html.shreddit-enabled shreddit-post::before,
      html.shreddit-enabled shreddit-post [data-post-click-location="vote"] {
        display: none !important;
      }
    }
  `;

  function readStoredBoolean(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value === 'true';
    } catch {
      return fallback;
    }
  }

  function getStoredMediaMode() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.mediaMode);
      return MEDIA_MODES.includes(stored) ? stored : 'text';
    } catch {
      return 'text';
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.mediaMode, state.mediaMode);
      localStorage.setItem(STORAGE_KEYS.toolbarVisible, String(state.toolbarVisible));
    } catch {
      // The interface still works if storage is blocked.
    }
  }

  function installStyle() {
    if (document.getElementById(IDS.style)) return;

    const style = document.createElement('style');
    style.id = IDS.style;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function applyState() {
    const root = document.documentElement;

    // Shreddit remains enabled while this userscript is active.
    root.classList.add(CLASSES.enabled);
    root.classList.toggle(CLASSES.textOnly, state.mediaMode === 'text');
    root.classList.toggle(CLASSES.compactMedia, state.mediaMode === 'compact');
    root.classList.toggle(CLASSES.hideToolbar, !state.toolbarVisible);

    updateToolbar();
    saveState();
  }

  function cycleMediaMode() {
    const currentIndex = MEDIA_MODES.indexOf(state.mediaMode);
    state.mediaMode = MEDIA_MODES[(currentIndex + 1) % MEDIA_MODES.length];
    applyState();
  }

  function toggleToolbar() {
    state.toolbarVisible = !state.toolbarVisible;
    applyState();
  }

  function getMediaLabel() {
    switch (state.mediaMode) {
      case 'compact':
        return 'compact media';
      case 'normal':
        return 'normal media';
      default:
        return 'text only';
    }
  }

  function addToolbar() {
    if (!document.body || document.getElementById(IDS.toolbar)) return;

    const toolbar = document.createElement('nav');
    toolbar.id = IDS.toolbar;
    toolbar.setAttribute('aria-label', 'Shreddit speedreader');
    toolbar.innerHTML = `
      <a class="shreddit-brand" href="/" title="Reddit home">shreddit</a>
      <a href="/">HOME</a>
      <a href="/r/popular/">POPULAR</a>
      <a href="/r/all/">ALL</a>
      <button id="${IDS.mediaButton}" type="button" title="Cycle media modes — Alt+Shift+M">text only</button>
      <span class="shreddit-spacer"></span>
      <span class="shreddit-status">full-width local speedreader</span>
      <button id="${IDS.toolbarButton}" type="button" title="Hide toolbar — Alt+Shift+T">×</button>
    `;

    document.body.prepend(toolbar);
    toolbar.querySelector(`#${IDS.mediaButton}`)?.addEventListener('click', cycleMediaMode);
    toolbar.querySelector(`#${IDS.toolbarButton}`)?.addEventListener('click', toggleToolbar);
    updateToolbar();
  }

  function updateToolbar() {
    const mediaButton = document.getElementById(IDS.mediaButton);
    if (!mediaButton) return;

    mediaButton.textContent = getMediaLabel();
    mediaButton.dataset.active = state.mediaMode === 'text' ? 'true' : 'false';
  }

  function isPromoted(post) {
    if (!(post instanceof Element)) return false;

    const promotedAttributes = ['is-promoted', 'promoted', 'is-sponsored', 'sponsored'];
    const hasPromotedAttribute = promotedAttributes.some((attribute) => (
      post.hasAttribute(attribute) || post.getAttribute(attribute) === 'true'
    ));

    if (hasPromotedAttribute) return true;
    if (post.closest('shreddit-ad-post, [data-testid="ad-post"]')) return true;

    const text = (post.textContent || '').slice(0, 500).toLowerCase();
    return text.includes('promoted') || text.includes('sponsored');
  }

  function decoratePost(post, fallbackRank) {
    if (!(post instanceof Element)) return;

    const feedIndex = Number.parseInt(post.getAttribute('feedindex') || '', 10);
    const rank = Number.isFinite(feedIndex) ? feedIndex + 1 : fallbackRank;

    post.dataset.shredditRank = rank ? String(rank) : '';
    post.dataset.shredditPromoted = isPromoted(post) ? 'true' : 'false';
  }

  function decoratePosts(root = document) {
    root.querySelectorAll?.('shreddit-post').forEach((post, index) => {
      decoratePost(post, index + 1);
    });
  }

  function forceFullWidth(root = document) {
    const selectors = [
      'main',
      '[role="main"]',
      '#main-content',
      'shreddit-feed',
      'shreddit-posts-page',
      'shreddit-comment-tree',
      '.main-container',
      '.main-content',
      '.content-container'
    ];

    root.querySelectorAll?.(selectors.join(',')).forEach((element) => {
      element.style.setProperty('width', '100%', 'important');
      element.style.setProperty('max-width', 'none', 'important');
      element.style.setProperty('min-width', '0', 'important');
      element.style.setProperty('margin-left', '0', 'important');
      element.style.setProperty('margin-right', '0', 'important');
      element.style.setProperty('padding-left', '0', 'important');
      element.style.setProperty('padding-right', '0', 'important');
      element.style.setProperty('transform', 'none', 'important');
    });
  }

  let refreshScheduled = false;

  function scheduleRefresh() {
    if (refreshScheduled) return;
    refreshScheduled = true;

    requestAnimationFrame(() => {
      refreshScheduled = false;
      addToolbar();
      decoratePosts(document);
      forceFullWidth(document);
      applyState();
    });
  }

  function handleKeyboard(event) {
    const target = event.target;
    const isTyping = (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable
    );

    if (isTyping) return;

    if (event.altKey && event.shiftKey && event.code === 'KeyM') {
      event.preventDefault();
      cycleMediaMode();
      return;
    }

    if (event.altKey && event.shiftKey && event.code === 'KeyT') {
      event.preventDefault();
      toggleToolbar();
    }
  }

  function start() {
    installStyle();
    document.documentElement.classList.add(CLASSES.enabled);
    applyState();

    if (!document.body) {
      requestAnimationFrame(start);
      return;
    }

    addToolbar();
    decoratePosts(document);
    forceFullWidth(document);
    applyState();

    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', handleKeyboard, true);
  }

  start();
})();
