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
├── wudhu.jpg                # Infografis gerakan wudhu (faceless Muslim avatars)
├── sholat.jpg               # Infografis gerakan sholat (faceless Muslim avatars)
├── icon-192.png             # PWA app icon (192x192)
└── icon-512.png             # PWA app icon (512x512)

---

## 4. Core Features & Functional Requirements

### 4.1 Header & Global Navigation
- **Branding**: Title "Panduan Sholat & Wudhu" with subtitle referencing "Rumaysho.com".
- **Dynamic Font Resizer**:
  - `changeFontSize(delta)` updates the CSS variable `--arabic-size` between `20px` and `42px`.
  - The `.arabic-size` class applies the variable to Arabic recitation blocks.
- **Tab Navigation Bar**:
  - Horizontal scrollable bar for mobile/tablet optimization.
  - Tab switching is handled by `switchTab(tabId)`.
  - Tabs:
    1. `home` (Utama / Dalil Sholat 5 Waktu)
    2. `syarat` (Syarat Sah Sholat)
    3. `wudhu` (Tata Cara & Infografis Wudhu)
    4. `rukun` (Rukun, Infografis & Bacaan Sholat)
    5. `pembatal` (Pembatal Sholat)
    6. `bookmarks` (Favorit)

### 4.2 Global Real-time Search Filter
- **Input Field**: Top search bar listening on `oninput="handleSearch()"`.
- **Target Items**: Elements marked with `.search-item` class.
- **Behavior**: Case-insensitive client-side filtering of `.search-item` cards across all tabs. Matching tabs are revealed and a result-count banner (`#search-status`) is shown. Clearing the input restores the previously active tab, wudhu sub-tab, and sholat sub-tab. The search covers Arabic matan, transliteration, translation, and explanatory text.

### 4.3 Feature Modules & Content Schema

#### Module 1: Home (Dalil Sholat 5 Waktu)

##### Sub-section 1.1: Dalil Wajibnya Sholat
- **QS. Al-Baqarah: 43**
  - **Matan**: وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ
  - **Terjemahan**: "Dan laksanakanlah sholat, tunaikanlah zakat, dan rukuklah bersama orang-orang yang rukuk."
- **HR. Bukhari no. 8 & Muslim no. 16 (Rukun Islam)**
  - **Matan**: بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ
  - **Terjemahan**: "Islam dibangun di atas lima perkara: bersaksi bahwa tidak ada sesembahan yang berhak disembah selain Allah dan Muhammad adalah utusan Allah, mendirikan sholat, menunaikan zakat, haji, dan puasa Ramadhan."

##### Sub-section 1.2: Ganjaran Mengerjakan Sholat
- **QS. Al-Ankabut: 45**
  - **Matan**: إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ ۗ وَلَذِكْرُ اللَّهِ أَكْبَرُ
  - **Terjemahan**: "Sesungguhnya sholat itu mencegah dari (perbuatan) keji dan mungkar. Dan sungguh, mengingat Allah (sholat) itu lebih besar (keutamaannya)."
- **HR. Muslim no. 233 (Penghapus dosa kecil)**
  - **Matan**: الصَّلَاةُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ كَفَّارَةٌ لِمَا بَيْنَهُنَّ مَا لَمْ تُغْشَ الْكَبَائِرُ
  - **Terjemahan**: "Sholat lima waktu dan (sholat) Jumat ke Jumat berikutnya adalah penghapus (dosa) di antara keduanya selama tidak melakukan dosa-dosa besar."
- **HR. Bukhari no. 528 & Muslim no. 667 (Perumpamaan air sungai mengalir)**
  - **Matan**: أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ؟ قَالُوا: لَا يَبْقَى مِنْ دَرَنِهِ شَيْءٌ. قَالَ: فَذَلِكَ مَثَلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهِنَّ الْخَطَايَا
  - **Terjemahan**: "Tahukah kalian, seandainya ada sebuah sungai di depan pintu rumah salah seorang di antara kalian, lalu ia mandi di sungai itu lima kali sehari, apakah masih ada kotoran yang tersisa di badannya?" Para sahabat menjawab: "Tidak ada kotoran yang tersisa sedikit pun." Beliau bersabda: "Demikianlah perumpamaan sholat lima waktu, dengan sholat itu Allah menghapus dosa-dosa."

