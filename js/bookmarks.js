import { switchSholatSub, switchTab, switchWudhuSub } from './nav.js';
import { showRagamGroup } from './views/ragam.js';

const STORAGE_KEY = 'sholat_bookmarks';
export let bookmarkedIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

const esc = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const findCard = (id) => document.querySelector(`[data-bm="${CSS.escape(id)}"]`);

// ID stabil untuk kartu yang dibuat dari data (dipakai di template: data-bm="syarat-${bmSlug(judul)}")
export function bmSlug(text) {
    return String(text).toLowerCase().replace(/&amp;|&/g, ' dan ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedIds));
}

export function bookmarkItem(id) {
    const index = bookmarkedIds.indexOf(id);
    if (index > -1) bookmarkedIds.splice(index, 1);
    else bookmarkedIds.push(id);
    save();
    refreshBookmarkIcons();
    renderBookmarks();
}

export function removeBookmark(id) {
    const index = bookmarkedIds.indexOf(id);
    if (index > -1) bookmarkedIds.splice(index, 1);
    save();
    refreshBookmarkIcons();
    renderBookmarks();
}

export function clearBookmarks() {
    bookmarkedIds.length = 0;
    save();
    refreshBookmarkIcons();
    renderBookmarks();
}

/* ---------- Tombol favorit di setiap kartu (.search-item[data-bm]) ---------- */
const BTN_CLASS = 'bm-btn z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-gold-500';

export function decorateBookmarks() {
    document.querySelectorAll('.search-item[data-bm]').forEach(card => {
        if (card.querySelector('[data-bm-btn]')) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.bmBtn = card.dataset.bm;
        btn.innerHTML = '<i class="fa-regular fa-bookmark text-base"></i>';
        const summary = card.tagName === 'DETAILS' ? card.querySelector(':scope > summary') : null;
        if (summary) {
            // kartu akordeon: tombol ikut di baris judul, sebelum panah
            btn.className = BTN_CLASS + ' !h-8 !w-8';
            summary.insertBefore(btn, summary.querySelector('.details-chevron'));
        } else if (card.classList.contains('flex')) {
            btn.className = BTN_CLASS + ' self-start';
            card.appendChild(btn);
        } else {
            // sudut kanan atas; kartu overflow-hidden tidak boleh menggeser keluar sudut
            const inside = card.classList.contains('overflow-hidden');
            btn.className = BTN_CLASS + ' absolute ' + (inside ? 'top-2 right-2' : '-top-3 -right-2');
            card.classList.add('relative');
            card.appendChild(btn);
        }
    });
    refreshBookmarkIcons();
}

export function refreshBookmarkIcons() {
    document.querySelectorAll('[data-bm-btn]').forEach(btn => {
        const on = bookmarkedIds.includes(btn.dataset.bmBtn);
        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-solid', on);
        icon.classList.toggle('fa-regular', !on);
        btn.classList.toggle('text-gold-500', on);
        btn.classList.toggle('border-gold-400', on);
        btn.classList.toggle('text-slate-400', !on);
        btn.setAttribute('aria-pressed', on);
        btn.setAttribute('aria-label', on ? 'Hapus dari favorit' : 'Simpan ke favorit');
    });
}

/* ---------- Daftar di tab Favorit ---------- */
const textOf = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

function describe(id) {
    const card = findCard(id);
    if (!card) return null;
    const tabId = (card.closest('.tab-content')?.id || '').replace('content-', '');
    const crumbs = [textOf(document.getElementById('tab-' + tabId))];
    const info = { id, tab: tabId };
    const wudhu = card.closest('.wudhu-sub-content');
    const sholat = card.closest('#sholat-gerakan-container, #sholat-bacaan-container, #sholat-ragam-container');
    if (wudhu) {
        info.wudhu = wudhu.id.replace('wudhu-sub-', '');
        crumbs.push(textOf(document.getElementById('sub-wudhu-' + info.wudhu)));
    }
    if (sholat) {
        info.sholat = sholat.id.replace('-container', '');
        crumbs.push(textOf(document.getElementById('btn-' + info.sholat)));
    }
    const group = card.closest('.ragam-group');
    if (group) {
        info.ragam = group.id.replace('ragam-g-', '');
        crumbs.push(textOf(document.getElementById('ragam-chip-' + info.ragam)).replace(/\s*\(\d+\)$/, ''));
    }
    info.crumbs = crumbs.filter(Boolean);
    info.title = card.dataset.bmTitle
        || textOf(card.querySelector('h2, h3, h4, summary .text-sm.font-bold'))
        || textOf(card).slice(0, 60);
    const para = [...card.querySelectorAll('p')].find(p => !p.classList.contains('font-arabic') && textOf(p).length > 25 && textOf(p) !== info.title);
    info.snippet = textOf(para).slice(0, 110);
    return info;
}

export function renderBookmarks() {
    const container = document.getElementById('bookmarks-container');
    if (!container) return;
    if (bookmarkedIds.length === 0) {
        container.innerHTML = `<div class="bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-200">
            <i class="fa-regular fa-bookmark text-3xl text-gold-500 mb-2"></i>
            <p class="font-semibold text-emerald-900">Belum ada favorit</p>
            <p class="text-sm mt-1">Ketuk ikon bookmark di sudut kartu dalil, langkah, atau bacaan mana pun untuk menyimpannya di sini.</p>
        </div>`;
        return;
    }
    const rows = bookmarkedIds.map(id => ({ id, info: describe(id) }));
    const rowHtml = ({ id, info }) => `
        <div class="flex items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button type="button" data-bm-go="${esc(id)}" ${info ? '' : 'disabled'} class="min-w-0 flex-1 p-4 text-left hover:bg-emerald-50 transition">
                ${info ? `
                <p class="text-[11px] font-semibold text-gold-600">${esc(info.crumbs.join(' › '))}</p>
                <p class="mt-0.5 text-sm font-bold leading-snug text-emerald-900">${esc(info.title)}</p>
                ${info.snippet ? `<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">${esc(info.snippet)}</p>` : ''}
                <p class="mt-2 text-[11px] font-semibold text-emerald-700">Buka konten <i class="fa-solid fa-arrow-right text-[9px]"></i></p>`
                : `<p class="text-sm font-semibold text-slate-500">Konten tidak ditemukan</p><p class="text-[11px] text-slate-400">${esc(id)} (mungkin sudah dihapus dari aplikasi)</p>`}
            </button>
            <button type="button" data-bm-del="${esc(id)}" aria-label="Hapus dari favorit" class="flex w-14 shrink-0 items-center justify-center border-l border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition">
                <i class="fa-regular fa-trash-can text-base"></i>
            </button>
        </div>`;
    // kelompokkan per menu agar mudah dipindai
    const groups = new Map();
    rows.forEach(r => {
        const key = r.info ? r.info.crumbs[0] : 'Tidak ditemukan';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(r);
    });
    container.innerHTML = `
        <div class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-emerald-800">
            <span><strong>${bookmarkedIds.length}</strong> item tersimpan</span>
            <button type="button" data-bm-clear class="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"><i class="fa-regular fa-trash-can mr-1"></i> Hapus semua</button>
        </div>
        ${[...groups].map(([name, list]) => `
            <div class="space-y-2">
                <h3 class="px-1 text-xs font-bold uppercase tracking-wider text-slate-500">${esc(name)} (${list.length})</h3>
                ${list.map(rowHtml).join('')}
            </div>`).join('')}`;
}

/* ---------- Pindah ke kartu yang ditandai ---------- */
export function goToBookmark(id) {
    const card = findCard(id);
    if (!card) return;
    const info = describe(id);
    switchTab(info.tab);
    if (info.wudhu) switchWudhuSub(info.wudhu);
    if (info.sholat) switchSholatSub(info.sholat);
    if (info.ragam) showRagamGroup(info.ragam);
    // buka akordeon induk (dan kartunya sendiri bila akordeon)
    if (card.tagName === 'DETAILS') card.open = true;
    for (let d = card.parentElement && card.parentElement.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true;
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('bm-flash');
        setTimeout(() => card.classList.remove('bm-flash'), 2200);
    }, 80);
}

// Satu pendengar klik untuk semua tombol (kartu, daftar favorit, hapus)
document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-bm-btn]');
    if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        bookmarkItem(toggle.dataset.bmBtn);
        return;
    }
    const go = e.target.closest('[data-bm-go]');
    if (go) return goToBookmark(go.dataset.bmGo);
    const del = e.target.closest('[data-bm-del]');
    if (del) return removeBookmark(del.dataset.bmDel);
    if (e.target.closest('[data-bm-clear]') && confirm('Hapus semua favorit?')) clearBookmarks();
});
