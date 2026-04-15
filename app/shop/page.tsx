// Imports
import ShopPageContent from "@/components/pages/ShopPageContent";
import type { Metadata } from "next";
import { Suspense } from "react";

// Metadata
export const metadata: Metadata = {
  title: "Shop Online | Bazarna",
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
};

// Shop Page
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
