// Imports
import Stat from "@/components/Stat";
import { Award, Users, Zap, Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

// Metadata
export const metadata: Metadata = {
  title: "About | Bazarna",
  description:
    "Learn more about Bazarna, our mission, values, and commitment to providing high-quality technology products at the best prices.",

  keywords: [
    "Bazarna",
    "about bazarna",
    "tech store",
    "electronics shop",
    "online shopping",
  ],

  authors: [{ name: "Ahmed Talaat" }],

  openGraph: {
    title: "About Bazarna",
    description:
      "Discover our story and why Bazarna is trusted by thousands of customers.",
    url: "https://bazarna-store.vercel.app/about",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/image.png",
        width: 1200,
        height: 630,
        alt: "About Bazarna",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "About Bazarna",
    description:
      "Learn more about Bazarna and our mission to deliver premium tech.",
    images: ["/og/image.png"],
  },
};

// About Page
export default function AboutPage() {
  // Values data
  const values = [
    {
      icon: Award,
      title: "Quality",
      description:
        "We only offer products that meet our strict quality standards.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our top priority in everything we do.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We stay ahead with the latest products and technologies.",
    },
    {
      icon: Shield,
      title: "Trust",
      description:
        "Secure transactions and reliable service you can depend on.",
    },
  ];

  // Story data
  const storyParagraphs = [
    "Bazarna was founded in 2024 with a simple vision: to make premium technology products accessible to everyone. We started as a small team of tech enthusiasts passionate about quality and customer service.",
    "Today, we've grown into a trusted online retailer serving thousands of customers worldwide. We work directly with manufacturers to ensure authenticity and the best prices for our customers.",
    "Our commitment to excellence, combined with our customer-first approach, has made us one of the most trusted e-commerce platforms in the tech industry.",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-blue-600 mb-4">
              About Bazarna
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are committed to bringing you the best quality products at the
              best prices. Our mission is to make premium technology accessible
              to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Loop through values array */}
          {values.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="text-center">
                {/* Decorative icon */}
                <Icon
                  aria-hidden="true"
                  className="w-12 h-12 text-blue-600 mx-auto mb-4"
                />

                {/* Value title */}
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  {item.title}
                </h3>

                {/* Value description */}
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-6">
                Our Story
              </h2>

              {/* Loop through story paragraphs */}
              {storyParagraphs.map((text, index) => (
                <p
                  key={index}
                  className={`text-gray-600 leading-relaxed ${
                    index !== storyParagraphs.length - 1 ? "mb-4" : ""
                  }`}
                >
                  {text}
                </p>
              ))}
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <Stat value={50} suffix="K+" label="Happy Customers" />
          <Stat value={500} suffix="+" label="Premium Products" />
          <Stat value={4.8} suffix=".8★" label="Average Rating" />
          <Stat value={24} suffix="/7" label="Customer Support" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-blue-100 mb-8">
            Discover our full range of premium products today.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
