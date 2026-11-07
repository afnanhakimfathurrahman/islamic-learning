import { ROUTES } from './data/routes.js';
import { state } from './state.js';
import { showRagamGroup } from './views/ragam.js';

/* -------------------------------------------------------------
   4. NAVIGATION & TAB SWITCHING LOGIC
------------------------------------------------------------- */
export function switchTab(tabId, skipSearchReset = false) {
    if (state.searchActive && !skipSearchReset) {
        state.searchActive = false;
        state.searchPrevState = null;
        document.getElementById('search-input').value = '';
        document.getElementById('search-status').classList.add('hidden');
        document.querySelectorAll('.search-item').forEach(el => el.classList.remove('hidden'));
        switchWudhuSub('wudhu-langkah');
        switchSholatSub('sholat-gerakan');
        document.getElementById('ragam-nav').classList.remove('hidden');
        showRagamGroup(state.ragamActive);
    }

    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    // Remove active classes
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('tab-active'));
    
    // Show selected tab
    const target = document.getElementById(`content-${tabId}`);
    if (target) target.classList.remove('hidden');

    // Highlight nav button
    const navBtn = document.getElementById(`tab-${tabId}`);
    if (navBtn) navBtn.classList.add('tab-active');

    // Update mobile navbar styles
    document.querySelectorAll('nav.md\\:hidden button').forEach(btn => {
        btn.classList.remove('text-gold-400');
        btn.classList.add('text-emerald-300');
    });
    const mobBtn = document.getElementById(`mob-tab-${tabId}`);
    if (mobBtn) {
        mobBtn.classList.remove('text-emerald-300');
        mobBtn.classList.add('text-gold-400');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    syncUrl();
}

export function switchWudhuSub(subId) {
    // Terima 'wudhu-langkah' maupun 'langkah'
    const name = String(subId).replace(/^wudhu-/, '');
    const content = document.getElementById(`wudhu-sub-${name}`);
    const activeBtn = document.getElementById(`sub-wudhu-${name}`);
    if (!content) {
        console.warn(`Elemen wudhu-sub-${name} tidak ditemukan!`);
        return;
    }

    document.querySelectorAll('.wudhu-sub-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.wudhu-sub-btn').forEach(btn => {
        btn.classList.remove('bg-emerald-800', 'text-white', 'border-emerald-800', 'shadow-sm');
        btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
    });

    content.classList.remove('hidden');
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
        activeBtn.classList.add('bg-emerald-800', 'text-white', 'border-emerald-800', 'shadow-sm');
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    syncUrl();
}

export function goToDoaWudhu() {
    switchWudhuSub('wudhu-sunnah');
    document.getElementById('doa-setelah-wudhu').scrollIntoView({ behavior: 'smooth' });
}

export function switchSholatSub(type) {
    const ON = "flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg bg-white shadow text-emerald-900 transition";
    const OFF = "flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg text-slate-600 hover:text-emerald-900 transition";
    ['gerakan', 'bacaan', 'ragam'].forEach(name => {
        const cont = document.getElementById('sholat-' + name + '-container');
        const btn = document.getElementById('btn-sholat-' + name);
        const active = type === 'sholat-' + name;
        if (cont) cont.classList.toggle('hidden', !active);
        if (btn) btn.className = active ? ON : OFF;
    });
    syncUrl();
}

/* -------------------------------------------------------------
   URL PER BAGIAN (SEO). Daftar halaman ada di js/data/routes.js;
   halaman statisnya dibuat oleh scripts/build-pages.mjs.
------------------------------------------------------------- */
// Akar situs: halaman turunan memakai <base href="../">, jadi baseURI selalu menunjuk ke akar
const SITE_ROOT = new URL('.', document.baseURI);

function routeHref(route) {
    return new URL(route.slug ? route.slug + '/' : '', SITE_ROOT).href;
}

export function routeFromLocation() {
    const path = decodeURI(location.pathname);
    const rel = path.startsWith(SITE_ROOT.pathname) ? path.slice(SITE_ROOT.pathname.length) : '';
    const slug = rel.replace(/(^|\/)index\.html$/, '').replace(/\/+$/, '');
    return ROUTES.find(r => r.slug === slug) || ROUTES[0];
}

function viewState() {
    const tab = document.querySelector('.tab-content:not(.hidden)');
    const wudhu = document.querySelector('.wudhu-sub-content:not(.hidden)');
    return {
        tab: tab ? tab.id.replace('content-', '') : 'home',
        wudhu: wudhu ? wudhu.id.replace('wudhu-sub-', '') : null,
        sholat: ['gerakan', 'bacaan', 'ragam'].map(n => 'sholat-' + n)
            .find(id => { const el = document.getElementById(id + '-container'); return el && !el.classList.contains('hidden'); }) || null
    };
}

function routeMatches(route, v) {
    return route.tab === v.tab && (!route.wudhu || route.wudhu === v.wudhu) && (!route.sholat || route.sholat === v.sholat);
}

function setUrl(route) {
    document.title = route.title;
    const href = routeHref(route);
    if (href !== location.href.split('#')[0]) {
        try { history.replaceState(null, '', href); } catch (e) { /* mis. file:// */ }
    }
}

// Selaraskan URL & judul dengan tab yang tampil (replaceState, jadi tombol Kembali tetap seperti biasa)
export function syncUrl() {
    if (state.searchActive) return;
    const v = viewState();
    if (routeMatches(routeFromLocation(), v)) return;
    const forTab = ROUTES.filter(r => r.tab === v.tab && !r.anchor);
    setUrl(forTab.find(r => routeMatches(r, v)) || forTab[0] || ROUTES[0]);
}

export function openRoute(route) {
    switchTab(route.tab);
    if (route.wudhu) switchWudhuSub(route.wudhu);
    if (route.sholat) switchSholatSub(route.sholat);
    if (route.anchor) {
        const el = document.getElementById(route.anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setUrl(route);
}

// Tautan <a data-route="slug"> (daftar isi footer): pindah tab tanpa memuat ulang halaman
export function initRouteLinks() {
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[data-route]');
        if (!a || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        const route = ROUTES.find(r => r.slug === a.dataset.route);
        if (!route) return;
        e.preventDefault();
        openRoute(route);
    });
}
