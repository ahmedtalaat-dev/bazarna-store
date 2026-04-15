// Imports
import CartPageContent from "@/components/pages/CartPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "My Cart | Bazarna",
  description: "Review and manage items in your shopping cart before checkout.",

  robots: {
    index: false,
    follow: false,
  },
};

// Cart Page
export default function CartPage() {
  return (
    <main>
      <CartPageContent />
    </main>
  );
}
