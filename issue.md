# 📋 ISSUE: Frontend — Landing Page (Root `/`)

## Status

`open`

## Priority

`high`

## Assignee

_unassigned_

---

## Background

`src/app/page.tsx` saat ini masih template default Next.js. Buat landing page lengkap di route `/` sebelum user masuk ke autentikasi.

Design mengikuti layout referensi dengan skema warna: **putih** untuk hero, **hitam gelap** (`#0D0D0D`) untuk seluruh section bawahnya, dan **lime green** (`#AAFF00`) sebagai warna aksen. Konten disesuaikan ke konteks Pretest AI.

**Tidak perlu buat komponen baru** — gunakan shared component (`Button`, `Badge`, `Card`) yang sudah ada. Landing page cukup di satu file `page.tsx` (server component, tidak perlu `'use client'`).

---

## Warna & Tipografi

| Token | Value | Kegunaan |
|-------|-------|----------|
| Dark bg | `#0D0D0D` | Background section gelap |
| Accent | `#AAFF00` | Highlighted text, badge, border aksen |
| White | `#FFFFFF` | Text di atas dark bg, hero bg |
| Black | `#0D0D0D` | Text di hero |
| Font weight | `font-black` / `font-bold` | Headline besar |

Tailwind arbitrary value untuk aksen: `text-[#AAFF00]`, `bg-[#AAFF00]`, `border-[#AAFF00]`.

---

## File yang Dikerjakan

```
frontend-pretest-ai/
└── src/
    └── app/
        └── page.tsx    ← ganti seluruh isi dengan landing page
```

---

## Struktur Sections

```
┌─────────────────────────────────────────────────────┐
│  1. NAVBAR          (sticky, white bg)              │
├─────────────────────────────────────────────────────┤
│  2. HERO            (white bg)                      │
├─────────────────────────────────────────────────────┤
│  3. STATS BAR       (dark bg, 4 angka)              │
├─────────────────────────────────────────────────────┤
│  4. ABOUT           (dark bg, split layout)         │
├─────────────────────────────────────────────────────┤
│  5. FEATURES        (dark bg, numbered list)        │
├─────────────────────────────────────────────────────┤
│  6. MARQUEE         (dark bg, scrolling text)       │
├─────────────────────────────────────────────────────┤
│  7. TESTIMONIALS    (dark bg, card grid)            │
├─────────────────────────────────────────────────────┤
│  8. CTA             (dark bg, email input)          │
├─────────────────────────────────────────────────────┤
│  9. FOOTER          (darkest bg)                    │
└─────────────────────────────────────────────────────┘
```

---

## Detail Setiap Section

### 1. Navbar

```
Layout: flex justify-between items-center
Bg: white, sticky top-0, border-b border-gray-100, z-50
Padding: px-8 py-4

Kiri:   Logo — "Pretest AI" (font-bold text-xl) dengan dot aksen [#AAFF00]
Tengah: Nav links — Fitur · Cara Kerja · Tentang (hidden di mobile)
Kanan:  <Button variant="primary"> Mulai Gratis </Button>  → href="/register"
        <Button variant="ghost"> Masuk </Button>           → href="/login"
```

---

### 2. Hero

```
Layout: 2 kolom (text kiri 60%, visual kanan 40%) — stack di mobile
Bg: white
Padding: px-8 py-20 md:py-32

Kiri:
  Badge kecil:  "✦ Platform Belajar Berbasis AI"
               bg-[#AAFF00] text-black rounded-full px-3 py-1 text-xs font-bold

  Headline:    "Belajar Lebih Cerdas
                dengan Kekuatan AI"
               text-5xl md:text-7xl font-black leading-tight tracking-tight

  Sub:         "Upload modul PDF-mu, dapatkan ringkasan otomatis dan quiz yang
                dipersonalisasi. Persiapkan ujianmu dengan lebih efisien."
               text-gray-500 text-lg max-w-md mt-4

  Badge stat:  "★★★★★  95% Tingkat Kelulusan  |  10K+ Siswa Aktif"
               bg-gray-100 rounded-full px-4 py-2 text-sm mt-6

  CTAs (mt-8 flex gap-4):
    <Button variant="primary" size="lg">  Coba Gratis Sekarang  </Button>  → /register
    <Button variant="secondary" size="lg">  Pelajari Fitur  </Button>      → #fitur

Kanan:
  Kotak dekoratif rounded-3xl overflow-hidden bg-gray-100
  Di dalamnya: ilustrasi/placeholder dengan pola dots atau gradient gelap
  Floating badge (absolute bottom-4 left-4):
    bg-white shadow-lg rounded-2xl px-4 py-2
    "🤖 AI Summary aktif — 2.3 detik"
```

