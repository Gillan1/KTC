import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from "@/hooks/use-language";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "شركة الخندقاوي التجارية المحدودة | KTC",
  description: "شركة الخندقاوي التجارية المحدودة - KTC. رائدة في توريد معدات الطاقة الشمسية والبابورات الزراعية والمولدات الكهربائية في السودان. 18 فرع في جميع ولايات السودان.",
  keywords: ["KTC", "الخندقاوي", "طاقة شمسية", "بابورات زراعية", "مولدات كهربائية", "السودان", "خلايا شمسية", "inverter"],
  authors: [{ name: "KTC - Elkhandagawi Trading Co. Ltd" }],
  icons: {
    icon: "/images/ktc/logo.jpg",
  },
  openGraph: {
    title: "شركة الخندقاوي التجارية المحدودة | KTC",
    description: "معدات الطاقة الشمسية والبابورات الزراعية في السودان",
    siteName: "KTC",
    type: "website",
    locale: "ar_SD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster />
        <SonnerToaster position="top-center" dir="rtl" />
      </body>
    </html>
  );
}
