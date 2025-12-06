import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

// English Font (Inter is clean and professional)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Bengali Font (Hind Siliguri is excellent for readability)
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vistara - Local Guide Platform",
  description: "Experience the world like a local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        </ThemeProvider>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}