// Arti per kata untuk dalil di luar tab Ragam/Bacaan: dalilWords[teksArab] = [[latin, arti], ...], sejajar dengan Arab yang dipecah per spasi.
// Kunci = teks Arab persis seperti di kartu (spasi dirapatkan); entri kosong ["",""] = tanda baca dan dilewati saat render.
// Glos disusun mengikuti terjemahan di kartu masing-masing (bukan teks dalil), jadi tinjau bila ada yang janggal.
const SAW = ["shallallaahu 'alaihi wa sallam", "semoga shalawat dan salam atasnya"];
const P = ["", ""];

export const dalilWords = {
    // Beranda
    "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ": [
        ["wa aqiimuu", "dan laksanakanlah"], ["ash shalaata", "sholat"], ["wa aatuu", "dan tunaikanlah"], ["az zakaata", "zakat"],
        ["warka'uu", "dan rukuklah"], ["ma'a", "bersama"], ["ar raaki'iin", "orang-orang yang rukuk"]
    ],
    "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ": [
        ["buniya", "dibangun"], ["al islaamu", "Islam"], ["'alaa", "di atas"], ["khamsin", "lima (perkara)"],
        ["syahaadati", "bersaksi"], ["an", "bahwa"], ["laa", "tidak ada"], ["ilaaha", "sesembahan yang berhak disembah"], ["illaa", "selain"], ["Allaahu", "Allah"],
        ["wa anna", "dan bahwa"], ["Muhammadan", "Muhammad"], ["rasuulu", "utusan"], ["Allaahi", "Allah"],
        ["wa iqaami", "mendirikan"], ["ash shalaati", "sholat"], ["wa iitaa-i", "menunaikan"], ["az zakaati", "zakat"],
        ["wal hajji", "haji"], ["wa shaumi", "dan puasa"], ["Ramadhaana", "Ramadhan"]
    ],
    "إِنَّ ٱلصَّلَوٰةَ تَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ ۗ وَلَذِكْرُ ٱللَّهِ أَكْبَرُ": [
        ["inna", "sesungguhnya"], ["ash shalaata", "sholat itu"], ["tanhaa", "mencegah"], ["'ani", "dari"], ["al fahsyaa-i", "(perbuatan) keji"],
        ["wal munkari", "dan mungkar"], P, ["wa ladzikru", "dan sungguh mengingat"], ["Allaahi", "Allah"], ["akbaru", "lebih besar"]
    ],
    "أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ، يَغْتَسِلُ فِيهِ كُلَّ يَوْمٍ خَمْسًا، مَا تَقُولُ ذَلِكَ يُبْقِي مِنْ دَرَنِهِ. قَالُوا لاَ يُبْقِي مِنْ دَرَنِهِ شَيْئًا. قَالَ فَذَلِكَ مِثْلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهَا الْخَطَايَا.": [
        ["ara-aitum", "bagaimana pendapat kalian"], ["lau", "jika"], ["anna", "(ada)"], ["naharan", "sebuah sungai"], ["bibaabi", "di depan pintu"], ["ahadikum", "salah seorang dari kalian"],
        ["yaghtasilu", "ia mandi"], ["fiihi", "di dalamnya"], ["kulla", "setiap"], ["yaumin", "hari"], ["khamsan", "lima kali"],
        ["maa", "apa"], ["taquulu", "pendapatmu"], ["dzaalika", "(apakah) itu"], ["yubqii", "menyisakan"], ["min", "dari"], ["daranihi", "kotorannya"],
        ["qaaluu", "mereka menjawab"], ["laa", "tidak"], ["yubqii", "tersisa"], ["min", "dari"], ["daranihi", "kotorannya"], ["syai-an", "sedikit pun"],
        ["qaala", "beliau bersabda"], ["fadzaalika", "maka itulah"], ["mitslu", "perumpamaan"], ["ash shalawaati", "sholat"], ["al khamsi", "lima waktu"],
        ["yamhuu", "menghapus"], ["Allaahu", "Allah"], ["bihaa", "dengannya"], ["al khathaayaa", "kesalahan-kesalahan"]
    ],
    "مَا سَلَكَكُمْ فِي سَقَرَ . قَالُوا لَمْ نَكُ مِنَ الْمُصَلِّينَ": [
        ["maa", "apakah"], ["salakakum", "yang memasukkan kalian"], ["fii", "ke dalam"], ["saqar", "Saqar (neraka)"], P,
        ["qaaluu", "mereka menjawab"], ["lam", "tidak"], ["naku", "kami dahulu"], ["mina", "termasuk"], ["al mushalliin", "orang-orang yang sholat"]
    ],
    "إِنَّ بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكَ الصَّلاَةِ": [
        ["inna", "sesungguhnya"], ["baina", "antara"], ["ar rajuli", "seseorang"], ["wa baina", "dan antara"], ["asy syirki", "kesyirikan"],
        ["wal kufri", "dan kekafiran"], ["tarka", "meninggalkan"], ["ash shalaati", "sholat"]
    ],

    // Wudhu
    "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا قُمْتُمْ إِلَى ٱلصَّلَوٰةِ فَٱغْسِلُوا۟ وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى ٱلْمَرَافِقِ وَٱمْسَحُوا۟ بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى ٱلْكَعْبَيْنِ": [
        ["yaa ayyuhaa", "wahai"], ["alladziina", "orang-orang yang"], ["aamanuu", "beriman"], ["idzaa", "apabila"], ["qumtum", "kalian hendak (berdiri)"],
        ["ilaa", "untuk"], ["ash shalaati", "sholat"], ["faghsiluu", "maka basuhlah"], ["wujuuhakum", "wajah kalian"], ["wa aidiyakum", "dan tangan kalian"],
        ["ilaa", "sampai"], ["al maraafiqi", "siku"], ["wamsahuu", "dan usaplah"], ["biru-uusikum", "kepala kalian"], ["wa arjulakum", "dan (basuh) kaki kalian"],
        ["ilaa", "sampai"], ["al ka'bain", "kedua mata kaki"]
    ],
    "لَوْلاَ أَنْ أَشُقَّ عَلَى أُمَّتِي ـ أَوْ عَلَى النَّاسِ ـ لأَمَرْتُهُمْ بِالسِّوَاكِ مَعَ كُلِّ صَلاَةٍ": [
        ["laulaa", "seandainya tidak"], ["an", "(khawatir)"], ["asyuqqa", "memberatkan"], ["'alaa", "atas"], ["ummatii", "umatku"], P,
        ["au", "atau"], ["'alaa", "atas"], ["an naasi", "manusia"], P, ["la-amartuhum", "niscaya aku perintahkan mereka"],
        ["bis siwaaki", "bersiwak"], ["ma'a", "bersama"], ["kulli", "setiap"], ["shalaatin", "sholat"]
    ],
    "لاَ صَلاَةَ لِمَنْ لاَ وُضُوءَ لَهُ وَلاَ وُضُوءَ لِمَنْ لَمْ يَذْكُرِ اسْمَ اللَّهِ تَعَالَى عَلَيْهِ": [
        ["laa", "tidak ada"], ["shalaata", "sholat"], ["liman", "bagi orang yang"], ["laa", "tidak ada"], ["wudhuu-a", "wudhu"], ["lahu", "baginya"],
        ["wa laa", "dan tidak ada"], ["wudhuu-a", "wudhu"], ["liman", "bagi orang yang"], ["lam", "tidak"], ["yadzkuri", "menyebut"],
        ["isma", "nama"], ["Allaahi", "Allah"], ["ta'aalaa", "Yang Maha Tinggi"], ["'alaihi", "atasnya (di awal)"]
    ],
    "كَانَ النَّبِيُّ ﷺ يُعْجِبُهُ التَّيَمُّنُ فِي تَنَعُّلِهِ وَتَرَجُّلِهِ وَطُهُورِهِ وَفِي شَأْنِهِ كُلِّهِ": [
        ["kaana", "adalah"], ["an nabiyyu", "Nabi"], SAW, ["yu'jibuhu", "menyukai"], ["at tayammunu", "mendahulukan yang kanan"], ["fii", "dalam"],
        ["tana''ulihi", "memakai sandalnya"], ["wa tarajjulihi", "dan menyisirnya"], ["wa thuhuurihi", "dan bersucinya"], ["wa fii", "dan dalam"],
        ["sya'nihi", "urusannya"], ["kullihi", "seluruhnya"]
    ],
    "مَا مِنْكُمْ مِنْ أَحَدٍ يَتَوَضَّأُ فَيُبْلِغُ أَوْ فَيُسْبِغُ الْوُضُوءَ ثُمَّ يَقُولُ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُ اللَّهِ وَرَسُولُهُ إِلَّا فُتِحَتْ لَهُ أَبْوَابُ الْجَنَّةِ الثَّمَانِيَةُ يَدْخُلُ مِنْ أَيِّهَا شَاءَ": [
        ["maa", "tidak ada"], ["minkum", "di antara kalian"], ["min", "dari"], ["ahadin", "seorang pun"], ["yatawadh-dha-u", "yang berwudhu"],
        ["fayublighu", "lalu menyampaikan"], ["au", "atau"], ["fayusbighu", "lalu menyempurnakan"], ["al wudhuu-a", "wudhu"], ["tsumma", "kemudian"],
        ["yaquulu", "mengucapkan"], ["asyhadu", "aku bersaksi"], ["an", "bahwa"], ["laa", "tidak ada"], ["ilaaha", "sesembahan yang berhak disembah"],
        ["illaa", "selain"], ["Allaahu", "Allah"], ["wa anna", "dan bahwa"], ["Muhammadan", "Muhammad"], ["'abdu", "hamba"], ["Allaahi", "Allah"],
        ["wa rasuuluhu", "dan utusan-Nya"], ["illaa", "kecuali"], ["futihat", "dibukakan"], ["lahu", "baginya"], ["abwaabu", "pintu-pintu"],
        ["al jannati", "surga"], ["ats tsamaaniyatu", "yang delapan"], ["yadkhulu", "ia masuk"], ["min", "dari"], ["ayyihaa", "mana saja"], ["syaa-a", "ia kehendaki"]
    ],
    // sama dengan grid "Arti Per Kata" di kartu #doa-setelah-wudhu; dipakai di langkah wudhu ke-8
    "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ": [
        ["asyhadu", "aku bersaksi"], ["an", "bahwa"], ["laa", "tidak ada"], ["ilaaha", "sesembahan (yang berhak disembah)"], ["illaa", "selain"],
        ["Allaah", "Allah"], ["wahdahu", "Dia semata"], ["laa", "tidak ada"], ["syariika", "sekutu"], ["lah", "bagi-Nya"],
        ["wa asyhadu", "dan aku bersaksi"], ["anna", "bahwa"], ["Muhammadan", "Muhammad"], ["'abduhu", "hamba-Nya"], ["wa rasuuluh", "dan utusan-Nya"],
        ["Allaahumma", "Ya Allah"], ["ij'alnii", "jadikanlah aku"], ["mina", "termasuk"], ["at tawwaabiin", "orang-orang yang banyak bertaubat"],
        ["waj'alnii", "dan jadikanlah aku"], ["mina", "termasuk"], ["al mutathahhiriin", "orang-orang yang bersuci"]
    ],
    "وَيْلٌ لِلأَعْقَابِ مِنَ النَّارِ": [
        ["wailun", "celakalah"], ["lil a'qaabi", "bagi tumit-tumit"], ["mina", "dari"], ["an naari", "api neraka"]
    ],

    // Gerakan sholat (matan)
    "حَٰفِظُوا۟ عَلَى ٱلصَّلَوَٰتِ وَٱلصَّلَوٰةِ ٱلْوُسْطَىٰ وَقُومُوا۟ لِلَّهِ قَٰنِتِينَ": [
        ["haafizhuu", "peliharalah"], ["'alaa", "(atas)"], ["ash shalawaati", "semua sholat"], ["wash shalaati", "dan sholat"], ["al wusthaa", "wusthaa"],
        ["wa quumuu", "dan berdirilah"], ["lillaahi", "untuk Allah"], ["qaanitiin", "dengan khusyu'"]
    ],
    "رَأَيْتُ رَسُولَ اللَّهِ ﷺ إِذَا افْتَتَحَ الصَّلاَةَ رَفَعَ يَدَيْهِ حَتَّى يُحَاذِيَ مَنْكِبَيْهِ وَقَبْلَ أَنْ يَرْكَعَ وَإِذَا رَفَعَ مِنَ الرُّكُوعِ وَلاَ يَرْفَعُهُمَا بَيْنَ السَّجْدَتَيْنِ": [
        ["ra-aitu", "saya melihat"], ["rasuula", "Rasul"], ["Allaahi", "Allah"], SAW, ["idzaa", "apabila"], ["iftataha", "memulai"], ["ash shalaata", "sholat"],
        ["rafa'a", "mengangkat"], ["yadaihi", "kedua tangannya"], ["hattaa", "hingga"], ["yuhaadziya", "sejajar dengan"], ["mankibaihi", "kedua bahunya"],
        ["wa qabla", "dan sebelum"], ["an", "(untuk)"], ["yarka'a", "ruku"], ["wa idzaa", "dan apabila"], ["rafa'a", "bangkit"], ["mina", "dari"],
        ["ar rukuu'i", "ruku"], ["wa laa", "dan tidak"], ["yarfa'uhumaa", "mengangkat keduanya"], ["baina", "di antara"], ["as sajdatain", "dua sujud"]
    ],
    "رَأَى النَّبِيَّ ﷺ رَفَعَ يَدَيْهِ حِينَ دَخَلَ فِي الصَّلاَةِ كَبَّرَ - وَصَفَ هَمَّامٌ حِيَالَ أُذُنَيْهِ - ثُمَّ الْتَحَفَ بِثَوْبِهِ ثُمَّ وَضَعَ يَدَهُ الْيُمْنَى عَلَى الْيُسْرَى": [
        ["ra-aa", "ia melihat"], ["an nabiyya", "Nabi"], SAW, ["rafa'a", "mengangkat"], ["yadaihi", "kedua tangannya"], ["hiina", "ketika"],
        ["dakhala", "masuk"], ["fii", "ke dalam"], ["ash shalaati", "sholat"], ["kabbara", "bertakbir"], P, ["washafa", "menggambarkan"],
        ["Hammaamun", "Hammam (perawi)"], ["hiyaala", "sejajar dengan"], ["udzunaihi", "kedua telinganya"], P, ["tsumma", "kemudian"],
        ["iltahafa", "membungkus (tangannya)"], ["bitsaubihi", "dengan kainnya"], ["tsumma", "kemudian"], ["wadha'a", "meletakkan"],
        ["yadahu", "tangannya"], ["al yumnaa", "yang kanan"], ["'alaa", "di atas"], ["al yusraa", "yang kiri"]
    ],
    "رَأَيْتُهُ إِذَا كَبَّرَ جَعَلَ يَدَيْهِ حِذَاءَ مَنْكِبَيْهِ، وَإِذَا رَكَعَ أَمْكَنَ يَدَيْهِ مِنْ رُكْبَتَيْهِ، ثُمَّ هَصَرَ ظَهْرَهُ": [
        ["ra-aituhu", "saya melihat beliau"], ["idzaa", "apabila"], ["kabbara", "bertakbir"], ["ja'ala", "mengangkat"], ["yadaihi", "kedua tangannya"],
        ["hidzaa-a", "sejajar dengan"], ["mankibaihi", "kedua bahunya"], ["wa idzaa", "dan apabila"], ["raka'a", "ruku"],
        ["amkana", "meletakkan dengan kokoh"], ["yadaihi", "kedua tangannya"], ["min", "pada"], ["rukbataihi", "kedua lututnya"],
        ["tsumma", "kemudian"], ["hashara", "membungkukkan dengan lurus"], ["zhahrahu", "punggungnya"]
    ],
    "كَانَ رَسُولُ اللَّهِ ﷺ إِذَا قَامَ إِلَى الصَّلاَةِ يُكَبِّرُ حِينَ يَقُومُ، ثُمَّ يُكَبِّرُ حِينَ يَرْكَعُ، ثُمَّ يَقُولُ سَمِعَ اللَّهُ لَمِنْ حَمِدَهُ. حِينَ يَرْفَعُ صُلْبَهُ مِنَ الرَّكْعَةِ، ثُمَّ يَقُولُ وَهُوَ قَائِمٌ رَبَّنَا لَكَ الْحَمْدُ": [
        ["kaana", "adalah"], ["rasuulu", "Rasul"], ["Allaahi", "Allah"], SAW, ["idzaa", "apabila"], ["qaama", "berdiri"], ["ilaa", "untuk"],
        ["ash shalaati", "sholat"], ["yukabbiru", "beliau bertakbir"], ["hiina", "ketika"], ["yaquumu", "berdiri"], ["tsumma", "kemudian"],
        ["yukabbiru", "bertakbir"], ["hiina", "ketika"], ["yarka'u", "ruku"], ["tsumma", "kemudian"], ["yaquulu", "mengucapkan"],
        ["sami'a", "Maha Mendengar"], ["Allaahu", "Allah"], ["liman", "(pujian) orang yang"], ["hamidahu", "memuji-Nya"], ["hiina", "ketika"],
        ["yarfa'u", "mengangkat"], ["shulbahu", "punggungnya"], ["mina", "dari"], ["ar rak'ati", "ruku"], ["tsumma", "kemudian"],
        ["yaquulu", "mengucapkan"], ["wa huwa", "sedang beliau"], ["qaa-imun", "berdiri"], ["rabbanaa", "wahai Rabb kami"], ["laka", "bagi-Mu"],
        ["al hamdu", "segala puji"]
    ],
    "أُمِرْتُ أَنْ أَسْجُدَ عَلَى سَبْعَةِ أَعْظُمٍ عَلَى الْجَبْهَةِ ـ وَأَشَارَ بِيَدِهِ عَلَى أَنْفِهِ ـ وَالْيَدَيْنِ، وَالرُّكْبَتَيْنِ وَأَطْرَافِ الْقَدَمَيْنِ، وَلاَ نَكْفِتَ الثِّيَابَ وَالشَّعَرَ": [
        ["umirtu", "aku diperintahkan"], ["an", "untuk"], ["asjuda", "sujud"], ["'alaa", "di atas"], ["sab'ati", "tujuh"], ["a'zhumin", "tulang"],
        ["'alaa", "di atas"], ["al jabhati", "dahi"], P, ["wa asyaara", "dan beliau menunjuk"], ["biyadihi", "dengan tangannya"], ["'alaa", "ke"],
        ["anfihi", "hidungnya"], P, ["wal yadaini", "dan kedua tangan"], ["war rukbataini", "dan kedua lutut"], ["wa athraafi", "dan ujung-ujung"],
        ["al qadamaini", "kedua kaki"], ["wa laa", "dan tidak"], ["nakfita", "mengumpulkan"], ["ats tsiyaaba", "pakaian"], ["wasy sya'ara", "dan rambut"]
    ],
    "وَكَانَ يَفْرِشُ رِجْلَهُ الْيُسْرَى وَيَنْصِبُ رِجْلَهُ الْيُمْنَى": [
        ["wa kaana", "dan beliau biasa"], ["yafrisyu", "meletakkan datar"], ["rijlahu", "kakinya"], ["al yusraa", "yang kiri"],
        ["wa yanshibu", "dan menegakkan"], ["rijlahu", "kakinya"], ["al yumnaa", "yang kanan"]
    ],
    "وَإِذَا جَلَسَ فِي الرَّكْعَةِ الآخِرَةِ قَدَّمَ رِجْلَهُ الْيُسْرَى وَنَصَبَ الأُخْرَى وَقَعَدَ عَلَى مَقْعَدَتِهِ": [
        ["wa idzaa", "dan apabila"], ["jalasa", "duduk"], ["fii", "pada"], ["ar rak'ati", "rakaat"], ["al aakhirati", "terakhir"],
        ["qaddama", "memajukan"], ["rijlahu", "kakinya"], ["al yusraa", "yang kiri"], ["wa nashaba", "dan menegakkan"], ["al ukhraa", "(kaki) yang lain"],
        ["wa qa'ada", "dan duduk"], ["'alaa", "di atas"], ["maq'adatihi", "pantatnya"]
    ],
    "كُنْتُ أَرَى رَسُولَ اللَّهِ ﷺ يُسَلِّمُ عَنْ يَمِينِهِ وَعَنْ يَسَارِهِ حَتَّى أَرَى بَيَاضَ خَدِّهِ": [
        ["kuntu", "dahulu saya"], ["araa", "melihat"], ["rasuula", "Rasul"], ["Allaahi", "Allah"], SAW, ["yusallimu", "mengucapkan salam"],
        ["'an", "ke"], ["yamiinihi", "kanannya"], ["wa 'an", "dan ke"], ["yasaarihi", "kirinya"], ["hattaa", "hingga"], ["araa", "saya melihat"],
        ["bayaadha", "putih"], ["khaddihi", "pipinya"]
    ],

    // Syarat sah sholat
    "وَمَن يَبْتَغِ غَيْرَ الْإِسْلَامِ دِينًا فَلَن يُقْبَلَ مِنْهُ وَهُوَ فِي الْآخِرَةِ مِنَ الْخَاسِرِينَ": [
        ["wa man", "dan barangsiapa"], ["yabtaghi", "mencari"], ["ghaira", "selain"], ["al islaami", "Islam"], ["diinan", "(sebagai) agama"],
        ["falan", "maka tidak akan"], ["yuqbala", "diterima"], ["minhu", "darinya"], ["wa huwa", "dan dia"], ["fii", "di"],
        ["al aakhirati", "akhirat"], ["mina", "termasuk"], ["al khaasiriin", "orang-orang yang merugi"]
    ],
    "رُفِعَ الْقَلَمُ عَنْ ثَلَاثَةٍ: عَنِ النَّائِمِ حَتَّى يَسْتَيْقِظَ، وَعَنِ الصَّبِيِّ حَتَّى يَحْتَلِمَ، وَعَنِ الْمَجْنُونِ حَتَّى يَعْقِلَ": [
        ["rufi'a", "diangkat"], ["al qalamu", "pena"], ["'an", "dari"], ["tsalaatsatin", "tiga (orang)"], ["'ani", "dari"], ["an naa-imi", "orang yang tidur"],
        ["hattaa", "hingga"], ["yastaiqizha", "ia bangun"], ["wa 'ani", "dan dari"], ["ash shabiyyi", "anak kecil"], ["hattaa", "hingga"],
        ["yahtalima", "ia baligh"], ["wa 'ani", "dan dari"], ["al majnuuni", "orang gila"], ["hattaa", "hingga"], ["ya'qila", "ia berakal"]
    ],
    "مُرُوا أَوْلَادَكُمْ بِالصَّلَاةِ وَهُمْ أَبْنَاءُ سَبْعِ سِنِينَ، وَاضْرِبُوهُمْ عَلَيْهَا وَهُمْ أَبْنَاءُ عَشْرِ سِنِينَ، وَفَرِّقُوا بَيْنَهُمْ فِي الْمَضَاجِعِ": [
        ["muruu", "perintahkanlah"], ["aulaadakum", "anak-anak kalian"], ["bish shalaati", "untuk sholat"], ["wa hum", "ketika mereka"],
        ["abnaa-u", "berumur"], ["sab'i", "tujuh"], ["siniina", "tahun"], ["wadhribuuhum", "dan pukullah mereka (mendidik)"],
        ["'alaihaa", "karena (meninggalkan)nya"], ["wa hum", "ketika mereka"], ["abnaa-u", "berumur"], ["'asyri", "sepuluh"], ["siniina", "tahun"],
        ["wa farriquu", "dan pisahkanlah"], ["bainahum", "di antara mereka"], ["fii", "pada"], ["al madhaaji'i", "tempat tidur"]
    ],
    "لَا تُقْبَلُ صَلَاةُ مَنْ أَحْدَثَ حَتَّى يَتَوَضَّأَ": [
        ["laa", "tidak"], ["tuqbalu", "diterima"], ["shalaatu", "sholat"], ["man", "orang yang"], ["ahdatsa", "berhadats"],
        ["hattaa", "hingga"], ["yatawadh-dha-a", "ia berwudhu"]
    ],
    "دَعُوهُ وَهَرِيقُوا عَلَى بَوْلِهِ سَجْلاً مِنْ مَاءٍ، أَوْ ذَنُوبًا مِنْ مَاءٍ، فَإِنَّمَا بُعِثْتُمْ مُيَسِّرِينَ، وَلَمْ تُبْعَثُوا مُعَسِّرِينَ": [
        ["da'uuhu", "biarkanlah dia"], ["wa hariiquu", "dan tuangkanlah"], ["'alaa", "di atas"], ["baulihi", "air kencingnya"],
        ["sajlan", "seember"], ["min", "dari"], ["maa-in", "air"], ["au", "atau"], ["dzanuuban", "setimba"], ["min", "dari"], ["maa-in", "air"],
        ["fa innamaa", "sesungguhnya"], ["bu'itstum", "kalian diutus"], ["muyassiriina", "untuk mempermudah"], ["wa lam", "dan bukan"],
        ["tub'atsuu", "kalian diutus"], ["mu'assiriin", "untuk mempersulit"]
    ],
    "يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِنْدَ كُلِّ مَسْجِدٍ": [
        ["yaa", "wahai"], ["banii", "anak-anak"], ["aadama", "Adam"], ["khudzuu", "pakailah"], ["ziinatakum", "pakaianmu yang indah"],
        ["'inda", "ketika (memasuki)"], ["kulli", "setiap"], ["masjidin", "masjid"]
    ],
    "لاَ تُقْبَلُ صَلاَةُ الْحَائِضِ إِلاَّ بِخِمَارٍ": [
        ["laa", "tidak"], ["tuqbalu", "diterima"], ["shalaatu", "sholat"], ["al haa-idhi", "wanita yang telah haid"], ["illaa", "kecuali"], ["bikhimaarin", "dengan khimar"]
    ],
    "يَا أَسْمَاءُ إِنَّ الْمَرْأَةَ إِذَا بَلَغَتِ الْمَحِيضَ لَمْ تَصْلُحْ أَنْ يُرَى مِنْهَا إِلاَّ هَذَا وَهَذَا . وَأَشَارَ إِلَى وَجْهِهِ وَكَفَّيْهِ": [
        ["yaa", "wahai"], ["Asmaa-u", "Asma"], ["inna", "sesungguhnya"], ["al mar-ata", "wanita"], ["idzaa", "apabila"], ["balaghat", "telah mencapai"],
        ["al mahiidha", "masa haid"], ["lam", "tidak"], ["tashluh", "pantas"], ["an", "untuk"], ["yuraa", "terlihat"], ["minhaa", "darinya"],
        ["illaa", "kecuali"], ["haadzaa", "ini"], ["wa haadzaa", "dan ini"], P, ["wa asyaara", "dan beliau menunjuk"], ["ilaa", "ke"],
        ["wajhihi", "wajahnya"], ["wa kaffaihi", "dan kedua telapak tangannya"]
    ],
    "إِذَا زَوَّجَ أَحَدُكُمْ خَادِمَهُ عَبْدَهُ أَوْ أَجِيرَهُ فَلاَ يَنْظُرْ إِلَى مَا دُونَ السُّرَّةِ وَفَوْقَ الرُّكْبَةِ": [
        ["idzaa", "ketika"], ["zawwaja", "menikahkan"], ["ahadukum", "salah seorang dari kalian"], ["khaadimahu", "pelayan wanitanya"],
        ["'abdahu", "(dengan) budaknya"], ["au", "atau"], ["ajiirahu", "pegawainya"], ["falaa", "maka janganlah"], ["yanzhur", "ia melihat"],
        ["ilaa", "kepada"], ["maa", "bagian yang"], ["duuna", "di bawah"], ["as surrati", "pusar"], ["wa fauqa", "dan di atas"], ["ar rukbati", "lutut"]
    ],
    "أَمَا عَلِمْتَ أَنَّ الْفَخِذَ عَوْرَةٌ": [
        ["amaa", "tidakkah"], ["'alimta", "kamu tahu"], ["anna", "bahwa"], ["al fakhidza", "paha"], ["'auratun", "aurat"]
    ],
    "لاَ يَنْظُرُ الرَّجُلُ إِلَى عَوْرَةِ الرَّجُلِ وَلاَ الْمَرْأَةُ إِلَى عَوْرَةِ الْمَرْأَةِ وَلاَ يُفْضِي الرَّجُلُ إِلَى الرَّجُلِ فِي ثَوْبٍ وَاحِدٍ وَلاَ تُفْضِي الْمَرْأَةُ إِلَى الْمَرْأَةِ فِي الثَّوْبِ الْوَاحِدِ": [
        ["laa", "tidak boleh"], ["yanzhuru", "melihat"], ["ar rajulu", "seorang laki-laki"], ["ilaa", "kepada"], ["'aurati", "aurat"],
        ["ar rajuli", "laki-laki (lain)"], ["wa laa", "dan tidak boleh"], ["al mar-atu", "seorang wanita"], ["ilaa", "kepada"], ["'aurati", "aurat"],
        ["al mar-ati", "wanita (lain)"], ["wa laa", "dan tidak boleh"], ["yufdhii", "berbaring bersama"], ["ar rajulu", "seorang laki-laki"],
        ["ilaa", "dengan"], ["ar rajuli", "laki-laki (lain)"], ["fii", "di bawah"], ["tsaubin", "selimut"], ["waahidin", "yang satu"],
        ["wa laa", "dan tidak boleh"], ["tufdhii", "berbaring bersama"], ["al mar-atu", "seorang wanita"], ["ilaa", "dengan"],
        ["al mar-ati", "wanita (lain)"], ["fii", "di bawah"], ["ats tsaubi", "selimut"], ["al waahidi", "yang satu"]
    ],
    "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا": [
        ["inna", "sesungguhnya"], ["ash shalaata", "sholat"], ["kaanat", "adalah"], ["'alaa", "atas"], ["al mu'miniina", "orang-orang yang beriman"],
        ["kitaaban", "kewajiban"], ["mauquutaa", "yang ditetapkan waktunya"]
    ],
    "فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ": [
        ["fawalli", "maka hadapkanlah"], ["wajhaka", "wajahmu"], ["syathra", "ke arah"], ["al masjidi", "Masjid"], ["al haraami", "Al-Haram"]
    ],
    "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى": [
        ["innamaa", "sesungguhnya"], ["al a'maalu", "amal-amal"], ["bin niyyaati", "tergantung pada niat"], ["wa innamaa", "dan sesungguhnya"],
        ["likulli", "bagi setiap"], ["imri-in", "orang"], ["maa", "apa yang"], ["nawaa", "ia niatkan"]
    ],

    // Pembatal sholat
    "إِنَّ هَذِهِ الصَّلَاةَ لَا يَصْلُحُ فِيهَا شَيْءٌ مِنْ كَلَامِ النَّاسِ، إِنَّمَا هُوَ التَّسْبِيحُ وَالتَّكْبِيرُ وَقِرَاءَةُ الْقُرْآنِ": [
        ["inna", "sesungguhnya"], ["haadzihi", "ini"], ["ash shalaata", "sholat"], ["laa", "tidak"], ["yashluhu", "pantas"], ["fiihaa", "di dalamnya"],
        ["syai-un", "sesuatu"], ["min", "dari"], ["kalaami", "perkataan"], ["an naasi", "manusia"], ["innamaa", "hanyalah"], ["huwa", "ia (sholat itu)"],
        ["at tasbiihu", "tasbih"], ["wat takbiiru", "dan takbir"], ["wa qiraa-atu", "dan bacaan"], ["al qur-aani", "Al-Qur'an"]
    ]
};

