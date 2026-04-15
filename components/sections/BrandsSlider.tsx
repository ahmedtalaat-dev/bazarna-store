"use client"

// Imports
import { motion } from "framer-motion";
import Image from "next/image";

// Brands
const brands = [
  { name: "Nike", logo: "/brands/nike.webp" },
  { name: "Adidas", logo: "/brands/adidas.webp" },
  { name: "Apple", logo: "/brands/apple.webp" },
  { name: "Samsung", logo: "/brands/samsung.webp" },
  { name: "Puma", logo: "/brands/puma.webp" },
  { name: "Zara", logo: "/brands/zara.webp" },
];

// Main Page
export function BrandsSlider() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
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
  );
}