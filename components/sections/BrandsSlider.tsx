"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrands, type ApiRecord } from "@/lib/api";

export function BrandsSlider() {
  const [brands, setBrands] = useState<ApiRecord[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getBrands()
      .then((items) => {
        if (active) setBrands(items);
      })
      .catch((cause: unknown) => {
        console.error("Failed to load brands.", cause);
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 overflow-hidden">
      {error ? (
        <p className="text-center text-gray-500" role="status">
          Brands are temporarily unavailable.
        </p>
      ) : brands.length ? (
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          >
            {[...brands, ...brands].map((brand, index) => {
              const name = String(brand.name ?? "Brand");
              const image =
                typeof brand.image === "string" ? brand.image : "";
              return (
                <Link
                  key={`${String(brand._id)}-${index}`}
                  href={`/shop?brand=${encodeURIComponent(String(brand._id))}`}
                  aria-label={`Shop ${name}`}
                  className="flex items-center justify-center bg-gray-50 rounded-xl p-6 min-w-[200px] mx-4 hover:bg-gray-100 transition"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      width={400}
                      height={100}
                      unoptimized
                      className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-gray-700">
                      {name}
                    </span>
                  )}
                </Link>
              );
            })}
          </motion.div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No brands available yet.</p>
      )}
    </section>
  );
}
