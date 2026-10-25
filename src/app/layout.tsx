import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SettingsProvider } from "@/lib/settings";

export const metadata: Metadata = {
  title: "کمیته امداد امام خمینی (ره) | پورتال بازطراحی‌شده",
  description:
    "نسخه بازطراحی‌شده و مدرن پورتال کمیته امداد امام خمینی (ره) - خدمات الکترونیک، اخبار، مشارکت‌های مردمی، چندرسانه‌ای و پنل دسترسی‌پذیری کامل",
  keywords: [
    "کمیته امداد",
    "امداد امام خمینی",
    "خیریه",
    "طرح اکرام",
    "صدقه",
    "جهیزیه",
    "کمک معیشت",
    "پورتال امداد",
  ],
  authors: [{ name: "بازطراحی پورتال امداد" }],
  openGraph: {
    title: "پورتال کمیته امداد امام خمینی (ره) - نسخه مدرن",
    description: "بازطراحی کامل و مدرن پورتال کمیته امداد با دسترسی‌پذیری، تم‌های رنگی و امکانات پیشرفته",
    siteName: "پورتال امداد",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning data-theme="emerald" data-font="vazirmatn">
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <SettingsProvider>{children}</SettingsProvider>
        <Toaster />
        <Sonner position="bottom-left" dir="rtl" richColors closeButton />
      </body>
    </html>
  );
}
