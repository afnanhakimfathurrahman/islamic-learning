/* -------------------------------------------------------------
   QUIZ BANK (semua soal bersumber dari materi aplikasi ini)
   mc(id, topik, tingkat 1-3, tanya, [benar, salah, salah, salah], penjelasan, sumber)
   fill(...): sama dengan mc, ditambah argumen terakhir `ar` (kalimat Arab dengan ____)
   tf(id, topik, tingkat, pernyataan, true|false, penjelasan, sumber)
   order(id, topik, tingkat, tanya, [item urut benar], penjelasan, sumber)
   match(id, topik, tingkat, tanya, [[kiri, kanan] x4], penjelasan, sumber)
------------------------------------------------------------- */
export const mc = (id, topic, lvl, q, opts, exp, src, ar) => ({ t: ar ? 'fill' : 'mc', id, topic, lvl, q, opts, exp, src, ar });

export const fill = (id, topic, lvl, q, opts, exp, src, ar) => mc(id, topic, lvl, q, opts, exp, src, ar);

export const tf = (id, topic, lvl, q, a, exp, src) => ({ t: 'tf', id, topic, lvl, q, a, exp, src });

export const order = (id, topic, lvl, q, items, exp, src) => ({ t: 'order', id, topic, lvl, q, items, exp, src });

export const match = (id, topic, lvl, q, pairs, exp, src) => ({ t: 'match', id, topic, lvl, q, pairs, exp, src });

// Opsi/butir berisi Arab (disalin dari aplikasi) + Latin; teks dirender sebagai HTML
export const ARL = (ar, lat) => `<span class="font-arabic text-xl leading-loose" dir="rtl">${ar}</span><span class="block text-xs font-normal text-slate-500">${lat}</span>`;

