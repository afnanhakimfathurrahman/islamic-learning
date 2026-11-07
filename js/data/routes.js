// Halaman (URL) per bagian untuk SEO. Satu sumber untuk:
// - scripts/build-pages.mjs (membuat <slug>/index.html, tautan footer #route-links dan sitemap.xml)
// - js/nav.js (membuka tab sesuai URL dan memperbarui URL saat pindah tab)
// slug '' = beranda (index.html). tab = id di content-<tab>; wudhu = nama sub-tab wudhu;
// sholat = id sub-tab sholat; anchor = id elemen yang digulir setelah dibuka.
// Setelah mengubah file ini atau index.html jalankan: node scripts/build-pages.mjs
export const SITE_URL = 'https://belajarsholat.is-my.app/';

export const ROUTES = [
    {
        slug: '',
        tab: 'home',
        label: 'Beranda',
        title: 'Panduan Sholat & Wudhu Sesuai Sunnah – Tata Cara, Bacaan & Dalil',
        description: "Panduan lengkap tata cara wudhu dan sholat sesuai sunnah Rasulullah ﷺ: syarat sah, gerakan, bacaan Arab, latin dan arti per kata, ragam bacaan, pembatal sholat, beserta dalil Al-Qur'an dan hadits shahih. Bisa dipakai offline."
    },
    {
        slug: 'syarat-sah-sholat',
        tab: 'syarat',
        label: 'Syarat Sah Sholat',
        title: 'Syarat Sah Sholat dan Dalilnya – Panduan Sholat Sesuai Sunnah',
        description: "9 syarat sah sholat beserta dalil Al-Qur'an dan hadits shahih: Islam, berakal, mumayyiz, suci dari hadats, suci badan, pakaian dan tempat, menutup aurat, masuk waktu, menghadap kiblat, dan niat."
    },
    {
        slug: 'tata-cara-wudhu',
        tab: 'wudhu',
        wudhu: 'langkah',
        label: 'Tata Cara Wudhu',
        title: 'Tata Cara Wudhu Sesuai Sunnah – Syarat, Rukun & Sunnah Wudhu',
        description: 'Langkah-langkah wudhu sesuai sunnah Rasulullah ﷺ dengan infografis, beserta syarat, rukun dan sunnah wudhu, doa setelah wudhu, dan dalil haditsnya.'
    },
    {
        slug: 'doa-setelah-wudhu',
        tab: 'wudhu',
        wudhu: 'sunnah',
        anchor: 'doa-setelah-wudhu',
        label: 'Doa Setelah Wudhu',
        title: 'Doa Setelah Wudhu: Arab, Latin, Arti per Kata & Dalil',
        description: 'Bacaan doa setelah wudhu dalam tulisan Arab, latin dan arti per kata, beserta dalil hadits shahih tentang keutamaannya.'
    },
    {
        slug: 'tata-cara-sholat',
        tab: 'rukun',
        sholat: 'sholat-gerakan',
        label: 'Tata Cara Sholat',
        title: 'Tata Cara Sholat Sesuai Sunnah – Urutan Gerakan Sholat',
        description: 'Urutan gerakan sholat sesuai sunnah Nabi ﷺ dari takbiratul ihram hingga salam, lengkap dengan infografis dan dalil hadits shahih.'
    },
    {
        slug: 'bacaan-sholat',
        tab: 'rukun',
        sholat: 'sholat-bacaan',
        label: 'Bacaan Sholat',
        title: 'Bacaan Sholat Lengkap: Arab, Latin & Arti per Kata',
        description: 'Bacaan sholat lengkap dari takbiratul ihram, doa iftitah, Al-Fatihah, ruku, sujud, tasyahud dan shalawat hingga salam, dalam tulisan Arab, latin dan arti per kata.'
    },
    {
        slug: 'ragam-bacaan-sholat',
        tab: 'rukun',
        sholat: 'sholat-ragam',
        label: 'Ragam Bacaan Sholat',
        title: 'Ragam Bacaan Sholat dari Riwayat Shahih – Iftitah hingga Dzikir',
        description: "Pilihan bacaan sholat dari berbagai riwayat untuk setiap gerakan: doa iftitah, ruku, i'tidal, sujud, duduk, tasyahud, shalawat, doa sebelum salam dan dzikir, lengkap dengan sumbernya."
    },
    {
        slug: 'pembatal-sholat',
        tab: 'pembatal',
        label: 'Pembatal Sholat',
        title: 'Hal-Hal yang Membatalkan Sholat dan Dalilnya',
        description: 'Hal-hal yang membatalkan sholat beserta dalil shahihnya: berbicara dengan sengaja, tertawa terbahak-bahak, terbuka aurat, makan dan minum, berhadats, banyak bergerak, mendahului imam, dan murtad.'
    },
    {
        slug: 'kuis-sholat',
        tab: 'quiz',
        label: 'Kuis Sholat & Wudhu',
        title: 'Kuis Sholat & Wudhu – Uji Pemahamanmu',
        description: 'Uji pemahaman tentang wudhu dan sholat dengan 10 soal acak per level: pilihan ganda, isian, benar/salah, mengurutkan, dan menjodohkan.'
    }
];
