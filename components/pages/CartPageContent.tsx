"use client";

// Imports
import CartItem from "@/components/cart-checkout/CartItem";
import OrderSummary from "@/components/cart-checkout/OrderSummary";
import { useEcommerce } from "@/contexts/EcommerceContext";
import { useToast } from "@/contexts/ToastContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Cart Page
export default function CartPageContent() {
  // Get cart data and functions from hooks
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartDiscountedTotal,
    clearCart,
    loading,
    syncError,
    applyCoupon,
  } =
    useEcommerce();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [busy, setBusy] = useState(false);

  // Remove item from cart
  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      addToast("Removed from cart", "info");
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Could not remove item.", "error");
    }
  };

  // Update item quantity
  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartQuantity(productId, quantity);
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Could not update quantity.", "error");
    }
  };

  const subtotal = cartTotal;
  const shipping = 0;
  const tax = 0;
  const total = cartDiscountedTotal ?? subtotal;

  const handleCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!coupon.trim()) return;
    setBusy(true);
    try {
      await applyCoupon(coupon.trim());
      addToast("Coupon applied successfully.", "success");
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Could not apply coupon.", "error");
    } finally {
      setBusy(false);
    }
  };

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
        {syncError && (
          <p className="mb-6 text-red-600" role="alert">{syncError}</p>
        )}
        {loading && (
          <p className="mb-6 text-gray-500" role="status">Syncing your cart...</p>
        )}
        {/* Empty Cart */}
        {loading && cart.length === 0 ? (
          <p className="py-16 text-center text-gray-500">Loading your cart...</p>
        ) : cart.length === 0 ? (
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
                    key={item.itemId || `${item.product.id}-${item.color || "default"}`}
                    item={item}
                    handleQuantityChange={handleQuantityChange}
                    handleRemove={handleRemove}
                  />
                ))}
              </div>

              {/* Clear Cart Button */}
              <button
                onClick={() => {
                  void clearCart()
                    .then(() => addToast("Cart cleared", "info"))
                    .catch((error: unknown) =>
                      addToast(
                        error instanceof Error ? error.message : "Could not clear cart.",
                        "error",
                      ),
                    );
                }}
                className="mt-6 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Clear Cart
              </button>
              <form onSubmit={handleCoupon} className="mt-6 flex gap-2">
                <input
                  aria-label="Coupon code"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  placeholder="Coupon code"
                  className="min-w-0 flex-1 border rounded-lg px-4 py-2"
                />
                <button
                  type="submit"
                  disabled={!user || busy}
                  title={!user ? "Sign in to apply a coupon" : undefined}
                  className="px-4 py-2 border rounded-lg text-blue-600 disabled:opacity-50"
                >
                  {busy ? "Applying..." : "Apply"}
                </button>
              </form>
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
