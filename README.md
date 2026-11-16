# APIW.EXE // Happy Birthday 25 Babee ! <3 (Retro Cyberpunk Arcade)

Aplikasi web interaktif ulang tahun ke-25 spesial untuk **Apiw (17 November)** dengan estetika **Retro Game Console / Cyberpunk Terminal** (`#0a0a0c`, `#00ff66`, `#ff007f`, `#00f3ff`), siap dipasang ke **Vercel** + **Supabase PostgreSQL**.

---

## Fitur Utama
1. **Layar Pembuka Mesin Dingdong (`LEVEL 25 START`) & Dashboard `"Happy Birthday 25 Babee ! <3"`**
   - Dilengkapi untaian doa panjang umur, sehat selalu, kerjaan lancar, serta makin cinta & sayang.
2. **Stage 1: Cerita Perjalanan Cinta Kita (`MemoryQuests`)**
   - Kartu milestone perjalanan cinta dari awal kenal, jadian **25 Maret 2025**, hingga ulang tahun ke-25.
3. **Stage 2: Foto-Foto Kenangan Kita (`PhotoVault`)**
   - Galeri foto romantis lengkap dengan keterangan waktu & caption + fitur klik perbesar (*Lightbox*).
4. **Stage 3: Mini-Game `"Catch the Heart"` + Hadiah Foto & Barcode Spotify**
   - Permainan tangkap 5 hati pixel (bisa geser jari di HP atau tombol panah di laptop).
   - Saat menang (skor 5), otomatis memunculkan efek *confetti* (`canvas-confetti`), pesan cinta spesial:
     > *"Congratulations, you beat the game! But the real prize for me is having you in my life. Happy 25th birthday, Apiw! Thank you for being my favorite person, my tech partner, and my home. Aku cinta banget sama kamu, hari ini, besok, dan selamanya."*
   - Menampilkan beberapa foto berdua dan gambar **Barcode Spotify** yang bisa langsung di-scan oleh Apiw.
5. **Stage 4: Undangan Ngedate Hari Kamis di Blok M + Buku Tamu Database (`BirthdayWishes`)**
   - Tiket undangan ngedate hari Kamis di Blok M dengan pilihan jam & rute fleksibel yang bisa dipilih langsung oleh Apiw beserta kolom pesan balasan yang tersimpan ke database Supabase.
6. **Mode Edit Rahasia Pasangan (PIN: `250325`)**
   - Klik tombol **PIN** di pojok kanan atas web, masukkan `250325` (25 Maret 2025), dan kamu bisa langsung mengupload foto asli kalian, mengganti gambar Barcode Spotify, menambah cerita, atau mengubah jadwal Date Kamis tanpa perlu membongkar kodingan!

---

## Panduan Langkah demi Langkah: Koneksi Database Supabase & Deploy ke Vercel

### Langkah 1: Siapkan Database Gratis di Supabase (3 Menit)
1. Buka [https://supabase.com](https://supabase.com) dan login, lalu klik **"New Project"**.
2. Beri nama project (misal: `apiw-birthday-25`), buat password database bebas, pilih region terdekat (*Singapore*), lalu klik **"Create new project"**.
3. Setelah project aktif, klik menu **"SQL Editor"** di bilah kiri Supabase.
4. Buka file [`supabase/schema.sql`](./supabase/schema.sql) dari folder projek ini, **Copy seluruh isinya**, tempelkan ke SQL Editor Supabase, lalu klik tombol **"Run"** (akan muncul tulisan *Success*).
5. Klik menu **"Project Settings"** (ikon roda gigi di kiri bawah) &rarr; pilih **"API"**:
   - Salin **Project URL** (untuk `NEXT_PUBLIC_SUPABASE_URL`).
   - Salin **anon public key** (untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### Langkah 2: Upload & Deploy Gratis ke Vercel (Agar Bisa Dibuka di HP Apiw)
1. Upload folder projek ini ke akun **GitHub** kamu (buat repository baru bernama `happy-birthday-apiw`).
2. Buka [https://vercel.com](https://vercel.com), login dengan GitHub, lalu klik **"Add New..." &rarr; "Project"**.
3. Pilih repository `happy-birthday-apiw` lalu klik **"Import"**.
4. Pada bagian **"Environment Variables"**, tambahkan 3 baris berikut:
   - `NEXT_PUBLIC_SUPABASE_URL` = *(Tempel Project URL dari Supabase)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Tempel anon public key dari Supabase)*
   - `ADMIN_SECRET_PIN` = `250325`
5. Klik tombol **"Deploy"** dan tunggu ~1 menit hingga selesai!
6. Kamu akan mendapatkan link publik (contoh: `https://happy-birthday-apiw.vercel.app`).
7. Buka link tersebut di HP/laptopmu terlebih dahulu, klik tombol **PIN** di pojok kanan atas &rarr; masukkan **`250325`** &rarr; upload foto-foto kenangan asli kalian serta gambar **Barcode Spotify**, lalu kirimkan link-nya ke **Apiw**!
