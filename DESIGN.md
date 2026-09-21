# Panduan Desain & Identitas Visual (DESIGN.md)

> Identitas visual resmi untuk portal web **Komunitas Siswa Kristiani SMK Negeri 1 Bantul (Kristiani Skansaba)**.
> Disusun untuk memberikan arah desain yang bersahabat, terpercaya, teduh, dan berbobot tanpa ornamen klise AI.

---

## 1. Identitas & Karakter Produk (Identity & Character)
- **Nama Produk:** Kristiani Skansaba (Website Resmi Persekutuan Rohani Siswa Kristiani SMK Negeri 1 Bantul)
- **Tujuan:** Wadah publikasi kegiatan ibadah/rohani, etalase capaian prestasi siswa, direktori anggota & alumni, serta dokumentasi galeri resmi.
- **Audiens Utama:** Siswa-siswi Kristiani, guru pembimbing, orang tua siswa, alumni, dan keluarga besar SMK Negeri 1 Bantul.
- **Kepribadian (Personality):**
  - **Teduh & Hangat:** Mencerminkan kasih persaudaraan dan persekutuan rohani yang inklusif.
  - **Bersahaja & Rapi:** Bernuansa edukatif khas institusi sekolah kejuruan berprestasi, bukan korporat kaku atau startup teknologi neon.
  - **Transparan & Akurat:** Menyajikan data kegiatan, pengumuman, dan prestasi nyata tanpa klaim berlebihan.

---

## 2. Dial Pengaturan (Dials)

| Dial | Nilai | Definisi & Justifikasi |
|---|---|---|
| **ENERGY** | **1 (Calm)** | Portal komunitas sekolah dan persekutuan rohani. Tenang, berwibawa, dan fokus pada keterbacaan konten berita/kegiatan. |
| **RHYTHM** | **2 (Balanced)** | Struktur konsisten dengan jeda yang jelas antara agenda kegiatan, sorotan prestasi, dan pilar komunitas. Menghindari pengulangan template kaku 3-kolom seragam di setiap bagian. |
| **MOTION** | **1 (Hover & State Only)** | Interaksi fokus pada hover tombol, perpindahan kartu halus, dan feedback form. **Dilarang** animasi loop tanpa henti (seperti infinite pulse atau spin). |

---

## 3. Palet Warna (Color Palette)
Maksimal 2-3 warna utama + 1 aksen fungsional, berakar pada palet alami (warm earth & deep teal) yang nyaman di mata:

### Warna Dasar (Neutral Base)
- **Background Utama (Warm Paper):** `#FAF7F2` (memberikan kehangatan kertas alami)
- **Background Sekunder / Kartu:** `#FFFFFF` dan `#F6EEE5`
- **Border / Garis Pemisah:** `#EDE5D8` dan `#EAE2D5`
- **Teks Utama (Deep Slate):** `#1A252C` (rasio kontras > 10:1 terhadap latar putih/kertas)
- **Teks Muted (Neutral Slate):** `#556372` (memenuhi standar WCAG AA > 4.5:1)

### Warna Brand & Aksen (Core & Functional Accents)
- **Primary Brand (Deep Teal):** `#236374` (Hover: `#1B4F5E`, Tint: `#E2EFF7`) — Melambangkan kedalaman iman, ketenangan, dan keteraturan.
- **Warm Earth / Prestasi (Amber Terracotta):** `#9A5328` (Badge Tint: `#FDF1E6`, Border: `#F7DFC9`) — Digunakan khusus pada penghargaan, kejuaraan, dan piala.
- **Sage / Pertumbuhan (Forest Sage):** `#1E5738` (Tint: `#E5F1E9`) — Digunakan untuk pengumuman aktif dan pilar pertumbuhan rohani.

*Aturan Warna:* Dilarang menggunakan gradien ungu-biru neon, orba radial blur berlebih di hero, atau latar belakang gelap tech-dark default tanpa konteks.

---

## 4. Tipografi (Typography)
- **Font Utama:** Sans-serif sistem berbobot bersih (Geist / Inter / system-ui sans).
- **Hirarki:**
  - Judul H1: Tebal (font-extrabold/bold), ukuran proporsional (2.25rem - 3rem desktop), line-height nyaman (leading-tight).
  - Judul H2/H3: font-bold, berjarak wajar dari isi teks.
  - Isi Teks (Body): font-normal / font-medium, leading-relaxed (1.6 - 1.7) untuk kemudahan membaca pengumuman panjang dan renungan.
- *Aturan Tipografi:* Hindari huruf besar semua berjarak ekstrem (wide-tracked uppercase) atau styling monospace ala terminal programmer pada judul halaman komunitas.

---

## 5. Komponen & Bentuk (Components & Form)
- **Radius Sudut (Border Radius):**
  - Kartu & Kontainer: `rounded-2xl` (16px) hingga `rounded-3xl` (24px) untuk kesan ramah dan modern.
  - Tombol & Input: `rounded-xl` (12px) konsisten.
  - Badge Status: `rounded-full` hanya jika menandai status riil (Mendatang, Selesai, Juara).
- **Bayangan (Shadows):**
  - Mayoritas elemen duduk datar (`border border-[#EDE5D8]`).
  - Hover menggunakan `shadow-sm` hingga `shadow-md` ringan sebagai respons elevasi interaksi.
- **Ikonografi:**
  - Hanya gunakan ikon yang secara harfiah mewakili objek (Kalender untuk tanggal, MapPin untuk lokasi, Trophy untuk kejuaraan).
  - Hindari ikon generic AI (Sparkles, Magic Wand, Orb) yang diletakkan tanpa konteks.

---

## 6. Standar Konten & Kejujuran (Content Honesty)
- Semua data kegiatan, nama siswa, tanggal, dan lokasi diambil dari database/store nyata (`lib/data-store.ts`).
- Jika data kosong, tampilkan state kosong yang jujur dan solutif (bukan statistik fiktif atau testimoni rekayasa).
- Penulisan tanda baca mengikuti kaidah bahasa Indonesia yang baik tanpa karakter em dash (`—`) dalam teks UI/copy.
