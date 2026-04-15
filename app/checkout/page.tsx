// Imports
import CheckoutPageContent from "@/components/pages/CheckoutPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Checkout | Bazarna",
  description:
    "Securely complete your purchase and finalize your order on Bazarna.",

  robots: {
    index: false,
    follow: false,
  },
};

// Checkout Page
export default function CheckoutPage() {
  return (
    <main>
      <CheckoutPageContent />
    </main>
  );
}
