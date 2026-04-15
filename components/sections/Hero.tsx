"use client";

// Imports
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Main Page
export function Hero() {
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
    </div>
  );
}
