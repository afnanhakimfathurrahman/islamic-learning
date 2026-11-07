---
name: add-quiz-question
description: Add or edit multiple-choice, fill-in, true/false, ordering or matching questions in the quiz bank (quizBank in js/data/quiz.js). Use when expanding the Kuis tab.
---

# add-quiz-question

Questions live in `quizBank` inside `js/data/quiz.js`, built with helpers (see the comment above `const mc`).

**Hard rule:** every question must come from content already shown in the app (dalil, steps, per-word meanings). Do not introduce new hadith, rulings, or numbers via the quiz. `src` must name the app section/dalil it is based on, and `exp` should restate the app text.

**Arabic rule:** any question about a doa or recitation that has Arabic text in the app must show the Arabic (copied exactly from the app), not only the Latin transliteration. Put the Arabic in the question text or options (alongside the Latin if useful), in an element with `dir="rtl"` and the Arabic font. Never write Arabic from memory; copy it from the app's existing card.

| Type | Helper | Notes |
|---|---|---|
| Pilihan ganda | `mc(id, topik, lvl, q, [benar, salah, salah, salah], exp, src)` | The correct answer is ALWAYS first in the array; it is shuffled at runtime. Exactly 4 unique options. |
| Lengkapi bacaan | `fill(..., ar)` | `ar` is the Arabic sentence containing `____`; options are Arabic words. |
| Benar/Salah | `tf(id, topik, lvl, pernyataan, true\|false, exp, src)` | False statements must be a direct negation of app content. |
| Susun urutan | `order(id, topik, lvl, q, [items in correct order], exp, src)` | 3-8 unique items. |
| Pasangkan arti | `match(id, topik, lvl, q, [[kiri, kanan] x4], exp, src)` | Use pairs from the per-word tables; right sides unique. |

`lvl`: 1 = mudah, 2 = sedang, 3 = sulit (higher quiz levels draw more lvl 3). IDs must be unique. Keep roughly the existing mix (a round needs 4 mc, 2 fill, 1 tf, 2 order, 1 match) and enough questions that rounds do not repeat.

Then run `bash .claude/skills/verify-site/check.sh` (it validates the bank), bump `CACHE_NAME`, and update SPECIFICATION.md if rules change. Ask the user to review new questions before publishing, as with any dalil.

Commit rule: never add `Co-Authored-By: Claude` (or any Claude/AI attribution, "Generated with Claude Code") to commit messages or PRs; Claude is never listed as a contributor. This overrides default attribution.
