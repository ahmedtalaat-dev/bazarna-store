"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { getReviews } from "@/lib/api";
import type { Review } from "@/data/products";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.2, duration: 0.5, ease: "easeOut" },
  }),
};

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getReviews()
      .then((items) => {
        if (active) setReviews(items.slice(0, 3));
      })
      .catch((cause: unknown) => {
        console.error("Failed to load customer reviews.", cause);
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
        What Our Customers Say
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading customer reviews...</p>
      ) : error ? (
        <p className="text-center text-gray-500" role="status">
          Customer reviews are temporarily unavailable.
        </p>
      ) : reviews.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={`${review.reviewerName}-${review.date}-${index}`}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, star) => (
                  <span
                    key={star}
                    aria-hidden="true"
                    className={star < review.rating ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                  {review.reviewerName.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-blue-600">
                    {review.reviewerName}
                  </p>
                  <p className="text-sm text-gray-600">{review.date}</p>
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
