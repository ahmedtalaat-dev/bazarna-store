// Imports
import Image from "next/image";

// Props interface
interface OrderSummaryProps {
  cart: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Main Page
export default function CheckoutOrderSummary({
  cart,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    // Sidebar container
    <div className="lg:col-span-1">
      {/* Sticky card */}
      <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
        {/* Title */}
        <h2 className="text-xl font-bold text-blue-600 mb-6">Order Summary</h2>

        {/* Cart items list */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {cart.map((item) => (
            // Single item
            <div
              key={item.product.id}
              className="flex gap-3 pb-4 border-b last:border-b-0"
            >
              {/* Product image */}
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                <Image
                  src={item.product.thumbnail || "/placeholder.png"}
                  alt={item.product.title || "Product"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                {/* Product title */}
                <p className="font-semibold text-blue-600 text-sm line-clamp-1">
                  {item.product.title}
                </p>

                {/* Quantity */}
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>

                {/* Item total price */}
                <p className="font-semibold text-blue-600 text-sm">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals section */}
        <div className="space-y-4 pb-6 border-b">
          {/* Subtotal */}
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span
              className={
                shipping === 0 ? "text-green-600 font-medium" : "" // highlight free
              }
            >
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Final total */}
        <div className="flex justify-between mt-6">
          <span className="text-lg font-bold text-blue-600">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