export const quizBank = [
    // ---- Dalil sholat (Home)
    mc('d1', 'Dalil Sholat', 1, "Menurut QS. Al-Baqarah: 43, perintah yang disebut bersama sholat dan rukuk adalah…", ["Menunaikan zakat", "Berpuasa", "Berhaji", "Bersedekah"], "Ayat ini memerintahkan: laksanakan sholat, tunaikan zakat, dan rukuklah bersama orang-orang yang rukuk.", "QS. Al-Baqarah: 43"),
    mc('d2', 'Dalil Sholat', 1, "Berapa perkara yang menjadi dasar bangunan Islam menurut HR. Bukhari no. 8?", ["Lima", "Tiga", "Empat", "Enam"], "\"Islam dibangun di atas lima perkara\", salah satunya mendirikan sholat.", "HR. Bukhari no. 8"),
    mc('d3', 'Dalil Sholat', 2, "Menurut HR. Muslim no. 233, sholat lima waktu menghapus dosa di antaranya selama…", ["tidak melakukan dosa-dosa besar", "tidak lupa membaca Al-Fatihah", "dikerjakan di masjid", "dikerjakan berjamaah"], "Sholat lima waktu dan Jumat ke Jumat adalah penghapus dosa di antara keduanya selama tidak melakukan dosa-dosa besar.", "HR. Muslim no. 233"),
    mc('d4', 'Dalil Sholat', 1, "Dalam HR. Bukhari no. 528, sholat lima waktu diumpamakan seperti…", ["Sungai di depan rumah yang dipakai mandi lima kali sehari", "Pohon yang berbuah setiap hari", "Cahaya yang menerangi malam", "Pagar yang melindungi rumah"], "Orang yang mandi lima kali sehari di sungai tidak akan tersisa kotorannya; begitu pula sholat lima waktu menghapus kesalahan.", "HR. Bukhari no. 528"),
    mc('d5', 'Dalil Sholat', 1, "Menurut QS. Al-Ankabut: 45, sholat mencegah dari…", ["Perbuatan keji dan mungkar", "Rasa malas", "Kemiskinan", "Penyakit"], "\"Sesungguhnya sholat itu mencegah dari (perbuatan) keji dan mungkar.\"", "QS. Al-Ankabut: 45"),
    mc('d6', 'Dalil Sholat', 2, "Menurut HR. Muslim no. 82, batas antara seseorang dengan kesyirikan dan kekafiran adalah…", ["Meninggalkan sholat", "Meninggalkan puasa sunnah", "Terlambat sholat", "Tidak berjamaah"], "\"Sesungguhnya batasan antara seseorang dengan kesyirikan dan kekafiran adalah meninggalkan sholat.\"", "HR. Muslim no. 82"),
    mc('d7', 'Dalil Sholat', 3, "Dalam QS. Al-Muddaththir: 42-43, penghuni Saqar menjawab mereka masuk neraka karena…", ["Dahulu tidak termasuk orang-orang yang melaksanakan sholat", "Tidak berzakat", "Tidak berpuasa", "Tidak bersedekah"], "\"Dahulu kami tidak termasuk orang-orang yang melaksanakan sholat.\"", "QS. Al-Muddaththir: 42-43"),

    // ---- Syarat sah sholat
    mc('s1', 'Syarat Sah Sholat', 1, "Anak yang sudah mumayyiz dan sah sholatnya berusia sekitar…", ["7 tahun", "3 tahun", "5 tahun", "12 tahun"], "Syarat mumayyiz: anak yang sudah bisa membedakan baik dan buruk (sekitar 7 tahun).", "HR. Abu Daud no. 495"),
    mc('s2', 'Syarat Sah Sholat', 1, "Menurut HR. Abu Daud no. 4114, bagian tubuh laki-laki yang tidak boleh dilihat adalah di bawah pusar dan di atas…", ["Lutut", "Dada", "Bahu", "Mata kaki"], "Yang tidak boleh dilihat adalah bagian di bawah pusar dan di atas lutut.", "HR. Abu Daud no. 4114"),
    mc('s3', 'Syarat Sah Sholat', 1, "Menurut HR. Abu Daud no. 4104, bagian tubuh wanita yang telah baligh yang boleh tampak adalah…", ["Wajah dan kedua telapak tangan", "Wajah dan kedua kaki", "Rambut dan leher", "Kedua tangan sampai siku"], "Beliau menunjuk wajah dan kedua telapak tangannya.", "HR. Abu Daud no. 4104"),
    mc('s4', 'Syarat Sah Sholat', 2, "Dalil syarat menghadap kiblat terdapat pada…", ["QS. Al-Baqarah: 144", "QS. An-Nisa: 103", "QS. Ali 'Imran: 85", "QS. Maryam: 59"], "\"Maka hadapkanlah wajahmu ke arah Masjidil Haram.\"", "QS. Al-Baqarah: 144"),
    mc('s5', 'Syarat Sah Sholat', 2, "Syarat masuk waktu sholat berdalil pada…", ["QS. An-Nisa: 103", "QS. Al-Baqarah: 144", "QS. Al-A'raf: 31", "QS. Ali 'Imran: 85"], "Sholat adalah kewajiban yang ditetapkan waktunya atas orang-orang beriman.", "QS. An-Nisa: 103"),
    mc('s6', 'Syarat Sah Sholat', 2, "Hadits <span class='font-arabic text-xl' dir='rtl'>إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ</span> (Innamal a'maalu bin niyyaat) menjadi dalil syarat…", ["Niat", "Menutup aurat", "Suci dari najis", "Menghadap kiblat"], "Amal tergantung niatnya.", "HR. Bukhari no. 1"),
    mc('s7', 'Syarat Sah Sholat', 2, "QS. Al-A'raf: 31 (\"pakailah pakaianmu yang indah di setiap masjid\") menjadi dalil syarat…", ["Menutup aurat", "Berakal", "Islam", "Masuk waktu"], "Ayat ini dipakai sebagai dalil menutup aurat.", "QS. Al-A'raf: 31"),
    mc('s8', 'Syarat Sah Sholat', 3, "Hadits orang Badui yang kencing di masjid lalu bekas kencingnya disiram air menjadi dalil syarat…", ["Suci badan, pakaian, dan tempat dari najis", "Berakal", "Mumayyiz", "Niat"], "Najis (air kencing) dihilangkan dengan menyiramkan air.", "HR. Bukhari no. 220"),
    mc('s9', 'Syarat Sah Sholat', 3, "Menurut HR. Abu Daud no. 4403, pena diangkat dari orang tidur hingga bangun, anak kecil hingga baligh, dan…", ["Orang gila hingga berakal", "Orang sakit hingga sembuh", "Musafir hingga pulang", "Orang miskin hingga kaya"], "Hadits ini menjadi dalil syarat berakal.", "HR. Abu Daud no. 4403"),

    // ---- Wudhu
    mc('w1', 'Wudhu', 1, "Mencuci kedua telapak tangan pada awal wudhu dilakukan sebanyak…", ["3 kali", "1 kali", "2 kali", "4 kali"], "Langkah 2: mencuci telapak tangan 3 kali hingga sela-sela jari.", "Tata Cara Wudhu, langkah 2"),
    mc('w2', 'Wudhu', 1, "Mengusap kepala dan telinga dalam wudhu dilakukan sebanyak…", ["1 kali", "2 kali", "3 kali", "4 kali"], "Langkah 6: mengusap kepala dan telinga 1 kali.", "Tata Cara Wudhu, langkah 6"),
    mc('w3', 'Wudhu', 1, "Berapa rukun wudhu yang wajib menurut materi?", ["6", "4", "5", "8"], "Niat, membasuh muka, membasuh tangan sampai siku, mengusap kepala, membasuh kaki sampai mata kaki, dan tertib.", "Rukun Wudhu"),
    mc('w4', 'Wudhu', 2, "Manakah yang BUKAN termasuk rukun wudhu?", ["Bersiwak", "Niat", "Tertib", "Membasuh muka"], "Bersiwak termasuk sunnah wudhu, bukan rukun.", "Rukun & Sunnah Wudhu"),
    mc('w5', 'Wudhu', 1, "Ayat yang menjelaskan tata cara wudhu adalah…", ["QS. Al-Ma'idah: 6", "QS. Al-Ankabut: 45", "QS. Maryam: 59", "QS. An-Nisa: 103"], "Ayat ini menyebut membasuh wajah, tangan sampai siku, mengusap kepala, dan membasuh kaki sampai mata kaki.", "QS. Al-Ma'idah: 6"),
    mc('w6', 'Wudhu', 1, "Berapa pintu surga yang dibukakan bagi orang yang menyempurnakan wudhu lalu membaca syahadat?", ["Delapan", "Tujuh", "Lima", "Sepuluh"], "\"…dibukakan baginya delapan pintu surga; ia boleh masuk dari pintu mana saja yang ia kehendaki.\"", "HR. Muslim no. 234"),
    mc('w7', 'Wudhu', 1, "Hadits <span class='font-arabic text-xl' dir='rtl'>وَيْلٌ لِلْأَعْقَابِ مِنَ النَّارِ</span> (Wailul lil a'qaab minan naar) mengancam…", ["Tumit yang tidak terbasuh air wudhu", "Orang yang tidak bersiwak", "Orang yang tidak berdoa setelah wudhu", "Orang yang berwudhu terlalu lama"], "Celakalah tumit-tumit yang tidak terbasuh air wudhu dari api neraka.", "HR. Bukhari no. 60 & Muslim no. 242"),
    mc('w8', 'Wudhu', 2, "Kumur dan istinsyaq (menghirup air ke hidung) sebaiknya dilakukan…", ["Dalam satu cakupan air, 3 kali", "Terpisah, masing-masing 1 kali", "Hanya sekali", "Setelah mencuci kaki"], "Disatukan dalam satu cakupan air dan dilakukan 3 kali.", "Sunnah Wudhu"),
    mc('w9', 'Wudhu', 2, "Mendahulukan anggota badan yang kanan dalam bersuci disebut…", ["At-Tayamun", "Tuma'ninah", "Istinsyaq", "Tawarruk"], "Nabi <span class='font-arabic'>ﷺ</span> menyukai mendahulukan yang kanan dalam bersuci dan segala urusan.", "HR. Bukhari no. 168"),
    mc('w10', 'Wudhu', 2, "Hadits \"Seandainya aku tidak merasa berat bagi umatku, niscaya aku akan memerintahkan mereka … setiap kali shalat\" menyebut sunnah…", ["Bersiwak", "Membaca basmalah", "Berkumur", "Membasuh telinga"], "Sunnah bersiwak setiap kali shalat.", "HR. Bukhari no. 887 & Muslim no. 252"),
    mc('w11', 'Wudhu', 2, "Yang termasuk penghalang air ke kulit sehingga wudhu tidak sah adalah…", ["Cat kuku waterproof (kutek)", "Keringat", "Air hujan", "Air sumur"], "Penghalang seperti cat, cat kuku waterproof, lilin, atau minyak tebal harus dihilangkan.", "Syarat Sah Wudhu"),
    mc('w12', 'Wudhu', 2, "Menurut HR. Abu Daud no. 101, tidak ada wudhu bagi orang yang tidak…", ["Menyebut nama Allah atasnya", "Bersiwak", "Berniat dengan lisan", "Berwudhu berurutan"], "Dalil sunnah membaca basmalah saat wudhu.", "HR. Abu Daud no. 101"),
    mc('w13', 'Wudhu', 3, "Wudhu bagi penderita istihadhah (beser) disyaratkan…", ["Masuk waktu sholat", "Dilakukan tiga kali", "Dengan siwak", "Setelah mandi"], "Salah satu syarat sah wudhu: masuk waktu sholat bagi penderita istihadhah/beser.", "Syarat Sah Wudhu"),

    // ---- Sholat: gerakan & rukun
    mc('g1', 'Gerakan Sholat', 1, "Sujud dilakukan di atas berapa anggota tubuh?", ["7", "5", "6", "8"], "Dahi+hidung, 2 telapak tangan, 2 lutut, dan 2 ujung kaki.", "HR. Bukhari no. 812"),
    mc('g2', 'Gerakan Sholat', 1, "Duduk di antara dua sujud memakai cara duduk…", ["Iftirasy", "Tawarruk", "Bersila", "Berlutut"], "Menduduki kaki kiri dan menegakkan kaki kanan.", "HR. Muslim no. 498"),
    mc('g3', 'Gerakan Sholat', 1, "Duduk pada tasyahud akhir memakai cara duduk…", ["Tawarruk", "Iftirasy", "Bersila", "Berlutut"], "Kaki kiri dimajukan, kaki kanan ditegakkan, lalu duduk di atas pantat.", "HR. Bukhari no. 828"),
    mc('g4', 'Gerakan Sholat', 1, "Ucapan ketika bangkit dari ruku' menuju i'tidal adalah…", [ARL("سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ", "Sami'allahu liman hamidah"), ARL("اللَّهُ أَكْبَرُ", "Allahu akbar"), ARL("سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ", "Subhaana rabbiyal 'azhiimi wa bihamdih"), ARL("السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ", "Assalaamu 'alaikum wa rahmatullaah")], "Bangkit dari ruku' sambil mengucapkan 'Sami'allahu liman hamidah'.", "HR. Bukhari no. 789"),
    mc('g5', 'Gerakan Sholat', 2, "Saat salam ke kanan dan ke kiri, kepala ditoleh hingga…", ["Putih pipi terlihat", "Bahu menyentuh dagu", "Mata terpejam", "Telinga menyentuh bahu"], "Salam ke kanan dan ke kiri hingga terlihat putih pipi beliau.", "HR. Muslim no. 582"),
    mc('g6', 'Gerakan Sholat', 2, "Posisi tangan saat sedekap adalah…", ["Tangan kanan di atas tangan kiri", "Kedua tangan di samping badan", "Tangan kiri di atas tangan kanan", "Kedua tangan di belakang"], "Sedekap: tangan kanan diletakkan di atas tangan kiri.", "HR. Muslim no. 401"),
    mc('g7', 'Gerakan Sholat', 2, "Saat takbiratul ihram, tangan diangkat sejajar…", ["Bahu atau telinga", "Pinggang", "Lutut", "Dahi"], "Mengangkat kedua tangan sejajar bahu (atau telinga) sambil bertakbir.", "HR. Muslim no. 390 & no. 401"),

    // ---- Pembatal sholat
    mc('p1', 'Pembatal Sholat', 1, "Menurut ijma' ulama, tertawa terbahak-bahak (hingga terdengar suara) dalam sholat…", ["Membatalkan sholat", "Tidak berpengaruh", "Hanya makruh", "Menggugurkan pahala saja"], "Para ulama sepakat tertawa terbahak-bahak membatalkan sholat.", "Ijma' Ulama"),
    mc('p2', 'Pembatal Sholat', 1, "Hadits tentang \"kepala keledai\" berkaitan dengan…", ["Mendahului imam", "Berbicara saat sholat", "Menoleh saat sholat", "Meninggalkan sholat"], "Orang yang mengangkat kepalanya sebelum imam diancam Allah mengubah kepalanya menjadi kepala keledai.", "HR. Muslim no. 427"),
    mc('p3', 'Pembatal Sholat', 1, "Menurut HR. Muslim no. 537, sholat itu hanyalah…", ["Tasbih, takbir, dan bacaan Al-Qur'an", "Doa dan zikir bebas", "Gerakan dan diam", "Perkataan baik"], "Tidak boleh ada perkataan manusia di dalam sholat.", "HR. Muslim no. 537"),
    mc('p4', 'Pembatal Sholat', 2, "Dalil berhadats (batal wudhu) membatalkan sholat adalah…", ["HR. Bukhari no. 135", "HR. Muslim no. 82", "QS. Maryam: 59", "HR. Abu Daud no. 495"], "\"Tidak diterima sholat orang yang berhadats hingga ia berwudhu.\"", "HR. Bukhari no. 135"),
    mc('p5', 'Pembatal Sholat', 3, "Berapa hal yang membatalkan sholat dibahas pada materi aplikasi ini?", ["8", "5", "10", "12"], "Berbicara sengaja, tertawa terbahak-bahak, terbuka aurat, makan-minum, berhadats, banyak bergerak berturut-turut, mendahului imam, dan murtad/berubah niat.", "Tab Batal"),

    // ---- Lengkapi bacaan
    fill('f1', 'Bacaan Sholat', 1, "Lengkapi potongan ayat Al-Fatihah ini:", ["الْعَالَمِينَ", "الْمُسْتَقِيمَ", "الدِّينِ", "الرَّحِيمِ"], "Alhamdu lillaahi rabbil 'aalamiin: segala puji bagi Allah, Tuhan semesta alam.", "QS. Al-Fatihah: 2", "الْحَمْدُ لِلَّهِ رَبِّ ____"),
    fill('f2', 'Bacaan Sholat', 1, "Lengkapi potongan ayat Al-Fatihah ini:", ["الدِّينِ", "الْعَالَمِينَ", "الْمُسْتَقِيمَ", "الضَّالِّينَ"], "Maaliki yawmid-diin: Pemilik hari pembalasan.", "QS. Al-Fatihah: 4", "مَالِكِ يَوْمِ ____"),
    fill('f3', 'Bacaan Sholat', 1, "Lengkapi potongan ayat Al-Fatihah ini:", ["نَسْتَعِينُ", "نَعْبُدُ", "الْمُسْتَقِيمَ", "اهْدِنَا"], "Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan.", "QS. Al-Fatihah: 5", "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ____"),
    fill('f4', 'Bacaan Sholat', 2, "Lengkapi potongan ayat Al-Fatihah ini:", ["الْمُسْتَقِيمَ", "الْعَالَمِينَ", "الدِّينِ", "الرَّحِيمِ"], "Ihdinash-shiraathal mustaqiim: tunjukilah kami jalan yang lurus.", "QS. Al-Fatihah: 6", "اهْدِنَا الصِّرَاطَ ____"),
    fill('f5', 'Bacaan Sholat', 1, "Lengkapi bacaan RUKU' berikut:", ["الْعَظِيمِ", "الْأَعْلَى", "الْكَرِيمِ", "الْحَكِيمِ"], "Subhaana rabbiyal 'azhiim: Maha Suci Tuhanku Yang Maha Agung.", "HR. Muslim no. 772", "سُبْحَانَ رَبِّيَ ____"),
    fill('f6', 'Bacaan Sholat', 1, "Lengkapi bacaan SUJUD berikut:", ["الْأَعْلَى", "الْعَظِيمِ", "الْكَبِيرِ", "الرَّحِيمِ"], "Subhaana rabbiyal a'laa: Maha Suci Tuhanku Yang Maha Tinggi.", "HR. Muslim no. 772", "سُبْحَانَ رَبِّيَ ____"),
    fill('f7', 'Bacaan Sholat', 2, "Lengkapi bacaan duduk di antara dua sujud:", ["اغْفِرْ", "ارْحَمْ", "ارْزُقْ", "اهْدِ"], "Rabbighfir lii: Wahai Tuhanku ampunilah aku.", "HR. Abu Daud no. 874 & Ibn Majah", "رَبِّ ____ لِي"),
    fill('f8', 'Bacaan Sholat', 2, "Lengkapi doa setelah wudhu:", ["التَّوَّابِينَ", "الْمُتَطَهِّرِينَ", "الصَّالِحِينَ", "الْمُؤْمِنِينَ"], "Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat.", "HR. At-Tirmidzi no. 55", "اللَّهُمَّ اجْعَلْنِي مِنَ ____"),
    fill('f9', 'Bacaan Sholat', 2, "Lengkapi bacaan tasyahud:", ["الطَّيِّبَاتُ", "الصَّالِحَاتُ", "الْبَرَكَاتُ", "الْحَسَنَاتُ"], "Segala penghormatan, sholawat, dan kebaikan adalah milik Allah.", "HR. Bukhari no. 6265 & Muslim no. 402", "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَ____"),
    fill('f10', 'Bacaan Sholat', 3, "Lengkapi bacaan i'tidal:", ["مُبَارَكًا", "كَثِيرًا", "طَيِّبًا", "عَظِيمًا"], "Pujian yang banyak, baik, dan diberkahi di dalamnya.", "HR. Bukhari no. 799", "رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا ____ فِيهِ"),
    fill('f11', 'Bacaan Sholat', 3, "Lengkapi doa iftitah:", ["الْمَغْرِبِ", "الْمَشْرِقِ", "الشَّمَالِ", "الْجَنُوبِ"], "Sebagaimana Engkau menjauhkan antara timur dan barat.", "HR. Bukhari no. 744 & Muslim no. 598", "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَ____"),
    fill('f12', 'Bacaan Sholat', 2, "Lengkapi bacaan salam:", ["رَحْمَةُ", "بَرَكَاتُ", "مَغْفِرَةُ", "جَنَّةُ"], "Semoga keselamatan dan rahmat Allah tercurah kepada kalian.", "HR. An-Nasa'i no. 1325 & At-Tirmidzi no. 295", "السَّلَامُ عَلَيْكُمْ وَ____ اللَّهِ"),
    fill('f13', 'Wudhu', 2, "Lengkapi hadits tentang basmalah dalam wudhu:", ["اسْمَ اللَّهِ", "الْبَسْمَلَةَ", "الدُّعَاءَ", "النِّيَّةَ"], "Tidak ada wudhu bagi orang yang tidak menyebut nama Allah atasnya.", "HR. Abu Daud no. 101", "لَا وُضُوءَ لِمَنْ لَمْ يَذْكُرِ ____ عَلَيْهِ"),
    fill('f14', 'Wudhu', 2, "Lengkapi hadits ancaman wudhu tidak sempurna:", ["النَّارِ", "الْمَاءِ", "الْأَرْضِ", "الْجَنَّةِ"], "Celakalah bagi tumit-tumit dari api neraka.", "HR. Bukhari no. 60 & Muslim no. 242", "وَيْلٌ لِلْأَعْقَابِ مِنَ ____"),

    // ---- Lengkapi dalil (Al-Qur'an & hadits; Arab disalin dari aplikasi)
    fill('h1', 'Dalil Sholat', 1, "Lengkapi potongan ayat tentang perintah sholat dan zakat:", ["ٱلزَّكَوٰةَ", "ٱلْمُنكَرِ", "ٱلْفَحْشَآءِ", "ٱلْمَرَافِقِ"], "Laksanakan sholat, tunaikan zakat, dan rukuklah bersama orang-orang yang rukuk.", "QS. Al-Baqarah: 43", "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ____ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ"),
    fill('h2', 'Dalil Sholat', 1, "Lengkapi potongan ayat tentang manfaat sholat:", ["ٱلْمُنكَرِ", "ٱلزَّكَوٰةَ", "ٱلْكَعْبَيْنِ", "ٱلرَّٰكِعِينَ"], "Sesungguhnya sholat itu mencegah dari (perbuatan) keji dan mungkar.", "QS. Al-Ankabut: 45", "إِنَّ ٱلصَّلَوٰةَ تَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَ____"),
    fill('h3', 'Dalil Sholat', 2, "Lengkapi jawaban penghuni Saqar:", ["الْمُصَلِّينَ", "الْمُتَطَهِّرِينَ", "التَّوَّابِينَ", "الصَّالِحِينَ"], "Dahulu kami tidak termasuk orang-orang yang melaksanakan sholat.", "QS. Al-Muddaththir: 42-43", "مَا سَلَكَكُمْ فِي سَقَرَ . قَالُوا لَمْ نَكُ مِنَ ____"),
    fill('h4', 'Dalil Sholat', 2, "Lengkapi hadits tentang batas antara keimanan dan kekafiran:", ["الصَّلاَةِ", "الزَّكَاةِ", "الْوُضُوءِ", "الْمَاءِ"], "Batasan antara seseorang dengan kesyirikan dan kekafiran adalah meninggalkan sholat.", "HR. Muslim no. 82", "إِنَّ بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكَ ____"),
    fill('h5', 'Syarat Sah Sholat', 2, "Lengkapi hadits tentang wudhu dan diterimanya sholat:", ["يَتَوَضَّأَ", "يَسْتَيْقِظَ", "يَعْقِلَ", "يَحْتَلِمَ"], "Tidak diterima sholat orang yang berhadats hingga ia berwudhu.", "HR. Bukhari no. 135", "لَا تُقْبَلُ صَلَاةُ مَنْ أَحْدَثَ حَتَّى ____"),
    fill('h6', 'Wudhu', 1, "Lengkapi hadits tentang sunnah bersiwak:", ["بِالسِّوَاكِ", "بِالصَّلَاةِ", "بِالْمَاءِ", "بِالنَّارِ"], "Seandainya aku tidak memberatkan umatku, niscaya aku akan memerintahkan mereka bersiwak setiap kali shalat.", "HR. Muslim no. 252", "لَوْلاَ أَنْ أَشُقَّ عَلَى الْمُؤْمِنِينَ لأَمَرْتُهُمْ ____ عِنْدَ كُلِّ صَلاَةٍ"),
    fill('h7', 'Wudhu', 3, "Lengkapi hadits tentang mendahulukan anggota kanan:", ["التَّيَمُّنُ", "التَّسْبِيحُ", "التَّكْبِيرُ", "التَّحِيَّاتُ"], "Nabi menyukai mendahulukan yang kanan saat memakai sandal, menyisir, bersuci, dan dalam segala urusannya.", "HR. Bukhari no. 168", "كَانَ النَّبِيُّ ﷺ يُعْجِبُهُ ____ فِي تَنَعُّلِهِ وَتَرَجُّلِهِ وَطُهُورِهِ وَفِي شَأْنِهِ كُلِّهِ"),
    fill('h8', 'Syarat Sah Sholat', 2, "Lengkapi ayat tentang menghadap kiblat:", ["الْمَسْجِدِ", "الْمَشْرِقِ", "الْمَغْرِبِ", "الْعَالَمِينَ"], "Maka hadapkanlah wajahmu ke arah Masjidil Haram.", "QS. Al-Baqarah: 144", "فَوَلِّ وَجْهَكَ شَطْرَ ____ الْحَرَامِ"),
    fill('h9', 'Syarat Sah Sholat', 2, "Lengkapi hadits tentang niat:", ["النِّيَّاتِ", "الصَّلَوَاتِ", "الطَّيِّبَاتِ", "الْحَسَنَاتِ"], "Amal tergantung niatnya.", "HR. Bukhari no. 1", "إِنَّمَا الْأَعْمَالُ بِ____، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى"),
    fill('h10', 'Wudhu', 1, "Lengkapi ayat tentang tata cara wudhu:", ["ٱلْمَرَافِقِ", "ٱلْكَعْبَيْنِ", "ٱلصَّلَوٰةِ", "بِرُءُوسِكُمْ"], "Basuhlah wajahmu dan tanganmu sampai siku.", "QS. Al-Ma'idah: 6", "فَٱغْسِلُوا۟ وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى ____"),
    fill('h11', 'Bacaan Sholat', 2, "Lengkapi shalawat ibrahimiyyah:", ["إِبْرَاهِيمَ", "الْمُصَلِّينَ", "الصَّالِحِينَ", "الْمُؤْمِنِينَ"], "Sebagaimana Engkau bershalawat atas Ibrahim dan keluarga Ibrahim.", "Bacaan Sholat: Shalawat Ibrahimiyyah", "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى ____ وَعَلَى آلِ إِبْرَاهِيمَ"),
    fill('h12', 'Bacaan Sholat', 1, "Lengkapi akhir surat Al-Fatihah:", ["الضَّالِّينَ", "الْمُسْتَقِيمَ", "الدِّينِ", "الرَّحِيمِ"], "Bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat.", "QS. Al-Fatihah: 7", "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا ____"),
    fill('h13', 'Syarat Sah Sholat', 3, "Lengkapi hadits tentang diangkatnya pena:", ["يَعْقِلَ", "يَتَوَضَّأَ", "يَذْكُرِ", "يَقُولُ"], "Pena diangkat dari orang gila hingga ia berakal.", "HR. Abu Daud no. 4403", "رُفِعَ الْقَلَمُ عَنْ ثَلَاثَةٍ: عَنِ النَّائِمِ حَتَّى يَسْتَيْقِظَ، وَعَنِ الصَّبِيِّ حَتَّى يَحْتَلِمَ، وَعَنِ الْمَجْنُونِ حَتَّى ____"),
    fill('h14', 'Pembatal Sholat', 2, "Lengkapi hadits tentang bacaan yang boleh dalam sholat:", ["الْقُرْآنِ", "الْوُضُوءِ", "النَّاسِ", "السِّوَاكِ"], "Sholat itu hanyalah tasbih, takbir, dan bacaan Al-Qur'an.", "HR. Muslim no. 537", "إِنَّمَا هُوَ التَّسْبِيحُ وَالتَّكْبِيرُ وَقِرَاءَةُ ____"),

    // ---- Benar atau salah
    tf('t1', 'Wudhu', 1, "Wudhu tetap sah meskipun ada cat kuku waterproof yang menutupi kuku.", false, "Penghalang air ke kulit harus dihilangkan agar wudhu sah.", "Syarat Sah Wudhu"),
    tf('t2', 'Wudhu', 1, "Mengusap kepala dan telinga dalam wudhu dilakukan satu kali.", true, "Langkah 6: usap kepala dan telinga 1 kali.", "Tata Cara Wudhu"),
    tf('t3', 'Pembatal Sholat', 1, "Berbicara dengan sengaja di tengah sholat membatalkan sholat.", true, "Sholat tidak boleh dicampuri perkataan manusia.", "HR. Muslim no. 537"),
    tf('t4', 'Syarat Sah Sholat', 1, "Anak yang sudah mumayyiz (sekitar 7 tahun) sah sholatnya.", true, "Mumayyiz adalah salah satu syarat sah sholat.", "HR. Abu Daud no. 495"),
    tf('t5', 'Wudhu', 2, "Orang yang berakal dan orang yang kehilangan akal sama-sama sah wudhunya.", false, "Berakal adalah syarat sah wudhu; orang gila/pingsan wudhunya tidak sah.", "Syarat Sah Wudhu"),
    tf('t6', 'Gerakan Sholat', 1, "Duduk di antara dua sujud memakai duduk tawarruk.", false, "Antara dua sujud memakai iftirasy; tawarruk dipakai pada tasyahud akhir.", "HR. Muslim no. 498 & Bukhari no. 828"),
    tf('t7', 'Dalil Sholat', 2, "Sholat lima waktu menghapus dosa apa pun tanpa syarat.", false, "Penghapusan dosa berlaku selama tidak melakukan dosa-dosa besar.", "HR. Muslim no. 233"),
    tf('t8', 'Syarat Sah Sholat', 1, "Sholat yang dikerjakan sebelum masuk waktunya tetap sah.", false, "Sholat adalah kewajiban yang ditetapkan waktunya.", "QS. An-Nisa: 103"),
    tf('t9', 'Pembatal Sholat', 1, "Makan dan minum dengan sengaja membatalkan sholat.", true, "Termasuk hal yang membatalkan sholat.", "Fikih Syafi'i"),
    tf('t10', 'Pembatal Sholat', 2, "Mendahului imam dengan sengaja termasuk perbuatan yang diancam dalam hadits.", true, "Diancam Allah mengubah kepalanya menjadi kepala keledai.", "HR. Muslim no. 427"),
    tf('t11', 'Wudhu', 1, "Tertib (berurutan) termasuk rukun wudhu.", true, "Tertib adalah salah satu dari enam rukun wudhu.", "Rukun Wudhu"),
    tf('t12', 'Gerakan Sholat', 1, "Salam pertama diucapkan sambil menoleh ke kiri.", false, "Salam dimulai ke kanan, lalu ke kiri, hingga terlihat putih pipi beliau.", "HR. Muslim no. 582"),
    tf('t13', 'Wudhu', 2, "Doa setelah wudhu dibaca sambil menghadap kiblat (langkah 8 tata cara wudhu).", true, "Langkah 8: menghadap kiblat dan membaca doa kesaksian.", "Tata Cara Wudhu"),
    tf('t14', 'Syarat Sah Sholat', 2, "Terbukanya aurat dengan sengaja membatalkan sholat.", true, "Termasuk hal yang membatalkan sholat.", "QS. Al-A'raf: 31"),
    tf('t15', 'Wudhu', 3, "Basmalah saat wudhu termasuk rukun wudhu.", false, "Basmalah termasuk sunnah wudhu; rukunnya ada enam (niat, muka, tangan, kepala, kaki, tertib).", "HR. Abu Daud no. 101"),
    tf('t16', 'Gerakan Sholat', 2, "Tangan diangkat sejajar bahu atau telinga saat takbiratul ihram.", true, "Dilakukan sambil bertakbir; sejajar bahu atau telinga.", "HR. Muslim no. 390 & no. 401"),

    // ---- Susun urutan
    order('o1', 'Wudhu', 1, "Urutkan anggota wudhu sesuai urutan dalam QS. Al-Ma'idah: 6:", ["Wajah", "Kedua tangan sampai siku", "Kepala", "Kedua kaki sampai mata kaki"], "Urutannya: wajah, tangan sampai siku, usap kepala, kaki sampai mata kaki.", "QS. Al-Ma'idah: 6"),
    order('o2', 'Wudhu', 2, "Urutkan 8 langkah wudhu berikut:", ["Niat & Bismillah", "Mencuci telapak tangan", "Kumur & istinsyaq", "Membasuh muka", "Membasuh tangan hingga siku", "Mengusap kepala & telinga", "Membasuh kaki hingga mata kaki", "Membaca doa setelah wudhu"], "Urutan sesuai Tata Cara Wudhu (langkah 1 sampai 8).", "Tata Cara Wudhu"),
    order('o3', 'Gerakan Sholat', 1, "Urutkan gerakan berikut:", ["Ruku'", "I'tidal", "Sujud", "Duduk antara dua sujud"], "Ruku', i'tidal, sujud, lalu duduk di antara dua sujud.", "Rukun Sholat"),
    order('o4', 'Gerakan Sholat', 2, "Urutkan gerakan sholat dari awal:", ["Takbiratul ihram", "Ruku'", "I'tidal", "Sujud", "Duduk antara dua sujud", "Tasyahud akhir", "Salam"], "Sesuai urutan rukun pada materi.", "Rukun Sholat"),
    order('o5', 'Bacaan Sholat', 2, "Urutkan bacaan dalam sholat:", ["Doa iftitah", "Al-Fatihah", "Bacaan ruku'", "Bacaan i'tidal", "Bacaan sujud", "Tasyahud"], "Urutan bacaan sesuai gerakan sholat.", "Bacaan Sholat"),
    order('o6', 'Wudhu', 3, "Susun doa setelah wudhu dengan urutan yang benar:", [ARL("أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ", "Asyhadu an laa ilaaha illallaah"), ARL("وَحْدَهُ لَا شَرِيكَ لَهُ", "wahdahu laa syariika lah"), ARL("وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", "wa asyhadu anna Muhammadan 'abduhu wa rasuuluh"), ARL("اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ", "Allaahummaj'alnii minat tawwaabiin"), ARL("وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ", "waj'alnii minal mutathahhiriin")], "Dua kalimat syahadat, lalu permohonan menjadi golongan yang bertaubat dan bersuci.", "HR. At-Tirmidzi no. 55"),

    // ---- Pasangkan arti
    match('m1', 'Bacaan Sholat', 1, "Pasangkan kata Arab dengan artinya (doa iftitah):", [["اللَّهُمَّ", "Ya Allah"], ["بَاعِدْ", "jauhkanlah"], ["الْمَشْرِقِ", "timur"], ["وَالْمَغْرِبِ", "dan barat"]], "Arti per kata doa iftitah.", "Bacaan Sholat: Doa Iftitah"),
    match('m2', 'Bacaan Sholat', 1, "Pasangkan kata Arab dengan artinya (Al-Fatihah):", [["الْحَمْدُ", "segala puji"], ["رَبِّ", "Tuhan"], ["الْعَالَمِينَ", "semesta alam"], ["مَالِكِ", "Pemilik"]], "Arti per kata Al-Fatihah.", "Bacaan Sholat: Al-Fatihah"),
    match('m3', 'Bacaan Sholat', 1, "Pasangkan kata Arab dengan artinya (bacaan ruku' dan sujud):", [["سُبْحَانَ", "Maha Suci"], ["الْعَظِيمِ", "Yang Maha Agung"], ["الْأَعْلَى", "Yang Maha Tinggi"], ["رَبِّيَ", "Tuhanku"]], "Arti per kata bacaan ruku' dan sujud.", "Bacaan Sholat: Ruku' & Sujud"),
    match('m4', 'Wudhu', 2, "Pasangkan kata Arab dengan artinya (doa setelah wudhu):", [["أَشْهَدُ", "aku bersaksi"], ["وَحْدَهُ", "Dia semata"], ["عَبْدُهُ", "hamba-Nya"], ["اجْعَلْنِي", "jadikanlah aku"]], "Arti per kata doa setelah wudhu.", "Doa Setelah Wudhu"),
    match('m5', 'Bacaan Sholat', 2, "Pasangkan kata Arab dengan artinya (i'tidal dan takbir):", [["رَبَّنَا", "Wahai Tuhan kami"], ["كَثِيرًا", "yang banyak"], ["مُبَارَكًا", "yang diberkahi"], ["أَكْبَرُ", "Maha Besar"]], "Arti per kata bacaan i'tidal dan takbiratul ihram.", "Bacaan Sholat"),
    match('m6', 'Bacaan Sholat', 3, "Pasangkan kata Arab dengan artinya (tasyahud):", [["التَّحِيَّاتُ", "Segala penghormatan"], ["عَلَيْكَ", "atasmu"], ["النَّبِيُّ", "Nabi"], ["وَبَرَكَاتُهُ", "dan berkah-Nya"]], "Arti per kata tasyahud.", "Bacaan Sholat: Tasyahud")
];

