'use client';

// Imports
import { ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCategories, type ApiRecord } from '@/lib/api';

// Filter interface
export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  color?: string;
}

// Props interface
interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  onReset: () => void;
}

// Main Page
export function ProductFilters({ onFilterChange, currentFilters, onReset }: ProductFiltersProps) {
  const [categories, setCategories] = useState<ApiRecord[]>([]);
  const [localColor, setLocalColor] = useState(currentFilters.color || '');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
  });

  useEffect(() => {
    let active = true;
    getCategories()
      .then((items) => {
        if (active) setCategories(items);
      })
      .catch((error: unknown) => {
        console.error('Failed to load product categories', error);
      });
    return () => {
      active = false;
    };
  }, []);

  // Local state for price range to prevent excessive re-renders
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    currentFilters.priceRange || [0, 2000]
  );

  // Update local price range when currentFilters change (e.g. on reset)
  useEffect(() => {
    const timer = setTimeout(
      () => setLocalPriceRange(currentFilters.priceRange || [0, 2000]),
      0,
    );
    return () => clearTimeout(timer);
  }, [currentFilters.priceRange]);

  // Debounce price changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        localPriceRange[0] !== (currentFilters.priceRange?.[0] || 0) ||
        localPriceRange[1] !== (currentFilters.priceRange?.[1] || 2000)
      ) {
        onFilterChange({ ...currentFilters, priceRange: localPriceRange });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localPriceRange, currentFilters, onFilterChange]);

  useEffect(() => {
    const timer = setTimeout(
      () => setLocalColor(currentFilters.color || ''),
      0,
    );
    return () => clearTimeout(timer);
  }, [currentFilters.color]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const color = localColor.trim();
      if (color !== (currentFilters.color || '')) {
        onFilterChange({ ...currentFilters, color: color || undefined });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localColor, currentFilters, onFilterChange]);

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Categories & Ratings
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-6">
      {/* Reset Filters */}
      {Object.keys(currentFilters).length > 0 && (
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium cursor-pointer"
        >
          <X className="w-4 h-4" />
          Reset Filters
        </button>
      )}

      {/* Category Filter */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors font-semibold text-blue-600"
        >
          Category
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              expandedSections.category ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.category && (
          <div className="border-t p-4 space-y-3">
            {categories.map((category) => (
              <label
                key={String(category._id)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={String(category._id)}
                  checked={currentFilters.category === String(category._id)}
                  onChange={() =>
                    onFilterChange({
                      ...currentFilters,
                      category: String(category._id),
                    })
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 group-hover:text-blue-600">
                  {String(category.name ?? '')}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors font-semibold text-blue-600"
        >
          Color
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              expandedSections.color ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.color && (
          <div className="border-t p-4">
            <label htmlFor="product-color-filter" className="sr-only">
              Filter by color
            </label>
            <input
              id="product-color-filter"
              type="text"
              value={localColor}
              onChange={(event) => setLocalColor(event.target.value)}
              placeholder="Enter a color"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors font-semibold text-blue-600"
        >
          Price Range
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.price && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Min: ${localPriceRange[0]}</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={localPriceRange[0]}
                onChange={(e) =>
                  setLocalPriceRange([parseInt(e.target.value), localPriceRange[1]])
                }
                className="w-full accent-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Max: ${localPriceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={localPriceRange[1]}
                onChange={(e) =>
                  setLocalPriceRange([localPriceRange[0], parseInt(e.target.value)])
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>


      {/* Rating Filter */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors font-semibold text-blue-600"
        >
          Rating
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.rating && (
          <div className="border-t p-4 space-y-3">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={currentFilters.rating === rating}
                  onChange={() => onFilterChange({ ...currentFilters, rating })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 group-hover:text-blue-600">
                  {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} {rating} & up
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
