"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useEcommerce } from "@/contexts/EcommerceContext";
import { useAuth } from "@/contexts/AuthContext";
import { createCashOrder } from "@/lib/api";
import CheckoutForm from "@/components/cart-checkout/CheckoutForm";
import PaymentForm from "@/components/cart-checkout/PaymentForm";
import CheckoutOrderSummary from "@/components/cart-checkout/CheckoutOrderSummary";
import OrderPlaced from "@/components/cart-checkout/OrderPlaced";

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function CheckoutPageContent() {
  const router = useRouter();
  const {
    cart,
    cartId,
    cartTotal,
    cartDiscountedTotal,
    refreshCommerce,
    loading: commerceLoading,
  } = useEcommerce();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [confirmedTotals, setConfirmedTotals] = useState<{
    subtotal: number;
    total: number;
  } | null>(null);
  const [formData, setFormData] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!user) return;
    const nameParts = String(user.name ?? "").split(" ");
    setFormData((previous) => ({
      ...previous,
      firstName: previous.firstName || nameParts[0] || "",
      lastName: previous.lastName || nameParts.slice(1).join(" "),
      email: previous.email || String(user.email ?? ""),
      phone: previous.phone || String(user.phone ?? ""),
    }));
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=%2Fcheckout");
    }
  }, [authLoading, user, router]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cartId || cart.length === 0) {
      addToast("Your cart is empty or not synchronized. Please review it before checkout.", "error");
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const subtotal = cartTotal;
      const total = cartDiscountedTotal ?? subtotal;
      const payload = await createCashOrder(cartId, {
        details: `${formData.firstName} ${formData.lastName}`.trim()
          ? `${formData.firstName} ${formData.lastName}: ${formData.address}`
          : formData.address,
        phone: formData.phone,
        city: formData.city,
        postalCode: formData.postalCode,
      });
      const order = payload.data as Record<string, unknown> | undefined;
      const createdOrderId = String(order?._id ?? "");
      if (!createdOrderId) {
        throw new Error("The API did not return the created order.");
      }
      setConfirmedTotals({ subtotal, total });
      setOrderId(createdOrderId);
      await refreshCommerce();
      addToast("Order placed successfully!", "success");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Could not place your order.",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderId && confirmedTotals) {
    return (
      <OrderPlaced
        orderId={orderId}
        subtotal={confirmedTotals.subtotal}
        shipping={0}
        tax={0}
        total={confirmedTotals.total}
      />
    );
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Preparing checkout...</p>
      </div>
    );
  }

  if (!cart.length && commerceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Syncing your cart...</p>
      </div>
    );
  }

  if (!cart.length) {
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
            <ArrowLeft aria-hidden="true" className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cartTotal;
  const total = cartDiscountedTotal ?? subtotal;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">Checkout</h1>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <CheckoutForm
                formData={formData}
                handleInputChange={handleInputChange}
              />
              <PaymentForm />
              <button
                type="submit"
                disabled={isProcessing || !cartId}
                aria-busy={isProcessing}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition-colors"
              >
                {isProcessing ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
          <CheckoutOrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={0}
            tax={0}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
