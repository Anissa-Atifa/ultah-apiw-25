# PRD (Product Requirements Document): APIW LEVEL 25 — Retro Cyberpunk Birthday Arcade

================================================================================
ZONA ATAS: SPESIFIKASI KEBUTUHAN PRODUK (BLUEPRINT AWAL)
================================================================================

## 1. Nama Projek & Problem Statement
- **Nama Projek:** **APIW.EXE // HAPPY BIRTHDAY 25 BABEE ! <3**
- **Target Spesial:** Ulang Tahun **Apiw ke-25** pada tanggal **17 November**.
- **Tanggal Spesial (PIN Admin):** **25 Maret 2025** (Kode PIN: `250325`).
- **Problem Statement (Masalah yang Diselesaikan):**
  Memberikan kejutan ulang tahun ke-25 yang interaktif, romantis, dan abadi secara digital untuk Apiw yang bisa dibuka langsung dari HP maupun laptop melalui link publik Vercel. Dimulai dari Dashboard ucapan ulang tahun, lalu memiliki tombol navigasi ke 4 halaman spesial: Perjalanan Cinta, Galeri Foto & Waktu Kenangan, Mini-Game berhadiah Surat Cinta + Foto + Barcode Spotify, serta Undangan Ngedate Hari Kamis di Blok M yang interaktif dan tersimpan di database Supabase.

---

## 2. Peran Pengguna (User Roles)
1. **Player 1 (Apiw - Birthday Boy):**
   - Membuka **Halaman Utama (Dashboard)**: Membaca ucapan *"Happy Birthday 25 Babee ! <3"* beserta doa ulang tahun (panjang umur, sehat selalu, kerjaan lancar, makin cinta & sayang).
   - Menekan 4 tombol menu interaktif untuk membuka setiap halaman kejutan.
   - Memainkan **Mini-Game ("Catch the Heart")** hingga menang (5 poin) untuk membuka hadiah rahasia: pesan cinta spesial, kolase foto berdua, dan **Barcode Spotify** yang bisa langsung di-scan.
   - Membuka **Undangan Ngedate Hari Kamis (Blok M Date)**, memilih opsi spot/jam atau menulis pesan konfirmasi/balasan RSVP yang langsung tersimpan ke database.
2. **Player 2 / Creator (Kamu - Pasangan Apiw via PIN `250325`):**
   - Membuka **Mode Edit Rahasia** langsung dari web menggunakan PIN **`250325`**.
   - Mengubah/menambah daftar **Cerita Perjalanan Cinta** dan **Foto Kenangan + Caption & Waktu**.
   - Mengganti foto hadiah game dan mengunggah gambar **Barcode Spotify** langsung dari web.
   - Mengatur detail jam & daftar tempat tujuan **Date Hari Kamis di Blok M** kapan saja saat rencananya sudah fiks, tanpa perlu bongkar kodingan.

---

## 3. Arsitektur & Lingkungan Kerja
- **Rekomendasi Arsitektur:** **Modular Full-Stack Next.js (App Router)** — Siap deploy ke **Vercel** dan terhubung ke **Supabase PostgreSQL**.
- **Tech Stack Utama:**
  - **Frontend:** Next.js (React), Tailwind CSS, Google Fonts (`Press Start 2P`, `VT323`, dan `Plus Jakarta Sans`), `canvas-confetti` untuk efek perayaan menang game, serta ikon SVG vektor bergaya pixel/cyberpunk.
  - **Backend API:** Next.js Serverless Route Handlers (`/api/memories`, `/api/photos`, `/api/reward`, `/api/date-invite`, `/api/wishes`) dengan **Pagination, Search, Auto-ID Generator (`MAX + 1`), dan Validasi PIN `250325`**.
  - **Database:** **Supabase (PostgreSQL)** via `@supabase/supabase-js` dengan data bawaan (default seed) romantis sehingga web langsung tampil lengkap sejak pertama kali dibuka.
  - **Client Optimization:** In-Memory Client Cache & Optimistic UI (perpindahan antar halaman berlangsung instan 0 detik tanpa loading berulang).

