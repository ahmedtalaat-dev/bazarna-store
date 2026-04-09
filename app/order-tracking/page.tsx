// Imports
import OrderTrackingPageContent from '@/components/pages/OrderTrackingPageContent';
import type { Metadata } from 'next';

// Metadata
export const metadata: Metadata = {
  title: "Order Tracking | Bazarna",
  description: "Easily track your orders on Bazarna store in real-time.",
  keywords: ["Bazarna", "order tracking", "track order", "online shopping"],
  authors: [{ name: "Ahmed Talaat" }],
  openGraph: {
    title: "Order Tracking | Bazarna",
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
    title: "Order Tracking | Bazarna",
    description: "Track your orders easily on Bazarna store.",
    images: ["/og/order-tracking.png"],
  },
};

// Order Tracking Page
export default function OrderTrackingPage() {
  return (
    <OrderTrackingPageContent />
  );
}