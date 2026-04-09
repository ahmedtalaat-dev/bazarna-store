"use client";

import Link from "next/link";
import { Award} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

export function Footer() {
  const [email, setEmail] = useState<string>("");
  const { addToast } = useToast();

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim()) {
      addToast("Thank you for subscribing!", "success");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Subscribe to Our Newsletter
            </h3>

            <p className="text-gray-400 mb-4">
              Get the latest products and exclusive offers.
            </p>

            <form
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded bg-gray-800 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors w-full sm:w-auto cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer*/}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About Bazarna</h4>

            <p className="text-gray-400 text-sm leading-relaxed">
              We provide premium quality products with exceptional customer
              service. Your satisfaction is our top priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/shop?category=Electronics"
                  className="hover:text-white transition-colors"
                >
                  Electronics
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?category=Computers"
                  className="hover:text-white transition-colors"
                >
                  Computers
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?category=Accessories"
                  className="hover:text-white transition-colors"
                >
                  Accessories
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?category=Furniture"
                  className="hover:text-white transition-colors"
                >
                  Furniture
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social + Contact */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Award className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Award className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Award className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Award className="w-5 h-5" />
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Award className="w-4 h-4" />
              <span>support@bazarna.com</span>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-800 pt-8 space-y-2">
            <p>© {new Date().getFullYear()} Bazarna. All rights reserved.</p>

            <p className="flex items-center justify-center gap-1">
              Made with 💙 by Ahmed Talaat
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