---

## 4. Alur Kerja Aplikasi & Struktur Halaman (User Flow)

1. **Halaman Utama (Home Dashboard): `"Happy Birthday 25 Babee ! <3"`**
   - Menampilkan judul utama bergaya neon arcade: **`Happy Birthday 25 Babee ! <3`**.
   - Di bawahnya terdapat kartu doa & harapan hangat: *"Selamat ulang tahun yang ke-25 ya sayang! Semoga panjang umur, sehat selalu, kerjaannya makin lancar dan berkah, semua impianmu satu per satu tercapai, dan yang paling penting... makin cinta dan sayang sama aku terus setiap harinya! ❤️"* (Teks ini juga bisa kamu edit lewat PIN `250325`).
   - Menampilkan **Grid 3 Kartu Status Karakter** (`LEVEL 25 UNLOCKED`, `CO-OP SINCE 25.03.26`, `STATUS: MY FAVORITE PERSON`) dan **4 Tombol Menu Utama** untuk masuk ke masing-masing halaman:
     - **[Tombol 1] Cerita Perjalanan Cinta Kita**
     - **[Tombol 2] Foto-Foto Kenangan Kita**
     - **[Tombol 3] Play Mini-Game (Unlock Secret Prize!)**
     - **[Tombol 4] Special Invitation: Kamis Ngedate Yuk!**

2. **Halaman 1 — Cerita Perjalanan Cinta Kita (Memory Timeline):**
   - Menampilkan kartu-kartu *Quest* perjalanan cinta kalian dari awal kenal, jadian **25 Maret 2025**, momen-momen manis, hingga ulang tahun ke-25 hari ini.
   - Dilengkapi tombol **"+ Tambah / Edit Cerita (PIN `250325`)"**.

3. **Halaman 2 — Foto-Foto Kenangan Kita (Photo Vault):**
   - Menampilkan galeri foto kenangan berdua lengkap dengan **Caption romantis** dan **Keterangan Waktu/Tanggalnya**.
   - Foto bisa diklik untuk diperbesar (Lightbox) dan bisa ditambah/diubah langsung dari web menggunakan **PIN `250325`**.

4. **Halaman 3 — Interactive Mini-Game ("Catch the Heart") & Hadiah Barcode Spotify:**
   - Game tangkap hati pixel (target: **5 Poin**, ramah layar sentuh HP & laptop).
   - **Saat Menang (5 Poin):**
     - Efek ledakan *confetti* warna-warni menyala di layar.
     - Terbuka **Secret Prize Modal** berisi:
       1. **Pesan Cinta Utama:**
          > *"Congratulations, you beat the game! But the real prize for me is having you in my life. Happy 25th birthday, Apiw! Thank you for being my favorite person, my tech partner, and my home. Aku cinta banget sama kamu, hari ini, besok, dan selamanya."*
       2. **Kolase Foto Spesial Kalian Berdua** (bisa diunggah/diganti lewat PIN `250325`).
       3. **Kartu Barcode Spotify (Scan Me!):** Menampilkan gambar kode **Spotify Code / Barcode** yang bisa langsung di-scan oleh Apiw dari aplikasi Spotify di HP-nya untuk memutar lagu/playlist spesial dari kamu!

5. **Halaman 4 — Undangan Ngedate Hari Kamis di Blok M + RSVP & Ucapan Balasan (Database-Backed):**
   - Menampilkan tiket digital bergaya **VIP Arcade Date Pass: "UNDANGAN NGEDATE HARI KAMIS — BLOK M EDITION"**.
   - Karena detail jam dan rincian tempat di Blok M masih fleksibel, tiket ini menyediakan:
     - **Rekomendasi Itinerary Fleksibel di Blok M** (misal: *Kulineran Sore / Ramen & Gultik Blok M*, *Photobox Bareng*, *Jajan Matcha / Kopi & Jalan Santai di M Bloc / Taman Literasi*) yang jadwal jam dan daftar tempatnya **bisa kamu ubah kapan saja lewat PIN `250325`**.
     - **Form Konfirmasi & Balasan Apiw (Tersimpan ke Database Supabase):** Apiw bisa memilih jam yang paling pas buat dia, memilih spot Blok M yang paling dia pengen datangi bareng kamu, dan mengetik pesan balasan/ucapan ulang tahunnya yang langsung tersimpan permanen di papan pesan bawahnya!

