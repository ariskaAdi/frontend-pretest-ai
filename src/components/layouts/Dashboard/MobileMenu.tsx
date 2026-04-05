"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants/navItems";

const DURATION = 300; // ms — must match the CSS transition durations below

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  // Keep mounted during the exit animation
  const [mounted, setMounted] = React.useState(isOpen);
  // Drive CSS classes: true = fully visible, false = animating out
  const [visible, setVisible] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Let the browser paint the hidden state first, then trigger enter
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      const id = setTimeout(() => setMounted(false), DURATION);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity",
          `duration-[${DURATION}ms]`,
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${DURATION}ms` }}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col border-r border-gray-100",
          "transition-transform ease-in-out",
          visible ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ transitionDuration: `${DURATION}ms` }}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="text-lg font-bold text-gray-900">Pretest AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all active:scale-95">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary",
                )}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Need Help?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Contact our team if you encounter any issues while learning.
            </p>
            <Link
              href="/info"
              className="text-xs font-bold text-primary hover:underline">
              Learn More →
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
