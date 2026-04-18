"use client";

// Imports
import Image from "next/image";
import { testimonials } from "@/data/products";
import { motion, type Variants   } from "framer-motion";

// Animation Variants
const cardVariants: Variants  = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // stagger effect
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

// Main Page
export function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
        What Our Customers Say
      </h2>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }} // 🔥 only first time
            className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
          >
            {/* Star Rating */}
            <div
              className="flex gap-1 mb-4"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`${
                    i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-700 mb-6 italic leading-relaxed">
              &ldquo;{testimonial.text}&rdquo;
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-3">
              <Image
                src={testimonial.avatar}
                alt={testimonial.author}
                loading="lazy"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-blue-600">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
