import { state } from './state.js';

/* -------------------------------------------------------------
   5. UTILITIES (Search, Font Size, Bookmarks)
------------------------------------------------------------- */
export function openLightbox(src, title) {
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const scroll = document.getElementById('lightbox-scroll');
    document.getElementById('lightbox-title').innerText = title || 'Infografis';
    img.src = src;
    img.alt = title || 'Infografis';
    document.getElementById('lightbox-open').href = src;
    box.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    scroll.scrollTop = 0;
}

export function closeLightbox(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('lightbox').classList.add('hidden');
    document.getElementById('lightbox-img').src = '';
    document.body.classList.remove('overflow-hidden');
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
});

export function toggleSearch() {
    const sb = document.getElementById('search-bar');
    sb.classList.toggle('hidden');
    if (!sb.classList.contains('hidden')) {
        document.getElementById('search-input').focus();
    }
}

export function toggleSettings() {
    document.getElementById('settings-bar').classList.toggle('hidden');
}

export function changeFontSize(delta) {
    state.currentFontSize = Math.max(20, Math.min(42, state.currentFontSize + delta));
    document.documentElement.style.setProperty('--arabic-size', state.currentFontSize + 'px');
    document.getElementById('font-size-label').innerText = state.currentFontSize + 'px';
}
