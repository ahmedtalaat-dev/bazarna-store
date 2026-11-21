"use client";

// Imports
import { ImageGallery } from "@/components/product/imageGallery";
import { ProductCard } from "@/components/product/productCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEcommerce } from "@/contexts/EcommerceContext";
import { useToast } from "@/contexts/ToastContext";
import {
  addProductReview,
  getProductById,
  getProducts,
  removeReview,
} from "@/lib/api";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import { type Product } from "../../types/index";

// Main Page
export default function ProductPageContent({ id }: { id: string }) {
  const { user, loading: authLoading } = useAuth();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useEcommerce();
  const { addToast } = useToast();

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [submittedReviewProductId, setSubmittedReviewProductId] = useState<
    string | null
  >(null);

  // Fetch Product
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Product = await getProductById(id);

        setProduct(data);
        setSelectedColor(data.colors?.[0]);

        const allData = await getProducts({
          ...(data.categoryId ? { category: data.categoryId } : {}),
          limit: 20,
          sort: "-sold",
        });
        const related = allData.filter((p) => p.category == data.category);

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
          error instanceof Error
            ? error.message
            : "Could not add this item to cart.",
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
            error instanceof Error
              ? error.message
              : "Could not update your wishlist.",
            "error",
          ),
        );
    } else {
      void addToWishlist(product)
        .then(() => addToast("Added to wishlist!", "success"))
        .catch((error: unknown) =>
          addToast(
            error instanceof Error
              ? error.message
              : "Could not update your wishlist.",
            "error",
          ),
        );
    }
  };

  const currentUserId = String(user?._id ?? user?.id ?? "");
  const hasReviewed =
    submittedReviewProductId === product.id ||
    Boolean(
      currentUserId &&
      product.reviews.some((review) => review.userId === currentUserId),
    );
  const isAdmin = user?.role === "admin";

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const comment = reviewComment.trim();
    if (!currentUserId || hasReviewed || !comment || reviewBusy) return;

    setReviewBusy(true);
    try {
      await addProductReview(product.id, reviewRating, comment);
      setSubmittedReviewProductId(product.id);
      setReviewComment("");
      addToast("Your review was added.", "success");
      try {
        setProduct(await getProductById(id));
      } catch (refreshError) {
        console.error(
          "Could not refresh the product after adding a review.",
          refreshError,
        );
        addToast(
          "Your review was saved, but the product could not be refreshed.",
          "info",
        );
      }
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Could not add your review.",
        "error",
      );
    } finally {
      setReviewBusy(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAdmin || deletingReviewId) return;
    if (!window.confirm("Delete this review? This cannot be undone.")) return;

    setDeletingReviewId(reviewId);
    try {
      await removeReview(reviewId);
      setSubmittedReviewProductId(null);
      setProduct((current) => {
        if (!current) return current;
        const reviews = current.reviews.filter(
          (review) => review.id !== reviewId,
        );
        const rating = reviews.length
          ? reviews.reduce((total, review) => total + review.rating, 0) /
            reviews.length
          : 0;
        return { ...current, reviews, rating };
      });
      addToast("Review deleted.", "success");
      try {
        setProduct(await getProductById(id));
      } catch (refreshError) {
        console.error(
          "Could not refresh the product after deleting a review.",
          refreshError,
        );
        addToast(
          "The review was deleted, but the product could not be refreshed.",
          "info",
        );
      }
    } catch (error) {
      addToast(
        error instanceof Error
          ? error.message
          : "Could not delete this review.",
        "error",
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-full mx-auto px-4 py-4 text-sm text-gray-600 border-b">
        <Link href="/">Home</Link> /<Link href="/shop">Shop</Link> /
        <span className="text-blue-600">{product.title}</span>
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

          {/* Product Colors */}
          {product.colors?.length ? (
            <div className="mb-6">
              <span className="block mb-3 font-medium">
                Color: <span className="text-gray-500">{selectedColor}</span>
              </span>

              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <label key={color} className="cursor-pointer" title={color}>
                    <input
                      type="radio"
                      name="productColor"
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                      className="sr-only"
                    />

                    <span
                      className={`block w-9 h-9 rounded-full border-2 transition-all
              ${
                selectedColor === color
                  ? "ring-2 ring-blue-600 ring-offset-2 border-white"
                  : "border-gray-300 hover:ring-2 hover:ring-gray-300"
              }`}
                      style={{ backgroundColor: color }}
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                product.stock
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {product.stock
                ? `${product.stock} in stock`
                : "Currently out of stock"}
            </span>
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
        {product.reviews.length ? (
          product.reviews.map((review, index) => {
            const reviewId = review.id;
            return (
              <div
                key={
                  reviewId ?? `${review.userId ?? review.reviewerName}-${index}`
                }
                className="mb-4 border-b pb-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* User Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg uppercase">
                    {review.reviewerName?.trim().charAt(0) || "U"}
                  </div>

                  {/* User Information */}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.reviewerName}
                    </p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>

                {/* Review Rating */}
                <div
                  className="flex items-center gap-1 mb-3"
                  aria-label={`Rated ${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={18}
                      className={
                        starIndex < Math.round(Number(review.rating) || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {/* Review Comment */}
                <blockquote className="text-gray-700 italic leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>

                {/* Admin Delete */}
                {isAdmin && reviewId && (
                  <button
                    type="button"
                    disabled={deletingReviewId !== null}
                    onClick={() => void handleDeleteReview(reviewId)}
                    className="mt-3 text-sm bg-red-600 text-white p-2 cursor-pointer hover:bg-red-500 transition rounded disabled:opacity-50"
                  >
                    {deletingReviewId === reviewId
                      ? "Deleting..."
                      : "Delete review"}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="mb-6 text-gray-500">No reviews yet.</p>
        )}

        {!isAdmin ? (
          <div className="mt-8 max-w-xl">
            {!hasReviewed ? (
              <h3 className="mb-4 text-lg font-semibold">Write a review</h3>
            ) : (
              ""
            )}
            {authLoading ? (
              <p className="text-gray-600">Checking your account...</p>
            ) : !user ? (
              <p className="text-gray-600">
                <Link
                  href={`/auth/login?next=${encodeURIComponent(`/product/${id}`)}`}
                  className="text-blue-600"
                >
                  Sign in
                </Link>{" "}
                to review this product.
              </p>
            ) : hasReviewed ? (
              <p className="text-gray-600">
                You have already reviewed this product.
              </p>
            ) : !currentUserId ? (
              <p className="text-gray-600">
                Your account could not be verified to submit a review.
              </p>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Rating</span>
                  <select
                    value={reviewRating}
                    onChange={(event) =>
                      setReviewRating(Number(event.target.value))
                    }
                    className="rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-3 py-2"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} {rating === 1 ? "star" : "stars"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Review</span>
                  <textarea
                    required
                    maxLength={1000}
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-3 py-2"
                  />
                </label>
                <button
                  type="submit"
                  disabled={reviewBusy || !reviewComment.trim()}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                >
                  {reviewBusy ? "Submitting..." : "Submit review"}
                </button>
              </form>
            )}
          </div>
        ) : (
          ""
        )}
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
