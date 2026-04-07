// Imports
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "Page Not Found | Bazarna",
  description:
    "The page you are looking for does not exist. Explore other products and pages on Bazarna.",
};

// Not Found Page
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-8xl font-bold text-blue-100 mb-4">404</div>

          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Page Not Found
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Sorry, the page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-blue-600 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Helpful links */}
          <div className="mt-16 pt-8 border-t">
            <p className="text-gray-600 mb-6">Looking for something?</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/shop"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Shop
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/about"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                About Us
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/faq"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
