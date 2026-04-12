// Imports
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";

// Interfaces
interface CartItemProps {
  item: any;
  handleQuantityChange: (productId: string, quantity: number) => void;
  handleRemove: (productId: string) => void;
}

// Main Page
export default function CartItem({
  item,
  handleQuantityChange,
  handleRemove,
}: CartItemProps) {
  // Fallback image
  const fallbackImage = "/placeholder.png";

  return (
    <div
      key={item.product.id}
      className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={
            item.product.images?.[0] || item.product.thumbnail || fallbackImage
          }
          alt={item.product.title || "Product image"}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.product.id}`}
          className="text-lg font-semibold text-blue-600 hover:text-blue-600 line-clamp-2"
        >
          {item.product.title}
        </Link>
        <p className="text-sm text-gray-500 mt-1">${item.product.price}</p>
      </div>

      {/* Quantity & Price */}
      <div className="flex flex-col items-end gap-4">
        <div className="text-lg font-semibold text-blue-600">
          ${(item.product.price * item.quantity).toFixed(2)}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 border rounded-lg p-1">
          {/* Decrease quantity button */}
          <button
            onClick={() =>
              handleQuantityChange(item.product.id, item.quantity - 1)
            }
            aria-label="Decrease quantity" // Accessible label for screen readers
            disabled={item.quantity === 1} // Prevent going below 1
            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" /> {/* Minus icon */}
          </button>

          {/* Quantity display */}
          <span
            aria-live="polite" // Notify screen readers on change
            className="w-8 text-center font-semibold"
          >
            {item.quantity}
          </span>

          {/* Increase quantity button */}
          <button
            onClick={() =>
              handleQuantityChange(item.product.id, item.quantity + 1)
            }
            aria-label="Increase quantity" // Accessible label for screen readers
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> {/* Plus icon */}
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => handleRemove(item.product.id)}
          aria-label="Remove product from cart"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
