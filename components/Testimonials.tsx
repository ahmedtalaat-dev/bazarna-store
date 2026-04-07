import Image from "next/image";
import { testimonials } from "@/data/products";

// Testimonial Interface 
interface Testimonial {
  id: string;
  author: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

export function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
        What Our Customers Say
      </h2>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial: Testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
          >
            {/* Star Rating */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
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
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-blue-600">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}