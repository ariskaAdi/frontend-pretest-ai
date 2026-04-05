import {
  Home,
  BookOpen,
  ClipboardList,
  User,
  Info,
  Star,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
  { label: "Modul", href: "/modules", icon: <BookOpen size={20} /> },
  { label: "Quiz", href: "/quiz", icon: <ClipboardList size={20} /> },
  { label: "Profile", href: "/profile", icon: <User size={20} /> },
  { label: "Info", href: "/info", icon: <Info size={20} /> },
  { label: "Review", href: "/review", icon: <Star size={20} /> },
];
