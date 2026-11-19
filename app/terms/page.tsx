// Imports
import type { Metadata } from "next";
import { terms } from "../../data/index";

// Metadata
export const metadata: Metadata = {
  title: "Terms & Conditions | Bazarna",
  description:
    "Read the terms and conditions of using Bazarna, including policies, rules, and user agreements.",

  keywords: [
    "Bazarna",
    "terms and conditions",
    "user agreement",
    "policies",
    "online store rules",
  ],

  authors: [{ name: "Ahmed Talaat" }],

  openGraph: {
    title: "Terms & Conditions | Bazarna",
    description:
      "Understand Bazarna's terms, policies, and user agreements before shopping.",
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
    title: "Terms & Conditions | Bazarna",
    description:
      "Learn about Bazarna's policies and user agreements for safe online shopping.",
    images: ["/og/image.png"],
  },
};

// Terms Page
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-gray-600">Last updated: February 2026</p>
        </div>
      </section>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
          {terms.map((term, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                {idx + 1}. {term.title}
              </h2>
              <p>{term.content}</p>
              {term.list && (
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  {term.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
