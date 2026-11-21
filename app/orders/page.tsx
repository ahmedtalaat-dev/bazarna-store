import { Suspense } from "react";
import OrdersPageContent from "@/components/pages/OrdersPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "My Orders | Bazarna",
  description: "Easily track your orders on Bazarna store in real-time.",
  keywords: ["Bazarna", "order tracking", "track order", "online shopping"],
  authors: [{ name: "Ahmed Talaat" }],
  openGraph: {
    title: "My Orders | Bazarna",
    description: "Check the status of your orders quickly and securely.",
    url: "https://bazarna-store.vercel.app/order-tracking",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/order-tracking.png",
        width: 1200,
        height: 630,
        alt: "Order Tracking Bazarna",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Orders | Bazarna",
    description: "Track your orders easily on Bazarna store.",
    images: ["/og/order-tracking.png"],
  },
};

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <OrdersPageContent />
    </Suspense>
  );
}
