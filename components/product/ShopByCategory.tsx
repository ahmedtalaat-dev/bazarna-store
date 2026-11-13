"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCategories, type ApiRecord } from "@/lib/api";

const categoryFallbacks = ["/categories/beauty.webp", "/categories/fragrances.webp", "/categories/furniture.webp"];

export function ShopByCategory() {
  const [categories, setCategories] = useState<ApiRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((items) => {
        if (active) setCategories(items);
      })
      .catch((cause: unknown) => {
        console.error("Failed to load categories.", cause);
        if (active) setError("Categories are temporarily unavailable.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
        Shop by Category
      </h2>
      {error ? (
        <p className="text-center text-gray-600" role="status">{error}</p>
      ) : categories.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const name = String(category.name ?? "Category");
            const image =
              typeof category.image === "string" && category.image
                ? category.image
                : categoryFallbacks[index % categoryFallbacks.length];
            return (
              <Link
                key={String(category._id)}
                href={`/shop?category=${encodeURIComponent(String(category._id))}`}
                aria-label={`Shop ${name} category`}
                className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={name}
                  width={500}
                  height={500}
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">{name}</h3>
                    <p className="text-white/80">Explore our {name.toLowerCase()} collection</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No categories available yet.</p>
      )}
    </section>
  );
}
