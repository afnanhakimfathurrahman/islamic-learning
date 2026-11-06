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
}