---

## 5. Desain Basis Data (Supabase PostgreSQL - Tanpa Karakter Underscore pada Nama Tabel)

### Tabel 1: `BirthdayWishes` (Konfirmasi Date Kamis & Balasan Pesan Apiw - Halaman 4)
| Urutan | Nama Kolom | Tipe Data | Penjelasan & Contoh Isi |
| :--- | :--- | :--- | :--- |
| 0 | `id` | `VARCHAR(30) PRIMARY KEY` | Kode unik otomatis: `WSH-20261117-001` |
| 1 | `senderName` | `VARCHAR(80) NOT NULL` | Nama pengirim: `"Apiw (Birthday Boy)"` |
| 2 | `dateStatus` | `VARCHAR(60) NOT NULL` | Konfirmasi Date Kamis: `"SIAP GAS BLOK M KAMIS! 🚀"` |
| 3 | `preferredSpot` | `VARCHAR(120) NOT NULL` | Pilihan jam & aktivitas di Blok M: `"Sore habis kerja - Kulineran + Photobox"` |
| 4 | `message` | `TEXT NOT NULL` | Isi pesan balasan / harapan dari Apiw |
| 5 | `createdAt` | `VARCHAR(30) NOT NULL` | Waktu simpan (`2026-11-17 19:30:00` WIB) |

### Tabel 2: `MemoryQuests` (Cerita Perjalanan Cinta - Halaman 1)
| Urutan | Nama Kolom | Tipe Data | Penjelasan & Contoh Isi |
| :--- | :--- | :--- | :--- |
| 0 | `id` | `VARCHAR(30) PRIMARY KEY` | Kode unik otomatis: `QST-202611-001` |
| 1 | `questCode` | `VARCHAR(30) NOT NULL` | Label cerita: `"CHAPTER 01"`, `"CHAPTER 02"` |
| 2 | `title` | `VARCHAR(120) NOT NULL` | Judul momen: `"Hari Jadian Kita ❤️"` |
| 3 | `eventDate` | `VARCHAR(50) NOT NULL` | Tanggal/Waktu: `"25 Maret 2025"` |
| 4 | `story` | `TEXT NOT NULL` | Isi cerita perjalanan cinta |
| 5 | `badgeText` | `VARCHAR(50) NOT NULL` | Badge manis: `"OFFICIAL COUPLE"` |
| 6 | `sortOrder` | `INTEGER NOT NULL` | Urutan tampil (1, 2, 3, dst.) |

### Tabel 3: `PhotoVault` (Foto Kenangan + Caption & Waktu - Halaman 2)
| Urutan | Nama Kolom | Tipe Data | Penjelasan & Contoh Isi |
| :--- | :--- | :--- | :--- |
| 0 | `id` | `VARCHAR(30) PRIMARY KEY` | Kode unik otomatis: `PHO-202611-001` |
| 1 | `title` | `VARCHAR(100) NOT NULL` | Judul foto: `"Our Favorite Moment"` |
| 2 | `imageUrl` | `TEXT NOT NULL` | URL Foto atau gambar yang diunggah dari HP/Laptop |
| 3 | `caption` | `TEXT NOT NULL` | Caption romantis tentang foto tersebut |
| 4 | `dateTaken` | `VARCHAR(50) NOT NULL` | Keterangan waktu foto: `"Maret 2025"` |
| 5 | `createdAt` | `VARCHAR(30) NOT NULL` | Waktu simpan (`yyyy-MM-dd HH:mm:ss`) |

