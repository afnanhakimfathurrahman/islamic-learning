import { bookmarkListHtml, bookmarkedIds, describe, setBookmarksRenderer } from './bookmarks.js';
import { ragamWords } from './data/ragam-words.js';
import { bacaanSholatWords } from './data/sholat.js';
import { switchTab } from './nav.js';
import { arabKey, dalilWordsFor } from './words.js';

/* =============================================================
   HAFALAN: kartu favorit yang berisi teks Arab menjadi bahan hafalan.
   - Status per teks (Baru / Sedang dihafal / Hafal) dari kotak Leitner 0-5
   - Ulangan berjarak: Lupa -> besok, Ragu -> besok (kotak tetap), Hafal -> naik kotak
   - Mode latihan: Kartu, Tutup bertahap, Per potongan, Susun kata, Rekam suara
   - Streak harian, target harian, lencana jumlah ulangan dan pengingat (Periodic Background Sync)
   Teks dalil tidak diubah: semua mode hanya mengatur tampilan teks yang sudah ada di kartu.
============================================================= */

const STORE_KEY = 'sholat_hafalan';
const INTERVALS = [0, 1, 3, 7, 14, 30]; // hari sampai ulangan berikutnya per kotak
const META_CACHE = 'hafalan-meta';     // dibaca sw.js untuk pengingat; tidak ikut dihapus saat CACHE_NAME naik
const META_URL = new URL('hafalan-state.json', document.baseURI).href; // akar situs, juga dari halaman per bagian

const esc = (str) => String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const textOf = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

/* ---------- Tanggal (zona waktu lokal) ---------- */
const ymd = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
const daysUntil = (date) => Math.round((new Date(date + 'T00:00') - new Date(ymd() + 'T00:00')) / 864e5);

function dueLabel(rec) {
    if (!rec || !rec.box) return 'Belum dilatih';
    const n = daysUntil(rec.due);
    if (n <= 0) return 'Ulang hari ini';
    if (n === 1) return 'Ulang besok';
    return `Ulang ${n} hari lagi`;
}

/* ---------- Penyimpanan ---------- */
function loadStore() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch (e) { s = {}; }
    return {
        items: s.items || {},
        streak: s.streak || { last: '', count: 0, best: 0 },
        day: s.day || { date: '', count: 0 },
        goal: s.goal || 5,
        remind: !!s.remind
    };
}

const store = loadStore();

function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* penyimpanan penuh/diblokir */ }
    writeReminderMeta();
}

/* ---------- Ulangan berjarak (Leitner) ---------- */
export const STATUS = {
    baru: ['Baru', 'bg-slate-100 text-slate-600 border-slate-200'],
    sedang: ['Sedang dihafal', 'bg-amber-50 text-amber-700 border-amber-200'],
    hafal: ['Hafal', 'bg-emerald-100 text-emerald-800 border-emerald-300']
};

const statusOf = (rec) => (!rec || !rec.box ? 'baru' : rec.box >= 4 ? 'hafal' : 'sedang');
const isDue = (rec) => !rec || !rec.box || daysUntil(rec.due) <= 0;

// Pratinjau jadwal tiap tombol nilai, mis. "besok" / "7 hari"
function nextInterval(rec, grade) {
    const box = rec?.box || 0;
    if (grade !== 'hafal') return 1;
    return INTERVALS[Math.min(5, box + 1)];
}

function grade(id, g) {
    const rec = store.items[id] || { box: 0, reviews: 0, lapses: 0 };
    const days = nextInterval(rec, g);
    if (g === 'lupa') { rec.box = 1; rec.lapses = (rec.lapses || 0) + 1; }
    else if (g === 'ragu') rec.box = Math.max(1, rec.box);
    else rec.box = Math.min(5, rec.box + 1);
    rec.due = addDays(days);
    rec.reviews = (rec.reviews || 0) + 1;
    rec.last = ymd();
    store.items[id] = rec;

    const today = ymd();
    if (store.day.date !== today) store.day = { date: today, count: 0 };
    store.day.count++;
    if (store.streak.last !== today) {
        store.streak.count = store.streak.last === addDays(-1) ? store.streak.count + 1 : 1;
        store.streak.last = today;
        store.streak.best = Math.max(store.streak.best || 0, store.streak.count);
    }
    save();
}

const streakNow = () => (store.streak.last === ymd() || store.streak.last === addDays(-1) ? store.streak.count : 0);
const todayCount = () => (store.day.date === ymd() ? store.day.count : 0);

/* ---------- Indeks teks Arab di kartu ---------- */
const PUNCT = /^[،؛؟.:\-ـۖ-ۜ]+$/;
const MARKS = /[ً-ٰٟۖ-ۭ]/;

let index = null; // Map id -> { id, bm, n, total, el, card }

function buildIndex() {
    index = new Map();
    document.querySelectorAll('.search-item[data-bm]').forEach(card => {
        const texts = [...card.querySelectorAll('.font-arabic[dir="rtl"]')].filter(el =>
            el.dataset.words !== 'off' && !el.closest('.words-block, .word-badge') && arabKey(el.textContent).split(' ').length >= 2);
        texts.forEach((el, n) => {
            const id = card.dataset.bm + (n ? '~' + n : '');
            index.set(id, { id, bm: card.dataset.bm, n, total: texts.length, el, card });
        });
    });
}

const getIndex = () => index || (buildIndex(), index);
const itemsOfBookmark = (bm) => [...getIndex().values()].filter(it => it.bm === bm);
const hafalanItems = () => bookmarkedIds.flatMap(itemsOfBookmark);

