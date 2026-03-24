import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared";
import { ReactQueryProvider } from "@/lib/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pretest AI",
  description: "AI-powered study platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
        <ReactQueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
