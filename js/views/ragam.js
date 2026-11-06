import { ragamBacaan } from '../data/ragam.js';
import { ragamWords } from '../data/ragam-words.js';
import { switchSholatSub, switchTab } from '../nav.js';
import { state } from '../state.js';

export const RAGAM_TAG = {
    pokok: ['Pokok', 'bg-emerald-100 text-emerald-800 border-emerald-200'],
    tambahan: ['Tambahan', 'bg-white text-gold-600 border-gold-500'],
    alternatif: ['Alternatif', 'bg-slate-100 text-slate-600 border-slate-200']
};

export const RAGAM_CHIP_ON = 'bg-emerald-800 text-white border-emerald-800 shadow-sm';

export const RAGAM_CHIP_OFF = 'bg-white text-slate-600 border-slate-200';

export const RAGAM_KITAB = { bukhari: 'Bukhari', muslim: 'Muslim', abudawud: 'Abu Daud', tirmidzi: 'Tirmidzi', nasai: "An-Nasa'i", ibnmajah: 'Ibnu Majah', ahmad: 'Ahmad' };

export function renderRagam() {
    const nav = document.getElementById('ragam-nav');
    const body = document.getElementById('ragam-body');
    if (!nav || !body) return;
    nav.innerHTML = ragamBacaan.map((g, i) => `
        <button type="button" role="tab" onclick="showRagamGroup('${g.key}')" id="ragam-chip-${g.key}" aria-controls="ragam-g-${g.key}"
            class="ragam-chip px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full border whitespace-nowrap transition shrink-0 ${RAGAM_CHIP_OFF}">
            ${g.title} <span class="opacity-70">(${g.items.length})</span>
        </button>`).join('');
    body.innerHTML = ragamBacaan.map((g, gi) => {
        const prev = ragamBacaan[gi - 1], next = ragamBacaan[gi + 1];
        const many = g.items.length > 3;
        return `
        <div id="ragam-g-${g.key}" class="ragam-group hidden space-y-3" role="tabpanel">
            <div class="bg-emerald-900 text-white p-4 rounded-2xl border border-gold-500/20">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-[11px] text-emerald-200">Gerakan ${gi + 1} dari ${ragamBacaan.length}</p>
                        <h3 class="text-lg font-bold text-amber-50">${g.title}</h3>
                    </div>
                    ${many ? `<button type="button" onclick="toggleRagamAll('${g.key}')" class="shrink-0 text-[11px] font-semibold rounded-full border border-emerald-300/40 px-3 py-1 hover:bg-emerald-800 transition"><i class="fa-solid fa-angles-down mr-1"></i><span id="ragam-toggle-${g.key}">Buka semua</span></button>` : ''}
                </div>
                ${g.intro ? `<p class="text-xs text-emerald-100 mt-2 leading-relaxed">${g.intro}</p>` : ''}
            </div>
            ${g.items.map((v, vi) => renderRagamItem(g, v, vi, !many || v.tag === 'pokok')).join('')}
            <div class="flex items-center justify-between gap-2 pt-1">
                ${prev ? `<button type="button" onclick="showRagamGroup('${prev.key}', true)" class="text-xs font-semibold text-emerald-800 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:border-gold-400 transition"><i class="fa-solid fa-arrow-left mr-1"></i> ${prev.title}</button>` : '<span></span>'}
                ${next ? `<button type="button" onclick="showRagamGroup('${next.key}', true)" class="text-xs font-semibold text-white bg-emerald-800 rounded-xl px-3 py-2 hover:bg-emerald-700 transition">${next.title} <i class="fa-solid fa-arrow-right ml-1"></i></button>` : '<span></span>'}
            </div>
        </div>`;
    }).join('');
    showRagamGroup(state.ragamActive);
}

