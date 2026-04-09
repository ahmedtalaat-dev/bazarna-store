import Link from "next/link";
import { Check } from "lucide-react";

// Props interface
interface OrderPlacedProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Main component
export default function OrderPlaced({
  subtotal,
  shipping,
  tax,
  total,
}: OrderPlacedProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Centered content */}
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">

        {/* Success icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Order Confirmed!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been placed
          successfully.
        </p>

        {/* Order details card */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
          
          {/* Order ID label */}
          <p className="text-gray-600 mb-2">Order ID:</p>

          {/* Generated Random Order ID */}
          <p className="text-2xl font-bold text-blue-600 mb-6">
            #ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>

          {/* Info message */}
          <p className="text-gray-600 mb-4 pb-4 border-b">
            You will receive a confirmation email shortly with tracking
            information.
          </p>

          {/* Price details */}
          <div className="space-y-2">
            
            {/* Subtotal */}
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            {/* Tax */}
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">
                ${tax.toFixed(2)}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          
          {/* Track order */}
          <Link
            href="/order-tracking"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-center"
          >
            Track Order
          </Link>

          {/* Continue shopping */}
          <Link
            href="/shop"
            className="flex-1 px-6 py-3 border border-gray-300 text-blue-600 rounded-lg hover:bg-gray-50 font-medium transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}