##### Sub-section 1.3: Ancaman Meninggalkan Sholat
- **QS. Maryam: 59**
  - **Matan**: فَخَلَفَ مِنْ بَعْدِهِمْ خَلْفٌ أَضَاعُوا الصَّلَاةَ وَاتَّبَعُوا الشَّهَوَاتِ فَسَوْفَ يَلْقَوْنَ غَيًّا
  - **Terjemahan**: "Maka datanglah setelah mereka, pengganti (yang buruk) yang menyia-nyiakan sholat dan mengikuti hawa nafsunya, maka mereka kelak akan menemui kesesatan."
- **QS. Al-Muddaththir: 42-43 (Penyebab masuk Neraka Saqar)**
  - **Matan**: مَا سَلَكَكُمْ فِي سَقَرَ . قَالُوا لَمْ نَكُ مِنَ الْمُصَلِّينَ
  - **Terjemahan**: "Apakah yang memasukkan kamu ke dalam Saqar (neraka)?" Mereka menjawab: "Dahulu kami tidak termasuk orang-orang yang melaksanakan sholat."
- **HR. Muslim no. 82 (Batas kekafiran)**
  - **Matan**: إِنَّ بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكَ الصَّلَاةِ
  - **Terjemahan**: "Sesungguhnya batasan antara seseorang dengan kesyirikan dan kekafiran adalah meninggalkan sholat."

#### Module 2: Syarat Sah Sholat
Itemized list with detailed explanations, full Matan, translation, and Dalil references:
1. **Islam**
   - **Dalil**: QS. Ali 'Imran: 85
   - **Matan**: وَمَن يَبْتَغِ غَيْرَ الْإِسْلَامِ دِينًا فَلَن يُقْبَلَ مِنْهُ وَهُوَ فِي الْآخِرَةِ مِنَ الْخَاسِرِينَ
   - **Terjemahan**: "Dan barangsiapa mencari agama selain Islam, maka tidak akan diterima (agama itu) darinya, dan di akhirat ia termasuk orang-orang yang merugi."
2. **Berakal**
   - **Dalil**: HR. Abu Daud no. 4403
   - **Matan**: رُفِعَ الْقَلَمُ عَنْ ثَلَاثَةٍ: عَنِ النَّائِمِ حَتَّى يَسْتَيْقِظَ، وَعَنِ الصَّبِيِّ حَتَّى يَحْتَلِمَ، وَعَنِ الْمَجْنُونِ حَتَّى يَعْقِلَ
   - **Terjemahan**: "Diangkat pena (tidak dicatat) dari tiga orang: orang yang tidur hingga ia bangun, anak kecil hingga ia baligh, dan orang gila hingga ia berakal."
3. **Tamyiz**
   - **Dalil**: HR. Abu Daud no. 495
   - **Matan**: مُرُوا أَوْلَادَكُمْ بِالصَّلَاةِ وَهُمْ أَبْنَاءُ سَبْعِ سِنِينَ، وَاضْرِبُوهُمْ عَلَيْهَا وَهُمْ أَبْنَاءُ عَشْرِ سِنِينَ، وَفَرِّقُوا بَيْنَهُمْ فِي الْمَضَاجِعِ
   - **Terjemahan**: "Perintahkanlah anak-anak kalian untuk sholat ketika mereka berumur tujuh tahun, pukullah mereka (mendidik) karena meninggalkannya ketika berumur sepuluh tahun, dan pisahkanlah tempat tidur mereka."
4. **Thaharah / Suci dari Hadats**
   - **Dalil**: QS. Al-Ma'idah: 6 & HR. Bukhari no. 135
   - **Matan**: لَا تُقْبَلُ صَلَاةُ مَنْ أَحْدَثَ حَتَّى يَتَوَضَّأَ
   - **Terjemahan**: "Tidak diterima sholat orang yang berhadats hingga ia berwudhu."
