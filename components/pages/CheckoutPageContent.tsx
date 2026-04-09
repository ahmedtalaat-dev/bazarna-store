"use client";

// Imports
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useEcommerce } from "@/contexts/EcommerceContext";
import CheckoutForm from "@/components/cart-checkout/CheckoutForm";
import PaymentForm from "@/components/cart-checkout/PaymentForm";
import CheckoutOrderSummary from "@/components/cart-checkout/CheckoutOrderSummary";
import OrderPlaced from "@/components/cart-checkout/OrderPlaced";

export default function CheckoutPageContent() {
  // Get cart data and toast notifications
  const { cart, cartTotal, clearCart } = useEcommerce();
  const { addToast } = useToast();

  // States
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
  });

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shipping + tax;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !formData.cardNumber ||
        !formData.cardName ||
        !formData.cardExpiry ||
        !formData.cardCVC
      ) {
        addToast("Please fill in all payment details", "error");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      setOrderPlaced(true);
      setIsProcessing(false);
      addToast("Order placed successfully!", "success");
    }, 2000);
  };

  // Show empty cart message if cart is empty
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add items to your cart before checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Show order confirmation page
  if (orderPlaced) {
    return (
      <OrderPlaced
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        total={total}
      />
    );
  }

  // Main checkout page
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">Checkout</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <CheckoutForm
                formData={formData}
                handleInputChange={handleInputChange}
                isProcessing={isProcessing}
              />

              {/* Payment Method */}
              <PaymentForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                formData={{
                  cardName: formData.cardName,
                  cardNumber: formData.cardNumber,
                  cardExpiry: formData.cardExpiry,
                  cardCVC: formData.cardCVC,
                }}
                handleInputChange={handleInputChange}
              />

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition-colors"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <CheckoutOrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
