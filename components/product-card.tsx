"use client";

import { Product } from "@/data/products";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useEcommerce } from "@/contexts/EcommerceContext";

interface ProductCardProps {
  product: Product;
  isQuickViewOpen?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useEcommerce();
  const { addToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);

  // ✅ FIX: safe image
  const imageSrc =
    product.thumbnail ||
    (product.images && product.images.length > 0 && product.images[0]) ||
    "/placeholder.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    addToast("Added to cart!", "success");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast("Removed from wishlist", "info");
    } else {
      addToWishlist(product);
      addToast("Added to wishlist!", "success");
    }
  };

  // const discount = product.originalPrice
  //   ? Math.round(
  //       ((product.originalPrice - product.price) / product.originalPrice) * 100
  //     )
  //   : 0;

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 h-[200px]">
          <Image
            src={imageSrc}
            alt={product.title || product.title || "product"}
            width={500}
            height={500}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Wishlist */}
          <div className="absolute top-3 right-3">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-blue-600 hover:bg-white"
              }`}
            >
              <Heart
                className="w-5 h-5"
                fill={inWishlist ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="font-semibold text-blue-600 mb-2 line-clamp-2">
            {product.title || product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews?.length || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-blue-600">
              ${product.price}
            </span>

            {/* {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )} */}
          </div>

          {/* Button */}
          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}