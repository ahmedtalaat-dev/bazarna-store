"use client";

// Imports
import CartItem from "@/components/cart-checkout/CartItem";
import OrderSummary from "@/components/cart-checkout/OrderSummary";
import { useEcommerce } from "@/contexts/EcommerceContext";
import { useToast } from "@/contexts/ToastContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Cart Page
export default function CartPageContent() {
  // Get cart data and functions from hooks
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } =
    useEcommerce();
  const { addToast } = useToast();

  // Remove item from cart
  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    addToast("Removed from cart", "info");
  };

  // Update item quantity
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartQuantity(productId, quantity);
  };

  // Calculate prices
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">Shopping Cart</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping and add items to your cart!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <ArrowLeft aria-hidden="true" className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Side*/}
            <div className="lg:col-span-2">
              {/* Cart Items Count */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600" aria-live="polite">
                  {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
                </p>
              </div>

              {/* Cart Products */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    handleQuantityChange={handleQuantityChange}
                    handleRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Clear Cart Button */}
              <button
                onClick={() => {
                  clearCart();
                  addToast("Cart cleared", "info");
                }}
                className="mt-6 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        )}
      </div>
    </div>
  );
}
