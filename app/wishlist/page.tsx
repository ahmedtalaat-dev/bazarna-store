// Imports
import WishlistPageContent from "@/components/pages/WishlistPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "My Wishlist | Bazarna",
  description: "Manage your Wishlist.",
};

// Wishlist Page
export default function WishlistPage() {
  return (
    <WishlistPageContent />
  )
}
