---
name: verify-site
description: Run static checks (manifest JSON, inline JS and sw.js syntax, getElementById and tab ID cross-check, SW precache files) before committing or pushing changes to the Islamic learning PWA.
---

# verify-site

Run from anywhere in the repo:

```bash
bash .claude/skills/verify-site/check.sh
```

Expect `RESULT: PASS`. On `MISSING id:` fix the HTML/JS ID mismatch (see SPECIFICATION.md 5.1). The script does not render the page, so also open the live or local page and click every tab and sub-tab when you changed navigation.