5. **Menghilangkan Najis**
   - **Dalil**: HR. Bukhari no. 216 & Muslim no. 292
   - **Matan**: يُعَذَّبَانِ، وَمَا يُعَذَّبَانِ فِي كَبِيرٍ، بَلَى، كَانَ أَحَدُهُمَا لَا يَسْتَتِرُ مِنْ بَوْلِهِ، وَكَانَ الْآخَرُ يَمْشِي بِالنَّمِيمَةِ
   - **Terjemahan**: "Keduanya disiksa, dan tidaklah keduanya disiksa karena perkara yang besar (menurut mereka). Sungguh, salah satunya tidak menjaga diri dari (percikan) air kencingnya, dan yang lain berjalan menyebarkan namimah (adu domba)."
6. **Menutup Aurat**
   - **Dalil**: QS. Al-A'raf: 31 & HR. Tirmidzi no. 377
   - **Matan**: يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِنْدَ كُلِّ مَسْجِدٍ . لَا تُقْبَلُ صَلَاةُ الْحَائِضِ إِلَّا بِخِمَارٍ
   - **Terjemahan**: "Wahai anak-anak Adam, pakailah pakaianmu yang indah di setiap (memasuki) masjid." (Dan) "Sholat seorang wanita yang telah haid tidak diterima kecuali dengan mengenakan khimar (penutup kepala)."
7. **Masuk Waktu Sholat**
   - **Dalil**: QS. An-Nisa': 103
   - **Matan**: إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
   - **Terjemahan**: "Sesungguhnya sholat itu adalah kewajiban yang ditetapkan waktunya atas orang-orang yang beriman."
8. **Menghadap Kiblat**
   - **Dalil**: QS. Al-Baqarah: 144
   - **Matan**: فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
   - **Terjemahan**: "Maka hadapkanlah wajahmu ke arah Masjidil Haram."
9. **Niat**
   - **Dalil**: HR. Bukhari no. 1 & Muslim no. 1907
   - **Matan**: إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
   - **Terjemahan**: "Sesungguhnya amal itu tergantung pada niatnya, dan setiap orang hanya mendapatkan apa yang ia niatkan."

#### Module 3: Tata Cara Wudhu
- **Visual Infographic**: Embedded image `wudhu.jpg` showing step-by-step Wudhu with faceless Muslim avatars.
  - Displayed as a full-width card at the top of the "Visual & Tata Cara" sub-tab.
  - Tap/click opens a fullscreen lightbox with pinch-zoom, pan, and "open in new tab" fallback.
  - The written 8-step guide follows below the infographic as compact numbered cards.
- **Syarat Sah Wudhu**: Islam, berakal, tamyiz, niat, air muthohir, menghilangkan penghalang air ke kulit, dan masuk waktu sholat bagi penderita istihadhah.
- **Rukun Wudhu (Wajib)**:
  - **Dalil**: QS. Al-Ma'idah: 6
  - **Matan**: يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ
  - **Terjemahan**: "Wahai orang-orang yang beriman! Apabila kamu hendak melaksanakan sholat, maka basuhlah wajahmu dan tanganmu sampai ke siku, dan usaplah kepalamu dan (basuh) kedua kakimu sampai ke kedua mata kaki."
  - **Rincian**: Wajah, tangan ke siku, kepala/telinga, kaki ke mata kaki, tertib, muwalat.
