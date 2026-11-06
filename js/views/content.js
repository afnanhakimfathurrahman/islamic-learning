import { pembatalData } from '../data/pembatal.js';
import { ragamBacaan } from '../data/ragam.js';
import { bacaanSholatWords, bacaanVariants, sholatStepsData } from '../data/sholat.js';
import { syaratData } from '../data/syarat.js';
import { wudhuStepsData } from '../data/wudhu.js';

// Render Syarat Sah
export function renderDalilDetails(item) {
    if (!item.arab && !item.translation) return '';
    return `
        <details class="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
            <summary class="flex cursor-pointer items-center justify-between gap-2 text-xs font-semibold text-emerald-800">
                <span><i class="fa-solid fa-book-open text-gold-500 mr-1"></i> Matan & Terjemahan</span>
                <i class="fa-solid fa-chevron-down details-chevron text-[10px]"></i>
            </summary>
            <div class="mt-3 space-y-2 border-t border-slate-200 pt-3">
                ${item.mainLabel ? `<p class="text-[11px] font-semibold text-slate-500">${item.mainLabel}</p>` : ''}
                ${item.arab ? `<p class="font-arabic text-right text-xl leading-loose text-emerald-950" dir="rtl">${item.arab}</p>` : ''}
                ${item.translation ? `<p class="text-xs italic leading-relaxed text-slate-600">"${item.translation}"</p>` : ''}
                ${(item.extra || []).map(x => `
                <div class="mt-3 space-y-2 border-t border-slate-200 pt-3">
                    <p class="text-[11px] font-semibold text-slate-500">${x.label}</p>
                    <p class="font-arabic text-right text-xl leading-loose text-emerald-950" dir="rtl">${x.arab}</p>
                    <p class="text-xs italic leading-relaxed text-slate-600">"${x.translation}"</p>
                    ${x.note ? `<p class="text-[11px] leading-relaxed text-slate-500">${x.note}</p>` : ''}
                </div>`).join('')}
            </div>
        </details>
    `;
}

export function renderSyarat() {
    const container = document.getElementById('syarat-container');
    container.innerHTML = syaratData.map(item => `
        <div class="search-item bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-gold-400 transition">
            <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h4 class="font-bold text-emerald-950">${item.title}</h4>
                <span class="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold whitespace-nowrap">${item.dalil}</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">${item.desc}</p>
            ${renderDalilDetails(item)}
        </div>
    `).join('');
}

// Render Wudhu Steps
export function renderWudhuSteps() {
    const container = document.getElementById('wudhu-steps-grid');
    container.innerHTML = wudhuStepsData.map(step => `
        <div class="search-item bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
            <div class="flex items-start gap-3">
                <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-gold-400 shadow-sm">
                    <i class="fa-solid ${step.icon} text-lg"></i>
                </div>
                <div class="min-w-0">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-gold-600">Langkah ${step.step}</span>
                    <h4 class="font-bold leading-snug text-slate-800">${step.title}</h4>
                </div>
            </div>
            <p class="mt-3 text-xs leading-relaxed text-slate-600">${step.desc}</p>
            ${step.arab ? `
            <div class="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                <p class="font-arabic arabic-size text-right text-emerald-950 leading-loose" dir="rtl">${step.arab}</p>
                <p class="mt-2 text-xs italic text-slate-700">"${step.arti}"</p>
                <a href="#doa-setelah-wudhu" onclick="event.preventDefault(); goToDoaWudhu()" class="mt-2 inline-block text-xs font-semibold text-emerald-800 underline">Lihat dalil & arti per kata</a>
            </div>` : ''}
        </div>
    `).join('');
}

