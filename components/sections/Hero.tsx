"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Truck,
  Shield,
  Award,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

// Feature type definition
interface Feature {
  title: string;
  caption: string;
  icon: LucideIcon;
}

const brands = [
  { name: "Nike", logo: "/brands/nike.webp" },
  { name: "Adidas", logo: "/brands/adidas.webp" },
  { name: "Apple", logo: "/brands/apple.webp" },
  { name: "Samsung", logo: "/brands/samsung.webp" },
  { name: "Puma", logo: "/brands/puma.webp" },
  { name: "Zara", logo: "/brands/zara.webp" },
];

export function Hero() {
  // Features array
  const features: Feature[] = [
    {
      title: "Fast Delivery",
      caption: "Get your orders in 2-3 days",
      icon: Zap,
    },
    { title: "Free Shipping", caption: "On orders over $50", icon: Truck },
    {
      title: "Secure Payment",
      caption: "100% secure transactions",
      icon: Shield,
    },
    {
      title: "Quality Guarantee",
      caption: "30-day money-back guarantee",
      icon: Award,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:flex md:flex-row flex-col items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 z-10">
            {/* Limited Offer Badge */}
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🚀 Limited Time Offer
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-4 leading-tight">
              Premium Products at Unbeatable Prices
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover our curated collection of electronics, computers, and
              accessories. Quality you can trust, prices you'll love.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row mb-4">
              <Link
                href="/shop"
                aria-label="Shop Now - Premium Products"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors gap-2"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/about"
                aria-label="Learn More About Us"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Video */}
          <div className="flex-1 relative h-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-3xl z-10"></div>

            {/* Video Element */}
            <video
              src="/video.mp4"
              poster="/video-poster.webp"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-20"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 overflow-hidden">

      <div className="relative w-full overflow-hidden">
        <motion.div
    className="flex w-max" // w-max ensures the div expands to fit all items
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      ease: "linear",
      duration: 20,
      repeat: Infinity,
    }}
  >
    {/* Duplicate brands for infinite effect */}
    {[...brands, ...brands].map((brand, index) => (
      <div
        key={index}
        className="flex items-center justify-center bg-gray-50 rounded-xl p-6 min-w-[200px] mx-4 hover:bg-gray-100 transition"
      >
        <Image
          src={brand.logo}
          alt={brand.name}
          width={400}
          height={100}
          className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
        />
      </div>
    ))}
  </motion.div>
      </div>
    </section>
    </div>
  );
}
