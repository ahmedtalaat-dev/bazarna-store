"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { getProducts } from "@/lib/api";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import { type Product } from "@/data/products";
import { Suspense } from "react";

export default function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch + Transform API Data
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // URL Params
  const sortBy = searchParams.get("sort") || "newest";
  const category = searchParams.get("category");
  const color = searchParams.get("color");
  const rating = searchParams.get("rating");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = Number(searchParams.get("page")) || 1;
  const viewMode = searchParams.get("view") || "grid";

  const itemsPerPage = 12;

  // Update URL Params
  const updateParam = useCallback(
    (key: any, value: any) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Filter + Sort
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (category) result = result.filter((item) => item.category === category);
    if (rating) result = result.filter((item) => item.rating >= Number(rating));
    if (minPrice)
      result = result.filter((item) => item.price >= Number(minPrice));
    if (maxPrice)
      result = result.filter((item) => item.price <= Number(maxPrice));

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "best-selling":
        result.sort((a, b) => b.reviews.length - a.reviews.length);
        break;
      default:
        result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [products, category, color, rating, sortBy, minPrice, maxPrice]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

  // Filters handler
  const handleFilterChange = useCallback(
    (newFilters: any) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newFilters).forEach(([key, value]) => {
        if (key === "priceRange" && Array.isArray(value)) {
          params.set("minPrice", value[0].toString());
          params.set("maxPrice", value[1].toString());
        } else if (!value) {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });
      params.set("page", "1");
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleResetFilters = useCallback(() => {
    router.push("/shop");
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Shop All Products
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} products
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col-reverse md:flex-row gap-8">
          {/* Products */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-between mb-6">
              <select
                value={sortBy}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center py-10">No products found</p>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => updateParam("page", page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam("page", i + 1)}
                  className={`px-3 py-1 border ${
                    page === i + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => updateParam("page", page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded"
              >
                Next
              </button>
            </div>
          </div>

          {/* Filters */}
          <aside className="w-full md:w-64">
            <ProductFilters
              onFilterChange={handleFilterChange}
              currentFilters={{
                category: category || undefined,
                color: color || undefined,
                rating: rating ? Number(rating) : undefined,
                priceRange:
                  minPrice || maxPrice
                    ? [Number(minPrice || 0), Number(maxPrice || 2000)]
                    : undefined,
              }}
              onReset={handleResetFilters}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