- **Sunnah Wudhu**:
  - **Basmalah** — HR. Abu Daud no. 101
    - **Matan**: لَا وُضُوءَ لِمَنْ لَمْ يَذْكُرِ اسْمَ اللَّهِ عَلَيْهِ
    - **Terjemahan**: "Tidak ada wudhu bagi orang yang tidak menyebut nama Allah atasnya."
  - **Siwak** — HR. Ahmad
    - **Matan**: لَوْلَا أَنْ أَشُقَّ عَلَى أُمَّتِي لَأَمَرْتُهُمْ بِالسِّوَاكِ عِنْدَ كُلِّ وُضُوءٍ
    - **Terjemahan**: "Seandainya tidak memberatkan umatku, niscaya aku perintahkan mereka bersiwak setiap kali wudhu."
  - **Membasuh dua telapak tangan, menyela jari/jenggot.**
  - **Mendahulukan yang kanan** — HR. Bukhari no. 168 & Muslim no. 268
    - **Matan**: كَانَ النَّبِيُّ ﷺ يُعْجِبُهُ التَّيَمُّنُ فِي تَنَعُّلِهِ وَتَرَجُّلِهِ وَطُهُورِهِ وَفِي شَأْنِهِ كُلِّهِ
    - **Terjemahan**: "Nabi ﷺ menyukai mendahulukan yang kanan saat memakai sandal, menyisir, bersuci, dan dalam segala urusannya."
  - **Doa setelah Wudhu** — HR. Muslim no. 234
    - **Matan**: أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ
    - **Terjemahan**: "Aku bersaksi bahwasanya tidak ada sesembahan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya, dan aku bersaksi bahwasanya Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang bersuci."
    - **Keutamaan**: مَا مِنْكُمْ مِنْ أَحَدٍ يَتَوَضَّأُ فَيُبْلِغُ أَوْ فَيُسْبِغُ الْوُضُوءَ ثُمَّ يَقُولُ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُ اللَّهِ وَرَسُولُهُ إِلَّا فُتِحَتْ لَهُ أَبْوَابُ الْجَنَّةِ الثَّمَانِيَةُ يَدْخُلُ مِنْ أَيِّهَا شَاءَ
    - **Terjemahan**: "Tidak ada seorang pun di antara kalian yang berwudhu lalu menyempurnakan wudhunya, kemudian mengucapkan 'Aku bersaksi tidak ada sesembahan yang berhak disembah selain Allah dan Muhammad adalah hamba dan utusan Allah', kecuali dibukakan baginya delapan pintu surga; ia boleh masuk dari pintu mana saja yang ia kehendaki."
- **Ancaman Wudhu Tidak Sempurna** — HR. Bukhari no. 60 & Muslim no. 242
  - **Matan**: وَيْلٌ لِلْأَعْقَابِ مِنَ النَّارِ
  - **Terjemahan**: "Celakalah bagi tumit-tumit (yang tidak terbasuh air wudhu) dari api neraka!"
  - **Penjelasan**: Hadits ini menunjukkan kewajiban meratakan air wudhu ke seluruh anggota wudhu yang wajib. Meremehkan bagian kecil seperti tumit yang kering dapat membatalkan wudhu dan diancam azab neraka.

#### Module 4: Rukun & Bacaan Sholat
- **Visual Infographic**: Embedded image `sholat.jpg` showing complete prayer movements.
  - Displayed as a full-width card at the top of "Gerakan & Rukun".
  - Tap/click opens a fullscreen lightbox with pinch-zoom, pan, and "open in new tab" fallback.
