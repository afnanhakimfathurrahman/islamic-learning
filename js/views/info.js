import { infoDalil, infoKitab, infoQuran, infoSumber } from '../data/info.js';
import { ragamBacaan } from '../data/ragam.js';

export function renderInfo() {
    if (!infoDalil.some(g => g.judul === "Ragam Bacaan Sholat")) {
        const have = new Set(infoDalil.flatMap(g => g.items));
        const extra = [];
        ragamBacaan.forEach(g => g.items.forEach(v => (v.refs || []).forEach(r => {
            const k = r.k + ':' + r.n;
            if (!have.has(k)) { have.add(k); extra.push(k); }
        })));
        if (extra.length) infoDalil.push({ judul: "Ragam Bacaan Sholat", items: extra });
    }
    const sumber = document.getElementById('info-sumber');
    const quran = document.getElementById('info-quran');
    const dalil = document.getElementById('info-dalil');
    if (!sumber || !quran || !dalil) return;
    sumber.innerHTML = infoSumber.map(x => `
        <a href="${x.url}" target="_blank" rel="noopener noreferrer" class="block bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:border-gold-400 transition">
            <span class="inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mb-1">${x.peran}</span>
            <h4 class="font-bold text-emerald-900 text-sm"><i class="fa-solid fa-globe text-gold-500 mr-1"></i> ${x.nama}</h4>
            <p class="text-[11px] text-slate-500 break-all">${x.url.replace('https://', '')}</p>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">${x.ket}</p>
        </a>`).join('');
    quran.innerHTML = infoQuran.map(([sr, ay, label]) => `
        <a href="https://quran.com/${sr}/${ay}" target="_blank" rel="noopener noreferrer" class="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-emerald-800 font-medium hover:border-gold-400 transition">QS. ${label}</a>`).join('');
    dalil.innerHTML = infoDalil.map(g => `
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <h4 class="font-bold text-emerald-900 text-sm mb-2">${g.judul}</h4>
            <div class="flex flex-wrap gap-2">
                ${g.items.map(k => { const [kt, no] = k.split(':'); return `<a href="https://www.hadits.id/hadits/${kt}/${no}" target="_blank" rel="noopener noreferrer" class="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-emerald-800 font-medium hover:border-gold-400 transition">${infoKitab[kt]} ${no}</a>`; }).join('')}
            </div>
        </div>`).join('');
}