// Satuan kata: Arab per spasi (tanda baca digabung ke kata sebelumnya) + latin & arti bila ada datanya
function unitsOf(it) {
    if (it.units) return it.units;
    const text = arabKey(it.el.textContent);
    const tokens = text.split(' ');
    const bacaan = it.bm.startsWith('bacaan-') ? bacaanSholatWords[Number(it.bm.slice(7))] : null;
    if (bacaan?.words?.length && arabKey(bacaan.arabFull) === text) {
        // tab Bacaan: grid per kata/frasa milik kartu itu sendiri
        it.units = bacaan.words.map(w => ({ ar: w.ar, lat: w.lat, id: w.id }));
    } else {
        let words = dalilWordsFor(text) || (it.bm.startsWith('ragam-') ? ragamWords[it.bm.slice(6)] : null);
        if (words && words.length !== tokens.length) words = null;
        const units = [];
        tokens.forEach((ar, i) => {
            const w = words ? words[i] : null;
            if (units.length && (PUNCT.test(ar) || (w && !w[1]))) { units[units.length - 1].ar += ' ' + ar; units[units.length - 1].end = true; return; }
            units.push({ ar, lat: w ? w[0] : '', id: w ? w[1] : '' });
        });
        it.units = units;
    }
    it.units.forEach(u => { if (/[،.:؛]$/.test(u.ar)) u.end = true; });
    return it.units;
}

// Judul, label (mis. sumber dalil), latin dan terjemahan diambil dari kartu
function infoOf(it) {
    if (it.info) return it.info;
    const d = describe(it.bm) || { crumbs: [], title: it.bm };
    let label = '';
    for (let p = it.el.previousElementSibling; p; p = p.previousElementSibling) {
        const t = textOf(p);
        if (t && t.length <= 90 && !p.classList.contains('font-arabic') && !/^Derajat/.test(t)) { label = t; break; }
    }
    const after = [];
    for (let n = it.el.nextElementSibling; n && n.tagName === 'P' && !n.classList.contains('font-arabic'); n = n.nextElementSibling) after.push(n);
    // dari tanda kutip pertama sampai terakhir (terjemahan bisa memuat dialog bertanda kutip)
    const quoted = after.map(textOf).map(t => (t.match(/"(.{8,})"/) || [])[1]).find(Boolean);
    const translation = quoted || textOf(after.find(p => p.classList.contains('italic'))).replace(/^"|"$/g, '');
    const latinP = after.find(p => p.classList.contains('font-semibold') && !textOf(p).includes('"'));
    const units = unitsOf(it);
    const latin = textOf(latinP) || (units.every(u => u.lat) ? units.map(u => u.lat).join(' ') : '');
    it.info = { crumbs: d.crumbs || [], title: d.title, label: it.total > 1 ? label : (label !== d.title ? label : ''), latin, translation };
    return it.info;
}

// Huruf awal sebagai petunjuk; untuk kata ber-"al" (mis. ٱلصَّلَوٰة, وَالْمُنكَرِ) huruf setelah lam ikut ditampilkan
function firstLetter(w) {
    const clusters = [];
    for (const ch of w) {
        if (MARKS.test(ch) && clusters.length) clusters[clusters.length - 1] += ch;
        else clusters.push(ch);
    }
    const base = clusters.map(c => c[0]).join('');
    const n = /^[اٱ]ل/.test(base) ? 3 : /^[وفبلك][اٱ]ل/.test(base) ? 4 : 1;
    return clusters.slice(0, n).join('');
}

// Potongan: berhenti di tanda baca, atau tiap 5 kata bila kalimatnya panjang
function chunksOf(units) {
    const chunks = []; let cur = [];
    units.forEach((u, i) => { cur.push(i); if (u.end || cur.length >= 5) { chunks.push(cur); cur = []; } });
    if (cur.length) chunks.push(cur);
    return chunks;
}

// Bagian susun kata: potongan digabung selama totalnya <= 8 kata
function sectionsOf(units) {
    const out = [];
    chunksOf(units).forEach(c => {
        const last = out[out.length - 1];
        if (last && last.length + c.length <= 8) last.push(...c); else out.push([...c]);
    });
    return out;
}

/* =============================================================
   TAB HAFALAN (#bookmarks-container)
============================================================= */
const ui = { filter: 'semua' };

const FILTERS = [['semua', 'Semua'], ['ulang', 'Perlu diulang'], ['baru', 'Baru'], ['sedang', 'Sedang'], ['hafal', 'Hafal']];

function boxDots(rec) {
    const box = rec?.box || 0;
    return `<span class="inline-flex gap-0.5" aria-label="Kotak ${box} dari 5">${[1, 2, 3, 4, 5].map(b => `<span class="h-1.5 w-3 rounded-full ${b <= box ? 'bg-emerald-600' : 'bg-slate-200'}"></span>`).join('')}</span>`;
}

function itemRowHtml(it) {
    const rec = store.items[it.id];
    const st = statusOf(rec);
    const info = infoOf(it);
    const preview = arabKey(it.el.textContent);
    return `
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="p-4">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS[st][1]}">${STATUS[st][0]}</span>
                    <span class="text-[11px] font-semibold text-gold-600">${esc(info.crumbs.join(' › '))}</span>
                </div>
                <p class="mt-1 text-sm font-bold leading-snug text-emerald-900">${esc(info.title)}</p>
                ${info.label ? `<p class="text-[11px] text-slate-500">${esc(info.label)}</p>` : ''}
                <p class="mt-2 truncate font-arabic text-lg text-emerald-950" dir="rtl">${esc(preview)}</p>
                <div class="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>${dueLabel(rec)}${rec?.reviews ? ` · ${rec.reviews}x dilatih` : ''}</span>
                    ${boxDots(rec)}
                </div>
            </div>
            <div class="flex border-t border-slate-100 text-xs font-semibold">
                <button type="button" data-hf-start="${esc(it.id)}" class="flex-1 py-2.5 text-white bg-emerald-800 hover:bg-emerald-700 transition"><i class="fa-solid fa-brain mr-1"></i> Latihan</button>
                <button type="button" data-bm-go="${esc(it.bm)}" class="flex-1 py-2.5 text-emerald-800 hover:bg-emerald-50 transition"><i class="fa-solid fa-arrow-up-right-from-square mr-1"></i> Buka</button>
                <button type="button" data-bm-del="${esc(it.bm)}" aria-label="Hapus dari favorit" class="w-12 border-l border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"><i class="fa-regular fa-trash-can"></i></button>
            </div>
        </div>`;
}

