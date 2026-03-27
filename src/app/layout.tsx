import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "ГПТ Портал — топ-нейросети в одном месте",
  description: "AI-агрегатор: ChatGPT, Gemini, Grok, Kling, Nano Banana и 20+ моделей. Без VPN, оплата в рублях.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`} data-theme="dark" suppressHydrationWarning>
      <body className="min-h-full flex font-[var(--font-inter)]">
        <ThemeProvider>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
