"use client";

import { ProductCard } from "@/components/product/product-card";
import { type Product } from "@/data/products";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getProducts } from "@/lib/api";
import ProductSkeleton from "@/components/product/ProductSkeleton";

export function BestSellers() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const totalSlides = 4;

  // ✅ Fetch Products
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slider controls
  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setIsTransitioning(true);
  };

  // Auto-slide on mobile
  useEffect(() => {
    if (!isMobile || loading) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isMobile, loading]);

  // Infinite loop transition
  useEffect(() => {
    if (!sliderRef.current || loading) return;

    const handleTransitionEnd = () => {
      if (currentIndex === totalSlides) {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }
    };

    const sliderDiv = sliderRef.current;
    sliderDiv.addEventListener("transitionend", handleTransitionEnd);
    return () => sliderDiv.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, totalSlides, loading]);

  /* ================= Render ================= */
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-blue-600 mb-2">Best Sellers</h2>
            <p className="text-gray-600">Most popular products loved by our customers</p>
          </div>
          <Link
            href="/shop?sort=best-selling"
            aria-label="View all best-selling products"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* ================= Loading Skeletons ================= */}
        {loading ? (
          isMobile ? (
            <div className="relative overflow-hidden">
              <div className="flex gap-2 px-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-full">
                    <ProductSkeleton />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )
        ) : isMobile ? (
          /* ================= Mobile Slider ================= */
          <div className="relative">
            <div className="overflow-hidden">
              <div
                ref={sliderRef}
                className={`flex ${isTransitioning ? "transition-transform duration-500" : ""}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-full px-2">
                    <ProductCard product={product} />
                  </div>
                ))}
                {/* Clone first slide for loop */}
                <div className="flex-shrink-0 w-full px-2">
                  <ProductCard product={products[0]} />
                </div>
              </div>
            </div>

            {/* Slider Buttons */}
            <button
              onClick={prevSlide}
              aria-label="Previous Product"
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Product"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        ) : (
          /* ================= Desktop Grid ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
