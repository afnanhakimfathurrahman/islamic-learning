#!/usr/bin/env node
// Membuat halaman per bagian untuk SEO dari index.html + js/data/routes.js:
//   - index.html          : <title>, meta description, canonical, Open Graph/Twitter, daftar isi #route-links
//   - <slug>/index.html   : salinan index.html dengan meta sendiri, <base href="../"> dan tab/sub-tab bagian itu terbuka
//   - sitemap.xml         : semua URL
// Pakai: node scripts/build-pages.mjs           (tulis file)
//        node scripts/build-pages.mjs --check   (gagal bila ada file yang belum diperbarui; dipakai verify-site)
// Jalankan ulang setiap kali index.html atau js/data/routes.js berubah. Jangan edit <slug>/index.html langsung.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { ROUTES, SITE_URL } = await import(pathToFileURL(join(ROOT, 'js/data/routes.js')).href);
const CHECK = process.argv.includes('--check');
const GENERATED_NOTE = '<!-- DIBUAT OTOMATIS oleh scripts/build-pages.mjs dari index.html + js/data/routes.js. Jangan diedit langsung. -->';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pageUrl = (route) => SITE_URL + (route.slug ? route.slug + '/' : '');

function replaceOne(html, re, make, what) {
    if (!re.test(html)) throw new Error(`index.html: ${what} tidak ditemukan`);
    return html.replace(re, make);
}

function setMeta(html, route) {
    const url = pageUrl(route), title = esc(route.title), desc = esc(route.description);
    html = replaceOne(html, /<title>[^<]*<\/title>/, () => `<title>${title}</title>`, '<title>');
    html = replaceOne(html, /<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${desc}">`, 'meta description');
    html = replaceOne(html, /<link rel="canonical" href="[^"]*">/, () => `<link rel="canonical" href="${url}">`, 'canonical');
    html = replaceOne(html, /<meta property="og:url" content="[^"]*">/, () => `<meta property="og:url" content="${url}">`, 'og:url');
    html = replaceOne(html, /<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${title}">`, 'og:title');
    html = replaceOne(html, /<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${desc}">`, 'og:description');
    html = replaceOne(html, /<meta name="twitter:title" content="[^"]*">/, () => `<meta name="twitter:title" content="${title}">`, 'twitter:title');
    html = replaceOne(html, /<meta name="twitter:description" content="[^"]*">/, () => `<meta name="twitter:description" content="${desc}">`, 'twitter:description');
    return html;
}

function setRouteLinks(html) {
    const links = ROUTES.map((r) =>
        `                <a href="${r.slug ? r.slug + '/' : './'}" data-route="${r.slug}" class="hover:text-gold-400 hover:underline">${esc(r.label)}</a>`
    ).join('\n');
    return replaceOne(html, /(<nav id="route-links"[^>]*>)[\s\S]*?(\n[ \t]*<\/nav>)/, (_, open, close) => `${open}\n${links}${close}`, 'nav#route-links');
}

// Tambah/hapus kelas "hidden" pada elemen ber-id tertentu (agar bagian yang benar tampil sebelum JS berjalan)
function setHidden(html, id, hide) {
    const re = new RegExp(`(<[a-z]+\\s+id="${id}"\\s+class=")([^"]*)(")`);
    return replaceOne(html, re, (_, a, cls, z) => {
        const list = cls.split(/\s+/).filter((c) => c && c !== 'hidden');
        if (hide) list.splice(1, 0, 'hidden');
        return a + list.join(' ') + z;
    }, `#${id}`);
}

function subPage(base, route) {
    let html = setMeta(base, route);
    html = replaceOne(html, /<!DOCTYPE html>\n/i, (m) => m + GENERATED_NOTE + '\n', 'doctype');
    html = replaceOne(html, /(<meta charset="UTF-8">\n)/, (m) => m + '    <base href="../">\n', 'meta charset');
    html = setHidden(html, 'content-home', true);
    html = setHidden(html, `content-${route.tab}`, false);
    if (route.wudhu) {
        html = setHidden(html, 'wudhu-sub-langkah', true);
        html = setHidden(html, `wudhu-sub-${route.wudhu}`, false);
    }
    if (route.sholat) {
        html = setHidden(html, 'sholat-gerakan-container', true);
        html = setHidden(html, `${route.sholat}-container`, false);
    }
    if (route.anchor && !html.includes(`id="${route.anchor}"`)) throw new Error(`anchor #${route.anchor} tidak ada di index.html`);
    return html;
}

function sitemap() {
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        ROUTES.map((r) => `  <url>\n    <loc>${pageUrl(r)}</loc>\n  </url>\n`).join('') + '</urlset>\n';
}

// --- main ---
const indexPath = join(ROOT, 'index.html');
const raw = readFileSync(indexPath, 'utf8');
const nl = raw.includes('\r\n') ? '\r\n' : '\n';
const withNl = (s) => (nl === '\n' ? s : s.replace(/\n/g, nl));

const base = setRouteLinks(setMeta(raw.replace(/\r\n/g, '\n'), ROUTES[0]));
const outputs = [[indexPath, withNl(base)], [join(ROOT, 'sitemap.xml'), sitemap()]];
for (const route of ROUTES.slice(1)) outputs.push([join(ROOT, route.slug, 'index.html'), withNl(subPage(base, route))]);

// Setiap halaman turunan harus di-precache service worker agar bisa dibuka offline
const sw = readFileSync(join(ROOT, 'sw.js'), 'utf8');
const missingSw = ROUTES.slice(1).filter((r) => !sw.includes(`'./${r.slug}/'`)).map((r) => `'./${r.slug}/'`);
if (missingSw.length) {
    console.log('pages: tambahkan ke ASSETS_TO_CACHE di sw.js ->', missingSw.join(', '));
    process.exitCode = 1;
}

const stale = [];
for (const [path, content] of outputs) {
    const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
    // Abaikan beda CRLF/LF (core.autocrlf di Windows)
    if (current !== null && current.replace(/\r\n/g, '\n') === content.replace(/\r\n/g, '\n')) continue;
    const rel = path.slice(ROOT.length + 1).replace(/\\/g, '/');
    if (CHECK) { stale.push(rel); continue; }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
    console.log('ditulis:', rel);
}
if (CHECK) {
    if (stale.length) {
        console.log('pages: BELUM DIPERBARUI ->', stale.join(', '), '\n       jalankan: node scripts/build-pages.mjs');
        process.exit(1);
    }
    if (!process.exitCode) console.log(`pages: ${ROUTES.length} halaman up to date`);
} else {
    console.log(`selesai: ${ROUTES.length} halaman`);
}
