"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebarStore";
import { navItems } from "@/constants/navItems";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 flex flex-col z-30 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-60",
        className,
      )}>
      {/* Logo + Toggle */}
      <div className="px-3 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                Pretest AI
              </span>
            </>
          )}
        </div>
        <button
          onClick={toggle}
          className="p-1.5 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors duration-150 cursor-pointer",
                isCollapsed && "justify-center px-0",
                isActive
                  ? "bg-primary text-white font-black hover:bg-primary-hover"
                  : "text-black font-bold hover:bg-blue-50 hover:text-gray-900",
              )}>
              <div className={cn(isCollapsed && "scale-110 transition-transform")}>
                {item.icon}
              </div>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-gray-100 mt-auto">
        {!isCollapsed && (
          <p className="text-xs text-center text-gray-400">
            © 2026 Pretest AI v0.1.0
          </p>
        )}
      </div>
    </aside>
  );
}