---

### 3. Stats Bar

```
Bg: #0D0D0D
Layout: grid grid-cols-2 md:grid-cols-4
Padding: px-8 py-16

4 item, masing-masing:
  Angka:  text-5xl font-black text-white
  Label:  text-gray-400 text-sm mt-1

Data:
  10.000+   Siswa Aktif
  5.000+    Modul Diupload
  50.000+   Quiz Diselesaikan
  95%       Tingkat Kelulusan

Divider antar item: border-r border-white/10 (kecuali terakhir)
```

---

### 4. About / Mission

```
Bg: #0D0D0D
Layout: 2 kolom (text kiri, gambar kanan) — stack di mobile
Padding: px-8 py-24

Kiri:
  Badge:     "PLATFORM AI BELAJAR"
             border border-[#AAFF00] text-[#AAFF00] rounded-full px-3 py-1 text-xs

  Headline:  "Ubah Cara Belajarmu
              Menjadi Lebih Efisien"
             text-4xl md:text-5xl font-black text-white

  Body:      "Kami tidak sekadar menyediakan ringkasan. Dengan teknologi AI,
              setiap modul yang kamu upload dianalisis mendalam untuk menghasilkan
              ringkasan kontekstual dan quiz yang benar-benar relevan."
             text-gray-400 text-base leading-relaxed mt-4 max-w-md

Kanan:
  Grid 2x2 gambar/placeholder (gap-3)
  Setiap kotak: rounded-2xl bg-zinc-900 aspect-square
  Salah satu kotak lebih besar (col-span-2 atau row-span-2)
  Badge overlay (di kotak besar): bg-[#AAFF00] text-black text-xs font-bold px-3 py-1 rounded-full
    "PRETEST AI PLATFORM"
```

---

### 5. Features

```
id="fitur"
Bg: #0D0D0D
Padding: px-8 py-24
Border-top: border-t border-white/5

Header (2 kolom):
  Kiri:
    Headline: "Fitur "
              <span bg-[#AAFF00] text-black px-2 rounded> Unggulan </span>
              text-4xl md:text-5xl font-black text-white

  Kanan:
    Sub: "Semua yang kamu butuhkan untuk belajar lebih cerdas ada di sini."
         text-gray-400 max-w-xs

List fitur (mt-12, border-t border-white/10):
  Setiap item: flex items-center justify-between py-5 border-b border-white/10
               hover:bg-white/5 transition px-2 rounded-xl cursor-default

  Format per item:
    [Nomor]  [Nama Fitur]  →  [Deskripsi singkat]

  01   Upload PDF Modul        →  Drag & drop PDF hingga 20MB, langsung diproses AI
  02   Ringkasan AI Otomatis   →  Ringkasan kontekstual dihasilkan dalam hitungan detik
  03   Generate Quiz Cerdas    →  Quiz pilihan ganda dipersonalisasi dari isi modulmu
  04   Pantau Progressmu       →  Riwayat quiz, skor, dan statistik belajarmu

  Nomor: text-[#AAFF00] font-mono text-sm
  Nama:  text-white font-bold text-lg
  Desc:  text-gray-400 text-sm (hidden di mobile)
  Arrow: → text-[#AAFF00]
```

---

### 6. Marquee / Ticker

```
Bg: #0D0D0D
Border-top & bottom: border-y border-white/10
Padding: py-5
Overflow: overflow-hidden

Animasi scroll horizontal (CSS animation):
  @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  animation: marquee 20s linear infinite

Konten (duplikat 2x untuk seamless loop):
  "Upload PDF  ✦  Ringkasan AI  ✦  Generate Quiz  ✦  Analisis Skor  ✦  Belajar Efisien  ✦  "

Styling: text-white/40 font-medium text-sm tracking-widest uppercase
Aksen ✦: text-[#AAFF00]
```

---

### 7. Testimonials

