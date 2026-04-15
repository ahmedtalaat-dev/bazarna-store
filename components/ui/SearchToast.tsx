"use client";

// Imports
import { FormEvent } from "react";
import { X, Search } from "lucide-react";

// Search Toast type
type SearchToastProps = {
  open: boolean;
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

// Quick Searches
const quickSearches = [
  "Kiwi",
  "Chair",
  "Oil",
  "Bed",
  "Food",
  "Gaming Chair",
  "Smart Watch",
  "Fish",
  "Mascara",
  "Sofa",
];

// Main Page
export function SearchToast({
  open,
  query,
  setQuery,
  onClose,
  onSubmit,
}: SearchToastProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 h-[50vh] animate-in slide-in-from-right mx-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-xl">Search Products</h3>

          <button
            onClick={onClose}
            aria-label="Close search modal"
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={onSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            className="flex items-center gap-1 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Searches */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">
            Popular Searches
          </h4>

          <div className="flex flex-wrap gap-2">
            {quickSearches.map((word) => (
              <button
                key={word}
                onClick={() => setQuery(word)}
                className="px-3 py-2 bg-gray-100 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Spacer / future suggestions */}
        <div className="mt-8 text-sm text-gray-400">
          Start typing to search our products...
        </div>
      </div>
    </div>
  );
}