function renderHafalan() {
    const container = document.getElementById('bookmarks-container');
    if (!container) return;
    updateNavBadge();
    if (bookmarkedIds.length === 0) {
        container.innerHTML = `<div class="bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-200">
            <i class="fa-regular fa-bookmark text-3xl text-gold-500 mb-2"></i>
            <p class="font-semibold text-emerald-900">Belum ada hafalan atau favorit</p>
            <p class="text-sm mt-1">Ketuk ikon bookmark di sudut kartu bacaan, doa, atau dalil mana pun. Kartu yang berisi teks Arab otomatis masuk daftar hafalan, lengkap dengan latihan dan jadwal ulangan.</p>
        </div>`;
        return;
    }

    const items = hafalanItems();
    const withText = new Set(items.map(it => it.bm));
    const others = bookmarkedIds.filter(id => !withText.has(id));
    const count = { baru: 0, sedang: 0, hafal: 0 };
    items.forEach(it => count[statusOf(store.items[it.id])]++);
    const due = items.filter(it => isDue(store.items[it.id]));
    const pct = items.length ? Math.round(count.hafal / items.length * 100) : 0;
    const done = todayCount();
    const shown = items.filter(it => {
        const rec = store.items[it.id];
        return ui.filter === 'semua' || (ui.filter === 'ulang' ? isDue(rec) : statusOf(rec) === ui.filter);
    });

    container.innerHTML = `
        ${items.length ? `
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="rounded-xl bg-slate-50 p-2"><p class="text-xl font-bold text-slate-700">${count.baru}</p><p class="text-[11px] text-slate-500">Baru</p></div>
                <div class="rounded-xl bg-amber-50 p-2"><p class="text-xl font-bold text-amber-700">${count.sedang}</p><p class="text-[11px] text-amber-700">Sedang dihafal</p></div>
                <div class="rounded-xl bg-emerald-50 p-2"><p class="text-xl font-bold text-emerald-800">${count.hafal}</p><p class="text-[11px] text-emerald-700">Hafal</p></div>
            </div>
            <div>
                <div class="flex justify-between text-[11px] font-semibold text-slate-500"><span>${count.hafal} dari ${items.length} sudah hafal</span><span>${pct}%</span></div>
                <div class="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-emerald-600 transition-all" style="width:${pct}%"></div></div>
            </div>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span><i class="fa-solid fa-fire text-orange-500 mr-1"></i><strong>${streakNow()}</strong> hari beruntun${store.streak.best ? ` <span class="text-slate-400">(terbaik ${store.streak.best})</span>` : ''}</span>
                <span><i class="fa-solid fa-bullseye text-gold-500 mr-1"></i>Hari ini <strong>${done}</strong>/
                    <select data-hf-goal aria-label="Target ulangan harian" class="rounded border border-slate-200 bg-white px-1 py-0.5 text-xs">${[3, 5, 10, 20].map(g => `<option value="${g}" ${g === store.goal ? 'selected' : ''}>${g}</option>`).join('')}</select> ulangan
                    ${done >= store.goal ? '<i class="fa-solid fa-circle-check text-emerald-600 ml-1" title="Target tercapai"></i>' : ''}</span>
            </div>
            ${due.length ? `
            <button type="button" data-hf-session class="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700 transition">
                <i class="fa-solid fa-play mr-1"></i> Mulai ulangan hari ini (${due.length})
            </button>` : `
            <p class="rounded-xl bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-800"><i class="fa-solid fa-circle-check mr-1"></i> Tidak ada ulangan hari ini. Mantap, sampai jumpa besok!</p>`}
            ${reminderHtml()}
        </div>

        <div class="hf-noscroll flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Saring hafalan">
            ${FILTERS.map(([k, label]) => {
                const n = k === 'semua' ? items.length : k === 'ulang' ? due.length : count[k];
                return `<button type="button" data-hf-filter="${k}" role="tab" aria-selected="${ui.filter === k}" class="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${ui.filter === k ? 'bg-emerald-800 text-white border-emerald-800 hf-on' : 'bg-white text-slate-600 border-slate-200'}">${label} (${n})</button>`;
            }).join('')}
        </div>

        <div class="space-y-3">
            ${shown.length ? shown.map(itemRowHtml).join('') : '<p class="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">Tidak ada hafalan di kategori ini.</p>'}
        </div>` : ''}

        ${others.length ? `
        <div class="space-y-3">
            <h3 class="px-1 text-sm font-bold text-emerald-900"><i class="fa-solid fa-bookmark text-gold-500 mr-1"></i> Favorit lainnya <span class="text-xs font-normal text-slate-500">(tanpa teks Arab untuk dihafal)</span></h3>
            ${bookmarkListHtml(others)}
        </div>` : ''}

        <div class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-emerald-800">
            <span><strong>${bookmarkedIds.length}</strong> kartu tersimpan</span>
            <button type="button" data-bm-clear class="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"><i class="fa-regular fa-trash-can mr-1"></i> Hapus semua</button>
        </div>`;
}

