"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle, Clock, Package } from "lucide-react";
import { getOrder, type ApiRecord } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function OrderTrackingPageContent() {
  const { user, isAuthenticated } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<ApiRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setError("Sign in to securely view your order.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOrder(await getOrder(orderId.trim()));
    } catch (cause) {
      setOrder(null);
      setError(cause instanceof Error ? cause.message : "Could not find this order.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Order placed", complete: Boolean(order) },
    { title: "Payment received", complete: Boolean(order?.isPaid) },
    { title: "Delivered", complete: Boolean(order?.isDelivered) },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">Track Your Order</h1>
        </div>
      </section>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={trackOrder} className="rounded-lg border p-8 shadow-sm">
          <p className="text-gray-600 mb-6">
            Enter your order ID to view its current status.
          </p>
          <label className="block mb-4">
            <span className="block text-sm font-medium mb-2">Order ID</span>
            <input
              required
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            />
          </label>
          {isAuthenticated ? (
            <p className="text-sm text-gray-500 mb-5">
              Looking up orders for {String(user?.email ?? "your account")}.
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-5">
              <Link href="/login?next=%2Forder-tracking" className="text-blue-600 underline">
                Sign in
              </Link>{" "}
              to continue.
            </p>
          )}
          {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
          <button
            disabled={loading || !isAuthenticated}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Looking up order..." : "Track Order"}
          </button>
        </form>

        {order && (
          <section className="mt-8 rounded-lg bg-blue-50 p-8">
            <h2 className="text-2xl font-bold text-blue-600">
              Order {String(order._id)}
            </h2>
            <p className="text-gray-600 mt-1">
              Placed {new Date(String(order.createdAt ?? "")).toLocaleDateString()}
            </p>
            <p className="mt-4 font-medium">
              Cash on Delivery · ${Number(order.totalOrderPrice ?? 0).toFixed(2)}
            </p>
            <div className="mt-8 space-y-6">
              {steps.map((step, index) => {
                const Icon = index === 0 ? Package : index === 1 ? Clock : CheckCircle;
                return (
                  <div key={step.title} className="flex items-center gap-4">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      step.complete ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={step.complete ? "font-semibold text-blue-600" : "text-gray-500"}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <Link href="/orders" className="mt-8 inline-block text-blue-600 underline">
              View all orders
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