### Tabel 4: `AppConfig` (Pengaturan Dashboard, Hadiah Game, Barcode Spotify & Rencana Date Blok M)
| Urutan | Nama Kolom | Tipe Data | Penjelasan & Contoh Isi |
| :--- | :--- | :--- | :--- |
| 0 | `id` | `VARCHAR(30) PRIMARY KEY` | Kode unik: `CFG-MAIN-001` |
| 1 | `dashboardTitle` | `VARCHAR(150) NOT NULL` | `"Happy Birthday 25 Babee ! <3"` |
| 2 | `dashboardWish` | `TEXT NOT NULL` | Kalimat doa panjang umur, sehat selalu, kerjaan lancar, makin cinta & sayang |
| 3 | `winMessage` | `TEXT NOT NULL` | Pesan hadiah menang game (`"Congratulations, you beat the game!..."`) |
| 4 | `winPhotosJson` | `TEXT NOT NULL` | JSON daftar foto berdua yang muncul saat menang game |
| 5 | `spotifyBarcodeUrl` | `TEXT NOT NULL` | Gambar Barcode Spotify yang bisa di-scan Apiw |
| 6 | `dateDay` | `VARCHAR(80) NOT NULL` | `"Hari Kamis (Blok M Date Edition)"` |
| 7 | `dateLocation` | `VARCHAR(120) NOT NULL` | `"Blok M (M Bloc / Taman Literasi / Little Tokyo)"` |
| 8 | `dateTimePlan` | `VARCHAR(120) NOT NULL` | `"Jam fleksibel (Bisa diatur bareng / pilih di bawah)"` |
| 9 | `dateNote` | `TEXT NOT NULL` | Ajakan manis ngedate hari Kamis & daftar ide aktivitas di Blok M |
| 10 | `updatedAt` | `VARCHAR(30) NOT NULL` | Waktu pembaruan terakhir |

---

## 6. Aturan Validasi & Logika Khusus
1. **Penomoran Kode Unik Sekuensial Otomatis (`MAX + 1`):**
   - Setiap data baru (`WSH-YYYYMMDD-XXX`, `QST-YYYYMM-XXX`, `PHO-YYYYMM-XXX`) dihitung otomatis di backend menggunakan urutan tertinggi `MAX + 1`.
2. **Upload Foto & Barcode Spotify Mudah (Lewat PIN `250325`):**
   - Kamu bisa langsung memilih file foto dari galeri HP/laptop (otomatis dikompres ringan atau tempel link foto) untuk menambah foto kenangan, foto hadiah menang game, maupun gambar **Barcode Spotify** tanpa perlu menyentuh kodingan.
3. **Anti-Tombol Macet & Custom Cyberpunk Toast:**
   - Semua form memakai `event.preventDefault()`, pemulihan tombol otomatis saat error (`.catch()`), serta notifikasi toast neon tanpa `alert()` bawaan browser.

---

## 7. Kriteria Pengujian (User Acceptance Checklist)
- [ ] Halaman pertama menampilkan Dashboard **"Happy Birthday 25 Babee ! <3"** lengkap dengan kalimat doa ulang tahun dan 4 tombol halaman utama.
- [ ] Halaman Cerita & Halaman Foto menampilkan waktu serta caption dengan rapi, dan bisa ditambah/diedit dengan PIN **`250325`**.
- [ ] Saat Apiw menang Mini-Game (skor 5), muncul *confetti*, teks *"Congratulations, you beat the game!..."*, beberapa foto kalian, dan gambar **Barcode Spotify** yang siap di-scan.
- [ ] Halaman terakhir menampilkan **Undangan Ngedate Hari Kamis di Blok M** dengan pilihan rencana aktivitas + form konfirmasi Apiw yang langsung tersimpan ke database Supabase.

================================================================================
ZONA BAWAH: MASTER CONTEXT & LOGIKA SISTEM TERKINI (LIVING CONTEXT)
================================================================================

