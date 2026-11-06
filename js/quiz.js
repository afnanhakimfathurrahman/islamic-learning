import { quizBank } from './data/quiz.js';

/* -------------------------------------------------------------
   QUIZ ENGINE
------------------------------------------------------------- */
export const QUIZ_KEY = 'quiz_progress';

export const QUIZ_ROUND_SIZE = 10;

export const QUIZ_POINTS = 10;

export const QUIZ_BONUS = 20;

export let quizProgress = loadQuizProgress();

export let quizRound = null;

export function loadQuizProgress() {
    try {
        const p = JSON.parse(localStorage.getItem(QUIZ_KEY));
        if (p && typeof p.level === 'number' && p.best) return { level: p.level, best: p.best, lastIds: p.lastIds || [] };
    } catch (e) { /* data rusak: mulai dari awal */ }
    return { level: 1, best: {}, lastIds: [] };
}

export function saveQuizProgress() {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizProgress));
}

export const quizShuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

export function quizTotalScore() {
    return Object.values(quizProgress.best).reduce((s, v) => s + v, 0);
}

// Pilih soal acak berbobot: level lebih tinggi -> soal sulit lebih sering muncul
export function quizPick(pool, n, level) {
    const weight = (q) => q.lvl === 1 ? Math.max(1, 4 - level) : q.lvl === 2 ? 2 : 1 + level * 0.5;
    const rest = pool.slice();
    const out = [];
    while (out.length < n && rest.length) {
        const total = rest.reduce((s, q) => s + weight(q), 0);
        let r = Math.random() * total, k = 0;
        for (; k < rest.length - 1; k++) { r -= weight(rest[k]); if (r <= 0) break; }
        out.push(rest.splice(k, 1)[0]);
    }
    return out;
}

export function quizBuildRound() {
    const fresh = quizBank.filter(q => !quizProgress.lastIds.includes(q.id));
    const byType = (t, src) => src.filter(q => q.t === t);
    const quota = { mc: 4, fill: 2, tf: 1, order: 2, match: 1 };
    const chosen = [];
    Object.entries(quota).forEach(([t, n]) => {
        let src = byType(t, fresh);
        if (src.length < n) src = byType(t, quizBank); // bank menipis: boleh mengulang
        chosen.push(...quizPick(src, n, quizProgress.level));
    });
    // Jika masih kurang (jenis soal kosong), tambah dari sisa bank
    if (chosen.length < QUIZ_ROUND_SIZE) {
        const ids = new Set(chosen.map(q => q.id));
        chosen.push(...quizPick(quizBank.filter(q => !ids.has(q.id)), QUIZ_ROUND_SIZE - chosen.length, quizProgress.level));
    }
    return quizShuffle(chosen).map(quizPrepare);
}

// Siapkan tampilan per soal (acak opsi, dll.) tanpa mengubah data bank
export function quizPrepare(q) {
    const v = { q, done: false, ok: false, yours: '', correct: '' };
    if (q.t === 'mc' || q.t === 'fill') {
        v.opts = quizShuffle(q.opts.map((text, i) => ({ text, right: i === 0 })));
        v.correct = q.opts[0];
    } else if (q.t === 'tf') {
        v.opts = [{ text: 'Benar', right: q.a === true }, { text: 'Salah', right: q.a === false }];
        v.correct = q.a ? 'Benar' : 'Salah';
    } else if (q.t === 'order') {
        v.pool = quizShuffle(q.items.map((text, i) => ({ text, i })));
        v.ans = [];
        v.correct = q.items.map((t, i) => `${i + 1}. ${t}`).join(' → ');
    } else if (q.t === 'match') {
        v.right = quizShuffle(q.pairs.map((p, i) => ({ text: p[1], i })));
        v.map = {};
        v.sel = null;
        v.correct = q.pairs.map(p => `${p[0]} = ${p[1]}`).join('; ');
    }
    return v;
}

export function quizStart() {
    quizRound = { items: quizBuildRound(), idx: 0, screen: 'play' };
    quizProgress.lastIds = quizRound.items.map(v => v.q.id);
    saveQuizProgress();
    renderQuiz();
}

export function quizHome() {
    quizRound = null;
    renderQuiz();
}

export function quizCurrent() { return quizRound.items[quizRound.idx]; }

export function quizFinishQuestion(v, ok, yours) {
    v.done = true;
    v.ok = ok;
    v.yours = yours;
    renderQuiz();
}

export function quizChoose(i) {
    const v = quizCurrent();
    if (v.done) return;
    v.pickedIdx = i;
    quizFinishQuestion(v, v.opts[i].right, v.opts[i].text);
}

export function quizOrderAdd(poolIdx) {
    const v = quizCurrent();
    if (v.done) return;
    v.ans.push(v.pool.splice(poolIdx, 1)[0]);
    renderQuiz();
}

