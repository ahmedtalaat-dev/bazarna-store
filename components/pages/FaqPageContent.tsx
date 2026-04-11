"use client";

// Imports
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// Main component
export default function FAQPageContent() {
  // States
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Toggle FAQ item
  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // FAQ data
  const faqs = [
    {
      id: "shipping",
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 2-3 business days. Express shipping is available for next-day delivery in select areas.",
    },
    {
      id: "return",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day money-back guarantee on all products. If you are not satisfied, simply return the item for a full refund.",
    },
    {
      id: "payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards, debit cards, and cash on delivery. All payments are processed securely.",
    },
    {
      id: "warranty",
      question: "Do products come with a warranty?",
      answer:
        "Most products come with the manufacturer warranty. Some items may have additional extended warranty options available.",
    },
    {
      id: "tracking",
      question: "Can I track my order?",
      answer:
        "Yes! You can track your order using your order ID on our Order Tracking page. You will also receive tracking updates via email.",
    },
    {
      id: "bulk",
      question: "Do you offer bulk discounts?",
      answer:
        "Yes, we offer special pricing for bulk orders. Please contact our sales team for more information.",
    },
    {
      id: "authentic",
      question: "Are all products authentic?",
      answer:
        "Absolutely! We only work with authorized manufacturers and suppliers to ensure 100% authenticity.",
    },
    {
      id: "support",
      question: "How can I contact customer support?",
      answer:
        "You can reach us via email at support@bazarna.com, phone at +20 1104894017, or through our contact form. We are available 24/7.",
    },
  ];

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
                aria-expanded={openItems[faq.id]}
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
                    openItems[faq.id] ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              {openItems[faq.id] && (
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