- **Status Projek:** Seluruh kode aplikasi Full-Stack Next.js + Supabase telah selesai dibangun (Production-Ready).
- **Daftar Berkas Aktif:**
  - `package.json`, `next.config.mjs`, `tailwind.config.js`, `postcss.config.js`, `.env.example`
  - `supabase/schema.sql`: Skema tabel PostgreSQL (`AppConfig`, `MemoryQuests`, `PhotoVault`, `BirthdayWishes`)
  - `src/lib/defaultData.js` & `src/lib/supabase.js`: Koneksi Supabase, fallback memori, dan generator ID sekuensial (`MAX + 1`)
  - `src/app/api/arcade/route.js`: Endpoint serverless untuk CRUD cerita, foto, hadiah game + barcode Spotify, dan konfirmasi Date Kamis Blok M
  - `src/components/ArcadeIcons.jsx` & `src/components/HeartCatcherGame.jsx`: Komponen ikon SVG vektor & mini-game interaktif dengan `canvas-confetti`
  - `src/app/page.jsx`: Antarmuka utama dengan Client-Side In-Memory Cache & Optimistic UI
- **Konfigurasi Spesial:**
  - Judul Dashboard: `Happy Birthday 25 Babee ! <3`
  - Tanggal Ulang Tahun Apiw: **17 November (Ke-25 Tahun)**.
  - PIN Edit Pasangan: **`250325`** (25 Maret 2025).
- **Log Pembaruan Resmi:**
  - `[Eksekusi Kode v1.0]` Implementasi penuh aplikasi sesuai PRD v2.0 setelah persetujuan `"OKE TERAPKAN"`.
  - `[Revisi v1.1 - Perbaikan Build Vercel]` Menambahkan `jsconfig.json`, mengubah pemanggilan modul di `src/app/page.jsx` dan `src/app/api/arcade/route.js` ke relative path murni, menambahkan `export const dynamic = "force-dynamic"`, serta memperbarui `next` ke `^14.2.35` di `package.json`.
  - `[Revisi v1.2 - 4 Poin Upgrade Fitur]` (1) Perbaikan kunci PIN `250325` anti-gagal + penyimpanan sesi & notifikasi tombol `REFRESH`; (2) Penambahan fitur upload 1 foto opsional pada setiap kartu Cerita Perjalanan Cinta (Stage 1); (3) Dukungan multi-foto dalam 1 momen yang bisa di-swipe kiri/kanan + efek *hover preview zoom* pada Galeri Foto Kenangan (Stage 2); (4) Upgrade Mini-Game menjadi target 1.000 poin (Hati Pink +20, Hati Biru +50, Hati terlewat -5, Speed Up tiap 10 detik, sistem 3 Nyawa, dan layar ledakan `BOOM!! U DEAD! "Kamu ga sayang akuuu :'("` saat kena Bug 3x).
  - `[Revisi v1.3 - Koneksi Database Cloud Otomatis]` Menanamkan URL `https://giimxsinwglzrawfdtff.supabase.co` dan `sb_publishable_` key langsung di `src/lib/supabase.js`.
  - `[Revisi v1.4 - Tombol Multi-Foto Berulang & Auto-Push Git]` Menambahkan tombol kustom `+ KLIK TAMBAH FOTO LAGI` yang otomatis mereset input (`e.target.value = ""`) di Stage 1 (Cerita Kita), Stage 2 (Foto Kenangan), dan Stage 3 (Hadiah Game), mendukung multi-foto swipe di setiap kartu Cerita Kita, serta mengaktifkan `git commit` & `git push` otomatis ke `https://github.com/Anissa-Atifa/ultah-apiw-25.git`.
  - `[Revisi v1.5 - Lagu Latar Timur.mp3 & Penyembunyian Tombol PIN]` Menyalin `Timur.Mp3` ke `public/Timur.mp3` untuk autoplay musik latar saat klik `PRESS START`, menambahkan tombol `🎵 MUSIC: ON / PAUSE` di header atas, serta menyembunyikan seluruh tombol `PIN` dari antarmuka utama.
