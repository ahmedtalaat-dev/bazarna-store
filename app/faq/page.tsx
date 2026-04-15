// Imports
import FAQPageContent from "@/components/pages/FaqPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "FAQ | Bazarna",
  description:
    "Find answers to frequently asked questions about Bazarna, our products, shipping, returns, and services.",

  keywords: [
    "Bazarna",
    "FAQ",
    "frequently asked questions",
    "tech store help",
    "support",
    "online shopping FAQ",
  ],

  authors: [{ name: "Ahmed Talaat" }],

  openGraph: {
    title: "Bazarna FAQ",
    description:
      "Get answers to common questions about Bazarna products, shipping, and services.",
    url: "https://bazarna-store.vercel.app/faq",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/image.png",
        width: 1200,
        height: 630,
        alt: "Bazarna FAQ",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bazarna FAQ",
    description:
      "Check frequently asked questions about Bazarna's products and services.",
    images: ["/og/image.png"],
  },
};

// FAQ Page
export default function FAQPage() {
  return (
    <main>
      <FAQPageContent />
    </main>
  );
}
