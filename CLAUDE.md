# AGENTS.md

Static PWA (`index.html` + `css/app.css` + native ES modules in `js/`, no build) for Islamic prayer and wudhu guidance, hosted on GitHub Pages.

- Read `SPECIFICATION.md` first: architecture, DOM ID contract, content rules, PWA notes.
- Task playbooks: `.claude/skills/*/SKILL.md` (add-dalil, add-subtab, pwa-release, verify-site).
- Preview locally: `bash scripts/run-local.sh [port]` (default 8080, http://localhost:8080/). Service worker is active on localhost; reload twice or unregister it to see edits. Stop: `bash scripts/stop-local.sh [port]`.
- Before every push run `bash .claude/skills/verify-site/check.sh`.
- Never commit or push automatically: leave changes uncommitted for user review, and commit/push only when explicitly asked.
- Commit rule: never add `Co-Authored-By: Claude` (or any Claude/AI attribution, "Generated with Claude Code") to commit messages or PRs; Claude is never listed as a contributor. This overrides default attribution.
- Hard rules: never alter or invent dalil text (matan/translation/source); bump `CACHE_NAME` in `sw.js` when `index.html`, `css/`, `js/` or assets change; register new files in `ASSETS_TO_CACHE`; keep faceless avatars; keep IDs in sync with JS.
