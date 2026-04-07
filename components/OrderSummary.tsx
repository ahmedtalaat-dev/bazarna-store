// Imports
import Link from "next/link";

// Interfaces
interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {

  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
        {/* Title */}
        <h2 className="text-xl font-bold text-blue-600 mb-6">Order Summary</h2>

        {/* Subtotal, Shipping, and Tax */}
        <div className="space-y-4 mb-6 pb-6 border-b">
          {/* Subtotal */}
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping cost */}
          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span
              className={shipping === 0 ? "text-green-600 font-medium" : ""}
            >
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-gray-700">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between mb-8">
          <span className="text-lg font-bold text-blue-600">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          aria-label="Proceed to checkout"
          className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors mb-3"
        >
          Proceed to Checkout
        </Link>

        {/* Continue Shopping Button */}
        <Link
          href="/shop"
          aria-label="Continue shopping"
          className="w-full block text-center px-6 py-3 border border-gray-300 text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
        >
          Continue Shopping
        </Link>

        {/* Promo Code Section */}
        <div className="mt-6 pt-6 border-t">
          {/* Promo Code Input */}
          <input
            type="text"
            placeholder="Enter promo code"
            className="w-full px-4 py-2 border rounded-lg text-sm mb-2 ring-2 ring-gray-300"
          />
          {/* Apply Promo Code Button */}
          <button
          aria-label="Apply promo code"
           className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Apply Code
          </button>
        </div>
      </div>
    </div>
  );
}
