'use client';

import { ImageGallery } from '@/components/image-gallery';
import { ProductCard } from '@/components/product-card';
import { useEcommerce } from '@/contexts/EcommerceContext';
import { useToast } from '@/contexts/ToastContext';
import { getProductById, getProducts } from '@/lib/api';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ProductPageContent({ id }: { id: string }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useEcommerce();
  const { addToast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductById(id);

        const transformed = {
          id: data.id,
          name: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          originalPrice: data.price / (1 - data.discountPercentage / 100),
          rating: data.rating,
          reviews: data.reviews?.length || 0,
          images: data.images,
          thumbnail: data.thumbnail,
          colors: data.tags || [],
          sizes: [],
          isNew: true,
          isBestseller: data.rating > 4,
          specifications: {
            brand: data.brand,
            weight: data.weight,
            warranty: data.warrantyInformation,
            shipping: data.shippingInformation,
          },
          reviews_data: data.reviews?.map((r: any, i: number) => ({
            id: i,
            author: r.reviewerName,
            date: new Date(r.date).toLocaleDateString(),
            rating: r.rating,
            text: r.comment,
          })) || [],
        };

        setProduct(transformed);
        setSelectedColor(transformed.colors[0]);

        const allData = await getProducts();
        const related = allData
          .filter((p: any) => p.category === data.category && p.id !== data.id)
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            rating: p.rating,
            images: p.images,
            thumbnail: p.thumbnail,
          }));

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-center py-20">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Product Not Found</h1>
        <Link href="/shop" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Back to Shop
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
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

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600 border-b">
        <Link href="/">Home</Link> /
        <Link href="/shop">Shop</Link> /
        <Link href={`/shop?category=${product.category}`}>{product.category}</Link> /
        <span className="text-blue-600">{product.name}</span>
      </div>

      {/* Product */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        <ImageGallery
          images={
            product.images && product.images.length > 0
              ? product.images
              : product.thumbnail
              ? [product.thumbnail]
              : ['/placeholder.png']
          }
          productName={product.title || product.name}
        />

        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            ))}
            <span>{product.rating}</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold">${product.price}</span>
            {discount > 0 && <span className="ml-2 text-green-600">-{discount}%</span>}
          </div>

          <p className="mb-6">{product.description}</p>

          <div className="mb-6 flex gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="flex gap-4 mb-8">
            <button onClick={handleAddToCart} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              Add to Cart
            </button>
            <button onClick={handleWishlist}>
              <Heart fill={inWishlist ? 'red' : 'none'} />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {product.reviews_data.map((review: any) => (
          <div key={review.id} className="mb-4 border-b pb-4">
            <p className="font-semibold">{review.author}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
            <p>{review.text}</p>
          </div>
        ))}
      </section>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}