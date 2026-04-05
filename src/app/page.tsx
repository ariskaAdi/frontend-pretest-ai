import Image from "next/image";
import Link from "next/link";
import { Bot, FileText, ClipboardList, BarChart3, Sparkles, ArrowUpRight, FileUp, PenLine, ClipboardCheck, GraduationCap, BookOpen } from "lucide-react";
import { LandingNavbar } from "@/components/layouts/LandingNavbar";
import picture from "../../public/pretest-ai.webp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <LandingNavbar />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-14 pb-12">
        {/* Top row: headline + CTA button */}
        <div className="flex items-start justify-between gap-8 mb-5">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none tracking-tighter uppercase">
            Smarter Prep,
            <br />
            Better Results.
          </h1>
          <div className="md:flex-col items-end gap-3 shrink-0 pt-3 hidden md:flex">
            <p className="text-gray-400 text-sm text-right max-w-40 leading-snug">
              AI-Powered Exam Preparation Platform
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#0D0D0D] text-white text-sm font-semibold px-6 py-3 hover:bg-[#222] transition-colors">
              Learn More
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
                NEW
              </span>
              <p className="text-white font-bold text-lg leading-snug">
                Leaders in AI-powered learning
              </p>
              <p className="text-white/60 text-sm mt-1">
                Upload PDFs, get instant summaries, and generate personalized quizzes.
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
          {/* Stat 1 */}
          <div className="bg-white rounded-3xl px-7 py-6 flex items-center justify-between border border-gray-100">
            <div>
              <p className="text-4xl font-black text-gray-900">10K+</p>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1.5">
                Active Students
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-3xl px-7 py-6 flex items-center justify-between border border-gray-100">
            <div>
              <p className="text-4xl font-black text-gray-900">50K+</p>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-1.5">
                Quizzes Generated
              </p>
            </div>
            <span className="inline-flex items-center border border-gray-300 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full">
              AI POWERED
            </span>
          </div>

          {/* Stat 3 — dark card */}
          <div className="bg-[#0D0D0D] rounded-3xl px-7 py-6">
            <p className="text-4xl font-black text-white">95%</p>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-1.5">
              Student Pass Rate
            </p>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4">
          {[
            { value: "10,000+", label: "Active Students" },
            { value: "5,000+", label: "Modules Uploaded" },
            { value: "50,000+", label: "Quizzes Completed" },
            { value: "95%", label: "Pass Rate" },
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
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-20">

          {/* Headline */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center border border-[#AAFF00] text-[#AAFF00] text-xs font-bold px-3 py-1.5 rounded-full">
              AI LEARNING PLATFORM
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Transform the Way You Learn
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
              Upload any PDF module and let AI do the heavy lifting — instant
              summaries, relevant quizzes, and progress tracking, all in one
              place.
            </p>
          </div>

          {/* How It Works */}
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
              How It Works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  step: 1,
                  icon: FileUp,
                  title: "Upload PDF Module",
                  desc: "Upload your textbook, lecture slides, or any curriculum document.",
                },
                {
                  step: 2,
                  icon: Bot,
                  title: "AI Generates Content",
                  desc: "AI reads the document and produces a concise summary and quiz questions.",
                },
                {
                  step: 3,
                  icon: PenLine,
                  title: "Review & Edit",
                  desc: "Freely edit any generated content before starting your session.",
                },
                {
                  step: 4,
                  icon: ClipboardCheck,
                  title: "Take the Quiz",
                  desc: "Answer questions interactively with instant feedback.",
                },
                {
                  step: 5,
                  icon: BarChart3,
                  title: "Track Progress",
                  desc: "Review scores and improvement over time from your dashboard.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="bg-zinc-900 rounded-3xl p-5 flex flex-col gap-4 border border-white/5 hover:border-[#AAFF00]/30 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#AAFF00]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#AAFF00]" />
                      </div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        {String(item.step).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm mb-1">
                        {item.title}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Who Is This For */}
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 text-center">
              Who Is This For
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  icon: GraduationCap,
                  audience: "Students & Learners",
                  problem:
                    "Curriculum changes frequently, leaving students with new modules and a limited bank of practice questions to prepare from.",
                  solution:
                    "Upload any PDF module and instantly get a tailored quiz to self-test and reinforce new material — no matter how recent the curriculum.",
                },
                {
                  icon: BookOpen,
                  audience: "Teachers & Educators",
                  problem:
                    "Creating quality quiz questions for every learning unit is time-consuming and repetitive for busy educators.",
                  solution:
                    "Generate a full set of questions from a module in seconds, then edit them to fit your class needs before distributing to students.",
                },
              ].map((uc) => {
                const Icon = uc.icon;
                return (
                  <div
                    key={uc.audience}
                    className="bg-zinc-900 rounded-3xl p-8 border border-white/5 hover:border-[#AAFF00]/30 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#AAFF00]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#AAFF00]" />
                      </div>
                      <h3 className="text-white font-extrabold text-base">
                        {uc.audience}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                          The Challenge
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {uc.problem}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#AAFF00] uppercase tracking-wider mb-1">
                          How Pretest AI Helps
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {uc.solution}
                        </p>
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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Core{" "}
              <span className="bg-[#AAFF00] text-black px-2 rounded-lg">
                Features
              </span>
            </h2>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              Everything you need to learn smarter is right here.
            </p>
          </div>

          {/* Feature list */}
          <div className="border-t border-white/10">
            {[
              {
                no: "01",
                name: "Upload PDF Modules",
                desc: "Drag & drop PDFs up to 20MB, processed instantly by AI",
                icon: <FileText className="w-6 h-6 text-white" />,
              },
              {
                no: "02",
                name: "Automated AI Summaries",
                desc: "Contextual summaries generated in seconds",
                icon: <Bot className="w-6 h-6 text-white" />,
              },
              {
                no: "03",
                name: "Smart Quiz Generation",
                desc: "Personalized multiple-choice quizzes based on your modules",
                icon: <ClipboardList className="w-6 h-6 text-white" />,
              },
              {
                no: "04",
                name: "Track Your Progress",
                desc: "Quiz history, scores, and your learning statistics",
                icon: <BarChart3 className="w-6 h-6 text-white" />,
              },
            ].map((feat) => (
              <div
                key={feat.no}
                className="flex items-center gap-6 py-5 border-b border-white/10 px-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-[#AAFF00] font-mono text-sm w-8 shrink-0">
                  {feat.no}
                </span>
                <span className="w-8 shrink-0 flex items-center">{feat.icon}</span>
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
                "AI Summary",
                "Generate Quiz",
                "Score Analysis",
                "Efficient Learning",
                "Progress Tracking",
              ].map((text) => (
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
            What Our <span className="text-[#AAFF00]">Users Say</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {[
              {
                name: "Rina Amalia",
                role: "Medical Student",
                quote:
                  "The AI summaries are incredibly accurate. 50 pages of material become key points in 2 minutes.",
              },
              {
                name: "Budi Santoso",
                role: "High School Student",
                quote:
                  "The quizzes are truly based on the module's content. My exam scores soared after using Pretest AI.",
              },
              {
                name: "Siti Rahayu",
                role: "Law Student",
                quote:
                  "Upload once, generate quizzes multiple times. A massive time-saver for exam prep.",
              },
              {
                name: "Dimas Pratama",
                role: "High School Teacher",
                quote:
                  "I introduced this to my students. They are much more active in independent learning thanks to the quiz feature.",
              },
              {
                name: "Ayu Lestari",
                role: "Civil Service Exam Candidate",
                quote:
                  "Super helpful for studying TWK and TIU materials. The summaries hit exactly what's needed.",
              },
              {
                name: "Fahri Ramadhan",
                role: "Engineering Student",
                quote:
                  "A feature to generate 20-question quizzes directly from lecture PDFs? Truly a game changer.",
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
            Ready to Start Learning
            <br />
            <span className="text-[#AAFF00]">Smarter?</span>
          </h2>
          <p className="text-gray-400 mt-5 text-base">
            Join thousands of students who have already improved their grades
            with Pretest AI.
          </p>

          <div className="flex gap-3 mt-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#AAFF00] transition-colors text-sm"
            />
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[#AAFF00] text-black font-bold text-sm px-5 py-3 hover:bg-[#99ee00] transition-colors shrink-0">
              Sign Up Now
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Free. No credit card required.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer id="contacts" className="bg-[#080808] border-t border-white/5">
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
                AI-powered learning platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="#fitur" className="hover:text-white transition-colors">
                Features
              </a>
              <a
                href="#cara-kerja"
                className="hover:text-white transition-colors">
                How It Works
              </a>
              <Link
                href="/login"
                className="hover:text-white transition-colors">
                Log In
              </Link>
              <Link
                href="/register"
                className="hover:text-white transition-colors">
                Sign Up
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
