// Imports
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastDisplay } from "@/components/ui/toast-display";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/contexts/ToastContext";
import { EcommerceProvider } from "@/contexts/EcommerceContext";

// Google Fonts
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Metadata
export const metadata: Metadata = {
  title: "Bazarna | Shop Online",
  description:
    "Browse and shop the latest tech products at Bazarna. Find best sellers, filter by category, price, and rating, and enjoy a seamless online shopping experience.",

  keywords: [
    "tech products",
    "electronics",
    "online store",
    "Bazarna",
    "best sellers",
    "shop online",
  ],

  authors: [{ name: "Ahmed Talaat" }],

  openGraph: {
    title: "Bazarna | Shop Tech Products Online",
    description:
      "Browse and shop the latest tech products at Bazarna. Find best sellers, filter by category, price, and rating, and enjoy a seamless online shopping experience.",
    url: "https://bazarna-store.vercel.app/shop",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/image.png",
        width: 1200,
        height: 630,
        alt: "Bazarna Shop - Tech Products",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bazarna | Shop Tech Products Online",
    description:
      "Browse and shop the latest tech products at Bazarna. Find best sellers, filter by category, price, and rating, and enjoy a seamless online shopping experience.",
    images: ["/og/image.png"],
  },

  icons: {
    icon: [
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ToastProvider>
          <EcommerceProvider>
            <Header />
            {children}
            <Footer />
            <ToastDisplay />
          </EcommerceProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
