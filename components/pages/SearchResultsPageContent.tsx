"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, type FilterOptions } from "@/components/product/product-filters";
import ProductSkeleton from "@/components/ProductSkeleton";
import Pagination from "@/components/ui/Pagination";
import { getProductPage } from "@/lib/api";
import type { Product } from "@/data/products";

const pageSize = 12;
const catalogPageSize = 50;

export default function SearchResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const category = searchParams.get("category") || undefined;
  const color = searchParams.get("color") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const rating = Number(searchParams.get("rating")) || undefined;
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const sortBy = searchParams.get("sort") || "newest";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const apiSort: Record<string, string> = {
          newest: "-createdAt",
          "best-selling": "-sold",
          "price-low": "price",
          "price-high": "-price",
        };
        const firstPage = await getProductPage({
          page: 1,
          limit: catalogPageSize,
          sort: apiSort[sortBy] || "-createdAt",
        });
        const remainingPages = await Promise.all(
          Array.from(
            { length: Math.max(0, firstPage.totalPages - 1) },
            (_, index) =>
              getProductPage({
                page: index + 2,
                limit: catalogPageSize,
                sort: apiSort[sortBy] || "-createdAt",
              }),
          ),
        );
        if (active) {
          setProducts(
            [firstPage, ...remainingPages].flatMap((response) => response.products),
          );
        }
      } catch (cause: unknown) {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "Could not search products.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchProducts();

    return () => {
      active = false;
    };
  }, [sortBy]);

  const matchingProducts = useMemo(() => {
    let matches = products.filter((product) => {
      const searchableText = [
        product.title,
        product.description,
        product.category,
        product.brand,
        product.sku,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return !query || searchableText.includes(query);
    });

    if (category) {
      matches = matches.filter(
        (product) =>
          product.category === category || product.categoryId === category,
      );
    }
    if (brand) {
      matches = matches.filter(
        (product) => product.brand === brand || product.brandId === brand,
      );
    }
    if (color) {
      matches = matches.filter((product) => product.colors?.includes(color));
    }
    if (minPrice) {
      matches = matches.filter((product) => product.price >= Number(minPrice));
    }
    if (maxPrice) {
      matches = matches.filter((product) => product.price <= Number(maxPrice));
    }
    if (rating) {
      matches = matches.filter((product) => product.rating >= rating);
    }

    if (sortBy === "price-low") {
      matches.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      matches.sort((a, b) => b.price - a.price);
    }

    return matches;
  }, [products, query, category, brand, color, minPrice, maxPrice, rating, sortBy]);

  const totalPages = Math.ceil(matchingProducts.length / pageSize);
  const searchResults = matchingProducts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const updateParam = useCallback(
    (key: string, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, String(value));
      if (key !== "page") params.set("page", "1");
      router.push(`/search${params.size ? `?${params.toString()}` : ""}`);
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
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleResetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ["category", "color", "rating", "minPrice", "maxPrice", "page"]) {
      params.delete(key);
    }
    router.push(`/search${params.size ? `?${params.toString()}` : ""}`);
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
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {matchingProducts.length} results for &ldquo;{query}&rdquo;
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col-reverse md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: pageSize }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-600" role="alert">
                {error}
              </div>
            ) : searchResults.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  No products found
                </h2>
                <p className="text-gray-600">
                  {query
                    ? `We couldn't find anything for "${query}"`
                    : "Enter a search term to find products."}
                </p>
              </div>
            )}

            {!loading && !error && matchingProducts.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(nextPage) => updateParam("page", nextPage)}
              />
            )}
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
