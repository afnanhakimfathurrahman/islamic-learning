import { dalilWords } from './data/dalil-words.js';

// Kunci pencocokan teks Arab: spasi dirapatkan, urutan harakat disamakan (NFC) agar shadda+fathah dll. tidak membedakan
export const arabKey = (text) => String(text).replace(/\s+/g, ' ').trim().normalize('NFC');

const byKey = new Map(Object.entries(dalilWords).map(([k, v]) => [arabKey(k), v]));

export const dalilWordsFor = (arab) => byKey.get(arabKey(arab));

// Blok "Arti per kata": Arab dipecah per spasi, sejajar dengan words ([latin, arti]); kosong bila jumlahnya tidak cocok
export function wordsHtml(arab, words) {
    const tokens = arab ? arabKey(arab).split(' ') : [];
    if (!words || words.length !== tokens.length) return '';
    const badges = tokens.map((ar, i) => ({ ar, lat: words[i][0], id: words[i][1] })).filter(w => w.id);
    if (!badges.length) return '';
    return `
                    <details class="words-block rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
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

// Sisipkan "Arti per kata" di bawah setiap teks dalil yang punya entri di dalilWords (statis maupun hasil render).
// Teks ber-data-words (sudah punya arti per kata sendiri, mis. Ragam atau grid doa wudhu) dan isi badge dilewati.
export function decorateDalilWords() {
    document.querySelectorAll('.font-arabic[dir="rtl"]').forEach(el => {
        if (el.dataset.words || el.closest('.words-block')) return;
        const html = wordsHtml(el.textContent, dalilWordsFor(el.textContent));
        if (!html) return;
        el.dataset.words = 'on';
        // letakkan setelah latin/terjemahan yang mengikuti teks Arab, sebelum dalil berikutnya
        let anchor = el;
        while (anchor.nextElementSibling?.tagName === 'P' && !anchor.nextElementSibling.classList.contains('font-arabic')) anchor = anchor.nextElementSibling;
        anchor.insertAdjacentHTML('afterend', `<div class="mt-2">${html}</div>`);
    });
}
