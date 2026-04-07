// Features Definition Type
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

export function ChooseUs() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
          Why Choose Bazarna?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature) => (
            <div key={feature.title}>
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
                  <li key={point} className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">✓</span>
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