// Teks Arab dalil (disalin dari kartu di aplikasi) untuk soal yang hanya menyebut terjemahan; ditampilkan pada penjelasan setelah menjawab (agar tidak membocorkan jawaban)
export const QUIZ_AR = {
    d1: "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ",
    d2: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ",
    d4: "أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ، يَغْتَسِلُ فِيهِ كُلَّ يَوْمٍ خَمْسًا، مَا تَقُولُ ذَلِكَ يُبْقِي مِنْ دَرَنِهِ. قَالُوا لاَ يُبْقِي مِنْ دَرَنِهِ شَيْئًا. قَالَ  فَذَلِكَ مِثْلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهَا الْخَطَايَا.",
    d5: "إِنَّ ٱلصَّلَوٰةَ تَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ ۗ وَلَذِكْرُ ٱللَّهِ أَكْبَرُ",
    d6: "إِنَّ بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكَ الصَّلاَةِ",
    d7: "مَا سَلَكَكُمْ فِي سَقَرَ . قَالُوا لَمْ نَكُ مِنَ الْمُصَلِّينَ",
    w6: "مَا مِنْكُمْ مِنْ أَحَدٍ يَتَوَضَّأُ فَيُبْلِغُ أَوْ فَيُسْبِغُ الْوُضُوءَ ثُمَّ يَقُولُ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُ اللَّهِ وَرَسُولُهُ إِلَّا فُتِحَتْ لَهُ أَبْوَابُ الْجَنَّةِ الثَّمَانِيَةُ يَدْخُلُ مِنْ أَيِّهَا شَاءَ",
    s2: "إِذَا زَوَّجَ أَحَدُكُمْ خَادِمَهُ عَبْدَهُ أَوْ أَجِيرَهُ فَلاَ يَنْظُرْ إِلَى مَا دُونَ السُّرَّةِ وَفَوْقَ الرُّكْبَةِ",
    s3: "يَا أَسْمَاءُ إِنَّ الْمَرْأَةَ إِذَا بَلَغَتِ الْمَحِيضَ لَمْ تَصْلُحْ أَنْ يُرَى مِنْهَا إِلاَّ هَذَا وَهَذَا . وَأَشَارَ إِلَى وَجْهِهِ وَكَفَّيْهِ",
    w10: "لَوْلاَ أَنْ أَشُقَّ عَلَى أُمَّتِي ـ أَوْ عَلَى النَّاسِ ـ لأَمَرْتُهُمْ بِالسِّوَاكِ مَعَ كُلِّ صَلاَةٍ",
    w12: "لاَ صَلاَةَ لِمَنْ لاَ وُضُوءَ لَهُ وَلاَ وُضُوءَ لِمَنْ لَمْ يَذْكُرِ اسْمَ اللَّهِ تَعَالَى عَلَيْهِ",
    p2: "أَمَا يَخْشَى الَّذِي يَرْفَعُ رَأْسَهُ قَبْلَ الْإِمَامِ أَنْ يُحَوِّلَ اللَّهُ رَأْسَهُ رَأْسَ حِمَارٍ",
    p3: "إِنَّ هَذِهِ الصَّلَاةَ لَا يَصْلُحُ فِيهَا شَيْءٌ مِنْ كَلَامِ النَّاسِ، إِنَّمَا هُوَ التَّسْبِيحُ وَالتَّكْبِيرُ وَقِرَاءَةُ الْقُرْآنِ"
};
quizBank.forEach(q => {
    if (QUIZ_AR[q.id]) q.exp += `<span class="block font-arabic text-xl text-right text-emerald-950 leading-loose font-normal mt-3 p-3 bg-slate-50 rounded-xl" dir="rtl">${QUIZ_AR[q.id]}</span>`;
});
