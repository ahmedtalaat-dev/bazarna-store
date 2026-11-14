"use client";

import { motion, type Variants } from "framer-motion";

// Testimonial interface
interface Testimonial {
  id: string;
  author: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

// Testimonials data
export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "Ahmed Ali",
    role: "Product Designer",
    text: "The quality and customer service are exceptional. I have become a loyal customer.",
    avatar: "/reviews/review 1.webp",
    rating: 5,
  },
  {
    id: "2",
    author: "Omar Mohamed",
    role: "Tech Entrepreneur",
    text: "Best online shopping experience I have had. Fast shipping and great prices.",
    avatar: "/reviews/review 2.webp",
    rating: 5,
  },
  {
    id: "3",
    author: "Abdullah Saad",
    role: "Content Creator",
    text: "High quality products at competitive prices. Highly recommended!",
    avatar: "/reviews/review 3.webp",
    rating: 4,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

export function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
        What Our Customers Say
      </h2>
      {testimonials.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${index}`}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <div
                className="flex gap-1 mb-4"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, star) => (
                  <span
                    key={star}
                    aria-hidden="true"
                    className={
                      star < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {testimonial.author.slice(0, 1).toUpperCase()}
                </span>
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
      ) : (
        <p className="text-center text-gray-500">No customer reviews yet.</p>
      )}
    </section>
  );
}