- **14 Rukun Sholat Grid**: Responsive grid overview below the infographic.
- **Word-by-Word Interactivity**:
  - Breakdown of key recitations (Takbir, Doa Istiftah, Rukuk, I'tidal, Sujud, Duduk antara dua sujud).
  - Arabic text paired with word-by-word Indonesian transliteration and literal word meaning grid.
  - Font size setting applies to Arabic recitation via the CSS variable `--arabic-size` (default `28px`, range `20px`–`42px`).

#### Module 5: Yang Membatalkan Sholat
Itemized list of invalidating conditions with Matan where a specific hadith exists:
1. **Berbicara dengan sengaja** — HR. Muslim no. 537
   - **Matan**: إِنَّ هَذِهِ الصَّلَاةَ لَا يَصْلُحُ فِيهَا شَيْءٌ مِنْ كَلَامِ النَّاسِ، إِنَّمَا هُوَ التَّسْبِيحُ وَالتَّكْبِيرُ وَقِرَاءَةُ الْقُرْآنِ
   - **Terjemahan**: "Sesungguhnya sholat ini tidak boleh di dalamnya ada sesuatu dari perkataan manusia. Sholat itu hanyalah tasbih, takbir, dan bacaan Al-Qur'an."
2. **Banyak melakukan gerakan di luar sholat** — Fikih Syafi'i (gerakan besar berturut-turut tanpa hajat).
3. **Berhadats kecil/besar** — HR. Bukhari no. 135
   - **Matan**: لَا تُقْبَلُ صَلَاةُ مَنْ أَحْدَثَ حَتَّى يَتَوَضَّأَ
   - **Terjemahan**: "Tidak diterima sholat orang yang berhadats hingga ia berwudhu."
4. **Tertawa terbahak-bahak** — Ijma' ulama (membatalkan sholat, tidak membatalkan wudhu).
5. **Terbukanya aurat secara sengaja** — QS. Al-A'raf: 31
   - **Matan**: يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِنْدَ كُلِّ مَسْجِدٍ
   - **Terjemahan**: "Wahai anak-anak Adam, pakailah pakaianmu yang indah di setiap (memasuki) masjid."
6. **Makan dan minum** — Fikih Syafi'i.
7. **Berpaling jauh dari kiblat** — QS. Al-Baqarah: 144.
8. **Mendahului imam** — HR. Bukhari no. 691 & Muslim no. 427
   - **Matan**: أَمَا يَخْشَى الَّذِي يَرْفَعُ رَأْسَهُ قَبْلَ الْإِمَامِ أَنْ يُحَوِّلَ اللَّهُ رَأْسَهُ رَأْسَ حِمَارٍ
   - **Terjemahan**: "Tidaklah orang yang mengangkat kepalanya sebelum imam takut bahwa Allah akan mengubah kepalanya menjadi kepala keledai?"
9. **Murtad atau berubah niat** — Kaidah niat.

#### Footer Requirement
- Mandatory attribution footer referencing [Rumaysho.com](https://rumaysho.com) (Ustadz Muhammad Abduh Tuasikal, M.Sc.).

---

## 5. Guidelines for AI Assistants & Contributors
1. **Maintain Image References**: Use `wudhu.jpg` for the wudhu infographic and `sholat.jpg` for the sholat infographic. Never remove, rename, or broken-link these files. Register any new image asset in `sw.js` pre-cache manifest.
2. **Dalil Integrity**: All Islamic texts must retain the **full Matan (Arabic script)**, Indonesian translation, and precise source attributions (Surah/Ayat or Hadith Collector + Number). Do not display a hadith reference without its matan unless the item is explicitly a fiqh ruling or ijma' without a specific hadith text.
3. **Faceless Avatar Rule**: Any new images generated or added must strictly feature faceless Muslim avatars (tanpa wajah).
4. **Infographic UX**: Both infographics must remain tap-to-zoom via the shared lightbox, keep descriptive `alt` text, use lazy loading, and stay readable on mobile. Provide an "open in new tab" fallback.
5. **Offline Capability**: Ensure any new assets added are registered in `sw.js` precache manifest. Bump `CACHE_NAME` when asset names change.
6. **UI Consistency**: Maintain Tailwind CSS emerald/gold color scheme and `Amiri` font styling for all Arabic typography. Use collapsible `<details>` blocks for long matan so cards stay scannable.
7. **PWA Correctness**: Use the real `manifest.json` link and register only `./sw.js`. Do not register service workers from `blob:` URLs.

---

## 6. Commit & Push ke GitHub
Jalankan perintah berikut di terminal Anda untuk memasukkan perubahan ke dalam repositori:

# Tambahkan file yang berubah
git add SPECIFICATION.md index.html sw.js manifest.json wudhu.jpg sholat.jpg icon-192.png icon-512.png

# Commit perubahan
git commit -m "Use wudhu/sholat infographics, improve UI/UX, and add hadith matan"

# Push ke GitHub
git push origin main
