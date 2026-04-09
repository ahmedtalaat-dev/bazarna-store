// Imports
import { Hero } from "@/components/sections/Hero";
import { BestSellers } from "@/components/product/BestSellers";
import { ShopByCategory } from "@/components/product/ShopByCategory";
import { ChooseUs } from "@/components/sections/ChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Bazarna | Premium Tech Store",
  description:
    "Shop the latest tech products with Bazarna. Explore best sellers, shop by category, and discover why our customers love us.",

  keywords: [
    "electronics",
    "tech store",
    "best sellers",
    "online shopping",
    "Bazarna",
  ],

  authors: [{ name: "Ahmed Talaat" }],

  openGraph: {
    title: "Bazarna | Premium Tech Store",
    description:
      "Shop the latest tech products with Bazarna. Explore best sellers, shop by category, and discover why our customers love us.",
    url: "https://bazarna-store.vercel.app/",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/about.png",
        width: 1200,
        height: 630,
        alt: "About Bazarna",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bazarna | Premium Tech Store",
    description:
      "Shop the latest tech products with Bazarna. Explore best sellers, shop by category, and discover why our customers love us.",
    images: ["/og/about.png"],
  },
};

// Home Page
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <BestSellers />
      <ShopByCategory />
      <ChooseUs />
      <Testimonials />
      <CTASection />
    </main>
  );
}