// Lencana jumlah ulangan hari ini di menu Hafalan (atas & bawah)
function updateNavBadge() {
    const n = hafalanItems().filter(it => isDue(store.items[it.id])).length;
    ['tab-bookmarks', 'mob-tab-bookmarks'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        let badge = btn.querySelector('.hf-nav-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'hf-nav-badge';
            btn.classList.add('relative');
            btn.appendChild(badge);
        }
        badge.textContent = n > 99 ? '99+' : n;
        badge.hidden = !n;
        badge.setAttribute('aria-label', `${n} hafalan perlu diulang`);
    });
}

/* =============================================================
   PENGINGAT HARIAN
   Notifikasi terjadwal memakai Periodic Background Sync (Chrome/Edge, aplikasi terpasang).
   sw.js membaca ringkasan jadwal dari Cache Storage (META_CACHE) karena SW tidak bisa membaca localStorage.
============================================================= */
const reminder = { support: 'unknown' };

function reminderHtml() {
    const on = store.remind;
    const note = !on ? 'Dapatkan notifikasi saat ada hafalan yang perlu diulang.'
        : reminder.support === 'background' ? 'Aktif: notifikasi muncul sekali sehari saat ada ulangan.'
        : reminder.support === 'denied' ? 'Izin notifikasi ditolak. Aktifkan di pengaturan situs browser.'
        : 'Browser ini belum mendukung pengingat terjadwal (hanya Chrome/Edge dengan aplikasi terpasang). Jumlah ulangan tetap tampil sebagai lencana di menu Hafalan.';
    return `
            <label class="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-xs text-slate-600">
                <input type="checkbox" data-hf-remind ${on ? 'checked' : ''} class="mt-0.5 h-4 w-4 accent-emerald-700">
                <span><span class="font-semibold text-emerald-900"><i class="fa-regular fa-bell mr-1"></i>Pengingat harian</span><br>${note}</span>
            </label>`;
}

async function writeReminderMeta() {
    if (!('caches' in window)) return;
    try {
        const ids = hafalanItems().map(it => it.id);
        const dues = ids.map(id => { const r = store.items[id]; return r && r.box ? r.due : ''; });
        const cache = await caches.open(META_CACHE);
        const prev = await cache.match(META_URL).then(r => (r ? r.json() : {})).catch(() => ({}));
        await cache.put(META_URL, new Response(JSON.stringify({ remind: store.remind, dues, notified: prev.notified || '' }), { headers: { 'content-type': 'application/json' } }));
    } catch (e) { /* Cache Storage tidak tersedia */ }
}

async function setupReminder(enable) {
    store.remind = enable;
    if (enable) {
        if (!('Notification' in window)) reminder.support = 'none';
        else {
            const perm = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
            if (perm !== 'granted') reminder.support = 'denied';
            else reminder.support = await registerPeriodic() ? 'background' : 'none';
        }
    } else {
        reminder.support = 'unknown';
        try {
            const reg = await navigator.serviceWorker?.ready;
            if (reg?.periodicSync) await reg.periodicSync.unregister('hafalan-reminder');
        } catch (e) { /* abaikan */ }
    }
    save();
    renderHafalan();
}

async function registerPeriodic() {
    try {
        const reg = await navigator.serviceWorker?.ready;
        if (!reg || !('periodicSync' in reg)) return false;
        const st = await navigator.permissions.query({ name: 'periodic-background-sync' });
        if (st.state !== 'granted') return false;
        await reg.periodicSync.register('hafalan-reminder', { minInterval: 12 * 60 * 60 * 1000 });
        return true;
    } catch (e) { return false; }
}

/* =============================================================
   LATIHAN (overlay #hafalan-practice)
============================================================= */
const MODES = [
    ['kartu', 'Kartu', 'fa-clone'],
    ['tutup', 'Tutup', 'fa-eye-slash'],
    ['potongan', 'Potongan', 'fa-layer-group'],
    ['susun', 'Susun', 'fa-shuffle'],
    ['rekam', 'Rekam', 'fa-microphone']
];
const LEVELS = ['Semua terlihat', 'Tutup sebagian', 'Huruf awal', 'Tutup semua'];

let ps = null; // status latihan yang sedang berjalan

function freshItemState(mode) {
    return { mode, shown: false, level: 1, hint: true, revealed: new Set(), step: 1, test: false, section: 0, pool: null, answer: [], checked: false, recUrl: '', recording: false, hideWhileRec: true };
}

function openPractice(ids, session) {
    if (!ids.length) return;
    ps = { queue: ids, pos: 0, session, graded: [], ...freshItemState('kartu') };
    let overlay = document.getElementById('hafalan-practice');
    if (!overlay) {
        document.body.insertAdjacentHTML('beforeend', '<div id="hafalan-practice" class="hidden fixed inset-0 z-[60] flex-col bg-slate-50" role="dialog" aria-modal="true" aria-label="Latihan hafalan"></div>');
        overlay = document.getElementById('hafalan-practice');
    }
    overlay.classList.replace('hidden', 'flex');
    document.body.style.overflow = 'hidden';
    renderPractice();
}

function closePractice() {
    stopRecording();
    if (ps?.recUrl) URL.revokeObjectURL(ps.recUrl);
    ps = null;
    const overlay = document.getElementById('hafalan-practice');
    if (overlay) { overlay.classList.replace('flex', 'hidden'); overlay.innerHTML = ''; }
    document.body.style.overflow = '';
    renderHafalan();
}

const currentItem = () => getIndex().get(ps.queue[ps.pos]);

