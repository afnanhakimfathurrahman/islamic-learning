# Technical Specification Document: Panduan Sholat & Wudhu Sesuai Sunnah (PWA)

## 1. Project Overview & Context
- **Project Name**: Panduan Sholat & Wudhu Sesuai Sunnah
- **Target Audience**: Umat Muslim yang ingin mempelajari tata cara sholat dan wudhu yang sesuai dengan dalil sahih.
- **Primary Reference Source**: [Hadits.id](https://www.hadits.id) (matan Arab, terjemahan, nomor, dan derajat hadits). Referensi penjelasan: Rumaysho.com, Muslim.or.id. Semua referensi dicantumkan hanya di tab Info.
- **Repository URL**: `https://github.com/kamaludin68/islamic-learning`
- **Architecture**: Single Page Application (SPA), Progressive Web App (PWA) offline-first.
- **Design Persona**: Clean Islamic Modern Aesthetic (default theme Langit Pagi: sky blue `#0c4a6e`, Gold/Amber accents `#f59e0b`, Light Slate background `#f8fafc`; selectable themes below). Character illustrations must strictly use faceless Muslim avatars (karakter Muslim tanpa wajah).

---

## 2. Technical Stack & Dependencies
- **Markup/Styling**: HTML5, Tailwind CSS (via `https://cdn.tailwindcss.com`, config inline in `<script>tailwind.config = {...}`; no build step).
- **Icons**: FontAwesome 6.4.0 (via CDN).
- **Typography**:
  - Latin: `Inter`, sans-serif (Google Fonts)
  - Arabic: `Amiri`, serif
- **State Management & Interactivity**: Vanilla JavaScript (ES6+) with `localStorage` persistence.
- **PWA Capabilities**: Service Worker (`sw.js`), Web App Manifest (`manifest.json`), Offline Caching Strategy (Cache-First or Stale-While-Revalidate).

---

## 3. Directory & File Structure

```
islamic-learning/
├── index.html               # Markup only + head scripts (theme bootstrap, tailwind config) + <script type="module" src="./js/main.js">
├── <slug>/index.html        # GENERATED per-section SEO pages (e.g. bacaan-sholat/), see section 5.5; never edit by hand
├── css/app.css              # Custom styles (themes, details, lightbox, dark overrides)
├── js/                      # ES modules (native, no bundler) - see section 5.2
├── manifest.json            # PWA manifest (id/scope/start_url "./", icons any + maskable)
├── sw.js                    # Service worker (stale-while-revalidate, per-asset precache)
├── SPECIFICATION.md         # This file: source of truth for AI agents
├── AGENTS.md                # Short entry point for AI agents (points here)
├── CLAUDE.md                # Same, for Claude Code
├── CNAME                    # GitHub Pages custom domain (belajarsholat.is-my.app)
├── scripts/run-local.sh     # Local preview server (python http.server), manual trigger
├── scripts/stop-local.sh    # Stops the local preview server
├── scripts/build-pages.mjs  # Node: writes <slug>/index.html, footer #route-links, sitemap.xml and index.html meta from js/data/routes.js
├── robots.txt / sitemap.xml # SEO (sitemap is generated)
├── og-image.jpg             # 1200x630 social share preview (og:image / twitter:image)
├── .claude/skills/          # Task playbooks for AI agents (see section 7)
├── wudhu.jpg / sholat.jpg   # Infographics (faceless Muslim avatars)
└── icon-192.png / icon-512.png
```

Hosting: GitHub Pages from branch `main`, root. Live URL: `https://belajarsholat.is-my.app/` (custom domain via the free is-my.app subdomain registry; CNAME target `kamaludin68.github.io`). The GitHub fallback URL `https://kamaludin68.github.io/islamic-learning/` redirects to the custom domain. A push to `main` deploys automatically (about 1-2 minutes). There is no build or test tooling; everything is static. The only generator is `scripts/build-pages.mjs` (section 5.5); its output is committed, so Pages still serves plain files.

---

## 4. Core Features & Functional Requirements

### 4.1 Header & Global Navigation
- **Branding**: Title "Panduan Sholat & Wudhu Sesuai Sunnah", tanpa subtitle. Nama situs referensi tidak boleh muncul di header atau konten kartu; letakkan di tab Info.
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
    6. `quiz` (Kuis)
    7. `bookmarks` (Favorit)

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
  - **Siwak** — HR. Bukhari 887 & Muslim 252
    - **Matan**: لَوْلاَ أَنْ أَشُقَّ عَلَى أُمَّتِي ـ أَوْ عَلَى النَّاسِ ـ لأَمَرْتُهُمْ بِالسِّوَاكِ مَعَ كُلِّ صَلاَةٍ
    - **Terjemahan**: "Seandainya aku tidak merasa berat bagi umatku -atau bagi manusia- niscaya aku akan memerintahkan mereka untuk bersiwak setiap kali shalat."
  - **Membasuh dua telapak tangan, menyela jari/jenggot.**
  - **Mendahulukan yang kanan** — HR. Bukhari no. 168 & Muslim no. 268
    - **Matan**: كَانَ النَّبِيُّ ﷺ يُعْجِبُهُ التَّيَمُّنُ فِي تَنَعُّلِهِ وَتَرَجُّلِهِ وَطُهُورِهِ وَفِي شَأْنِهِ كُلِّهِ
    - **Terjemahan**: "Nabi ﷺ menyukai mendahulukan yang kanan saat memakai sandal, menyisir, bersuci, dan dalam segala urusannya."
  - **Doa setelah Wudhu** — HR. Muslim no. 234
    - **Matan**: أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ
    - **Terjemahan**: "Aku bersaksi bahwasanya tidak ada sesembahan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya, dan aku bersaksi bahwasanya Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang bersuci."
    - **Tampilan**: kartu `#doa-setelah-wudhu` ada di sub-tab Sunnah; langkah 8 di Tata Cara menampilkan Arab + arti dan tautan `goToDoaWudhu()` yang membuka Sunnah dan menggulir ke kartu. Urutan: dalil (matan + arti, HR. Muslim no. 234) -> bacaan (Arab, latin, arti; tambahan doa HR. At-Tirmidzi no. 55) -> grid arti per kata. Sumber: rumaysho.com/19523.
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
  - Breakdown of 11 recitations in prayer order (`bacaanSholatWords`): Takbiratul Ihram, Doa Iftitah, Al-Fatihah, Ruku', Tasmi' (Sami'allahu liman hamidah; HR. Bukhari 689 & Muslim 411, from Rumaysho.com), I'tidal, Sujud, Duduk antara dua sujud, Tasyahud, Shalawat Ibrahimiyyah, Salam. Per-word badges must wrap (no `truncate`).
  - Arabic text paired with word-by-word Indonesian transliteration and literal word meaning grid.
  - Font size setting applies to Arabic recitation via the CSS variable `--arabic-size` (default `28px`, range `20px`–`42px`).
- **Ragam Bacaan (sub-tab ketiga, `btn-sholat-ragam` / `sholat-ragam-container`)**: daftar pilihan semua riwayat bacaan per gerakan (tujuannya menyediakan opsi, bukan membandingkan), agar tab Bacaan tidak menumpuk. Data `ragamBacaan` (13 grup berurutan sesuai sholat: iftitah, taawudz, fatihah, ruku, bangkit, itidal, sujud, duduk, tasyahud, sholawat, doasalam, salam, dzikir; tiap item: `label`, `tag` pokok|tambahan|alternatif, `arab`, `latin`, `translation`, `source`, `refs[{k,n}]`, `grade`, `madzhab`, `note`). Dirender `renderRagam()`: chip navigasi `#ragam-nav` (id `ragam-chip-<key>`), panel `ragam-g-<key>` (class `ragam-group`, satu tampil sekaligus lewat `showRagamGroup(key)`), kartu `<details class="ragam-item search-item">`, tombol sebelumnya/berikutnya, `toggleRagamAll`. Kartu di tab Bacaan hanya menampilkan tombol "Lihat N pilihan bacaan" (`openRagam(key)`, pemetaan `RAGAM_BY_WORD`). Saat pencarian aktif semua grup dibuka dan grup tanpa hasil disembunyikan; chip disembunyikan.
  - Sumber isi: latin, terjemah, dan daftar riwayat dari buku "Ragam Bacaan Sholat" (Nor Kandir, Pustaka Syabab, 1447 H); teks Arab, nomor, dan derajat diverifikasi ke Hadits.id. Item yang nomornya tidak ada di Hadits.id tidak dipakai: ta'awwudz lafaz umum dan Ahmad 22179, tasyahud 'Umar (Malik 53), shalawat Ahmad 18104, doa sebelum salam Ahmad 24215, salam satu kali (Tirmidzi 296), serta An-Nasa'i Al-Kubra 9848 dan Ash-Shahihah 114 (dzikir). Abu Daud 873 diriwayatkan 'Auf bin Malik (PDF menulis Aisyah). Arti per kata: `js/data/ragam-words.js` (`ragamWords[idItem] = [[latin, arti], ...]`, sejajar dengan Arab yang dipecah per spasi; entri kosong = tanda baca). Dirender `renderRagamWords` sebagai `<details>` "Arti per kata" di tiap kartu; dilewati bila jumlah kata tidak cocok. Glos disusun mengikuti terjemahan masing-masing riwayat (bukan sumber hadits.id), jadi perlu ditinjau bila ada yang janggal; tambahkan entri baru saat menambah riwayat. Nomor hadits ragam digabung otomatis ke Info (`renderInfo`), buku diletakkan di `infoSumber`.

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

#### Module 6: Kuis ("Yuk, Uji Pemahamanmu!")
- Tab `quiz` (`tab-quiz`, `mob-tab-quiz`, panel `content-quiz`, root `#quiz-root`, dirender oleh `renderQuiz()`). Tidak memakai `.search-item`, jadi tidak ikut pencarian.
- Satu putaran = 10 soal acak dari `quizBank`: 4 pilihan ganda (`mc`), 2 lengkapi bacaan (`fill`, kalimat Arab dengan `____`), 1 benar/salah (`tf`), 2 susun urutan (`order`), 1 pasangkan arti (`match`). Opsi diacak saat putaran dibuat; soal dari putaran sebelumnya dihindari selama bank cukup.
- Level tanpa batas. Naik level hanya jika 10/10 benar (`quizNextLevel`); jika ada salah, tampil koreksi (jawaban pemain, jawaban benar, penjelasan, sumber) dan pemain mengulang level dengan soal baru. Soal sulit lebih sering muncul di level tinggi (`quizPick`, bobot per `lvl` 1-3).
- Skor: 10 poin per jawaban benar, bonus 20 poin untuk 10/10 (maks 120 per level). Skor per level = skor terbaik pada level itu; total = jumlah skor terbaik semua level (mencegah farming).
- Persistensi: `localStorage['quiz_progress']` = `{level, best:{<level>:skor}, lastIds:[...]}`; tombol Reset meminta konfirmasi.
- Aturan Arab: soal yang menyangkut doa atau bacaan yang memiliki teks Arab di aplikasi **wajib menampilkan tulisan Arabnya** (disalin persis dari aplikasi), tidak hanya transliterasi Latin. Soal yang hanya menyebut terjemahan dalil menampilkan Arabnya pada penjelasan setelah menjawab (`QUIZ_AR`), agar jawaban tidak bocor. Soal `fill` `h1`-`h14` melengkapi ayat/hadits dari kartu dalil.
- Aturan isi: **setiap soal harus bersumber dari materi yang ada di aplikasi** (field `src` menunjuk bagian/dalil). Jangan menambah fakta atau dalil baru lewat kuis. Tambah soal dengan skill `add-quiz-question`.

#### Footer Requirement
- Footer memuat tautan ke tab Info (`switchTab('info')`), tempat semua referensi dicantumkan.
- Tab `info` (`tab-info`, `mob-tab-info`, panel `content-info`, kontainer `#info-sumber`, `#info-quran`, `#info-dalil`, dirender `renderInfo()` dari `infoSumber`, `infoQuran`, `infoDalil`). Setiap nomor hadits ditautkan ke `https://www.hadits.id/hadits/{kitab}/{nomor}`. Tambahkan nomor baru ke `infoDalil` saat menambah dalil.

---

## 5. Architecture (`index.html` + `css/` + `js/`)

### 5.1 DOM conventions (IDs are an API; JS looks them up by string)
| Purpose | ID / class pattern |
|---|---|
| Main tab buttons | `tab-<id>` (class `nav-tab`, active = `tab-active`); mobile bottom nav `mob-tab-<id>` |
| Main tab panels | `content-<id>` (class `tab-content`), `<id>` in `home, syarat, wudhu, rukun, pembatal, quiz, bookmarks` |
| Wudhu sub-tab buttons | `sub-wudhu-<name>` (class `wudhu-sub-btn`, pill style) |
| Wudhu sub-tab panels | `wudhu-sub-<name>` (class `wudhu-sub-content`), `<name>` in `langkah, syarat, rukun, sunnah, ancaman` |
| Sholat sub-tab buttons / panels | `btn-sholat-gerakan`, `btn-sholat-bacaan`, `btn-sholat-ragam` / `sholat-gerakan-container`, `sholat-bacaan-container`, `sholat-ragam-container` (+ `ragam-nav`, `ragam-body`) |
| Searchable card | class `search-item` (optional `data-search` overrides text used for matching) |
| Theme | `#theme-picker`, `#meta-theme-color` (in `#settings-bar`) |
| Quiz | `tab-quiz`, `mob-tab-quiz`, `content-quiz`, `#quiz-root` |
| Info | `tab-info`, `mob-tab-info`, `content-info`, `#info-sumber`, `#info-quran`, `#info-dalil` |
| Install button | `#pwa-install-btn` (hidden until `beforeinstallprompt`, or iOS Safari not standalone) |

### 5.2 JavaScript map (ES modules in `js/`, loaded by `js/main.js`)
Layout: `js/main.js` (init, imports everything, exposes inline-handler functions on `window` via `Object.assign(window, {...})`), `js/state.js` (shared mutable state object `state`: `searchActive`, `searchPrevState`, `currentFontSize`, `ragamActive`; imported bindings cannot be reassigned, so mutate `state.*`), `js/nav.js`, `js/search.js`, `js/theme.js`, `js/ui.js` (lightbox, search/settings toggles, font size), `js/bookmarks.js`, `js/quiz.js` (engine + views), `js/pwa.js` (install button + SW registration), `js/views/{content,ragam,info}.js` (renderers), `js/data/{syarat,wudhu,sholat,pembatal,info,ragam,quiz,routes}.js` (content only, `export const`, no logic).
**Rules**: every `onclick="fn(...)"` (static markup or generated templates) needs `fn` exported from a module AND listed in `main.js` `Object.assign(window, ...)` (verify-site checks this). Data modules must not import logic modules. Add new content to `js/data/*`; add new behaviour in the matching module, not in `index.html`. Head scripts stay inline on purpose (theme must apply before first paint; Tailwind CDN reads `tailwind.config`).
- Data arrays: `syaratData`, `wudhuStepsData`, `sholatStepsData`, `bacaanSholatWords`, `pembatalData`. Rendered by `renderSyarat/renderWudhuSteps/renderSholatSteps/renderSholatWords/renderPembatal` (and `renderDalilDetails` for collapsible matan).
- URLs (section 5.5): `routeFromLocation()`, `openRoute(route)`, `syncUrl()` (called at the end of every switch function; skipped while searching), `initRouteLinks()` (click delegation for `a[data-route]`), all in `js/nav.js`.
- Navigation: `switchTab(tabId, skipSearchReset)`, `switchWudhuSub(subId)` (accepts `'wudhu-langkah'` or `'langkah'`; null-safe), `switchSholatSub('sholat-gerakan'|'sholat-bacaan'|'sholat-ragam')`.
- Search: `toggleSearch`, `handleSearch`, `enterSearchMode` (snapshots active tab and sub-tabs), `exitSearchMode` (restores them). While searching, all sub-panels are un-hidden so matches in any sub-tab show.
- Settings: `toggleSettings`, `changeFontSize(delta)` (CSS var `--arabic-size`, default 28px, 20-42px).
- Lightbox: `openLightbox(src, title)`, `closeLightbox(event)`.
- Bookmarks (`js/bookmarks.js`): setiap kartu `.search-item` WAJIB punya `data-bm="<id-stabil>"` (static: tulis manual, mis. `dalil-wajib`; dari data: `syarat-${bmSlug(judul)}`, `wudhu-langkah-N`, `gerakan-<slug>`, `bacaan-<idx>`, `pembatal-<slug>`, `ragam-<idItem>`) dan opsional `data-bm-title`. `decorateBookmarks()` menyuntikkan tombol bookmark (`[data-bm-btn]`) ke semua kartu (sudut kanan atas; di baris judul untuk kartu `<details>`; di akhir untuk kartu `flex`), jadi jangan menulis tombol manual. Id disimpan di `localStorage['sholat_bookmarks']` (JSON array); jangan ganti id yang sudah rilis karena favorit pengguna menunjuk ke sana. Tab Favorit (`renderBookmarks`) menampilkan daftar per menu dengan breadcrumb (tab > sub-tab > grup), cuplikan, tombol buka (`goToBookmark`: pindah tab/sub-tab/grup ragam, buka akordeon, gulir dan kedipkan kartu) dan tombol hapus per item serta "Hapus semua". Semua klik memakai satu pendengar delegasi (`data-bm-btn|go|del|clear`), tidak ada handler inline. Menu Favorit ada di bar atas dan di navigasi bawah mobile (`mob-tab-bookmarks`).
- Quiz: data `quizBank` (helper `mc/fill/tf/order/match`), state `quizProgress`/`quizRound`, fungsi `quizStart`, `quizChoose`, `quizOrderAdd/Remove/Check`, `quizMatchLeft/Right/Check`, `quizNext`, `quizEndRound`, `quizNextLevel`, `quizReset`, render `renderQuiz` (`quizViewHome/Question/Result`).
- PWA: `beforeinstallprompt` handler stores `deferredInstallPrompt`; install button calls `.prompt()`; `appinstalled` hides the button; iOS shows an "Add to Home Screen" alert. Service worker registered on `load` via `./sw.js`.

### 5.3 Styling
- Tailwind palette: names `emerald` (primary scale) and `gold` (accent) are kept in markup but resolve to CSS variables (`--p-50..950`, `--g-400/500/600`) in `tailwind.config`, so themes only swap variables. Do not hardcode hex colors; use `rgb(var(--p-*))` in CSS.
- Themes: `data-theme` on `<html>`, stored in `localStorage['theme']`, applied by an inline script in `<head>` before render. Values: `langit` (default, `:root`), `zamrud` (the old emerald green), `taman` (kids: bright green + orange, rounder corners), `senja` (violet), `gelap` (black/grey dark mode: primary scale becomes neutral greys, light surfaces and dark text utilities are inverted by explicit `[data-theme="gelap"]` rules; when you introduce a new light-surface or dark-text utility class, add its override there). Picker `#theme-picker` lives in `#settings-bar`; `THEMES`, `applyTheme`, `renderThemePicker` in JS. `manifest.json` colors and the icons use the default theme (`#0c4a6e`); the `<meta name="theme-color">` follows the active theme.
- Active wudhu sub-tab: `bg-emerald-800 text-white border-emerald-800 shadow-sm`; inactive: `bg-white text-slate-600 border-slate-200`. Do NOT use `border-b-2` underline tabs inside an `overflow-x-auto` container: they collide with the container border (previous bug).
- Arabic blocks use class `.arabic-size` and font `Amiri`.

### 5.4 PWA / Service worker
- Strategy: stale-while-revalidate for all GET requests; precache list `ASSETS_TO_CACHE` is added one-by-one (`cache.add(...).catch`), so a failing CDN URL does not abort install.
- Bump `CACHE_NAME` (`islamic-learning-vN`) on every change to `index.html` or assets, otherwise installed clients keep serving stale files. Current: `v39`. Generated section pages (`'./<slug>/'`) are precached too; `build-pages.mjs --check` fails if one is missing. Every new file under `js/` or `css/` must also be added to `ASSETS_TO_CACHE` (verify-site checks this).
- Installability needs: valid manifest, 192/512 icons, active SW, HTTPS. Chrome will not fire `beforeinstallprompt` if the app is already installed.

---

### 5.5 SEO: one URL per section
- The SPA is still one page of markup, but each important section also has its own URL so search engines can index it separately: `/syarat-sah-sholat/`, `/tata-cara-wudhu/`, `/doa-setelah-wudhu/`, `/tata-cara-sholat/`, `/bacaan-sholat/`, `/ragam-bacaan-sholat/`, `/pembatal-sholat/`, `/kuis-sholat/`.
- Source of truth: `js/data/routes.js` (`ROUTES`: `slug`, `tab`, optional `wudhu` sub name, `sholat` sub id, `anchor`, plus `label`, `h1` (header `<h1 id="site-title">` text), `title`, `description`; `SITE_URL`; `SITE_UPDATED` = sitemap `<lastmod>`, update it when content changes). `ROUTES[0]` (slug `''`) is the home page.
- `scripts/build-pages.mjs` copies `index.html` to `<slug>/index.html` with its own `<title>`, meta description, canonical, Open Graph/Twitter tags, `<h1 id="site-title">`, its own JSON-LD (`WebPage` + `BreadcrumbList`, replacing the home `WebSite`/`FAQPage`/`WebApplication` graph), `<base href="../">` (so every relative URL still points at the site root) and the right tab/sub-tab un-hidden. It also rewrites the home meta in `index.html`, fills the footer link list `#route-links` (crawlable `<a href data-route>` links) and writes `sitemap.xml`. `--check` mode is run by verify-site.
- Runtime (`js/nav.js`): on load `openRoute(routeFromLocation())` opens the page's tab; every `switchTab/switchWudhuSub/switchSholatSub` calls `syncUrl()`, which `history.replaceState`s to the matching route and sets `document.title` and the header `h1` (tabs without a route, e.g. info/bookmarks, map to `/`). Because of `<base>`, code that builds URLs must resolve against `document.baseURI`, not `location.href` (see `js/theme.js`).
- Home `<head>` keeps the global `keywords` (spelling variants sholat/solat/shalat/salat etc.) and the `FAQPage` JSON-LD; edit those directly in `index.html`.
- Adding a page: add a route, add `'./<slug>/'` to `ASSETS_TO_CACHE`, run the generator, bump `CACHE_NAME`.

## 6. Guidelines for AI Assistants & Contributors
1. **Maintain Image References**: Use `wudhu.jpg` and `sholat.jpg`. Never remove or rename them. Register any new asset in `sw.js` `ASSETS_TO_CACHE`.
2. **Dalil Integrity**: All Islamic texts keep the **full Matan (Arabic)**, Indonesian translation, and precise source (Surah/Ayat or collector + number). Never invent, paraphrase or "fix" a hadith/ayat from memory; verify against the primary reference (Rumaysho.com) or ask the user. A hadith reference without matan is allowed only for fiqh rulings/ijma'.
3. **Faceless Avatar Rule**: New images must show faceless Muslim avatars.
4. **Infographic UX**: Tap-to-zoom via lightbox, descriptive `alt`, lazy loading, "open in new tab" fallback.
5. **Offline**: Register new assets in `sw.js` and bump `CACHE_NAME`.
6. **UI Consistency**: Emerald/gold scheme, `Amiri` for Arabic, collapsible `<details>` for long matan.
7. **PWA Correctness**: Register only `./sw.js`; no blob: service workers; keep manifest `scope`/`start_url` as `./`.
8. **ID contract**: When renaming or adding a tab/sub-tab, update the button ID, panel ID, the `onclick` argument, and the JS that references them together (see 5.1). Guard `getElementById` results against `null`.
9. **No build step**: Plain static files and native ES modules (`<script type="module">`, relative imports with `.js` extension); do not introduce bundlers or frameworks without the owner's approval. The owner approved the split of the old single `index.html` into `css/` + `js/` modules (2026-11-05).
10. **Language**: UI copy and docs are Indonesian; code identifiers in English/Indonesian mix as already present. Match the surrounding style.
11. **SEO pages**: after editing `index.html` or `js/data/routes.js`, run `node scripts/build-pages.mjs` and commit the regenerated files. Edit page titles/descriptions only in `js/data/routes.js`, never in `<slug>/index.html` or in the `index.html` meta tags (the generator overwrites them). Keep `SITE_URL` equal to the custom domain.

## 7. Agent Skills
Task playbooks live in `.claude/skills/<name>/SKILL.md` (frontmatter `name`, `description`). Agents other than Claude Code can read them as plain Markdown.
- `add-dalil`: add a verse/hadith card with matan, translation, source, and search/bookmark hooks.
- `add-subtab`: add a main tab or wudhu sub-tab without breaking the ID contract.
- `pwa-release`: bump cache, validate manifest/SW, verify install and deploy.
- `add-quiz-question`: tambah/ubah soal kuis dari materi yang sudah ada.
- `verify-site`: run the static checks (JS syntax, ID cross-check, manifest JSON) before pushing.

## 8. Known Pitfalls (history)
- `switchWudhuSub('wudhu-langkah')` once looked up `#wudhu-langkah` while the panel is `#wudhu-sub-langkah` -> `Cannot read properties of null (reading 'classList')`. Fixed by normalising the name and null-guarding.
- Install button had no handler and was `hidden sm:flex` (invisible on phones). Fixed with the `beforeinstallprompt` flow.
- `cache.addAll` in the SW aborts if any URL fails (e.g. CDN). Now per-asset.
- Stale caches: forgetting to bump `CACHE_NAME` makes deployed fixes invisible to returning users.

## 9. Local Preview & Deploy
Local preview (no build step):
```bash
bash scripts/run-local.sh [port]   # default 8080 -> http://localhost:8080/ (also prints LAN URL)
```
The service worker is active on `localhost`; if edits do not show, reload twice or unregister it in DevTools. Stop it with `bash scripts/stop-local.sh [port]`.

Deploy:
```bash
node scripts/build-pages.mjs               # regenerate SEO pages + sitemap after any index.html/routes change
bash .claude/skills/verify-site/check.sh   # static checks (includes build-pages --check)
git add -A && git commit -m "<message>" && git push origin main
```
Then confirm: `curl -s https://kamaludin68.github.io/islamic-learning/sw.js | head -1` shows the new `CACHE_NAME`.


## Catatan dalil (disesuaikan dengan Hadits.id)
- Matan, terjemahan, nomor, dan derajat hadits mengikuti Hadits.id. Kartu `sholatStepsData` memuat `matan` (Arab, arti, sumber) yang ditampilkan dalam `<details>`. Ragam bacaan lengkap ada di `ragamBacaan` (tab Ragam); `bacaanVariants` (kunci = indeks `bacaanSholatWords`) hanya menyimpan catatan singkat per kartu, ditampilkan oleh `renderBacaanVariants(idx)` bersama tombol ke tab Ragam.
- Bacaan ruku' dan sujud utama adalah tasbih tanpa "wa bihamdih" (HR. Muslim 772, Abu Daud 871); versi "wa bihamdih" (Abu Daud 870) hanya sebagai ragam bacaan dengan catatan perbedaan penilaian.
- Hadits siwak memakai Bukhari 887 & Muslim 252 ("setiap kali shalat"); redaksi "setiap kali wudhu" (HR. Ahmad) tidak ditemukan di Hadits.id sehingga tidak dipakai.
- Kartu "Menutup Aurat" memuat QS. Al-A'raf: 31 (potongan) dan hadits di `extra`: Tirmidzi 377, Abu Daud 4104 (wanita: wajah dan telapak tangan; Abu Daud menyebutnya mursal), Abu Daud 4114 (di bawah pusar dan di atas lutut), Abu Daud 4014 (paha adalah aurat), Muslim 338. Ahmad 6756 dan Al-Baihaqi 3219 tidak ditemukan di Hadits.id sehingga tidak dipakai; Nasa'i 4952 dan Abu Daud 4140 bukan hadits aurat.
