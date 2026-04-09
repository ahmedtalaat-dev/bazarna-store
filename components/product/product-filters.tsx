'use client';

import { ChevronDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  color?: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  onReset: () => void;
}

export function ProductFilters({ onFilterChange, currentFilters, onReset }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
    color: true,
  });

  // Local state for price range to prevent excessive re-renders
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    currentFilters.priceRange || [0, 2000]
  );

  // Update local price range when currentFilters change (e.g. on reset)
  useEffect(() => {
    if (currentFilters.priceRange) {
      setLocalPriceRange(currentFilters.priceRange);
    } else {
      setLocalPriceRange([0, 2000]);
    }
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
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localPriceRange, onFilterChange]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categories = ['beauty', 'fragrances', 'furniture', 'groceries'];
  const colors = ['Black', 'White', 'Silver', 'Gold', 'Gray', 'Brown', 'Blue'];
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
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={currentFilters.category === cat}
                  onChange={() => onFilterChange({ ...currentFilters, category: cat })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 group-hover:text-blue-600">{cat}</span>
              </label>
            ))}
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

      {/* Color Filter */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors font-semibold text-blue-600"
        >
          Color
          <ChevronDown
            className={`w-5 h-5 transition-transform ${expandedSections.color ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.color && (
          <div className="border-t p-4 space-y-3">
            {colors.map((color) => (
              <label key={color} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={currentFilters.color === color}
                  onChange={() => onFilterChange({ ...currentFilters, color })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 group-hover:text-blue-600">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
