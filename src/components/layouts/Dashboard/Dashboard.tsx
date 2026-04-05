"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Sidebar } from "../Sidebar/Sidebar";
import { Navbar } from "../Navbar/Navbar";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

import { useSidebarStore } from "@/stores/sidebarStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Route Protection: Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Layout Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-16" : "lg:pl-60",
        )}>
        {/* Navbar */}
        <Navbar
          onMenuClick={() => setIsMobileMenuOpen((prev) => !prev)}
          onLogoutSuccess={() => setIsMobileMenuOpen(false)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Mobile Menu Drawer */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 pt-24 px-4 pb-12 lg:px-8">
          <div className="mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
