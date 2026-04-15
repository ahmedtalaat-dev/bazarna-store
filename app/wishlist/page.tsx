// Imports
import WishlistPageContent from "@/components/pages/WishlistPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "My Wishlist | Bazarna",
  description: "Manage your favorite tech products on Bazarna.",

  keywords: [
    "Bazarna",
    "terms and conditions",
    "user agreement",
    "policies",
    "online store rules",
  ],

  authors: [{ name: "Ahmed Talaat" }],

  openGraph: {
    title: "My Wishlist | Bazarna",
    description: "Manage your favorite tech products on Bazarna.",
    url: "https://bazarna-store.vercel.app/terms",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/image.png",
        width: 1200,
        height: 630,
        alt: "Bazarna Terms & Conditions",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "My Wishlist | Bazarna",
    description: "Manage your favorite tech products on Bazarna.",
    images: ["/og/image.png"],
  },
};

// Wishlist Page
export default function WishlistPage() {
  return (
    <main>
      <WishlistPageContent />
    </main>
  );
}
