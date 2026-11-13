"use client";

// Imports
import { ImageGallery } from "@/components/product/image-gallery";
import { ProductCard } from "@/components/product/product-card";
import { useEcommerce } from "@/contexts/EcommerceContext";
import { useToast } from "@/contexts/ToastContext";
import { getProductById, getProducts } from "@/lib/api";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { type Product } from "@/data/products";

// Main Page
export default function ProductPageContent({ id }: { id: string }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useEcommerce();
  const { addToast } = useToast();

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  // Fetch Product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Product = await getProductById(id);

        setProduct(data);
        setSelectedColor(data.colors?.[0]);

        const allData = await getProducts({
          ...(data.categoryId ? { category: data.categoryId } : {}),
          limit: 5,
          sort: "-sold",
        });
        const related = allData.filter((p) => p.id !== data.id).slice(0, 4);

        setRelatedProducts(related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <div className="min-h-screen bg-white text-center py-20">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Product Not Found
        </h1>
        <Link
          href="/shop"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // Handle add to cart
  const handleAddToCart = () => {
    void addToCart(product, quantity, selectedColor)
      .then(() => {
        addToast(`Added ${quantity} to cart!`, "success");
        setQuantity(1);
      })
      .catch((error: unknown) =>
        addToast(
          error instanceof Error ? error.message : "Could not add this item to cart.",
          "error",
        ),
      );
  };

  // Handle wishlist
  const handleWishlist = () => {
    if (inWishlist) {
      void removeFromWishlist(product.id)
        .then(() => addToast("Removed from wishlist", "info"))
        .catch((error: unknown) =>
          addToast(
            error instanceof Error ? error.message : "Could not update your wishlist.",
            "error",
          ),
        );
    } else {
      void addToWishlist(product)
        .then(() => addToast("Added to wishlist!", "success"))
        .catch((error: unknown) =>
          addToast(
            error instanceof Error ? error.message : "Could not update your wishlist.",
            "error",
          ),
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600 border-b">
        <Link href="/">Home</Link> /<Link href="/shop">Shop</Link> /
        <Link href={`/shop?category=${product.category}`}>
          {product.category}
        </Link>{" "}
        /<span className="text-blue-600">{product.title}</span>
      </div>

      {/* Product */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        {/* Images */}
        <ImageGallery
          images={
            product.images && product.images.length > 0
              ? product.images
              : product.imageCover
                ? [product.imageCover]
                : ["/placeholder.png"]
          }
          productName={product.title || product.title}
        />

        <div>
          {/* Product title */}
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            {product.title}
          </h1>

          {/* Product rating */}
          <div className="flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span>{product.rating}</span>
          </div>

          {/* Product price */}
          <div className="mb-6">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-3 text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Product description */}
          <p className="mb-6">{product.description}</p>

          {product.colors?.length ? (
            <label className="mb-6 block">
              <span className="block mb-2 font-medium">Color</span>
              <select
                value={selectedColor || ""}
                onChange={(event) => setSelectedColor(event.target.value)}
                className="rounded-lg border px-4 py-2"
              >
                {product.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <p className="mb-4 text-sm text-gray-600">
            {product.stock ? `${product.stock} in stock` : "Currently out of stock"}
          </p>

          {/* Actions */}
          <div className="mb-6 flex gap-4">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              aria-label="Increase quantity"
              disabled={quantity >= (product.stock ?? 0)}
              onClick={() =>
                setQuantity(Math.min(product.stock ?? quantity, quantity + 1))
              }
            >
              +
            </button>
          </div>

          {/* Add to cart and wishlist */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!product.stock || quantity > product.stock}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              {product.stock ? "Add to Cart" : "Out of Stock"}
            </button>
            <button onClick={handleWishlist}>
              <Heart
                aria-label={
                  inWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
                fill={inWishlist ? "red" : "none"}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {product.reviews.map((review) => (
          <div key={review.reviewerName} className="mb-4 border-b pb-4">
            <p className="font-semibold">{review.reviewerName}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </section>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
    <h2 className="text-2xl font-bold mb-6">Related Products</h2>

    <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth">
      {relatedProducts.map((p) => (
        <div key={p.id} className="min-w-[300px] flex-shrink-0">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  </section>
      )}
    </div>
  );
}
