'use client';

// Imports
import { ProductCard } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { getProducts } from '@/lib/api';
import { type Product } from '@/data/products';

// Handle search Component
export default function SearchResults() {
  // Get query from URL
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter, search, and sort products
  const searchResults = useMemo(() => {
    let result = [...products].filter((product) =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );

    // Filter by category
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter(
        (p) =>
          p.price >= filters.priceRange[0] &&
          p.price <= filters.priceRange[1]
      );
    }

    // Filter by rating
    if (filters.rating) {
      result = result.filter((p) => p.rating >= filters.rating);
    }

    // Sort products based on selected option
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        result.sort((a, b) => b.reviews.length - a.reviews.length);
        break;
      default:
        break;
    }

    return result;
  }, [products, query, filters, sortBy]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {query ? (
              <>
                Found {searchResults.length} result
                {searchResults.length !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold text-blue-600">
                  "{query}"
                </span>
              </>
            ) : (
              <span>Enter a search term to find products</span>
            )}
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">

          {/* Products results section */}
          <div className="flex-1">

            {/* Top bar with results count and sorting */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b">
              <div className="text-sm text-gray-600">
                {searchResults.length} product
                {searchResults.length !== 1 ? 's' : ''} found
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Sort by:
                </label>
                <select
                  title="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white text-sm font-medium text-blue-600"
                >
                  <option value="newest">Newest</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products grid or empty state */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  No products found
                </h2>
                <p className="text-gray-600 mb-8">
                  {query
                    ? `We couldn't find anything for "${query}"`
                    : 'Start typing to search products'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <ProductFilters
              onFilterChange={setFilters}
              currentFilters={filters}
              onReset={() => setFilters({})}
            />
          </aside>

        </div>
      </div>
    </div>
  );
}