export function quizOrderRemove(ansIdx) {
    const v = quizCurrent();
    if (v.done) return;
    v.pool.push(v.ans.splice(ansIdx, 1)[0]);
    renderQuiz();
}

export function quizOrderCheck() {
    const v = quizCurrent();
    if (v.done || v.pool.length) return;
    const ok = v.ans.every((a, i) => a.i === i);
    quizFinishQuestion(v, ok, v.ans.map((a, i) => `${i + 1}. ${a.text}`).join(' → '));
}

export function quizMatchLeft(i) {
    const v = quizCurrent();
    if (v.done) return;
    v.sel = v.sel === i ? null : i;
    renderQuiz();
}

export function quizMatchRight(i) {
    const v = quizCurrent();
    if (v.done || v.sel === null) return;
    Object.keys(v.map).forEach(k => { if (v.map[k] === i) delete v.map[k]; });
    v.map[v.sel] = i;
    v.sel = null;
    renderQuiz();
}

export function quizMatchCheck() {
    const v = quizCurrent();
    if (v.done || Object.keys(v.map).length < v.q.pairs.length) return;
    const ok = v.q.pairs.every((p, i) => v.map[i] === i);
    const yours = v.q.pairs.map((p, i) => `${p[0]} = ${v.q.pairs[v.map[i]][1]}`).join('; ');
    quizFinishQuestion(v, ok, yours);
}

