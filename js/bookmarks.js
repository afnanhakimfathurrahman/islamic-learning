export let bookmarkedIds = JSON.parse(localStorage.getItem('sholat_bookmarks') || '[]');

export function bookmarkItem(id) {
    const index = bookmarkedIds.indexOf(id);
    if (index > -1) {
        bookmarkedIds.splice(index, 1);
    } else {
        bookmarkedIds.push(id);
    }
    localStorage.setItem('sholat_bookmarks', JSON.stringify(bookmarkedIds));
    renderBookmarks();
    
    // Toggle icon state
    const icon = document.getElementById(`bm-${id}`);
    if (icon) {
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
        icon.classList.toggle('text-gold-500');
    }
}

export function renderBookmarks() {
    const container = document.getElementById('bookmarks-container');
    if (bookmarkedIds.length === 0) {
        container.innerHTML = `<div class="bg-white p-8 rounded-2xl text-center text-slate-500 border border-slate-200">Belum ada item favorit yang disimpan. Klik ikon bookmark pada dalil atau bacaan.</div>`;
        return;
    }
    container.innerHTML = `<div class="bg-white p-4 rounded-xl border border-slate-200 text-sm text-emerald-800">Terdapat ${bookmarkedIds.length} item tersimpan dalam favorit Anda.</div>`;
}
