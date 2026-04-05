import * as React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4 sm:p-8">
      <div className="flex w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl shadow-white">
        {/* Left — Branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-[42%] bg-[#0d0d0d] relative overflow-hidden flex-col justify-start p-8 min-h-130">
          {/* Flame pillars */}
          <div className="absolute bottom-0 left-0 right-0 h-[58%] flex items-end justify-center gap-3 px-6">
            <div className="w-10 h-[55%] rounded-t-full bg-linear-to-t from-indigo-500 via-indigo-400/70 to-transparent blur-[2px] opacity-90" />
            <div className="w-14 h-[85%] rounded-t-full bg-linear-to-t from-indigo-400 via-indigo-300/60 to-transparent blur-[2px] opacity-80" />
            <div className="w-10 h-[65%] rounded-t-full bg-linear-to-t from-indigo-500 via-indigo-400/70 to-transparent blur-[2px] opacity-90" />
          </div>
          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-indigo-600/40 to-transparent" />

          {/* Text */}
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white leading-snug">
              Turn PDFs into
              <br />
              engaging quiz
              <br />
              questions
            </h1>
          </div>
        </div>

        {/* Right — Form area */}
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="mb-5">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 2L20.5 13.5L31 8L23.5 17L35 18L23.5 19L31 28L20.5 22.5L18 34L15.5 22.5L5 28L12.5 19L1 18L12.5 17L5 8L15.5 13.5L18 2Z"
                  fill="#F97316"
                />
              </svg>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            </div>

            {/* Mobile logo fallback */}
            <div className="lg:hidden text-center mb-6">
              <span className="text-xl font-bold text-orange-500">
                PreTest AI
              </span>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