```
Bg: #0D0D0D
Padding: px-8 py-24

Header:
  "Kata Mereka yang  "
  <span class="text-[#AAFF00]">Sudah Merasakan</span>
  text-4xl font-black text-white

Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12

6 Card testimonial (gunakan <Card> shared component atau div manual):
  Setiap card: bg-zinc-900 rounded-3xl p-6
    Avatar: w-10 h-10 rounded-full bg-zinc-700 (placeholder)
    Nama:   text-white font-bold text-sm
    Role:   text-gray-500 text-xs
    Quote:  text-gray-300 text-sm leading-relaxed mt-3

Data testimonial:
  1. Rina Amalia — Mahasiswi Kedokteran
     "Ringkasan AI-nya akurat banget. Materi 50 halaman jadi poin penting dalam 2 menit."

  2. Budi Santoso — Siswa SMA
     "Quiz-nya betul-betul dari isi modul. Nilai ujian naik drastis setelah pakai Pretest AI."

  3. Siti Rahayu — Mahasiswi Hukum
     "Upload sekali, bisa buat quiz berkali-kali. Hemat waktu banget buat persiapan ujian."

  4. Dimas Pratama — Guru SMA
     "Saya kasih ke murid-murid. Mereka lebih aktif belajar mandiri dengan fitur quiznya."

  5. Ayu Lestari — Peserta CPNS
     "Bantu banget buat belajar materi TWK dan TIU. Ringkasannya tepat sasaran."

  6. Fahri Ramadhan — Mahasiswa Teknik
     "Fitur generate quiz 20 soal langsung dari PDF kuliah? Game changer."
```

---

### 8. CTA Section

```
Bg: #0D0D0D
Padding: px-8 py-24
Border-top: border-t border-white/10

Layout: text center, max-w-2xl mx-auto

Headline: "Siap Mulai Belajar
           Lebih Cerdas?"
          text-5xl font-black text-white

Sub:      "Bergabung dengan ribuan siswa yang sudah meningkatkan nilainya bersama Pretest AI."
          text-gray-400 mt-4

Form (mt-8 flex gap-3 max-w-md mx-auto):
  <input type="email" placeholder="Masukkan emailmu..." />
  styling: flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3
           text-white placeholder-gray-500 outline-none
           focus:border-[#AAFF00] transition

  <Button variant="primary"> Daftar Sekarang </Button>  → /register

Note kecil di bawah: "Gratis. Tidak perlu kartu kredit."
                      text-gray-500 text-xs mt-3
```

---

### 9. Footer

```
Bg: #080808
Padding: px-8 py-12
Border-top: border-t border-white/5

Layout: flex justify-between items-center flex-wrap gap-4

Kiri:
  Logo: "Pretest AI" font-bold text-white
  Sub:  "Platform belajar berbasis AI." text-gray-500 text-sm mt-1

Kanan:
  Links: Fitur · Cara Kerja · Login · Daftar
         text-gray-400 text-sm hover:text-white transition

Bawah (border-t border-white/5 mt-8 pt-6):
  "© 2025 Pretest AI. All rights reserved."
  text-gray-600 text-xs text-center
```

---

## Shared Components yang Dipakai

| Section | Component | Variant |
|---------|-----------|---------|
| Navbar | `<Button>` | `primary`, `ghost` |
| Hero | `<Button>` | `primary`, `secondary` |
| Testimonials | `<Card>` (opsional) atau div manual | — |

> Tidak ada komponen baru yang perlu dibuat. Semua styling custom pakai Tailwind classes langsung di `page.tsx`.

---

## Animasi Marquee (CSS)

Tambahkan ke `globals.css`:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}
```

---

## Catatan Implementasi

- `page.tsx` adalah **server component** — tidak perlu `'use client'`
- Marquee tidak perlu JS, cukup CSS animation
- CTA email input: tidak perlu state/handler — cukup link ke `/register` via button di sebelahnya
- Semua gambar/foto: gunakan `<div>` placeholder dengan bg-zinc-800 (tidak perlu aset gambar nyata)
- Navigasi: gunakan `<Link>` dari `next/link`, bukan `<a>`
- Responsive: semua section harus stack jadi single column di mobile (`md:` breakpoint untuk 2 kolom)

---

## Definition of Done

- [ ] Navbar sticky dengan logo, nav links, dan tombol Login + Mulai Gratis
- [ ] Hero section dengan headline besar, badge, 2 CTA, dan kotak visual kanan
- [ ] Stats bar 4 angka di atas dark background
- [ ] About/mission section split layout
- [ ] Features section numbered list (01–04)
- [ ] Marquee ticker animasi CSS
- [ ] Testimonials grid 3 kolom (6 card)
- [ ] CTA section dengan email input
- [ ] Footer dengan logo dan links
- [ ] Semua section responsive (mobile: single column)
- [ ] Warna dark `#0D0D0D` dan aksen `#AAFF00` konsisten di seluruh page
- [ ] Tidak ada error TypeScript (`tsc --noEmit`)
- [ ] Tidak ada komponen baru yang dibuat
