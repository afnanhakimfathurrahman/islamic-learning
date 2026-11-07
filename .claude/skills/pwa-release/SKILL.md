---
name: pwa-release
description: Ship a change to the GitHub Pages PWA safely: bump the service worker cache, validate manifest/SW, push, and confirm the live deploy and install flow.
---

# pwa-release

1. Edit `CACHE_NAME` in `sw.js` (`islamic-learning-vN` -> `vN+1`) and add any new asset to `ASSETS_TO_CACHE`.
2. `node scripts/build-pages.mjs` (regenerates the per-section SEO pages + sitemap), then `bash .claude/skills/verify-site/check.sh` must PASS.
3. **Do NOT commit or push automatically.** Stop and show the user the changes (`git status`, `git diff`) for review. Only after they explicitly approve: `git add -A && git commit -m "..." && git push origin main` (branch `main`; Pages deploys in ~1-2 min).
   **Commit message rule (every commit): never add a `Co-Authored-By:` trailer** (nor any other attribution/"Generated with" line). The message is just the subject (and optional body) written by the user's convention; this overrides any default attribution behaviour.
4. Confirm (after the approved push): `curl -s https://kamaludin68.github.io/islamic-learning/sw.js | head -1` shows the new version.
5. Manual check on Chrome Android: reload twice, "Install App" button appears (unless already installed; then use menu -> Install app), tabs and sub-tabs switch, offline reload works.

Install requirements: manifest with `name`, `start_url`, `display: standalone`, 192 + 512 icons; active SW; HTTPS. `beforeinstallprompt` is Chromium only; iOS uses Share -> Add to Home Screen.
