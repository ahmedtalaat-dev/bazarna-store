"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, type FilterOptions } from "@/components/product/product-filters";
import ProductSkeleton from "@/components/ProductSkeleton";
import Pagination from "@/components/ui/Pagination";
import { getProductPage, type ProductPage } from "@/lib/api";

const pageSize = 12;

export default function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const [result, setResult] = useState<ProductPage>({
    products: [],
    page: 1,
    limit: pageSize,
    totalPages: 0,
    count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortBy = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || undefined;
  const color = searchParams.get("color") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const rating = Number(searchParams.get("rating")) || undefined;
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const viewMode = searchParams.get("view") || "grid";

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(queryString);
    const sortValue = params.get("sort");
    const apiSort: Record<string, string> = {
      newest: "-createdAt",
      "best-selling": "-sold",
      "price-low": "price",
      "price-high": "-price",
    };
    const query: Record<string, string | number | undefined> = {
      page,
      limit: pageSize,
      sort: apiSort[sortValue || "newest"] || "-createdAt",
      keyword: undefined,
    };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (color) query.colors = color;
    if (rating) query["ratingsAverage[gte]"] = rating;
    if (minPrice) query["price[gte]"] = minPrice;
    if (maxPrice) query["price[lte]"] = maxPrice;

    Promise.resolve()
      .then(() => {
        if (!active) return undefined;
        setLoading(true);
        setError(null);
        return getProductPage(query);
      })
      .then((response) => {
        if (active && response) setResult(response);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        const message =
          cause instanceof Error ? cause.message : "Could not load products.";
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [queryString, page, category, brand, color, rating, minPrice, maxPrice]);

  const updateParam = useCallback(
    (key: string, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, String(value));
      if (key !== "page") params.set("page", "1");
      router.push(`/shop${params.size ? `?${params.toString()}` : ""}`);
    },
    [router, searchParams],
  );

  const handleFilterChange = useCallback(
    (newFilters: FilterOptions) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const key of ["category", "color", "rating", "minPrice", "maxPrice"]) {
        params.delete(key);
      }
      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.color) params.set("color", newFilters.color);
      if (newFilters.rating) params.set("rating", String(newFilters.rating));
      if (newFilters.priceRange) {
        params.set("minPrice", String(newFilters.priceRange[0]));
        params.set("maxPrice", String(newFilters.priceRange[1]));
      }
      params.set("page", "1");
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleResetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ["category", "color", "rating", "minPrice", "maxPrice", "page"]) {
      params.delete(key);
    }
    router.push(`/shop${params.size ? `?${params.toString()}` : ""}`);
  }, [router, searchParams]);

  const filters = useMemo<FilterOptions>(
    () => ({
      category,
      color,
      rating,
      priceRange:
        minPrice || maxPrice
          ? [Number(minPrice || 0), Number(maxPrice || 2000)]
          : undefined,
    }),
    [category, color, rating, minPrice, maxPrice],
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Shop All Products
          </h1>
          <p className="text-gray-600">
            Showing {result.count} products
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col-reverse md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-low">Price Low</option>
                <option value="price-high">Price High</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: pageSize }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-600" role="alert">
                {error}
              </div>
            ) : result.products.length ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {result.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center py-10">No products found</p>
            )}

            <Pagination
              page={page}
              totalPages={result.totalPages}
              onPageChange={(nextPage) => updateParam("page", nextPage)}
            />
          </div>
          <aside className="w-full md:w-64">
            <ProductFilters
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              onReset={handleResetFilters}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