// Hadits HR. Muslim 427 tertulis dengan dua harakat berbeda (الإِمَامِ di peringatan makmum, الْإِمَامِ di kartu pembatal)
const MUSLIM_427 = [
    ["amaa", "tidakkah"], ["yakhsyaa", "takut"], ["alladzii", "orang yang"], ["yarfa'u", "mengangkat"], ["ra'sahu", "kepalanya"],
    ["qabla", "sebelum"], ["al imaami", "imam"], ["an", "bahwa"], ["yuhawwila", "mengubah"], ["Allaahu", "Allah"], ["ra'sahu", "kepalanya"],
    ["ra'sa", "(menjadi) kepala"], ["himaarin", "keledai"]
];
dalilWords["أَمَا يَخْشَى الَّذِي يَرْفَعُ رَأْسَهُ قَبْلَ الإِمَامِ أَنْ يُحَوِّلَ اللَّهُ رَأْسَهُ رَأْسَ حِمَارٍ"] = MUSLIM_427;
dalilWords["أَمَا يَخْشَى الَّذِي يَرْفَعُ رَأْسَهُ قَبْلَ الْإِمَامِ أَنْ يُحَوِّلَ اللَّهُ رَأْسَهُ رَأْسَ حِمَارٍ"] = MUSLIM_427;
