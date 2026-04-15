// Imports
import type { Metadata } from "next";

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
  // Terms data
  const terms = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing and using this website, you accept and agree to be bound by the terms. If you do not agree, please do not use this service.",
    },
    {
      title: "Use License",
      content:
        "Permission is granted to temporarily download one copy of the materials on Bazarna's website for personal, non-commercial viewing only. You may not:",
      list: [
        "Modify or copy the materials",
        "Use the materials for any commercial purpose or public display",
        "Attempt to decompile or reverse engineer software",
        "Remove any copyright or proprietary notices",
        "Transfer or 'mirror' materials on another server",
      ],
    },
    {
      title: "Disclaimer",
      content:
        "Materials are provided 'as is'. Bazarna makes no warranties, expressed or implied.",
    },
    {
      title: "Limitations",
      content:
        "Bazarna or its suppliers are not liable for any damages from using the website.",
    },
    {
      title: "Accuracy of Materials",
      content:
        "Materials may include errors. Bazarna does not guarantee accuracy and may update content anytime.",
    },
    {
      title: "Links",
      content: "Bazarna is not responsible for content on linked websites.",
    },
    {
      title: "Modifications",
      content:
        "Bazarna can revise these terms anytime. Using the website means you accept updates.",
    },
    {
      title: "Governing Law",
      content: "Terms are governed by the laws of the United States.",
    },
    {
      title: "Contact Information",
      content: "If you have questions, contact us at:",
      list: [
        "Email: legal@Bazarna.com",
        "Phone: +20 1104894017",
        "Address: 123 Al Salam Street, Minya, Egypt",
      ],
    },
  ];

  // Terms Page
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
