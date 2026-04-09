// Imports
import ContactPageContent from "@/components/pages/ContactPageContent";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Contact Us | Bazarna",
  description:
    "Get in touch with Bazarna. Reach out for support, inquiries, or feedback about our products and services.",

  keywords: [
    "Bazarna",
    "contact bazarna",
    "tech store contact",
    "customer support",
    "online shopping support",
  ],

  authors: [{ name: "Ahmed Talaat" }],

  openGraph: {
    title: "Contact Us Bazarna",
    description:
      "Contact Bazarna for support, questions, or feedback on our technology products.",
    url: "https://bazarna-store.vercel.app/contact",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/contact.png",
        width: 1200,
        height: 630,
        alt: "Contact Bazarna",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Us Bazarna",
    description:
      "Reach out to Bazarna for inquiries, support, or feedback on our tech products.",
    images: ["/og/contact.png"],
  },
};

// Main component
export default function ContactPage() {
  return <ContactPageContent />;
}
