import Image from "next/image";
import Link from "next/link";
import { Bot, FileText, ClipboardList, BarChart3, Sparkles, ArrowUpRight, FileUp, PenLine, ClipboardCheck, GraduationCap, BookOpen } from "lucide-react";
import { LandingNavbar } from "@/components/layouts/LandingNavbar";
import { getTranslations } from "next-intl/server";
import picture from "../../public/pretest-ai.webp";

export default async function Home() {
  const t = await getTranslations("LandingPage");

  const steps = (t.raw("about.steps") as Array<{ title: string; desc: string }>);
  const stepIcons = [FileUp, Bot, PenLine, ClipboardCheck, BarChart3];

  const audiences = (t.raw("about.audiences") as Array<{ name: string; problem: string; solution: string }>);
  const audienceIcons = [GraduationCap, BookOpen];

  const features = (t.raw("features.items") as Array<{ name: string; desc: string }>);
  const featureIcons = [
    <FileText key="ft" className="w-6 h-6 text-white" />,
    <Bot key="bt" className="w-6 h-6 text-white" />,
    <ClipboardList key="cl" className="w-6 h-6 text-white" />,
    <BarChart3 key="bc" className="w-6 h-6 text-white" />,
  ];
  const featureNos = ["01", "02", "03", "04"];

  const marqueeItems = t.raw("marquee") as string[];

  const testimonials = (t.raw("testimonials.items") as Array<{ name: string; role: string; quote: string }>);

  const statsBar = [
    { value: "10,000+", label: t("statsBar.activeStudents") },
    { value: "5,000+", label: t("statsBar.modulesUploaded") },
    { value: "50,000+", label: t("statsBar.quizzesCompleted") },
    { value: "95%", label: t("statsBar.passRate") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <LandingNavbar />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-14 pb-12">
        {/* Top row: headline + CTA button */}
        <div className="flex items-start justify-between gap-8 mb-5">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none tracking-tighter uppercase">
            {t("hero.headline1")}
            <br />
            {t("hero.headline2")}
          </h1>
          <div className="md:flex-col items-end gap-3 shrink-0 pt-3 hidden md:flex">
            <p className="text-gray-400 text-sm text-right max-w-40 leading-snug">
              {t("hero.aiPowered")}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#0D0D0D] text-white text-sm font-semibold px-6 py-3 hover:bg-[#222] transition-colors">
              {t("hero.learnMore")}
            </Link>
          </div>
        </div>

        {/* Hero image card */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-gray-900 h-[420px] md:h-[500px]">
          <Image
            src={picture}
            alt="Students studying with Pretest AI"
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/45" />

          {/* Bottom overlay card + arrow */}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 max-w-sm">
              <span className="inline-flex items-center bg-[#AAFF00] text-black text-xs font-black px-2.5 py-0.5 rounded-full mb-2">
                {t("hero.badge")}
              </span>
              <p className="text-white font-bold text-lg leading-snug">
                {t("hero.cardTitle")}
              </p>
              <p className="text-white/60 text-sm mt-1">
                {t("hero.cardDesc")}
              </p>
            </div>
            <Link
              href="/register"
              className="w-12 h-12 rounded-full bg-[#AAFF00] flex items-center justify-center hover:bg-white transition-colors shrink-0">
              <ArrowUpRight className="w-5 h-5 text-black" />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="bg-white rounded-3xl px-7 py-6 flex items-center justify-between border border-gray-100">
            <div>
              <p className="text-4xl font-black text-gray-900">10K+</p>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1.5">
                {t("hero.stat1Label")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="bg-white rounded-3xl px-7 py-6 flex items-center justify-between border border-gray-100">
            <div>
              <p className="text-4xl font-black text-gray-900">50K+</p>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1.5">
                {t("hero.stat2Label")}
              </p>
            </div>
            <span className="inline-flex items-center border border-gray-300 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full">
              AI POWERED
            </span>
          </div>

          <div className="bg-[#0D0D0D] rounded-3xl px-7 py-6">
            <p className="text-4xl font-black text-white">95%</p>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-1.5">
              {t("hero.stat3Label")}
            </p>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4">
          {statsBar.map((stat, i) => (
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
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-20">
          {/* Headline */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center border border-[#AAFF00] text-[#AAFF00] text-xs font-bold px-3 py-1.5 rounded-full">
              {t("about.badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              {t("about.title")}
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
              {t("about.desc")}
            </p>
          </div>

          {/* How It Works */}
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
              {t("about.howItWorksLabel")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {steps.map((item, index) => {
                const Icon = stepIcons[index];
                return (
                  <div
                    key={index}
                    className="bg-zinc-900 rounded-3xl p-5 flex flex-col gap-4 border border-white/5 hover:border-[#AAFF00]/30 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#AAFF00]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#AAFF00]" />
                      </div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Who Is This For */}
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
              {t("about.whoForLabel")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {audiences.map((uc, index) => {
                const Icon = audienceIcons[index];
                return (
                  <div
                    key={index}
                    className="bg-zinc-900 rounded-3xl p-8 border border-white/5 hover:border-[#AAFF00]/30 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#AAFF00]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#AAFF00]" />
                      </div>
                      <h3 className="text-white font-extrabold text-base">{uc.name}</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                          {t("about.challengeLabel")}
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed">{uc.problem}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#AAFF00] uppercase tracking-wider mb-1">
                          {t("about.howHelpsLabel")}
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed">{uc.solution}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────── */}
      <section id="fitur" className="bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              {t("features.title1")}{" "}
              <span className="bg-[#AAFF00] text-black px-2 rounded-lg">
                {t("features.title2")}
              </span>
            </h2>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              {t("features.desc")}
            </p>
          </div>

          <div className="border-t border-white/10">
            {features.map((feat, index) => (
              <div
                key={index}
                className="flex items-center gap-6 py-5 border-b border-white/10 px-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-[#AAFF00] font-mono text-sm w-8 shrink-0">
                  {featureNos[index]}
                </span>
                <span className="w-8 shrink-0 flex items-center">{featureIcons[index]}</span>
                <span className="text-white font-bold text-lg flex-1">{feat.name}</span>
                <span className="text-gray-400 text-sm hidden md:block flex-1">{feat.desc}</span>
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
              {marqueeItems.map((text) => (
                <span key={text} className="flex items-center gap-4 mr-8">
                  <span className="text-white/40 font-medium text-sm tracking-widest uppercase">
                    {text}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#AAFF00]" />
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
            {t("testimonials.title1")}{" "}
            <span className="text-[#AAFF00]">{t("testimonials.title2")}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {testimonials.map((item) => (
              <div key={item.name} className="bg-zinc-900 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-white">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex gap-0.5 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[#AAFF00] text-xs">★</span>
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
            {t("cta.title1")}
            <br />
            <span className="text-[#AAFF00]">{t("cta.title2")}</span>
          </h2>
          <p className="text-gray-400 mt-5 text-base">{t("cta.desc")}</p>

          <div className="flex gap-3 mt-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("cta.emailPlaceholder")}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#AAFF00] transition-colors text-sm"
            />
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[#AAFF00] text-black font-bold text-sm px-5 py-3 hover:bg-[#99ee00] transition-colors shrink-0">
              {t("cta.signUp")}
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-3">{t("cta.freeNote")}</p>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer id="contacts" className="bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xl font-bold text-white">
                Pretest
                <span className="text-[#AAFF00] bg-[#1a1a1a] px-1 rounded ml-0.5">AI</span>
              </span>
              <p className="text-gray-500 text-sm mt-1">{t("footer.tagline")}</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="#fitur" className="hover:text-white transition-colors">
                {t("footer.features")}
              </a>
              <a href="#cara-kerja" className="hover:text-white transition-colors">
                {t("footer.howItWorks")}
              </a>
              <Link href="/login" className="hover:text-white transition-colors">
                {t("footer.login")}
              </Link>
              <Link href="/register" className="hover:text-white transition-colors">
                {t("footer.signUp")}
              </Link>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-6 text-center">
            <p className="text-gray-600 text-xs">{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