// Arti per kata: Arab dipecah per spasi, sejajar dengan ragamWords[v.id]; dilewati jika jumlahnya tidak cocok
function renderRagamWords(v) {
    const words = ragamWords[v.id];
    const tokens = v.arab ? v.arab.split(/\s+/).filter(Boolean) : [];
    if (!words || words.length !== tokens.length) return '';
    const badges = tokens.map((ar, i) => ({ ar, lat: words[i][0], id: words[i][1] })).filter(w => w.id);
    if (!badges.length) return '';
    return `
                    <details class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                        <summary class="flex cursor-pointer items-center justify-between gap-2 text-xs font-semibold text-emerald-800">
                            <span><i class="fa-solid fa-list-ul text-gold-500 mr-1"></i> Arti per kata (${badges.length})</span>
                            <i class="fa-solid fa-chevron-down details-chevron text-[10px]"></i>
                        </summary>
                        <div class="mt-3 flex flex-wrap gap-2" dir="rtl">
                            ${badges.map(w => `
                                <div class="word-badge bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center flex-1 min-w-[84px] max-w-[150px]" dir="ltr">
                                    <p class="font-arabic text-lg font-bold text-emerald-950 mb-0.5" dir="rtl">${w.ar}</p>
                                    <p class="text-[11px] font-semibold text-emerald-700 break-words">${w.lat}</p>
                                    <p class="text-[11px] leading-snug text-slate-600 break-words">${w.id}</p>
                                </div>`).join('')}
                        </div>
                    </details>`;
}

export function renderRagamItem(g, v, vi, open) {
    const [tagText, tagCls] = RAGAM_TAG[v.tag] || RAGAM_TAG.alternatif;
    const links = (v.refs || []).map(r => `<a href="https://www.hadits.id/hadits/${r.k}/${r.n}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-emerald-800 hover:border-gold-400">${RAGAM_KITAB[r.k] || r.k} ${r.n} <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i></a>`).join('');
    return `
            <details class="ragam-item search-item bg-white rounded-2xl border border-slate-200 shadow-sm" ${open ? 'open' : ''}>
                <summary class="flex cursor-pointer items-center gap-3 p-3.5">
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white">${vi + 1}</span>
                    <span class="min-w-0 flex-1">
                        <span class="block text-sm font-bold leading-snug text-emerald-900">${v.label}</span>
                        <span class="mt-1 flex flex-wrap items-center gap-1.5">
                            <span class="rounded-full border px-2 py-0.5 text-[10px] font-bold ${tagCls}">${tagText}</span>
                            ${v.grade ? `<span class="text-[11px] text-slate-500">${v.grade}</span>` : ''}
                            <span class="text-[11px] italic text-slate-500">${v.source}</span>
                        </span>
                    </span>
                    <i class="fa-solid fa-chevron-down details-chevron text-[10px] text-slate-400"></i>
                </summary>
                <div class="space-y-2 border-t border-slate-100 p-3.5">
                    ${v.arab ? `<p class="font-arabic arabic-size text-right leading-loose text-emerald-950" dir="rtl">${v.arab}</p>` : ''}
                    ${v.latin ? `<p class="text-xs font-semibold leading-relaxed text-emerald-800">${v.latin}</p>` : ''}
                    ${v.translation ? `<p class="text-xs italic leading-relaxed text-slate-600">"${v.translation}"</p>` : ''}
                    ${renderRagamWords(v)}
                    ${v.madzhab ? `<p class="text-[11px] font-semibold text-gold-600"><i class="fa-solid fa-scale-balanced mr-1"></i>${v.madzhab}</p>` : ''}
                    ${v.note ? `<p class="text-[11px] leading-relaxed text-slate-500">${v.note}</p>` : ''}
                    ${links ? `<div class="flex flex-wrap gap-1.5 pt-1">${links}</div>` : ''}
                </div>
            </details>`;
}

export function showRagamGroup(key, scroll) {
    if (!ragamBacaan.some(g => g.key === key)) key = ragamBacaan[0].key;
    state.ragamActive = key;
    if (state.searchActive) return;
    ragamBacaan.forEach(g => {
        const panel = document.getElementById('ragam-g-' + g.key);
        const chip = document.getElementById('ragam-chip-' + g.key);
        if (panel) panel.classList.toggle('hidden', g.key !== key);
        if (chip) {
            chip.className = chip.className.replace(RAGAM_CHIP_ON, '').replace(RAGAM_CHIP_OFF, '').trim() + ' ' + (g.key === key ? RAGAM_CHIP_ON : RAGAM_CHIP_OFF);
            chip.setAttribute('aria-selected', g.key === key);
            if (g.key === key) chip.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
    });
    if (scroll) document.getElementById('ragam-nav').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function toggleRagamAll(key) {
    const items = document.querySelectorAll('#ragam-g-' + key + ' details.ragam-item');
    const open = ![...items].every(d => d.open);
    items.forEach(d => { d.open = open; });
    const label = document.getElementById('ragam-toggle-' + key);
    if (label) label.textContent = open ? 'Tutup semua' : 'Buka semua';
}

export function openRagam(key) {
    switchTab('rukun');
    switchSholatSub('sholat-ragam');
    showRagamGroup(key, true);
}