function switchMode(mode) {
    stopRecording();
    if (ps.recUrl) URL.revokeObjectURL(ps.recUrl);
    Object.assign(ps, freshItemState(mode));
    renderPractice();
}

// Teks Arab per satuan kata; hidden(i) menentukan kata yang ditutup (kecuali sudah diketuk)
function arabicHtml(units, idxs, hidden, opts = {}) {
    return `<p class="font-arabic arabic-size leading-[2.4] text-right text-emerald-950" dir="rtl">${idxs.map(i => {
        const u = units[i];
        if (!hidden(i) || ps.revealed.has(i)) return `<span class="hf-word ${opts.focus?.has(i) ? 'hf-word-focus' : ''}">${esc(u.ar)}</span>`;
        const inner = opts.first ? `${esc(firstLetter(u.ar))}…` : (ps.hint && u.id ? `<span class="hf-hint" dir="ltr">${esc(u.id)}</span>` : '<span aria-hidden="true">• • •</span>');
        return `<button type="button" class="hf-gap" data-hf-reveal="${i}" aria-label="Tampilkan kata ${i + 1}">${inner}</button>`;
    }).join(' ')}</p>`;
}

function meaningsHtml(units, idxs) {
    const list = idxs.filter(i => units[i].id || units[i].lat);
    if (!list.length) return '';
    return `<div class="mt-3 flex flex-wrap gap-2" dir="rtl">${list.map(i => `
        <div class="word-badge rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-center flex-1 min-w-[84px] max-w-[150px]" dir="ltr">
            <p class="font-arabic text-lg font-bold text-emerald-950" dir="rtl">${esc(units[i].ar)}</p>
            ${units[i].lat ? `<p class="text-[11px] font-semibold text-emerald-700 break-words">${esc(units[i].lat)}</p>` : ''}
            ${units[i].id ? `<p class="text-[11px] leading-snug text-slate-600 break-words">${esc(units[i].id)}</p>` : ''}
        </div>`).join('')}</div>`;
}

const all = (units) => units.map((_, i) => i);
const btn = (attrs, label, cls = 'border border-slate-200 bg-white text-emerald-800 hover:border-gold-400') =>
    `<button type="button" ${attrs} class="rounded-xl px-3 py-2 text-xs font-semibold transition ${cls}">${label}</button>`;

function modeKartu(it, units, info) {
    return `
        <div class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Coba baca dari ingatan</p>
            ${info.translation ? `<p class="rounded-xl bg-white border border-slate-200 p-4 text-sm italic leading-relaxed text-slate-700">"${esc(info.translation)}"</p>`
            : '<p class="text-sm text-slate-500">Ingat-ingat bacaan ini berdasarkan judulnya.</p>'}
            ${ps.shown ? `
            <div class="rounded-xl border border-emerald-200 bg-white p-4">
                ${arabicHtml(units, all(units), () => false)}
                ${info.latin ? `<p class="mt-2 text-xs font-semibold leading-relaxed text-emerald-800">${esc(info.latin)}</p>` : ''}
            </div>
            <p class="text-xs text-slate-500">Cocokkan dengan bacaanmu, lalu nilai di bawah.</p>`
            : `
            <button type="button" data-hf-show class="hf-cover w-full rounded-xl p-6 text-sm font-semibold text-emerald-900">
                <i class="fa-regular fa-eye mr-1"></i> Lihat bacaan
            </button>
            <button type="button" data-hf-peek class="text-xs font-semibold text-emerald-700 underline">${ps.revealed.size ? 'Tambah petunjuk satu kata' : 'Beri petunjuk kata pertama'}</button>
            ${ps.revealed.size ? `<div class="rounded-xl border border-slate-200 bg-white p-4">${arabicHtml(units, all(units), () => true)}</div>` : ''}`}
        </div>`;
}

function modeTutup(it, units) {
    const lv = ps.level;
    const hidden = lv === 0 ? () => false : lv === 1 ? (i) => i % 3 === 1 : () => true;
    return `
        <div class="space-y-3">
            <div class="flex flex-wrap gap-1.5">${LEVELS.map((l, i) => btn(`data-hf-level="${i}" aria-pressed="${lv === i}"`, l,
                lv === i ? 'bg-emerald-800 text-white border border-emerald-800 hf-on' : undefined)).join('')}</div>
            <label class="inline-flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" data-hf-hint ${ps.hint ? 'checked' : ''} class="accent-emerald-700"> Tampilkan arti sebagai petunjuk</label>
            <div class="rounded-xl border border-slate-200 bg-white p-4">${arabicHtml(units, all(units), hidden, { first: lv === 2 })}</div>
            <p class="text-xs text-slate-500">Baca sambil mengingat kata yang ditutup. Ketuk kotak untuk mengecek satu kata. Naikkan tingkatnya bila sudah lancar.</p>
            <div class="flex gap-2">${btn('data-hf-revealall', '<i class="fa-regular fa-eye mr-1"></i> Buka semua')}${btn('data-hf-resetreveal', '<i class="fa-solid fa-rotate-left mr-1"></i> Tutup lagi')}</div>
        </div>`;
}

