// ============================================================================
// DATA AWAL BAWAAN (DEFAULT ROMANTIC SEED DATA)
// Semua teks, foto cerita (opsional), multi-foto kenangan, barcode Spotify,
// dan jadwal Date Kamis Blok M otomatis tampil dan BISA DIEDIT LANGSUNG DARI WEB
// menggunakan PIN Rahasia: 250325 (Tanggal Jadian 25 Maret 2025)
// ============================================================================

const createRomanticSvgDataUri = (title, subtitle, accentHex) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0a0c"/>
        <stop offset="50%" stop-color="#151726"/>
        <stop offset="100%" stop-color="#0a0a0c"/>
      </linearGradient>
    </defs>
    <rect width="800" height="520" fill="url(#bg)"/>
    <g stroke="${accentHex}" stroke-opacity="0.16" stroke-width="1">
      <line x1="0" y1="80" x2="800" y2="80"/>
      <line x1="0" y1="160" x2="800" y2="160"/>
      <line x1="0" y1="240" x2="800" y2="240"/>
      <line x1="0" y1="320" x2="800" y2="320"/>
      <line x1="0" y1="400" x2="800" y2="400"/>
      <line x1="160" y1="0" x2="160" y2="520"/>
      <line x1="320" y1="0" x2="320" y2="520"/>
      <line x1="480" y1="0" x2="480" y2="520"/>
      <line x1="640" y1="0" x2="640" y2="520"/>
    </g>
    <rect x="36" y="36" width="728" height="448" rx="18" fill="none" stroke="${accentHex}" stroke-width="3" stroke-opacity="0.7"/>
    <path d="M400 310 C400 310 310 245 310 185 C310 150 340 125 370 125 C388 125 400 138 400 148 C400 138 412 125 430 125 C460 125 490 150 490 185 C490 245 400 310 400 310 Z" fill="#ff007f" fill-opacity="0.88" stroke="#00f3ff" stroke-width="3"/>
    <text x="400" y="375" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="28" font-weight="bold">${title}</text>
    <text x="400" y="418" text-anchor="middle" fill="${accentHex}" font-family="monospace" font-size="18">${subtitle}</text>
    <text x="400" y="456" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Klik tombol Gembok PIN (250325) di pojok kanan atas untuk upload foto asli kalian</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createSpotifyBarcodeSvgUri = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 180" width="680" height="180">
    <rect width="680" height="180" rx="22" fill="#12131a" stroke="#00ff66" stroke-width="3"/>
    <circle cx="78" cy="90" r="38" fill="#00ff66"/>
    <path d="M58 78 Q78 68 98 78 M62 91 Q78 83 94 91 M66 104 Q78 98 90 104" stroke="#0a0a0c" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g fill="#00ff66">
      <rect x="145" y="65" width="8" height="50" rx="4"/>
      <rect x="165" y="45" width="8" height="90" rx="4"/>
      <rect x="185" y="72" width="8" height="36" rx="4"/>
      <rect x="205" y="38" width="8" height="104" rx="4"/>
      <rect x="225" y="55" width="8" height="70" rx="4"/>
      <rect x="245" y="75" width="8" height="30" rx="4"/>
      <rect x="265" y="42" width="8" height="96" rx="4"/>
      <rect x="285" y="60" width="8" height="60" rx="4"/>
      <rect x="305" y="34" width="8" height="112" rx="4"/>
      <rect x="325" y="68" width="8" height="44" rx="4"/>
      <rect x="345" y="48" width="8" height="84" rx="4"/>
      <rect x="365" y="72" width="8" height="36" rx="4"/>
      <rect x="385" y="40" width="8" height="100" rx="4"/>
      <rect x="405" y="56" width="8" height="68" rx="4"/>
      <rect x="425" y="36" width="8" height="108" rx="4"/>
      <rect x="445" y="64" width="8" height="52" rx="4"/>
      <rect x="465" y="48" width="8" height="84" rx="4"/>
      <rect x="485" y="74" width="8" height="32" rx="4"/>
      <rect x="505" y="44" width="8" height="92" rx="4"/>
      <rect x="525" y="58" width="8" height="64" rx="4"/>
      <rect x="545" y="38" width="8" height="104" rx="4"/>
      <rect x="565" y="66" width="8" height="48" rx="4"/>
      <rect x="585" y="50" width="8" height="80" rx="4"/>
      <rect x="605" y="70" width="8" height="40" rx="4"/>
    </g>
    <text x="375" y="164" text-anchor="middle" fill="#00f3ff" font-family="monospace" font-size="13">SPOTIFY BARCODE // UPLOAD GAMBAR BARCODE ASLI LEWAT PIN 250325</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const DEFAULT_APP_CONFIG = {
  id: "CFG-MAIN-001",
  dashboardTitle: "Happy Birthday Babee ! <3",
  dashboardWish:
    "Selamat ulang tahun yang ke-25 ya apiiw sayangku cintakuu suamiikuu! Semoga panjang umur, sehat selalu, kerjaannya makin lancar dan berkah terus, semua hal baik yang kamu semogakan lekas tercapai, dan yang paling penting... harus makin cinta, makin betah, dan makin sayang sama aku terus setiap harinya! Terima kasih sudah jadi pacar, partner, sekaligus rumah paling nyaman buat aku. I love you so much! <3",
  winMessage:
    "Congratulations, you beat the game! But the real prize for me is having you in my life. Happy 25th birthday, Apiw! Thank you for being my favorite person, my tech partner, and my home. Aku cinta banget sama kamu, hari ini, besok, dan selamanya.",
  winPhotosJson: JSON.stringify([
    {
      title: "My Favorite Person <3",
      caption: "Selalu bahagia setiap kali bareng kamu",
      imageUrl: createRomanticSvgDataUri("APIW & ME #01", "MY FAVORITE PERSON", "#ff007f")
    },
    {
      title: "My Tech Partner & My Home",
      caption: "Partner cerita, ketawa, dan tumbuh bareng",
      imageUrl: createRomanticSvgDataUri("APIW & ME #02", "MY TECH PARTNER & HOME", "#00f3ff")
    }
  ]),
  spotifyBarcodeUrl: createSpotifyBarcodeSvgUri(),
  dateDay: "Kamis Ini (Special Birthday Date!)",
  dateLocation: "Blok M, Jakarta Selatan",
  dateTimePlan: "Jam Fleksibel (Pilih jam & rute favoritmu di bawah ya sayang!)",
  dateNote:
    "Sayang, di hari Kamis nanti aku mau ngajak kamu ngedate spesial ulang tahun di Blok M bareng aku! Jujur aku belum mengunci jam berapa dan kita mau ke titik mana aja di Blok M, jadi kita tentuin bareng-bareng yuk. Kamu tinggal klik rencana yang paling kamu pengen di bawah ini atau ketik request spesialmu!",
  updatedAt: "2026-11-17 00:00:00"
};

