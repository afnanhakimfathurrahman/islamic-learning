# AGENTS.md

Static PWA (single `index.html`, no build) for Islamic prayer and wudhu guidance, hosted on GitHub Pages.

- Read `SPECIFICATION.md` first: architecture, DOM ID contract, content rules, PWA notes.
- Task playbooks: `.claude/skills/*/SKILL.md` (add-dalil, add-subtab, pwa-release, verify-site).
- Before every push run `bash .claude/skills/verify-site/check.sh`.
- Hard rules: never alter or invent dalil text (matan/translation/source); bump `CACHE_NAME` in `sw.js` when `index.html` or assets change; keep faceless avatars; keep IDs in sync with JS.
