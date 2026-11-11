// Setiap teks Arab dalil/bacaan wajib punya arti per kata yang jumlahnya sejajar dengan kata Arabnya.
// Usage: node .claude/skills/verify-site/check-words.mjs (dari root repo)
import fs from 'fs';
import { pathToFileURL } from 'url';

const imp = (p) => import(pathToFileURL(process.cwd() + '/' + p).href);
const { arabKey, dalilWordsFor } = await imp('js/words.js');
const { ragamBacaan } = await imp('js/data/ragam.js');
const { ragamWords } = await imp('js/data/ragam-words.js');
const { bacaanSholatWords, sholatStepsData } = await imp('js/data/sholat.js');

const problems = [];
const check = (where, arab, words) => {
    const n = arabKey(arab).split(' ').length;
    if (n < 2) return; // satu kata = sel grid arti per kata itu sendiri
    if (!words) problems.push(`tanpa arti per kata: ${where}: ${arabKey(arab).slice(0, 50)}`);
    else if (words.length !== n) problems.push(`jumlah kata ${words.length}/${n}: ${where}`);
};

// Ragam: ragamWords per id; Bacaan: grid words milik kartu sendiri
for (const g of ragamBacaan) for (const v of g.items) if (v.arab) check('ragam ' + v.id, v.arab, ragamWords[v.id]);
for (const b of bacaanSholatWords) if (!b.words?.length) problems.push('bacaan tanpa words: ' + b.title);

// Dalil lain: dicari di dalilWords lewat teks Arabnya
for (const s of sholatStepsData) if (s.matan?.arab) check('gerakan ' + s.title, s.matan.arab, dalilWordsFor(s.matan.arab));
const walk = (o, where) => {
    if (Array.isArray(o)) o.forEach(x => walk(x, where));
    else if (o && typeof o === 'object') {
        if (typeof o.arab === 'string' && o.arab) check(where, o.arab, dalilWordsFor(o.arab));
        Object.values(o).forEach(v => walk(v, where));
    }
};
for (const f of ['syarat', 'pembatal', 'wudhu']) walk(Object.values(await imp(`js/data/${f}.js`)), f);

// Statis di index.html (lewati yang data-words, yaitu sudah punya grid sendiri)
const html = fs.readFileSync('index.html', 'utf8');
for (const m of html.matchAll(/<p\b([^>]*\bfont-arabic\b[^>]*)>([^<]*)<\/p>/g)) {
    if (!/dir="rtl"/.test(m[1]) || /data-words=/.test(m[1])) continue;
    const line = html.slice(0, m.index).split('\n').length;
    check('index.html:' + line, m[2], dalilWordsFor(m[2]));
}

problems.forEach(p => console.log('WORDS:', p));
console.log('arti per kata:', problems.length ? problems.length + ' masalah' : 'ok');
process.exit(problems.length ? 1 : 0);