export const DEFAULT_MEMORY_QUESTS = [
  {
    id: "QST-202611-001",
    questCode: "STAGE 01 // FIRST ENCOUNTER",
    title: "Awal Mula Cerita Kita Dimulai",
    eventDate: "Sebelum 25 Maret 2025",
    story:
      "Dari obrolan sederhana yang awalnya biasa aja, tiba-tiba berubah jadi notifikasi yang paling aku tunggu setiap hari. Sejak awal ngobrol sama kamu, aku udah ngerasa kalau kamu itu beda dan super nyaman diajak cerita apa aja.",
    badgeText: "+500 SPARK XP",
    sortOrder: 1,
    imageUrl: createRomanticSvgDataUri("CHAPTER 01 PHOTO", "FIRST ENCOUNTER", "#00ff66")
  },
  {
    id: "QST-202611-002",
    questCode: "STAGE 02 // OFFICIAL CO-OP MODE",
    title: "Hari Jadian Kita Berdua <3",
    eventDate: "25 Maret 2025",
    story:
      "Tanggal 25.03.2025 resmi jadi salah satu hari paling membahagiakan buat aku. Hari di mana kita mulai jalan bareng sebagai pasangan, saling jaga, dan jadi tim terbaik buat satu sama lain.",
    badgeText: "LOCKED IN: 25.03.25",
    sortOrder: 2,
    imageUrl: createRomanticSvgDataUri("25 MARET 2025", "OFFICIAL COUPLE <3", "#ff007f")
  },
  {
    id: "QST-202611-003",
    questCode: "STAGE 03 // CORE MEMORIES",
    title: "Semua Tawa, Kulineran & Waktu Bareng Kamu",
    eventDate: "2025 — 2026",
    story:
      "Entah itu jalan-jalan santai, cari makan enak berdua, ngobrolin kerjaan dan masa depan, atau sekadar duduk bareng—semua momen sama kamu selalu berhasil bikin hari-hariku jauh lebih berwarna.",
    badgeText: "+9999 HAPPINESS",
    sortOrder: 3,
    imageUrl: "" // Contoh cerita tanpa foto (opsional, tetap rapi!)
  },
  {
    id: "QST-202611-004",
    questCode: "STAGE 04 // LEVEL 25 UNLOCKED!",
    title: "Happy 25th Birthday, Apiw Sayang!",
    eventDate: "17 November",
    story:
      "Hari ini kamu resmi naik ke Level 25! Aku bangga banget sama semua kerja keras dan perjalananmu sejauh ini. Semoga di usia 25 ini kamu selalu dikelilingi kebahagiaan, kesehatan, rezeki yang deras, dan kita terus bareng selamanya!",
    badgeText: "BIRTHDAY BOY LVL 25",
    sortOrder: 4,
    imageUrl: createRomanticSvgDataUri("LEVEL 25 UNLOCKED", "HAPPY BIRTHDAY APIW!", "#00f3ff")
  }
];

