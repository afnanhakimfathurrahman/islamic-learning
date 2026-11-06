---
name: add-dalil
description: Add a Quran verse or hadith card (matan, translation, source) to the app so that it is searchable and bookmarkable. Use when adding or editing Islamic textual content.
---

# add-dalil

1. **Source text is not yours to write.** Take matan, translation, and reference from the user or Rumaysho.com. If unsure, ask; never reconstruct a hadith from memory.
2. Find the right panel in `index.html` or the data module in `js/data/` (`syarat.js`, `sholat.js`, `pembatal.js`, `ragam.js`, `info.js`) (`content-home`, `content-syarat`, `content-wudhu` sub-panels, `content-pembatal`) or the data array (`syaratData`, `pembatalData`, ...) that a `render*` function turns into cards.
3. Copy an existing card, keeping: `search-item` class, Arabic in an element with `arabic-size` + `dir="rtl"`, Indonesian translation, and source line (Surah:Ayat, or collector + number). Use `<details>` for long matan. Give bookmarkable cards a unique id used by `bookmarkItem(id)` and `bm-<id>`.
4. Mirror the change in `SPECIFICATION.md` section 4.3.
5. Bump `CACHE_NAME` in `sw.js`, run `verify-site`, then stop. Do NOT commit or push; leave changes uncommitted so the user can review first.
