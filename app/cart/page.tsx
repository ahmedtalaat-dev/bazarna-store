// Imports
import CartPageContent from "@/components/pages/CartPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "My Cart | Bazarna",
  description: "Manage your Cart.",
};

// Cart Page
export default function CartPage() {
  return <CartPageContent />;
}
