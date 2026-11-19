// Imports
import type { Metadata } from "next";
import { privacySections } from "../../data/index";

// Metadata
export const metadata: Metadata = {
  title: "Privacy Policy | Bazarna",
  description:
    "Read Bazarna's Privacy Policy to understand how we collect, use, and protect your personal data.",
  keywords: [
    "Bazarna",
    "privacy policy",
    "personal data",
    "security",
    "online shopping",
  ],
  authors: [{ name: "Ahmed Talaat" }],
  openGraph: {
    title: "Privacy Policy | Bazarna",
    description:
      "Learn how Bazarna protects your personal information and respects your privacy.",
    url: "https://bazarna-store.vercel.app/privacy",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/privacy.png",
        width: 1200,
        height: 630,
        alt: "Bazarna Privacy Policy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Bazarna",
    description: "Understand how your data is handled safely at Bazarna.",
    images: ["/og/privacy.png"],
  },
};

// Privacy Page
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: February 2026</p>
        </div>
      </section>

      {/* Content container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
          {/* Loop through sections */}
          {privacySections.map((section, index) => (
            <section key={index}>
              {/* Section title */}
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                {section.title}
              </h2>

              {/* Section paragraphs */}
              {section.content.map((text, i) => (
                <p key={i}>{text}</p>
              ))}

              {/* Section list (if exists) */}
              {section.list && (
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
