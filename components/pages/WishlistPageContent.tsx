"use client";

// Imports
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/data/products";
import { useToast } from "@/contexts/ToastContext";
import { useEcommerce } from "@/contexts/EcommerceContext";
import { useState, useMemo } from "react";

// Wishlist Page
export default function WishlistPageContent() {
  // Get wishlist actions and toast function
  const { wishlist, removeFromWishlist, addToCart } = useEcommerce();
  const { addToast } = useToast();

  // Pagination data
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Remove item from wishlist
  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    addToast("Removed from wishlist", "info");
  };

  // Add item to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    addToast("Added to cart!", "success");
  };

  // Placeholder if image missing
  const fallbackImage = "/placeholder.png";

  // Pagination logic
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedWishlist = useMemo(
    () => wishlist.slice(startIdx, endIdx),
    [wishlist, startIdx, endIdx],
  );

  // Wishlist Page
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">My Wishlist</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {wishlist.length === 0 ? (
          // Empty Wishlist
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add items to your wishlist and they will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            {/* Wishlist count */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600">
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your
                wishlist
              </p>
            </div>

            {/* Wishlist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedWishlist.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-lg border hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative bg-gray-100 aspect-square overflow-hidden">
                    <Image
                      src={
                        item.product.images?.[0] ||
                        item.product.thumbnail ||
                        fallbackImage
                      }
                      alt={item.product.title || "Product"}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Category */}
                    <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">
                      {item.product.category}
                    </p>
                    {/* Title */}
                    <Link
                      href={`/product/${item.product.id}`}
                      className="font-semibold text-blue-600 line-clamp-2 hover:text-blue-600 transition-colors mb-3"
                    >
                      {item.product.title}
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-sm text-yellow-500">★</span>
                      <span className="text-sm font-medium text-blue-600">
                        {item.product.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({item.product.reviews.length})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4 flex-grow">
                      <span className="text-lg font-bold text-blue-600">
                        ${item.product.price}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(page - 1)} // Previous page
                disabled={page === 1}
                className="px-4 py-2 border rounded"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)} // Jump to page
                  className={`px-3 py-1 border ${page === i + 1 ? "bg-blue-500 text-white" : ""}`}
                  aria-current={page === i + 1 ? "page" : undefined} // Accessibility for current page
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