export function quizNext() {
    if (quizRound.idx < quizRound.items.length - 1) {
        quizRound.idx++;
    } else {
        quizEndRound();
        return;
    }
    renderQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function quizEndRound() {
    const correct = quizRound.items.filter(v => v.ok).length;
    const perfect = correct === quizRound.items.length;
    const score = correct * QUIZ_POINTS + (perfect ? QUIZ_BONUS : 0);
    const level = quizProgress.level;
    quizRound.screen = 'result';
    quizRound.result = { correct, perfect, score, level };
    if (score > (quizProgress.best[level] || 0)) quizProgress.best[level] = score;
    saveQuizProgress();
    renderQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function quizNextLevel() {
    quizProgress.level++;
    saveQuizProgress();
    quizStart();
}

export function quizReset() {
    if (!confirm('Hapus semua level dan skor kuis? Tindakan ini tidak bisa dibatalkan.')) return;
    quizProgress = { level: 1, best: {}, lastIds: [] };
    saveQuizProgress();
    quizHome();
}

/* ---------- Rendering ---------- */
export const quizBtnBase = 'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition ';

export const quizBtnIdle = 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300';

export function quizScoreTable() {
    const levels = Object.keys(quizProgress.best).map(Number).sort((a, b) => a - b);
    if (!levels.length) return '';
    return `
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 class="font-bold text-emerald-900 mb-3 text-sm"><i class="fa-solid fa-ranking-star text-gold-500 mr-1"></i> Skor Per Level</h3>
            <div class="divide-y divide-slate-100 text-sm">
                ${levels.map(l => `
                    <div class="flex items-center justify-between py-2">
                        <span class="text-slate-600">Level ${l}${l < quizProgress.level ? ' <i class="fa-solid fa-circle-check text-emerald-600 ml-1"></i>' : ''}</span>
                        <span class="font-semibold text-emerald-800">${quizProgress.best[l]} poin</span>
                    </div>`).join('')}
                <div class="flex items-center justify-between pt-3 font-bold text-emerald-900">
                    <span>Total Skor</span><span>${quizTotalScore()} poin</span>
                </div>
            </div>
        </div>`;
}

export function renderQuiz() {
    const root = document.getElementById('quiz-root');
    if (!root) return;
    if (!quizRound) root.innerHTML = quizViewHome();
    else if (quizRound.screen === 'result') root.innerHTML = quizViewResult();
    else root.innerHTML = quizViewQuestion();
}

export function quizViewHome() {
    const started = Object.keys(quizProgress.best).length > 0;
    return `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-4">
            <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-900 text-gold-400 text-3xl shadow"><i class="fa-solid fa-circle-question"></i></div>
            <div>
                <p class="text-xs font-bold uppercase tracking-wider text-gold-600">Level ${quizProgress.level}</p>
                <p class="text-sm text-slate-600 mt-1">Total skor: <strong class="text-emerald-800">${quizTotalScore()} poin</strong></p>
            </div>
            <p class="text-sm text-slate-600 max-w-md mx-auto">10 soal acak dari seluruh materi: pilihan ganda, benar/salah, lengkapi bacaan, susun urutan, dan pasangkan arti. Jawab semuanya dengan benar untuk naik level.</p>
            <button onclick="quizStart()" class="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow transition">
                <i class="fa-solid fa-play mr-1"></i> ${started ? 'Mulai Level ' + quizProgress.level : 'Mulai Kuis'}
            </button>
            ${started ? `<div><button onclick="quizReset()" class="text-xs text-slate-500 underline">Reset kemajuan</button></div>` : ''}
        </div>
        ${quizScoreTable()}`;
}

export function quizViewQuestion() {
    const v = quizCurrent();
    const q = v.q;
    const n = quizRound.idx + 1, total = quizRound.items.length;
    let body = '';

    if (q.t === 'mc' || q.t === 'fill' || q.t === 'tf') {
        body = (q.ar ? `<div class="bg-slate-50 rounded-xl p-4 mb-3"><p class="font-arabic arabic-size text-center text-emerald-950 leading-loose" dir="rtl">${q.ar}</p></div>` : '')
            + `<div class="space-y-2.5">` + v.opts.map((o, i) => {
                let cls = quizBtnIdle;
                if (v.done) {
                    if (o.right) cls = 'bg-emerald-100 border-emerald-500 text-emerald-900';
                    else if (v.pickedIdx === i) cls = 'bg-red-50 border-red-400 text-red-800';
                    else cls = 'bg-white border-slate-200 text-slate-400';
                }
                const arabic = q.t === 'fill' ? ' font-arabic text-xl text-center' : '';
                return `<button ${v.done ? 'disabled' : ''} onclick="quizChoose(${i})" class="${quizBtnBase}${cls}${arabic}" ${q.t === 'fill' ? 'dir="rtl"' : ''}>${o.text}</button>`;
            }).join('') + `</div>`;
    } else if (q.t === 'order') {
        body = `
            <p class="text-xs text-slate-500 mb-2">Ketuk item sesuai urutan. Ketuk jawaban untuk membatalkan.</p>
            <div class="min-h-[3rem] space-y-2 mb-4 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-3">
                ${v.ans.length ? v.ans.map((a, i) => `
                    <button ${v.done ? 'disabled' : ''} onclick="quizOrderRemove(${i})" class="${quizBtnBase}${v.done ? (a.i === i ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-red-50 border-red-400 text-red-800') : 'bg-emerald-100 border-emerald-300 text-emerald-900'}">
                        <span class="font-bold mr-1">${i + 1}.</span> ${a.text}</button>`).join('') : '<p class="text-xs text-slate-400 text-center">Jawaban Anda muncul di sini</p>'}
            </div>
            <div class="space-y-2">
                ${v.pool.map((p, i) => `<button onclick="quizOrderAdd(${i})" class="${quizBtnBase}${quizBtnIdle}">${p.text}</button>`).join('')}
            </div>
            ${v.done ? '' : `<button onclick="quizOrderCheck()" ${v.pool.length ? 'disabled' : ''} class="mt-4 w-full py-3 rounded-xl font-bold text-sm text-white transition ${v.pool.length ? 'bg-slate-300' : 'bg-emerald-800 hover:bg-emerald-900'}">Periksa Jawaban</button>`}`;
    } else if (q.t === 'match') {
        const rightUsed = new Set(Object.values(v.map));
        body = `
            <p class="text-xs text-slate-500 mb-2">Ketuk kata Arab, lalu ketuk artinya. Ketuk lagi untuk mengubah.</p>
            <div class="grid grid-cols-2 gap-3">
                <div class="space-y-2">
                    ${q.pairs.map((p, i) => {
                        const chosen = v.map[i] !== undefined;
                        const right = v.done && v.map[i] === i;
                        let cls = v.sel === i ? 'bg-gold-500/20 border-gold-500 text-emerald-950' : chosen ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : quizBtnIdle;
                        if (v.done) cls = right ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : 'bg-red-50 border-red-400 text-red-800';
                        return `<button ${v.done ? 'disabled' : ''} onclick="quizMatchLeft(${i})" class="${quizBtnBase}${cls} font-arabic text-lg text-center" dir="rtl">${p[0]}${chosen ? `<span class="block text-[11px] font-sans font-semibold" dir="ltr">${q.pairs[v.map[i]][1]}</span>` : ''}</button>`;
                    }).join('')}
                </div>
                <div class="space-y-2">
                    ${v.right.map(r => `<button ${v.done ? 'disabled' : ''} onclick="quizMatchRight(${r.i})" class="${quizBtnBase}${rightUsed.has(r.i) ? 'bg-slate-100 border-slate-200 text-slate-400' : quizBtnIdle} text-center text-xs">${r.text}</button>`).join('')}
                </div>
            </div>
            ${v.done ? '' : `<button onclick="quizMatchCheck()" ${Object.keys(v.map).length < q.pairs.length ? 'disabled' : ''} class="mt-4 w-full py-3 rounded-xl font-bold text-sm text-white transition ${Object.keys(v.map).length < q.pairs.length ? 'bg-slate-300' : 'bg-emerald-800 hover:bg-emerald-900'}">Periksa Jawaban</button>`}`;
    }

    const feedback = v.done ? `
        <div class="mt-4 rounded-xl p-4 text-sm ${v.ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'}">
            <p class="font-bold mb-1">${v.ok ? '<i class="fa-solid fa-circle-check"></i> Benar!' : '<i class="fa-solid fa-circle-xmark"></i> Belum tepat'}</p>
            ${v.ok ? '' : `<p class="text-xs mb-1">Jawaban benar: <strong>${v.correct}</strong></p>`}
            <p class="text-xs">${q.exp} <span class="text-slate-500">(${q.src})</span></p>
        </div>
        <button onclick="quizNext()" class="mt-4 w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold text-sm transition">${n === total ? 'Lihat Hasil' : 'Lanjut'} <i class="fa-solid fa-arrow-right ml-1"></i></button>` : '';

    return `
        <div class="space-y-4">
            <div>
                <div class="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                    <span>Level ${quizProgress.level} · Soal ${n}/${total}</span>
                    <span>${q.topic}</span>
                </div>
                <div class="h-2 rounded-full bg-slate-200 overflow-hidden"><div class="h-full bg-emerald-700 transition-all" style="width:${(quizRound.idx + (v.done ? 1 : 0)) / total * 100}%"></div></div>
            </div>
            <div class="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 class="font-bold text-slate-800 mb-4 leading-snug">${q.q}</h3>
                ${body}
                ${feedback}
            </div>
        </div>`;
}

export function quizViewResult() {
    const r = quizRound.result;
    const wrong = quizRound.items.filter(v => !v.ok);
    return `
        <div class="space-y-4">
            <div class="bg-white rounded-2xl border ${r.perfect ? 'border-emerald-300' : 'border-slate-200'} p-6 text-center space-y-3">
                <div class="inline-flex h-16 w-16 items-center justify-center rounded-full ${r.perfect ? 'bg-emerald-100 text-emerald-700' : 'bg-gold-500/20 text-gold-600'} text-3xl">
                    <i class="fa-solid ${r.perfect ? 'fa-circle-check' : 'fa-book-open-reader'}"></i></div>
                <p class="text-xs font-bold uppercase tracking-wider text-gold-600">Level ${r.level}</p>
                <p class="text-3xl font-extrabold text-emerald-900">${r.correct}/${quizRound.items.length}</p>
                <p class="text-sm text-slate-600">Skor level ini: <strong class="text-emerald-800">${r.score} poin</strong>${r.perfect ? ` (termasuk bonus ${QUIZ_BONUS} poin)` : ''}</p>
                <p class="text-sm text-slate-600">${r.perfect ? 'Masyaa Allah, semua benar! Siap lanjut ke level berikutnya?' : 'Sedikit lagi. Pelajari koreksi di bawah, lalu coba lagi dengan soal baru.'}</p>
                <div class="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                    ${r.perfect
                        ? `<button onclick="quizNextLevel()" class="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm">Lanjut ke Level ${r.level + 1} <i class="fa-solid fa-arrow-right ml-1"></i></button>`
                        : `<button onclick="quizStart()" class="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm"><i class="fa-solid fa-rotate-right mr-1"></i> Ulangi Level ${r.level}</button>`}
                    <button onclick="quizHome()" class="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm">Ringkasan Skor</button>
                </div>
            </div>
            ${wrong.length ? `
            <div class="space-y-3">
                <h3 class="font-bold text-emerald-900 text-sm"><i class="fa-solid fa-lightbulb text-gold-500 mr-1"></i> Koreksi (${wrong.length} soal)</h3>
                ${wrong.map(v => `
                    <div class="bg-white rounded-2xl border border-red-200 p-4 text-sm space-y-1.5">
                        <p class="font-semibold text-slate-800">${v.q.q}</p>
                        ${v.q.ar ? `<p class="font-arabic text-lg text-center text-emerald-950" dir="rtl">${v.q.ar}</p>` : ''}
                        <p class="text-xs text-red-700"><i class="fa-solid fa-xmark mr-1"></i> Jawaban Anda: ${v.yours || '-'}</p>
                        <p class="text-xs text-emerald-800"><i class="fa-solid fa-check mr-1"></i> Jawaban benar: <strong>${v.correct}</strong></p>
                        <p class="text-xs text-slate-600">${v.q.exp} <span class="text-slate-500">(${v.q.src})</span></p>
                    </div>`).join('')}
            </div>` : ''}
            ${quizScoreTable()}
        </div>`;
}
