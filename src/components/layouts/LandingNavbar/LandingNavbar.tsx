"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "../../../../public/logo.webp";
import { Button } from "@/components/shared";

type SectionId = "hero" | "fitur" | "tentang" | "cara-kerja" | "contacts";

const NAV_SECTIONS: { key: string; href: string; sectionId: SectionId }[] = [
  { key: "home", href: "#hero", sectionId: "hero" },
  { key: "features", href: "#fitur", sectionId: "fitur" },
  { key: "about", href: "#tentang", sectionId: "tentang" },
  { key: "howItWorks", href: "#cara-kerja", sectionId: "cara-kerja" },
  { key: "contact", href: "#contacts", sectionId: "contacts" },
];

export function LandingNavbar() {
  const t = useTranslations("LandingNavbar");
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_SECTIONS.forEach(({ sectionId }) => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(sectionId);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex gap-2 items-center">
          <Image
            src={logo}
            alt="PretestAI"
            width={140}
            height={90}
            className=" hidden sm:inline-block"
          />
          
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          {NAV_SECTIONS.map(({ key, href, sectionId }) => (
            <a
              key={sectionId}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className={cn(
                "transition-colors hover:text-gray-900",
                activeSection === sectionId
                  ? "text-gray-900 border-b-2 border-gray-900 pb-0.5"
                  : "",
              )}>
              {t(key as Parameters<typeof t>[0])}
            </a>
          ))}
        </nav>

        {/* CTAs + Language Switcher */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t("login")}
            </Button>
          </Link>
          <Link
            href="/register"
            className="items-center justify-center rounded-full bg-[#0D0D0D] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#222] transition-colors hidden md:inline-flex">
            {t("startFree")}
          </Link>
        </div>
      </div>
    </header>
  );
}
