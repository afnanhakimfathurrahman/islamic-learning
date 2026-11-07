---
name: add-subtab
description: Add a main tab or a wudhu sub-tab to the SPA without breaking the ID contract between buttons, panels and JS.
---

# add-subtab

**Wudhu sub-tab `<name>`** needs all of:
- button `id="sub-wudhu-<name>"`, class `wudhu-sub-btn` + the pill classes copied from an inactive sibling, `onclick="switchWudhuSub('wudhu-<name>')"`;
- panel `id="wudhu-sub-<name>"`, class `wudhu-sub-content hidden space-y-4`.

**Main tab `<id>`** needs: `tab-<id>` button (`switchTab('<id>')`), `mob-tab-<id>` in the mobile nav, panel `content-<id>` with class `tab-content hidden`.

Rules: no underline (`border-b-2`) tabs in scrolling bars; never call `.classList` on an unchecked `getElementById`. Update SPECIFICATION.md 4.1/5.1, bump `CACHE_NAME`, run `verify-site`, and click through all tabs. Search mode un-hides every `wudhu-sub-content`, so new panels should contain `search-item` cards to be searchable.

**Own URL (SEO)**: if the new tab/sub-tab deserves its own search-indexed page, add an entry to `js/data/routes.js` (slug, tab, `wudhu`/`sholat` sub, label, title, description), add `'./<slug>/'` to `ASSETS_TO_CACHE` in `sw.js`, then run `node scripts/build-pages.mjs` (SPECIFICATION.md 5.5). Any `index.html` change needs the generator re-run anyway.
