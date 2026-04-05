"use client";

import * as React from "react";
import {
  FileUp,
  Sparkles,
  PenLine,
  ClipboardCheck,
  BarChart3,
  CreditCard,
  GraduationCap,
  BookOpen,
  Bot,
  CheckCircle2,
  ArrowRight,
  Layers,
  Cpu,
} from "lucide-react";
import { Card } from "@/components/shared/Card";

const PRICING = [
  {
    name: "Starter",
    price: "Rp 10.000",
    quota: 4,
    description: "Ideal for students exploring a new subject or module.",
    features: [
      "4x AI Quiz Generation",
      "4x AI Summarization",
      "Interactive quiz session",
      "Progress tracking",
      "Edit generated content",
    ],
    highlight: false,
  },
  {
    name: "Standard",
    price: "Rp 20.000",
    quota: 10,
    description: "Best for teachers or power users with multiple materials.",
    features: [
      "10x AI Quiz Generation",
      "10x AI Summarization",
      "Interactive quiz session",
      "Progress tracking",
      "Edit generated content",
    ],
    highlight: true,
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: FileUp,
    title: "Upload PDF Module",
    description:
      "Upload your learning material in PDF format. Supports textbooks, lecture slides, curriculum documents, and more.",
  },
  {
    step: 2,
    icon: Sparkles,
    title: "AI Generates Summary & Quiz",
    description:
      "Our AI reads and understands your document, then automatically produces a concise summary and a set of quiz questions.",
  },
  {
    step: 3,
    icon: PenLine,
    title: "Review & Edit Content",
    description:
      "Not happy with a question or summary? You can freely edit any generated content before starting your session.",
  },
  {
    step: 4,
    icon: ClipboardCheck,
    title: "Take the Interactive Quiz",
    description:
      "Answer questions in an interactive session with immediate feedback after each response.",
  },
  {
    step: 5,
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Review your quiz history, scores, and improvement over time from your personal dashboard.",
  },
];

const AI_MODELS = [
  { name: "GPT-4o", provider: "OpenAI" },
  { name: "Gemini 1.5", provider: "Google" },
  { name: "Grok", provider: "xAI" },
  { name: "Claude", provider: "Anthropic" },
];

const USE_CASES = [
  {
    icon: GraduationCap,
    audience: "Students & Learners",
    problem:
      "Curriculum changes frequently, leaving students with new modules and limited practice questions to prepare from.",
    solution:
      "Upload any PDF module and instantly get a tailored quiz to self-test and reinforce new material — no matter how recent.",
  },
  {
    icon: BookOpen,
    audience: "Teachers & Educators",
    problem:
      "Creating quality quiz questions for every learning unit is time-consuming and repetitive.",
    solution:
      "Generate a full set of questions from a module in seconds, then edit them to fit your class needs before distributing.",
  },
];

export default function InfoPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-20 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Hero */}
      <section className="text-center pt-10 space-y-5">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold">
          <Cpu size={14} />
          AI-Powered Learning
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Turn Any PDF Into a{" "}
          <span className="text-primary">Complete Study Set</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Pretest AI reads your learning material and instantly generates a
          summary and quiz. Study smarter, track your progress, and never run
          out of practice questions.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="https://lynk.id/ariskaadi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
            <CreditCard size={16} />
            Get Quota Now
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-800 font-bold px-6 py-3 rounded-2xl hover:border-primary hover:text-primary transition-all duration-200">
            Go to Dashboard
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* AI Models */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-sm font-semibold">
            <Bot size={14} />
            Powered by Multiple AI Models
          </div>
          <p className="text-gray-500 text-sm">
            We use the best available models so your summaries and quizzes are
            always accurate and insightful.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AI_MODELS.map((model) => (
            <div
              key={model.name}
              className="flex flex-col items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-2xl py-5 px-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200">
              <Layers size={20} className="text-primary" />
              <span className="text-sm font-bold text-gray-800">
                {model.name}
              </span>
              <span className="text-xs text-gray-400">{model.provider}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-sm font-semibold">
            <ClipboardCheck size={14} />
            How It Works
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            From PDF to Quiz in Minutes
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            A simple five-step workflow designed for both learners and educators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                hoverable
                className="p-6 flex flex-col gap-4 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Step {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Who Is This For */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-sm font-semibold">
            <GraduationCap size={14} />
            Who Is This For
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Built for Learners and Educators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.audience}
                className="relative overflow-hidden bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    {uc.audience}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      The Challenge
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {uc.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      How Pretest AI Helps
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {uc.solution}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-sm font-semibold">
            <CreditCard size={14} />
            Pricing
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Simple, Token-Based Pricing
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Pay only for what you use. Each quota covers one AI quiz generation
            and one summarization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border transition-shadow duration-200 ${
                plan.highlight
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/25"
                  : "bg-white text-gray-900 border-gray-200 shadow-sm hover:shadow-md"
              }`}>
              {plan.highlight && (
                <div className="absolute top-5 right-5">
                  <span className="bg-warning text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <p
                  className={`text-sm font-bold uppercase tracking-widest mb-1 ${plan.highlight ? "text-white/70" : "text-gray-400"}`}>
                  {plan.name}
                </p>
                <p
                  className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.price}
                </p>
                <p
                  className={`text-sm mt-2 leading-relaxed ${plan.highlight ? "text-white/80" : "text-gray-500"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={16}
                      className={
                        plan.highlight ? "text-white/80" : "text-primary"
                      }
                    />
                    <span
                      className={`text-sm font-medium ${plan.highlight ? "text-white/90" : "text-gray-700"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="https://lynk.id/ariskaadi"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                  plan.highlight
                    ? "bg-white text-primary hover:bg-gray-50 shadow-md"
                    : "bg-primary text-white hover:bg-primary/90 shadow-md"
                }`}>
                <CreditCard size={16} />
                Buy {plan.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary rounded-3xl p-10 text-center shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none p-8 translate-x-12 -translate-y-8">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="36" />
            <path d="M30 30L170 170" stroke="white" strokeWidth="18" />
          </svg>
        </div>
        <div className="relative z-10 space-y-5">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to study smarter?
          </h2>
          <p className="text-white/80 text-base max-w-md mx-auto">
            Get your quota and start generating quizzes from your own learning
            materials in under a minute.
          </p>
          <a
            href="https://lynk.id/ariskaadi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-warning text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200">
            <CreditCard size={18} />
            Get Quota Now
          </a>
        </div>
      </section>
    </div>
  );
}