export const DEFAULT_PHOTO_VAULT = [
  {
    id: "PHO-202611-001",
    title: "Our Sweet Beginning",
    imageUrl: JSON.stringify([
      createRomanticSvgDataUri("MOMENT #01 - SLIDE 1", "25 MARET 2025 (SWIPE ->)", "#00ff66"),
      createRomanticSvgDataUri("MOMENT #01 - SLIDE 2", "SENYUM FAVORITKU <3", "#00f3ff")
    ]),
    caption:
      "Momen manis waktu kita resmi mulai cerita berdua. Geser (swipe) fotonya ke samping untuk lihat foto lainnya di momen ini!",
    dateTaken: "25 Maret 2025",
    createdAt: "2026-11-16 12:00:00"
  },
  {
    id: "PHO-202611-002",
    title: "Favorite Date Time",
    imageUrl: JSON.stringify([
      createRomanticSvgDataUri("DATE TIME - SLIDE 1", "QUALITY TIME BERDUA", "#ff007f"),
      createRomanticSvgDataUri("DATE TIME - SLIDE 2", "KULINERAN & JALAN SANTAI", "#00ff66"),
      createRomanticSvgDataUri("DATE TIME - SLIDE 3", "MY SAFE PLACE <3", "#00f3ff")
    ]),
    caption:
      "Hari jalan bareng yang paling seru dan bikin kangen terus kalau lihat deretan fotonya.",
    dateTaken: "Momen Spesial Kita",
    createdAt: "2026-11-16 12:05:00"
  },
  {
    id: "PHO-202611-003",
    title: "Birthday Boy Level 25",
    imageUrl: JSON.stringify([
      createRomanticSvgDataUri("BIRTHDAY BOY LVL 25", "17 NOVEMBER SPECIAL", "#00f3ff")
    ]),
    caption:
      "Selamat ulang tahun yang ke-25 kesayanganku! Terima kasih sudah selalu hadir dan sayang sama aku.",
    dateTaken: "17 November",
    createdAt: "2026-11-16 12:10:00"
  }
];

export const DEFAULT_BIRTHDAY_WISHES = [
  {
    id: "WSH-20261117-001",
    senderName: "Pacarmu Tersayang (Player 2) <3",
    dateStatus: "UNDANGAN KAMIS SIAP! 💖",
    preferredSpot: "Bebas jam berapa aja asal bareng Apiw di Blok M!",
    message:
      "Happy 25th Birthday Babee! Jangan lupa mainin mini-gamenya sampai tembus 1.000 poin (awas jangan kena bug 3x nanti meledak!) buat buka hadiah rahasia & barcode Spotify dariku, terus isi konfirmasi ngedate hari Kamis di Blok M di sini yaa! Love youuu!",
    createdAt: "17/11/2026 00:01:00"
  }
];
