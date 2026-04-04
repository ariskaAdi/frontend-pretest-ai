"use client";

import * as React from "react";
import {
  Sparkles,
  Shield,
  Clipboard,
  FileText,
  CreditCard,
} from "lucide-react";
import { useGetMeQuery } from "@/queries/useUserQuery";
import { cn } from "@/lib/utils";

export function WelcomeBanner() {
  const { data: user } = useGetMeQuery();
  const [greeting, setGreeting] = React.useState("Selamat siang");

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat pagi");
    else if (hour < 15) setGreeting("Selamat siang");
    else if (hour < 19) setGreeting("Selamat sore");
    else setGreeting("Selamat malam");
  }, []);

  if (!user) return null;

  return (
    <div className="relative overflow-hidden bg-primary rounded-3xl p-8 mb-8 shadow-lg shadow-primary/20 group">
      {/* Pattern decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-12 -translate-y-8 group-hover:translate-x-8 group-hover:-translate-y-4 transition-transform duration-700 pointer-events-none">
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="120" r="100" stroke="white" strokeWidth="40" />
          <path d="M40 40L200 200" stroke="white" strokeWidth="20" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-3">
            {greeting}, {user.name}!
            <Sparkles
              className="text-warning animate-bounce-slow shrink-0"
              size={28}
            />
          </h2>
          <p className="text-primary-light/90 text-lg font-medium leading-relaxed">
            Senang melihatmu kembali. Mari lanjutkan perjalanan belajarmu hari
            ini dan taklukkan tantangan baru!
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 group/item hover:bg-white/20 transition-colors">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-semibold text-white">
                Status: Aktif
              </span>
            </div>
            {user.role === "admin" ? (
              <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 group/item hover:bg-white/20 transition-colors">
                <Shield size={14} className="text-white" />
                <span className="text-sm font-semibold text-white">
                  Admin — Unlimited Access
                </span>
              </div>
            ) : (
              <>
                {/* Badge: Sisa Quiz Quota */}
                <div
                  className={cn(
                    "backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border transition-colors",
                    user.quiz_quota === 0
                      ? "bg-red-500/30 border-red-400/40"
                      : "bg-white/10 border-white/10 hover:bg-white/20",
                  )}>
                  <Clipboard size={14} className="text-white" />
                  <span className="text-sm font-semibold text-white">
                    Quiz: {user.quiz_quota} tersisa
                  </span>
                </div>

                {/* Badge: Sisa Summarize Quota */}
                <div
                  className={cn(
                    "backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 border transition-colors",
                    user.summarize_quota === 0
                      ? "bg-red-500/30 border-red-400/40"
                      : "bg-white/10 border-white/10 hover:bg-white/20",
                  )}>
                  <FileText size={14} className="text-white" />
                  <span className="text-sm font-semibold text-white">
                    Ringkas: {user.summarize_quota} tersisa
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0">
          {user.role !== "admin" &&
            (user.quiz_quota === 0 || user.summarize_quota === 0) && (
              <a
                href="https://lynk.id/ariskaadi"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-warning text-white font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
                <CreditCard size={18} />
                Beli Quota
              </a>
            )}
          <button className="bg-white text-primary border-2 border-white  font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
            Mulai Belajar
          </button>
        </div>
      </div>
    </div>
  );
}
