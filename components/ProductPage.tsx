"use client";

import { ImageGallery } from '@/components/image-gallery';
import { ProductCard } from '@/components/product-card';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';
import { type Product } from "@/data/products";
import { useToast } from '@/contexts/ToastContext';
import { useEcommerce } from '@/contexts/EcommerceContext';

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useEcommerce();
  const { addToast } = useToast();
  // const { addViewed } = useRecentlyViewed();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // 🔥 fetch data
  useEffect(() => {
    async function fetchData() {
      const data: Product[] = await getProducts();

      setAllProducts(data);

      const found = data.find((p) => p.id === id);
      setProduct(found || null);
    }

    fetchData();
  }, [id]);

  // track viewed
  // useEffect(() => {
  //   if (product) addViewed(product.id);
  // }, [product, addViewed]);

  if (!product) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`Added ${quantity} to cart!`, 'success');
    setQuantity(1);
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      addToast('Added to wishlist!', 'success');
    }
  };

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600 border-b">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop">Shop</Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-blue-600">{product.title}</span>
      </div>

      {/* Product */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Images */}
          <ImageGallery
            images={product.images}
            productName={product.title}
          />

          {/* Info */}
          <div>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span>{product.rating}</span>
              <span>({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600 mb-6">
              ${product.price}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 rounded"
              >
                <ShoppingCart className="inline mr-2" />
                Add to Cart
              </button>

              <button onClick={handleWishlist}>
                <Heart fill={inWishlist ? "red" : "none"} />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex gap-2">
                <Truck /> {product.shippingInformation ?? "No shipping info"}
              </div>
              <div className="flex gap-2">
                <Shield /> {product.warrantyInformation ?? "No warranty"}
              </div>
              <div className="flex gap-2">
                <RotateCcw /> {product.returnPolicy ?? "No return policy"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t">

        <div className="flex gap-6 mb-6">
          <button onClick={() => setActiveTab('details')}>Details</button>
          <button onClick={() => setActiveTab('specs')}>Specs</button>
          <button onClick={() => setActiveTab('reviews')}>Reviews</button>
        </div>

        {activeTab === 'details' && <p>{product.description}</p>}

        {activeTab === 'specs' && (
          <div>
            <p>Brand: {product.brand ?? "N/A"}</p>
            <p>Stock: {product.stock ?? "N/A"}</p>
            <p>SKU: {product.sku ?? "N/A"}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {product.reviews?.map((review, i) => (
              <div key={i} className="border-b pb-4">
                <p className="font-bold">{review.reviewerName}</p>
                <p className="text-sm text-gray-500">{review.date}</p>

                <div className="flex">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl mb-6">Related Products</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}