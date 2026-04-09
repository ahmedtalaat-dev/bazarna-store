// Imports
import CheckoutPageContent from "@/components/pages/CheckoutPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Checkout | Bazarna",
  description: "Manage your orders, and checkout.",
};

// Main Page
export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
