// Tema warna: label, warna swatch (skala 500) dan warna bilah browser (skala 900)
export const THEMES = {
    langit: { label: 'Langit Pagi', swatch: '#8abae2', bar: '#375e85' },
    zamrud: { label: 'Zamrud', swatch: '#10b981', bar: '#064e3b' },
    taman: { label: 'Taman (mint pastel)', swatch: '#84c6a2', bar: '#3a6955' },
    senja: { label: 'Lavender pastel', swatch: '#ac98e0', bar: '#55448c' },
    coklat: { label: 'Coklat', swatch: '#a67c52', bar: '#4a3222' },
    gelap: { label: 'Gelap', swatch: '#3f3f46', bar: '#171717' }
};

export function applyTheme(name) {
    if (!THEMES[name]) name = 'langit';
    document.documentElement.dataset.theme = name;
    try { localStorage.setItem('theme', name); } catch (e) {}
    document.getElementById('meta-theme-color').setAttribute('content', THEMES[name].bar);
    updateAppIdentity(name);
    renderThemePicker();
}

// Ikon & manifest mengikuti tema. Tema default memakai manifest.json + icon-*.png; tema lain memakai icon-<tema>-*.png
// dan manifest sementara (Blob) dengan URL absolut (relatif ke document.baseURI = akar situs, juga di halaman turunan). Ikon aplikasi yang sudah terpasang tidak berubah sampai dipasang ulang.
export const BASE_MANIFEST_HREF = document.getElementById('app-manifest').getAttribute('href');

export let themeManifestUrl = null;

export function themeIcon(name, size) {
    return new URL(`icon${name === 'langit' ? '' : '-' + name}-${size}.png`, document.baseURI).href;
}

export async function updateAppIdentity(name) {
    document.getElementById('app-icon').href = themeIcon(name, 192);
    document.getElementById('app-apple-icon').href = themeIcon(name, 192);
    const link = document.getElementById('app-manifest');
    if (name === 'langit') { link.href = BASE_MANIFEST_HREF; return; }
    try {
        const m = await (await fetch(BASE_MANIFEST_HREF)).json();
        const abs = (u) => new URL(u, document.baseURI).href;
        m.id = abs(m.id); m.scope = abs(m.scope); m.start_url = abs(m.start_url);
        m.theme_color = m.background_color = THEMES[name].bar;
        m.icons = [192, 512].flatMap((sz) => ['any', 'maskable'].map((purpose) =>
            ({ src: themeIcon(name, sz), sizes: `${sz}x${sz}`, type: 'image/png', purpose })));
        const url = URL.createObjectURL(new Blob([JSON.stringify(m)], { type: 'application/manifest+json' }));
        if (themeManifestUrl) URL.revokeObjectURL(themeManifestUrl);
        themeManifestUrl = url;
        if (document.documentElement.dataset.theme === name) link.href = url;
    } catch (e) { /* tanpa jaringan/cache: tetap pakai manifest bawaan */ }
}

export function renderThemePicker() {
    const current = document.documentElement.dataset.theme;
    document.getElementById('theme-picker').innerHTML = Object.entries(THEMES).map(([k, t]) =>
        `<button onclick="applyTheme('${k}')" title="${t.label}" aria-label="Tema ${t.label}" class="theme-swatch${k === current ? ' active' : ''}" style="background:${t.swatch}"></button>`
    ).join('');
}
