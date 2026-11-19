"use client";

// Imports
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqs } from "../../data/index";

// Main component
export default function FAQPageContent() {
  // States
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Toggle FAQ item
  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            {/* Title */}
            <h1 className="text-5xl font-bold text-blue-600 mb-4">
              Frequently Asked Questions
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600">
              Find answers to common questions about our products, shipping, and
              services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="space-y-4">
          {/*FAQs */}
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border rounded-lg overflow-hidden transition-all"
            >
              {/* Question button */}
              <button
                onClick={() => toggleItem(faq.id)}
                aria-expanded={openItem === faq.id}
                aria-controls={`faq-${faq.id}`}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-lg font-semibold text-blue-600">
                  {faq.question}
                </span>

                {/* Icon */}
                <ChevronDown
                  aria-hidden="true"
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openItem === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              {openItem === faq.id && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