function modePotongan(it, units) {
    const chunks = chunksOf(units);
    const k = Math.min(ps.step, chunks.length);
    const shown = chunks.slice(0, k).flat();
    const newest = new Set(chunks[k - 1]);
    return `
        <div class="space-y-3">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Potongan ${k} dari ${chunks.length}</span>
                <div class="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200"><div class="h-full bg-emerald-600" style="width:${k / chunks.length * 100}%"></div></div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
                ${arabicHtml(units, shown, () => ps.test, { focus: ps.test ? null : newest })}
                ${!ps.test ? meaningsHtml(units, [...newest]) : ''}
            </div>
            <p class="text-xs text-slate-500">${ps.test ? 'Bacakan dari awal sampai potongan ini tanpa melihat. Ketuk kotak untuk mengecek.'
                : 'Hafalkan potongan yang disorot, lalu baca ulang dari awal. Setelah lancar, uji dirimu atau tambah potongan berikutnya.'}</p>
            <div class="flex flex-wrap gap-2">
                ${k > 1 ? btn('data-hf-step="-1"', '<i class="fa-solid fa-arrow-right mr-1"></i> Sebelumnya') : ''}
                ${btn('data-hf-test', ps.test ? '<i class="fa-regular fa-eye mr-1"></i> Lihat lagi' : '<i class="fa-regular fa-eye-slash mr-1"></i> Uji ingatan')}
                ${k < chunks.length ? btn('data-hf-step="1"', 'Tambah potongan <i class="fa-solid fa-arrow-left ml-1"></i>', 'bg-emerald-800 text-white hover:bg-emerald-700')
                : '<span class="self-center text-xs font-semibold text-emerald-700"><i class="fa-solid fa-flag-checkered mr-1"></i>Semua potongan sudah. Uji dari awal!</span>'}
            </div>
        </div>`;
}

function shuffled(arr) {
    const a = [...arr];
    for (let t = 0; t < 5; t++) {
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        if (a.length < 2 || a.some((x, i) => x !== arr[i])) break;
    }
    return a;
}

function modeSusun(it, units) {
    const sections = sectionsOf(units);
    const sec = sections[Math.min(ps.section, sections.length - 1)];
    if (!ps.pool) { ps.pool = shuffled(sec); ps.answer = []; ps.checked = false; }
    const wrong = ps.checked ? ps.answer.filter((i, j) => units[i].ar !== units[sec[j]].ar).length : 0;
    const chip = (i, attr, cls) => `<button type="button" ${attr} class="hf-chip ${cls}"><span class="font-arabic text-xl" dir="rtl">${esc(units[i].ar)}</span>${ps.hint && units[i].id ? `<span class="block text-[10px] text-slate-500">${esc(units[i].id)}</span>` : ''}</button>`;
    return `
        <div class="space-y-3">
            ${sections.length > 1 ? `<div class="flex flex-wrap gap-1.5">${sections.map((_, s) => btn(`data-hf-section="${s}"`, `Bagian ${s + 1}`,
                s === ps.section ? 'bg-emerald-800 text-white border border-emerald-800 hf-on' : undefined)).join('')}</div>` : ''}
            <label class="inline-flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" data-hf-hint ${ps.hint ? 'checked' : ''} class="accent-emerald-700"> Tampilkan arti</label>
            <p class="text-xs text-slate-500">Ketuk kata sesuai urutan bacaan (kanan ke kiri). Ketuk kata di atas untuk mengembalikannya.</p>
            <div class="min-h-[64px] rounded-xl border-2 border-dashed border-emerald-300 bg-white p-2 flex flex-wrap gap-2" dir="rtl">
                ${ps.answer.map((i, j) => chip(i, `data-hf-unpick="${j}"`, ps.checked ? (units[i].ar === units[sec[j]].ar ? 'hf-chip-ok' : 'hf-chip-bad') : '')).join('')}
            </div>
            <div class="flex flex-wrap gap-2" dir="rtl">
                ${ps.pool.map((i, j) => chip(i, `data-hf-pick="${j}"`, '')).join('')}
            </div>
            ${ps.checked ? `<p class="rounded-xl p-3 text-sm font-semibold ${wrong ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}">
                ${wrong ? `<i class="fa-solid fa-circle-xmark mr-1"></i>${wrong} kata belum tepat posisinya. Ketuk kata merah untuk memperbaiki.` : '<i class="fa-solid fa-circle-check mr-1"></i>Urutannya benar semua!'}</p>` : ''}
            <div class="flex flex-wrap gap-2">
                ${btn(`data-hf-check ${ps.pool.length ? 'disabled' : ''}`, '<i class="fa-solid fa-check mr-1"></i> Periksa', ps.pool.length ? 'bg-slate-200 text-slate-400' : 'bg-emerald-800 text-white hover:bg-emerald-700')}
                ${btn('data-hf-reshuffle', '<i class="fa-solid fa-shuffle mr-1"></i> Acak ulang')}
                ${btn('data-hf-solve', '<i class="fa-regular fa-eye mr-1"></i> Lihat jawaban')}
                ${ps.checked && !wrong && ps.section < sections.length - 1 ? btn(`data-hf-section="${ps.section + 1}"`, 'Bagian berikutnya <i class="fa-solid fa-arrow-left ml-1"></i>', 'bg-emerald-800 text-white hover:bg-emerald-700') : ''}
            </div>
        </div>`;
}

