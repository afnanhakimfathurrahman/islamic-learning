---
name: verify-site
description: Run static checks (manifest JSON, JS module and sw.js syntax, window-exposed onclick handlers, getElementById and tab ID cross-check, SW precache files) before committing or pushing changes to the Islamic learning PWA.
---

# verify-site

Run from anywhere in the repo:

```bash
bash .claude/skills/verify-site/check.sh
```

Expect `RESULT: PASS` followed by `pages: N halaman up to date`. If it says `BELUM DIPERBARUI`, run `node scripts/build-pages.mjs` (index.html or js/data/routes.js changed without regenerating the SEO pages). On `MISSING id:` fix the HTML/JS ID mismatch (see SPECIFICATION.md 5.1). The script does not render the page, so also open the live or local page and click every tab and sub-tab when you changed navigation.
