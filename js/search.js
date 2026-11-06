import { switchSholatSub, switchTab, switchWudhuSub } from './nav.js';
import { state } from './state.js';
import { showRagamGroup } from './views/ragam.js';

export function enterSearchMode() {
    if (state.searchActive) return;
    state.searchActive = true;
    const activeTab = document.querySelector('.tab-content:not(.hidden)');
    const activeWudhu = document.querySelector('.wudhu-sub-content:not(.hidden)');
    state.searchPrevState = {
        tab: activeTab ? activeTab.id.replace('content-', '') : 'home',
        wudhuSub: activeWudhu ? activeWudhu.id.replace('wudhu-sub-', '') : 'wudhu-langkah',
        sholatSub: ['bacaan', 'ragam'].map(n => 'sholat-' + n)
            .find(id => !document.getElementById(id + '-container').classList.contains('hidden')) || 'sholat-gerakan'
    };
}

export function exitSearchMode() {
    if (!state.searchActive) return;
    state.searchActive = false;
    document.querySelectorAll('.search-item').forEach(el => el.classList.remove('hidden'));
    document.getElementById('search-status').classList.add('hidden');
    const prev = state.searchPrevState || { tab: 'home', wudhuSub: 'wudhu-langkah', sholatSub: 'sholat-gerakan' };
    switchTab(prev.tab, true);
    switchWudhuSub(prev.tab === 'wudhu' ? prev.wudhuSub : 'wudhu-langkah');
    switchSholatSub(prev.tab === 'rukun' ? prev.sholatSub : 'sholat-gerakan');
    document.getElementById('ragam-nav').classList.remove('hidden');
    showRagamGroup(state.ragamActive);
    state.searchPrevState = null;
}

export function handleSearch() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const status = document.getElementById('search-status');
    if (!query) {
        exitSearchMode();
        return;
    }

    enterSearchMode();
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.wudhu-sub-content').forEach(el => el.classList.remove('hidden'));
    document.getElementById('sholat-gerakan-container').classList.remove('hidden');
    document.getElementById('sholat-bacaan-container').classList.remove('hidden');
    document.getElementById('sholat-ragam-container').classList.remove('hidden');
    document.querySelectorAll('.ragam-group').forEach(el => el.classList.remove('hidden'));
    document.getElementById('ragam-nav').classList.add('hidden');

    let total = 0;
    document.querySelectorAll('.tab-content').forEach(section => {
        let matches = 0;
        section.querySelectorAll('.search-item').forEach(item => {
            const haystack = (item.dataset.search || item.textContent).toLowerCase();
            const isMatch = haystack.includes(query);
            item.classList.toggle('hidden', !isMatch);
            if (isMatch) matches++;
        });
        if (matches > 0) {
            section.classList.remove('hidden');
            total += matches;
        }
    });

    document.querySelectorAll('.ragam-group').forEach(g => {
        g.classList.toggle('hidden', !g.querySelector('.search-item:not(.hidden)'));
    });

    const safeQuery = query.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    status.classList.remove('hidden');
    status.innerHTML = total > 0
        ? `<i class="fa-solid fa-magnifying-glass mr-1 text-emerald-700"></i> Ditemukan <strong>${total}</strong> hasil untuk &ldquo;${safeQuery}&rdquo;.`
        : `<i class="fa-solid fa-circle-info mr-1 text-emerald-700"></i> Tidak ada hasil untuk &ldquo;${safeQuery}&rdquo;. Coba kata kunci lain seperti <em>niat</em>, <em>sujud</em>, atau <em>wudhu</em>.`;
}