// Render Sholat Gerakan Steps
export function renderSholatSteps() {
    const container = document.getElementById('sholat-steps-list');
    container.innerHTML = sholatStepsData.map(step => `
        <div class="search-item bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-gold-300 hover:shadow-md transition flex gap-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-gold-400 shadow-sm">
                <i class="fa-solid ${step.icon} text-xl"></i>
            </div>
            <div class="min-w-0 flex-1 space-y-1.5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">${step.rukun}</span>
                    <span class="text-[11px] text-slate-400">${step.dalil}</span>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-emerald-950">${step.title}</h3>
                <p class="text-sm text-slate-600 leading-relaxed">${step.desc}</p>
                ${step.matan ? `
                <details class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                    <summary class="flex cursor-pointer items-center justify-between gap-2 text-xs font-semibold text-emerald-800">
                        <span><i class="fa-solid fa-book-open text-gold-500 mr-1"></i> Matan & Terjemahan</span>
                        <i class="fa-solid fa-chevron-down details-chevron text-[10px]"></i>
                    </summary>
                    <div class="mt-3 space-y-2 border-t border-slate-200 pt-3">
                        <p class="text-[11px] text-slate-500 italic">${step.matan.sumber}</p>
                        ${step.matan.derajat ? `<p class="text-[11px] text-slate-500">${step.matan.derajat}</p>` : ''}
                        <p class="font-arabic text-right text-xl leading-loose text-emerald-950" dir="rtl">${step.matan.arab}</p>
                        <p class="text-xs italic leading-relaxed text-slate-600">"${step.matan.arti}"</p>
                    </div>
                </details>` : ''}
            </div>
        </div>
    `).join('');
}

// Kartu bacaan: catatan singkat + tautan ke tab Ragam (daftar lengkap riwayat ada di sana)
export const RAGAM_BY_WORD = { 1: 'iftitah', 2: 'fatihah', 3: 'ruku', 4: 'bangkit', 5: 'itidal', 6: 'sujud', 7: 'duduk', 8: 'tasyahud', 9: 'sholawat', 10: 'salam' };

export function renderBacaanVariants(idx) {
    const entry = bacaanVariants[idx];
    const note = entry && entry.note ? `<p class="text-xs leading-relaxed text-slate-600"><i class="fa-solid fa-circle-info text-gold-500 mr-1"></i>${entry.note}</p>` : '';
    const group = ragamBacaan.find(g => g.key === RAGAM_BY_WORD[idx]);
    if (!group || group.items.length < 2) return note;
    return `${note}
            <button type="button" onclick="openRagam('${group.key}')" class="w-full flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-left text-xs font-semibold text-emerald-800 hover:border-gold-400 transition">
                <span><i class="fa-solid fa-list-check text-gold-500 mr-1.5"></i> Lihat ${group.items.length} pilihan bacaan ${group.title}</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>`;
}

// Render Sholat Recitations with Word-by-Word Breakdown
export function renderSholatWords() {
    const container = document.getElementById('sholat-bacaan-container');
    container.innerHTML = bacaanSholatWords.map((item, idx) => `
        <div class="search-item bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
                <h3 class="font-bold text-emerald-900 text-base">${item.title}</h3>
                <span class="text-xs text-slate-500 italic bg-slate-100 px-2.5 py-1 rounded-full">${item.source}</span>
            </div>

            <!-- Full Arabic Text -->
            <div class="bg-slate-50 p-4 rounded-xl text-right">
                <p class="font-arabic arabic-size text-emerald-950 mb-2 leading-loose" dir="rtl">
                    ${item.arabFull}
                </p>
                <p class="text-xs text-emerald-800 font-semibold text-left mb-1">${item.latinFull}</p>
                <p class="text-xs text-slate-600 text-left italic">"${item.translationFull}"</p>
            </div>

            ${renderBacaanVariants(idx)}

            <!-- Word by Word Interactive Badges -->
            <div>
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"><i class="fa-solid fa-list-ul text-gold-500 mr-1"></i> Terjemahan Per Kata:</h4>
                <div class="flex flex-wrap gap-2.5" dir="rtl">
                    ${item.words.map(w => `
                        <div class="word-badge bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center flex-1 min-w-[100px] max-w-[160px]" dir="ltr">
                            <p class="font-arabic text-xl font-bold text-emerald-950 mb-1" dir="rtl">${w.ar}</p>
                            <p class="text-[11px] font-semibold text-emerald-700 break-words">${w.lat}</p>
                            <p class="text-[11px] leading-snug text-slate-600 break-words">${w.id}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Render Pembatal Sholat
export function renderPembatal() {
    const container = document.getElementById('pembatal-list');
    container.innerHTML = pembatalData.map(item => `
        <div class="search-item bg-white p-5 rounded-2xl shadow-sm border border-red-100 hover:border-red-300 transition">
            <h4 class="font-bold text-red-900 mb-1">${item.title}</h4>
            <p class="text-xs text-slate-600 mb-2 leading-relaxed">${item.desc}</p>
            <span class="inline-block text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded">${item.dalil}</span>
            ${renderDalilDetails(item)}
        </div>
    `).join('');
}