function modeRekam(it, units, info) {
    const supported = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    const hideText = ps.recording && ps.hideWhileRec;
    return `
        <div class="space-y-3">
            <p class="text-xs text-slate-500">Rekam bacaanmu dari ingatan, lalu dengarkan sambil mencocokkan dengan teksnya. Rekaman hanya ada di perangkat ini dan terhapus saat latihan ditutup.</p>
            ${!supported ? '<p class="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Browser ini tidak mendukung perekaman suara.</p>' : `
            <label class="inline-flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" data-hf-hidewhile ${ps.hideWhileRec ? 'checked' : ''} class="accent-emerald-700"> Sembunyikan teks saat merekam</label>
            <div class="flex flex-wrap items-center gap-2">
                ${ps.recording ? btn('data-hf-recstop', '<i class="fa-solid fa-stop mr-1"></i> Berhenti', 'bg-red-600 text-white hover:bg-red-500 hf-rec-pulse')
                : btn('data-hf-recstart', `<i class="fa-solid fa-microphone mr-1"></i> ${ps.recUrl ? 'Rekam ulang' : 'Mulai rekam'}`, 'bg-emerald-800 text-white hover:bg-emerald-700')}
                ${ps.recording ? '<span class="text-xs font-semibold text-red-600"><i class="fa-solid fa-circle text-[8px] mr-1"></i>Merekam…</span>' : ''}
            </div>
            ${ps.recError ? `<p class="rounded-xl bg-red-50 p-3 text-xs text-red-700">${esc(ps.recError)}</p>` : ''}
            ${ps.recUrl ? `<audio controls src="${ps.recUrl}" class="w-full"></audio>` : ''}`}
            <div class="rounded-xl border border-slate-200 bg-white p-4">
                ${hideText ? '<p class="py-6 text-center text-sm text-slate-400"><i class="fa-regular fa-eye-slash mr-1"></i>Teks disembunyikan selama merekam</p>'
                : `${arabicHtml(units, all(units), () => false)}${info.latin ? `<p class="mt-2 text-xs font-semibold leading-relaxed text-emerald-800">${esc(info.latin)}</p>` : ''}`}
            </div>
        </div>`;
}

let recorder = null;

async function startRecording() {
    ps.recError = '';
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const parts = [];
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
        recorder.onstop = () => {
            const type = recorder?.mimeType || 'audio/webm';
            recorder = null;
            stream.getTracks().forEach(t => t.stop());
            if (!ps) return;
            if (ps.recUrl) URL.revokeObjectURL(ps.recUrl);
            ps.recUrl = URL.createObjectURL(new Blob(parts, { type }));
            ps.recording = false;
            renderPractice();
        };
        recorder.start();
        ps.recording = true;
    } catch (e) {
        ps.recError = 'Mikrofon tidak bisa dipakai. Pastikan izin mikrofon untuk situs ini diberikan.';
    }
    renderPractice();
}

function stopRecording() {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
}

function renderPractice() {
    const overlay = document.getElementById('hafalan-practice');
    if (!overlay || !ps) return;
    if (ps.pos >= ps.queue.length) return renderSummary(overlay);
    const it = currentItem();
    if (!it) { ps.pos++; return renderPractice(); }
    const units = unitsOf(it);
    const info = infoOf(it);
    const rec = store.items[it.id];
    const body = { kartu: modeKartu, tutup: modeTutup, potongan: modePotongan, susun: modeSusun, rekam: modeRekam }[ps.mode](it, units, info);
    const gradeBtn = (g, label, cls) => {
        const n = nextInterval(rec, g);
        return `<button type="button" data-hf-grade="${g}" class="flex-1 rounded-xl px-2 py-2.5 text-sm font-bold transition ${cls}">${label}<span class="block text-[10px] font-normal opacity-80">${n === 1 ? 'besok' : n + ' hari'}</span></button>`;
    };
    overlay.innerHTML = `
        <header class="bg-emerald-900 text-white px-4 py-3 shadow">
            <div class="mx-auto flex max-w-2xl items-start gap-3">
                <div class="min-w-0 flex-1">
                    <p class="text-[11px] text-emerald-200">${ps.session ? `Ulangan ${ps.pos + 1} dari ${ps.queue.length}` : 'Latihan'} · ${STATUS[statusOf(rec)][0]}</p>
                    <h2 class="truncate text-base font-bold text-amber-50">${esc(info.title)}</h2>
                    ${info.label ? `<p class="truncate text-[11px] text-emerald-200">${esc(info.label)}</p>` : ''}
                </div>
                <button type="button" data-hf-close aria-label="Tutup latihan" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 hover:bg-emerald-700"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="hf-noscroll mx-auto mt-3 flex max-w-2xl gap-1 overflow-x-auto" role="tablist" aria-label="Mode latihan">
                ${MODES.map(([k, label, icon]) => `<button type="button" role="tab" aria-selected="${ps.mode === k}" data-hf-mode="${k}" class="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${ps.mode === k ? 'bg-amber-50 text-emerald-900' : 'text-emerald-100 hover:bg-emerald-800'}"><i class="fa-solid ${icon} mr-1"></i>${label}</button>`).join('')}
            </div>
        </header>
        <main class="flex-1 overflow-y-auto px-4 py-4">
            <div class="mx-auto max-w-2xl">${body}</div>
        </main>
        <footer class="border-t border-slate-200 bg-white px-4 py-3" style="padding-bottom:max(0.75rem, env(safe-area-inset-bottom))">
            <div class="mx-auto max-w-2xl">
                <p class="mb-2 text-center text-[11px] font-semibold text-slate-500">Seberapa ingat bacaan ini?</p>
                <div class="flex gap-2">
                    ${gradeBtn('lupa', 'Lupa', 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100')}
                    ${gradeBtn('ragu', 'Ragu', 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100')}
                    ${gradeBtn('hafal', 'Hafal', 'bg-emerald-700 text-white hover:bg-emerald-600')}
                </div>
            </div>
        </footer>`;
}

