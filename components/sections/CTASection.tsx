// Imports
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Main Page
export function CTASection() {
  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Header */}
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Upgrade Your Setup?
        </h2>

        {/* Section Subtitle */}
        <p className="text-xl text-white/80 mb-8">
          Browse our exclusive collection and find the perfect products for you.
        </p>

        {/* CTA Button */}
        <Link
          href="/shop"
          aria-label="Start shopping at Bazarna"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors gap-2"
        >
          Start Shopping
          <ArrowRight aria-hidden="true" className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
