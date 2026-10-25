Berikut adalah dokumen spesifikasi teknis lengkap (SPECIFICATION.md) dalam format Markdown. Dokumen ini dirancang khusus agar dapat dibaca dan dipahami oleh AI Coding Assistant (seperti Cursor, Claude Code, OpenCode CLI, atau Windsurf) untuk pengembangan dan pemeliharaan aplikasi lebih lanjut.
Anda bisa menyimpan konten di bawah ini ke dalam file bernama SPECIFICATION.md di folder utama (root) repositori Anda.
# Technical Specification Document: Panduan Sholat & Wudhu Sesuai Sunnah (PWA)

## 1. Project Overview & Context
- **Project Name**: Panduan Sholat & Wudhu Sesuai Sunnah
- **Target Audience**: Umat Muslim yang ingin mempelajari tata cara sholat dan wudhu yang sesuai dengan dalil sahih.
- **Primary Reference Source**: [Rumaysho.com](https://rumaysho.com) (Ustadz Muhammad Abduh Tuasikal, M.Sc.)
- **Repository URL**: `https://github.com/kamaludin68/islamic-learning`
- **Architecture**: Single Page Application (SPA), Progressive Web App (PWA) offline-first.
- **Design Persona**: Clean Islamic Modern Aesthetic (Emerald Green `#064e3b`, Gold/Amber accents `#f59e0b`, Light Slate background `#f8fafc`). Character illustrations must strictly use faceless Muslim avatars (karakter Muslim tanpa wajah).

---

## 2. Technical Stack & Dependencies
- **Markup/Styling**: HTML5, Tailwind CSS (via CDN or JIT compilation).
- **Icons**: FontAwesome 6.4.0 (via CDN).
- **Typography**:
  - Latin: `Plus Jakarta Sans`, sans-serif
  - Arabic: `Amiri`, serif
- **State Management & Interactivity**: Vanilla JavaScript (ES6+) with `localStorage` persistence.
- **PWA Capabilities**: Service Worker (`sw.js`), Web App Manifest (`manifest.json`), Offline Caching Strategy (Cache-First or Stale-While-Revalidate).

---

## 3. Directory & File Structure

islamic-learning/
├── index.html               # Main Single-Page Application
├── manifest.json            # Web App Manifest for PWA installation
├── sw.js                    # Service Worker for offline functionality
├── SPECIFICATION.md         # AI-readable technical specification (this file)
├── image_0.png              # Visual diagram for Wudhu step-by-step
└── 1792763798721.jpg        # Visual diagram for Sholat step-by-step

---

## 4. Core Features & Functional Requirements

### 4.1 Header & Global Navigation
- **Branding**: Title "Panduan Sholat & Wudhu" with subtitle referencing "Rumaysho.com".
- **Dynamic Font Resizer**:
  - `changeFontSize(direction)` function modifies global content scaling (`rem` units) dynamically between `0.8rem` and `1.5rem`.
  - Adjusts `.arabic` font size proportionally.
- **Tab Navigation Bar**:
  - Horizontal scrollable bar for mobile/tablet optimization.
  - Active tab state management saved to `localStorage.getItem('activeTab')`.
  - Tabs:
    1. `home` (Utama / Dalil Sholat 5 Waktu)
    2. `syarat` (Syarat Sah Sholat)
    3. `wudhu` (Tata Cara & Infografis Wudhu)
    4. `rukun-sholat` (Rukun, Infografis & Bacaan Sholat)
    5. `batal` (Pembatal Sholat)

### 4.2 Global Real-time Search Filter
- **Input Field**: Top search bar listening on `oninput="handleSearch()"`.
- **Target Items**: Elements marked with `.search-item` class.
- **Behavior**: Case-insensitive client-side filtering that toggles `display: block` / `display: none` based on matching text content (Arabic, transliteration, or translation).

### 4.3 Feature Modules & Content Schema

#### Module 1: Home (Dalil Sholat 5 Waktu)
- **Sub-section 1.1: Dalil Wajibnya Sholat**
  - Quran: QS. Al-Baqarah: 43 (Arabic, Translation).
  - Hadith: HR. Bukhari no. 8 & Muslim no. 16 (Rukun Islam).
- **Sub-section 1.2: Ganjaran Mengerjakan Sholat**
  - Hadith: HR. Muslim no. 223 (Pelebur dosa).
  - Hadith: HR. Bukhari no. 528 (Perumpamaan air sungai mengalir).
- **Sub-section 1.3: Ancaman Meninggalkan Sholat**
  - Quran: QS. Maryam: 59.
  - Hadith: HR. Muslim no. 82 (Batas kekafiran).

#### Module 2: Syarat Sah Sholat
- Itemized list with detailed explanations and Dalil references:
  1. Islam (QS. Ali 'Imran: 85)
  2. Berakal (HR. Abu Daud no. 4403)
  3. Tamyiz (HR. Abu Daud no. 495)
  4. Thaharah / Suci dari Hadats (QS. Al-Ma'idah: 6)
  5. Menghilangkan Najis (HR. Bukhari no. 216 & Muslim no. 292)
  6. Menutup Aurat (QS. Al-A'raf: 31 & HR. Tirmidzi no. 377)
  7. Masuk Waktu Sholat (QS. An-Nisa': 103)
  8. Menghadap Kiblat (QS. Al-Baqarah: 144)
  9. Niat (HR. Bukhari no. 1 & Muslim no. 1907)

#### Module 3: Tata Cara Wudhu
- **Visual Infographic**: Embedded image `image_0.png` showing step-by-step Wudhu with faceless Muslim avatars.
- **Syarat Sah Wudhu**: Detailed breakdown (Islam, berakal, tamyiz, niat, air muthohir, dll).
- **Rukun Wudhu (Wajib)**: QS. Al-Ma'idah: 6 (Wajah, Tangan ke siku, Kepala/Telinga, Kaki ke mata kaki, Tertib, Muwalat).
- **Sunnah Wudhu**: Basmalah, Siwak, membasuh dua telapak tangan, menyela jari/jenggot, Doa setelah Wudhu (HR. Muslim no. 234).
- **Ancaman Wudhu Tidak Sempurna**: HR. Bukhari no. 60 & Muslim no. 240 ("Celakalah tumit-tumit dari api neraka").

#### Module 4: Rukun & Bacaan Sholat
- **Visual Infographic**: Embedded image `1792763798721.jpg` showing complete prayer movements.
- **14 Rukun Sholat Grid**: Responsive grid overview.
- **Word-by-Word Interactivity**:
  - Breakdown of key recitations (Takbir, Doa Istiftah, Rukuk, I'tidal, Sujud, Duduk antara dua sujud).
  - Arabic text paired with word-by-word Indonesian transliteration and literal word meaning grid.

#### Module 5: Yang Membatalkan Sholat
- Itemized list of invalidating conditions:
  1. Berbicara dengan sengaja (HR. Muslim no. 537)
  2. Banyak melakukan gerakan di luar sholat
  3. Berhadats kecil/besar (HR. Bukhari no. 135)
  4. Tertawa terbahak-bahak (Ijma' ulama)
  5. Terbukanya aurat secara sengaja
  6. Berpaling jauh dari kiblat
  7. Makan dan minum

#### Footer Requirement
- Mandatory attribution footer referencing [Rumaysho.com](https://rumaysho.com) (Ustadz Muhammad Abduh Tuasikal, M.Sc.).

---

## 5. Guidelines for AI Assistants & Contributors
1. **Maintain Image References**: Never remove or broken-link `image_0.png` or `1792763798721.jpg`.
2. **Dalil Integrity**: All Islamic texts must strictly retain full Matan (Arabic script), Indonesian translation, and precise source attributions (Surah/Ayat or Hadith Collector + Number).
3. **Faceless Avatar Rule**: Any new images generated or added must strictly feature faceless Muslim avatars (tanpa wajah).
4. **Offline Capability**: Ensure any new assets added are registered in `sw.js` precache manifest.
5. **UI Consistency**: Maintain Tailwind CSS emerald/gold color scheme and `Amiri` font styling for all Arabic typography.

Commit & Push ke GitHub
Jalankan perintah berikut di terminal Anda untuk memasukkan file spesifikasi ini ke dalam repositori:
# Tambahkan file SPECIFICATION.md
git add SPECIFICATION.md

# Commit perubahan
git commit -m "Add AI-readable technical specification document (SPECIFICATION.md)"

# Push ke GitHub
git push origin main

