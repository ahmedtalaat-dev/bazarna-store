// Imports
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';
import type { Metadata } from 'next';

// Metadata
export const metadata: Metadata = {
  title: "Search Products | Bazarna",
  description: "Find your favorite tech products quickly and easily on Bazarna using our search feature.",
  keywords: ["Bazarna", "search products", "tech store", "electronics shop", "find products online"],
  authors: [{ name: "Ahmed Talaat" }],
  openGraph: {
    title: "Search Products | Bazarna",
    description: "Discover and search for the best tech products at Bazarna.",
    url: "https://bazarna-store.vercel.app/search",
    siteName: "Bazarna",
    images: [
      {
        url: "/og/search.png",
        width: 1200,
        height: 630,
        alt: "Bazarna Search Page",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Products | Bazarna",
    description: "Quickly search and find tech products on Bazarna.",
    images: ["/og/search.png"],
  },
};

// Main page
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading search results...
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}