function renderSummary(overlay) {
    const counts = { lupa: 0, ragu: 0, hafal: 0 };
    ps.graded.forEach(g => counts[g]++);
    const goalMet = todayCount() >= store.goal;
    overlay.innerHTML = `
        <main class="flex flex-1 items-center justify-center overflow-y-auto p-6">
            <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow">
                <i class="fa-solid fa-medal text-4xl text-gold-500"></i>
                <h2 class="mt-2 text-lg font-bold text-emerald-900">${ps.session ? 'Ulangan hari ini selesai!' : 'Latihan tersimpan'}</h2>
                <p class="mt-1 text-sm text-slate-600">${ps.graded.length} bacaan dinilai: ${counts.hafal} hafal, ${counts.ragu} ragu, ${counts.lupa} lupa.</p>
                <p class="mt-3 text-sm text-slate-700"><i class="fa-solid fa-fire text-orange-500 mr-1"></i><strong>${streakNow()}</strong> hari beruntun${goalMet ? ' · <i class="fa-solid fa-bullseye text-gold-500"></i> target harian tercapai' : ''}</p>
                <button type="button" data-hf-close class="mt-5 w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700">Selesai</button>
            </div>
        </main>`;
}

/* ---------- Event ---------- */
function onPracticeClick(e) {
    const t = (sel) => e.target.closest(sel);
    let el;
    if (t('[data-hf-close]')) return closePractice();
    if ((el = t('[data-hf-mode]'))) return switchMode(el.dataset.hfMode);
    if ((el = t('[data-hf-grade]'))) {
        stopRecording();
        grade(ps.queue[ps.pos], el.dataset.hfGrade);
        ps.graded.push(el.dataset.hfGrade);
        if (ps.recUrl) URL.revokeObjectURL(ps.recUrl);
        Object.assign(ps, freshItemState(ps.session ? 'kartu' : ps.mode));
        ps.pos++;
        renderPractice();
        overlayScrollTop();
        return;
    }
    const units = ps.pos < ps.queue.length ? unitsOf(currentItem()) : [];
    if (t('[data-hf-show]')) ps.shown = true;
    else if (t('[data-hf-peek]')) { const next = units.findIndex((_, i) => !ps.revealed.has(i)); if (next > -1) ps.revealed.add(next); }
    else if ((el = t('[data-hf-reveal]'))) ps.revealed.add(Number(el.dataset.hfReveal));
    else if ((el = t('[data-hf-level]'))) { ps.level = Number(el.dataset.hfLevel); ps.revealed.clear(); }
    else if (t('[data-hf-revealall]')) ps.revealed = new Set(all(units));
    else if (t('[data-hf-resetreveal]')) ps.revealed.clear();
    else if ((el = t('[data-hf-step]'))) { ps.step = Math.max(1, ps.step + Number(el.dataset.hfStep)); ps.test = false; ps.revealed.clear(); }
    else if (t('[data-hf-test]')) { ps.test = !ps.test; ps.revealed.clear(); }
    else if ((el = t('[data-hf-section]'))) { ps.section = Number(el.dataset.hfSection); ps.pool = null; }
    else if ((el = t('[data-hf-pick]'))) { ps.answer.push(ps.pool.splice(Number(el.dataset.hfPick), 1)[0]); ps.checked = false; }
    else if ((el = t('[data-hf-unpick]'))) { ps.pool.push(ps.answer.splice(Number(el.dataset.hfUnpick), 1)[0]); ps.checked = false; }
    else if (t('[data-hf-check]')) ps.checked = true;
    else if (t('[data-hf-reshuffle]')) ps.pool = null;
    else if (t('[data-hf-solve]')) { const sec = sectionsOf(units)[ps.section]; ps.answer = [...sec]; ps.pool = []; ps.checked = true; }
    else if (t('[data-hf-recstart]')) return startRecording();
    else if (t('[data-hf-recstop]')) return stopRecording();
    else return;
    renderPractice();
}

function onPracticeChange(e) {
    if (e.target.matches('[data-hf-hint]')) ps.hint = e.target.checked;
    else if (e.target.matches('[data-hf-hidewhile]')) ps.hideWhileRec = e.target.checked;
    else return;
    renderPractice();
}

function overlayScrollTop() {
    document.querySelector('#hafalan-practice main')?.scrollTo(0, 0);
}

document.addEventListener('click', (e) => {
    if (ps && e.target.closest('#hafalan-practice')) return onPracticeClick(e);
    let el;
    if ((el = e.target.closest('[data-hf-start]'))) return openPractice([el.dataset.hfStart], false);
    if (e.target.closest('[data-hf-session]')) {
        const due = hafalanItems().filter(it => isDue(store.items[it.id]));
        // ulangan yang sudah jatuh tempo dulu, lalu bacaan baru
        due.sort((a, b) => (store.items[b.id]?.box ? 1 : 0) - (store.items[a.id]?.box ? 1 : 0));
        return openPractice(due.map(it => it.id), true);
    }
    if ((el = e.target.closest('[data-hf-filter]'))) { ui.filter = el.dataset.hfFilter; renderHafalan(); }
});

document.addEventListener('change', (e) => {
    if (ps && e.target.closest('#hafalan-practice')) return onPracticeChange(e);
    if (e.target.matches('[data-hf-goal]')) { store.goal = Number(e.target.value); save(); renderHafalan(); }
    else if (e.target.matches('[data-hf-remind]')) setupReminder(e.target.checked);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ps) closePractice();
});

/* ---------- Init ---------- */
export function initHafalan() {
    setBookmarksRenderer(renderHafalan);
    renderHafalan();
    writeReminderMeta();
    if (store.remind && 'Notification' in window && Notification.permission === 'granted') {
        registerPeriodic().then(ok => { reminder.support = ok ? 'background' : 'none'; renderHafalan(); });
    } else if (store.remind && 'Notification' in window && Notification.permission === 'denied') {
        reminder.support = 'denied';
    }
    // Notifikasi pengingat membuka ./#hafalan
    const openFromHash = () => { if (location.hash === '#hafalan') switchTab('bookmarks'); };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
}
