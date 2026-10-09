# Solusi Error 404 & Panduan Deployment ke Vercel (vercel.app)

Panduan ini menjelaskan penyebab error **404 NOT_FOUND** yang sempat muncul dan cara aplikasi ini diperbaiki secara tuntas.

---

## 🔍 Penyebab Error "404 NOT_FOUND" di Vercel

Pada screenshot yang Anda kirimkan, Vercel menampilkan:
```
404 NOT_FOUND
sin1::...
```
**Penyebab utamanya:**
Proyek TanStack Start secara default hanya membuat file server SSR (`dist/server/server.js`) dan folder `dist/client/assets/` tanpa menyertakan `index.html` di dalam `dist/client/`. Saat Vercel menerima permintaan dari pengunjung, Vercel mencari file `index.html` di dalam `outputDirectory: dist/client` dan tidak menemukannya, sehingga Vercel langsung mengeluarkan halaman 404.

---

## ✅ Perbaikan yang Telah Diterapkan

1. **Automated Static Pre-renderer (`scripts/prerender.js`)**:
   - Skrip build `npm run build` kini otomatis mengeksekusi `vite build && node scripts/prerender.js`.
   - Mengenerate file HTML statis lengkap ke dalam `dist/client/`:
     * `dist/client/index.html` (Halaman utama)
     * `dist/client/wp-admin/index.html` (Dashboard WP Admin)
     * `dist/client/login/index.html` (Halaman Login Petugas)
     * `dist/client/admin/index.html`
     * `dist/client/404.html` (Fallback SPA)
     * Seluruh halaman detail destinasi (`/destinations/*`) & panduan wisata (`/guide/*`)
2. **Konfigurasi `vercel.json` yang disempurnakan**:
   - `cleanUrls: true` (sehingga `/wp-admin` dan `/login` langsung terbuka tanpa ekstensi `.html`).
   - `rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]` (menjamin semua rute dinamis dilayani dengan mulus tanpa error 404).
   - Caching headers otomatis untuk aset CSS/JS dan gambar.

---

## 🔐 Fitur Login Masuk WP Admin

Fitur login telah ditambahkan dan disempurnakan:

1. **Akses Halaman Login**:
   - Buka langsung: **`/login`** atau **`/wp-admin`** (contoh: `https://garut-journey.vercel.app/login`).
   - Atau klik tombol **"Login WP-Admin"** berikon gembok di bagian bawah (Footer) website.
2. **Kemudahan & Keamanan Formulir Login**:
   - **Tombol Lihat / Sembunyikan Kata Sandi (Eye Icon)**: Anda dapat melihat teks password saat mengetik.
   - **Fitur "Ingat Saya"**: Menyimpan sesi login agar tidak perlu login berulang kali.
   - **Tombol 1-Click Masuk Cepat**: Tombol praktis untuk langsung masuk sekali klik.
3. **Kredensial Bawaan**:
   - **Username**: `admin`
   - **Password**: `admin`
4. **Fitur Ganti Username & Password Sendiri**:
   - Masuk ke dashboard WP Admin &rarr; buka tab **"Edit Website"** &rarr; gulir ke **"06 • Kredensial & Akun Login WP Admin"**.
   - Masukkan username dan password baru yang Anda inginkan, lalu klik **"Simpan Akun & Password Baru"**.

---

## 🚀 Cara Re-Deploy ke Vercel

Untuk mengupdate deployment di Vercel agar perubahan ini langsung aktif:

### Langkah di GitHub & Vercel:
1. **Push pembaruan ke GitHub**:
   ```bash
   git add .
   git commit -m "Fix Vercel 404 with prerender and add login features"
   git push origin main
   ```
2. **Vercel akan otomatis mendeteksi commit baru** dan memulai build ulang.
3. Tunggu hingga proses build selesai (sekitar 1–2 menit).
4. Buka kembali tautan aplikasi Anda di Vercel — website dan halaman `/login` akan langsung terbuka secara normal!
