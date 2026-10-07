import type { Metadata } from "next";
import { Inter, DM_Mono, Kalam } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "HYPE PORTAL — Intelligence Matrix | Enterprise Analytics & Trends",
  description:
    "Transform data into decisions with HYPE PORTAL — a powerful intelligence matrix designed for smarter, faster and more informed decisions.",
};

import { ThemeAndLangProvider } from "@/lib/themeContext";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${kalam.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeAndLangProvider>
          <CustomCursor />
          {children}
        </ThemeAndLangProvider>
      </body>
    </html>
  );
}
