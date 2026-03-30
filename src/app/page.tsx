import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <span className="text-xl font-bold text-gray-900">
            Pretest
            <span className="text-[#AAFF00] bg-[#0D0D0D] px-1 rounded ml-0.5">
              AI
            </span>
          </span>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-black">
            <a href="#fitur" className="hover:text-gray-900 transition-colors">
              Fitur
            </a>
            <a
              href="#cara-kerja"
              className="hover:text-gray-900 transition-colors">
              Cara Kerja
            </a>
            <a
              href="#tentang"
              className="hover:text-gray-900 transition-colors">
              Tentang
            </a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D0D0D] text-white text-sm font-medium px-4 py-2 hover:bg-[#222] transition-colors">
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1 max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            ✦ Platform Belajar Berbasis AI
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight">
            Belajar Lebih
            <br />
            <span className="text-[#0D0D0D]">Cerdas dengan</span>
            <br />
            <span className="bg-[#0D0D0D] text-[#AAFF00] px-2 rounded-xl">
              Kekuatan AI
            </span>
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mt-6 max-w-md">
            Upload modul PDF-mu, dapatkan ringkasan otomatis dan quiz yang
            dipersonalisasi. Persiapkan ujianmu dengan lebih efisien.
          </p>

          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 mt-6 text-sm">
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-gray-700 font-medium">
              95% Tingkat Kelulusan
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">10K+ Siswa Aktif</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[#0D0D0D] text-white font-semibold text-base px-7 py-3.5 hover:bg-[#222] transition-colors">
              Coba Gratis Sekarang
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 text-gray-700 font-semibold text-base px-7 py-3.5 hover:border-gray-500 hover:bg-gray-50 transition-colors">
              Pelajari Fitur
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="flex-1 w-full max-w-lg relative">
          <div className="w-full aspect-[4/5] bg-[#0D0D0D] rounded-3xl overflow-hidden relative">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 8 }).map((_, row) => (
                <div key={row} className="flex gap-6 mb-6 px-6 pt-6">
                  {Array.from({ length: 6 }).map((_, col) => (
                    <div key={col} className="w-2 h-2 rounded-full bg-white" />
                  ))}
                </div>
              ))}
            </div>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
              <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-4xl">
                🤖
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-xl">
                  AI-Powered Learning
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Upload → Ringkas → Quiz
                </p>
              </div>
              {/* Mini progress bars */}
              <div className="w-full space-y-3 mt-4">
                {[
                  { label: "Ringkasan AI", pct: "90%" },
                  { label: "Generate Quiz", pct: "75%" },
                  { label: "Analisis Skor", pct: "60%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{item.label}</span>
                      <span className="text-[#AAFF00]">{item.pct}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: item.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 left-6 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 border border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-gray-800">
              🤖 AI Summary aktif
            </span>
            <span className="text-xs text-gray-400">2.3 detik</span>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4">
          {[
            { value: "10.000+", label: "Siswa Aktif" },
            { value: "5.000+", label: "Modul Diupload" },
            { value: "50.000+", label: "Quiz Diselesaikan" },
            { value: "95%", label: "Tingkat Kelulusan" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-8 px-4 text-center ${i < 3 ? "border-r border-white/10" : ""}`}>
              <p className="text-4xl md:text-5xl font-black text-white">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ABOUT / MISSION ────────────────────────────────────────── */}
      <section id="tentang" className="bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1 max-w-lg">
            <span className="inline-flex items-center border border-[#AAFF00] text-[#AAFF00] text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              PLATFORM AI BELAJAR
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Ubah Cara Belajarmu
              <br />
              Menjadi Lebih Efisien
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mt-5 max-w-md">
              Kami tidak sekadar menyediakan ringkasan. Dengan teknologi AI,
              setiap modul yang kamu upload dianalisis mendalam untuk
              menghasilkan ringkasan kontekstual dan quiz yang benar-benar
              relevan.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-8 text-[#AAFF00] font-semibold text-sm hover:opacity-80 transition-opacity">
              Mulai sekarang →
            </Link>
          </div>

          {/* Visual grid */}
          <div className="flex-1 w-full max-w-md grid grid-cols-2 gap-3">
            <div className="col-span-2 h-48 bg-zinc-900 rounded-3xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#AAFF00]/10 to-transparent" />
              <div className="text-center relative z-10">
                <p className="text-5xl font-black text-white">PDF</p>
                <p className="text-gray-400 text-sm mt-1">
                  → AI Summary → Quiz
                </p>
              </div>
              <span className="absolute bottom-3 left-3 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                PRETEST AI PLATFORM
              </span>
            </div>
            <div className="h-36 bg-zinc-900 rounded-3xl flex items-center justify-center text-4xl">
              📄
            </div>
            <div className="h-36 bg-zinc-900 rounded-3xl flex items-center justify-center text-4xl">
              🧠
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────── */}
      <section id="fitur" className="bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-24">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Fitur{" "}
              <span className="bg-primary text-black px-2 rounded-lg">
                Unggulan
              </span>
            </h2>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              Semua yang kamu butuhkan untuk belajar lebih cerdas ada di sini.
            </p>
          </div>

          {/* Feature list */}
          <div className="border-t border-white/10">
            {[
              {
                no: "01",
                name: "Upload PDF Modul",
                desc: "Drag & drop PDF hingga 20MB, langsung diproses AI",
                icon: "📄",
              },
              {
                no: "02",
                name: "Ringkasan AI Otomatis",
                desc: "Ringkasan kontekstual dihasilkan dalam hitungan detik",
                icon: "🤖",
              },
              {
                no: "03",
                name: "Generate Quiz Cerdas",
                desc: "Quiz pilihan ganda dipersonalisasi dari isi modulmu",
                icon: "📝",
              },
              {
                no: "04",
                name: "Pantau Progressmu",
                desc: "Riwayat quiz, skor, dan statistik belajarmu",
                icon: "📊",
              },
            ].map((feat) => (
              <div
                key={feat.no}
                className="flex items-center gap-6 py-5 border-b border-white/10 px-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-[#AAFF00] font-mono text-sm w-8 shrink-0">
                  {feat.no}
                </span>
                <span className="text-2xl w-8 shrink-0">{feat.icon}</span>
                <span className="text-white font-bold text-lg flex-1">
                  {feat.name}
                </span>
                <span className="text-gray-400 text-sm hidden md:block flex-1">
                  {feat.desc}
                </span>
                <span className="text-[#AAFF00] text-lg">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] border-y border-white/10 overflow-hidden py-5">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2].map((n) => (
            <span key={n} className="flex shrink-0">
              {[
                "Upload PDF",
                "Ringkasan AI",
                "Generate Quiz",
                "Analisis Skor",
                "Belajar Efisien",
                "Progress Tracking",
              ].map((text) => (
                <span key={text} className="flex items-center gap-4 mr-8">
                  <span className="text-white/40 font-medium text-sm tracking-widest uppercase">
                    {text}
                  </span>
                  <span className="text-[#AAFF00] text-lg">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────────── */}
      <section id="cara-kerja" className="bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-black text-white">
            Kata Mereka yang{" "}
            <span className="text-[#AAFF00]">Sudah Merasakan</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {[
              {
                name: "Rina Amalia",
                role: "Mahasiswi Kedokteran",
                quote:
                  "Ringkasan AI-nya akurat banget. Materi 50 halaman jadi poin penting dalam 2 menit.",
              },
              {
                name: "Budi Santoso",
                role: "Siswa SMA",
                quote:
                  "Quiz-nya betul-betul dari isi modul. Nilai ujian naik drastis setelah pakai Pretest AI.",
              },
              {
                name: "Siti Rahayu",
                role: "Mahasiswi Hukum",
                quote:
                  "Upload sekali, bisa buat quiz berkali-kali. Hemat waktu banget buat persiapan ujian.",
              },
              {
                name: "Dimas Pratama",
                role: "Guru SMA",
                quote:
                  "Saya kasih ke murid-murid. Mereka lebih aktif belajar mandiri dengan fitur quiznya.",
              },
              {
                name: "Ayu Lestari",
                role: "Peserta CPNS",
                quote:
                  "Bantu banget buat belajar materi TWK dan TIU. Ringkasannya tepat sasaran.",
              },
              {
                name: "Fahri Ramadhan",
                role: "Mahasiswa Teknik",
                quote:
                  "Fitur generate quiz 20 soal langsung dari PDF kuliah? Game changer.",
              },
            ].map((t) => (
              <div key={t.name} className="bg-zinc-900 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex gap-0.5 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[#AAFF00] text-xs">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] border-t border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="text-5xl font-black text-white leading-tight">
            Siap Mulai Belajar
            <br />
            <span className="text-[#AAFF00]">Lebih Cerdas?</span>
          </h2>
          <p className="text-gray-400 mt-5 text-base">
            Bergabung dengan ribuan siswa yang sudah meningkatkan nilainya
            bersama Pretest AI.
          </p>

          <div className="flex gap-3 mt-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan emailmu..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#AAFF00] transition-colors text-sm"
            />
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-primary text-black font-bold text-sm px-5 py-3 hover:bg-[#99ee00] transition-colors shrink-0">
              Daftar Sekarang
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Gratis. Tidak perlu kartu kredit.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xl font-bold text-white">
                Pretest
                <span className="text-[#AAFF00] bg-[#1a1a1a] px-1 rounded ml-0.5">
                  AI
                </span>
              </span>
              <p className="text-gray-500 text-sm mt-1">
                Platform belajar berbasis AI.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="#fitur" className="hover:text-white transition-colors">
                Fitur
              </a>
              <a
                href="#cara-kerja"
                className="hover:text-white transition-colors">
                Cara Kerja
              </a>
              <Link
                href="/login"
                className="hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="hover:text-white transition-colors">
                Daftar
              </Link>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-6 text-center">
            <p className="text-gray-600 text-xs">
              © 2025 Pretest AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
