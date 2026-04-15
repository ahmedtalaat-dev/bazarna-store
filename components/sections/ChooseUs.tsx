"use client";

// Imports
import { motion, type Variants } from "framer-motion";

// Features interface
interface Feature {
  title: string;
  description: string;
  points: string[];
}

// Features data
const features: Feature[] = [
  {
    title: "Quality Assurance",
    description:
      "Every product in our store is carefully selected and tested to meet our high quality standards. We work directly with manufacturers to ensure authenticity.",
    points: [
      "Verified supplier partnerships",
      "Rigorous quality checks",
      "Authentic product guarantee",
    ],
  },
  {
    title: "Customer-First Service",
    description:
      "Your satisfaction is our top priority. Our dedicated customer support team is here to help you 24/7 with any questions or concerns.",
    points: [
      "24/7 customer support",
      "Easy returns & exchanges",
      "100% satisfaction guarantee",
    ],
  },
];

// Animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const pointVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

// Page Component
export function ChooseUs() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-4xl font-bold text-blue-600 mb-12 text-center"
        >
          Why Choose Bazarna?
        </motion.h2>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Feature Title */}
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Feature Points */}
              <ul className="space-y-3">
                {feature.points.map((point) => (
                  <motion.li
                    key={point}
                    variants={pointVariants}
                    className="flex items-start gap-3"
                  >
                    <span aria-hidden="true" className="text-blue-600 mt-1">
                      ✓
                    </span>
                    <span className="text-gray-600">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
