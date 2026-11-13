"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOrder, getOrders, type ApiRecord } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const asRecord = (value: unknown): ApiRecord =>
  value && typeof value === "object" ? (value as ApiRecord) : {};

export default function OrdersPageContent() {
  const searchParams = useSearchParams();
  const selectedOrderId = searchParams.get("id");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ApiRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ApiRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    let active = true;
    Promise.resolve()
      .then(() => {
        if (!active) return undefined;
        setLoading(true);
        setError(null);
        return Promise.all([
          getOrders("?limit=50&sort=-createdAt"),
          selectedOrderId ? getOrder(selectedOrderId) : Promise.resolve(null),
        ]);
      })
      .then((response) => {
        if (!active || !response) return;
        const [ordersData, orderData] = response;
        setOrders(ordersData);
        setSelectedOrder(orderData);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "Could not load your orders.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, selectedOrderId]);

  if (authLoading) {
    return <p className="min-h-[60vh] flex items-center justify-center">Loading orders...</p>;
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-blue-600">Your Orders</h1>
        <p className="text-gray-600">Sign in to view your orders.</p>
        <Link href="/login?next=%2Forders" className="rounded-lg bg-blue-600 px-6 py-3 text-white">
          Sign In
        </Link>
      </div>
    );
  }
  if (loading) {
    return <p className="min-h-[60vh] flex items-center justify-center">Loading orders...</p>;
  }

  const activeOrder = selectedOrder ?? undefined;
  const rawItems = Array.isArray(activeOrder?.cartItems)
    ? activeOrder.cartItems
    : [];
  const shippingAddress = asRecord(activeOrder?.shippingAddress);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">My Orders</h1>
          <p className="text-gray-600 mt-2">Review your order history and details.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && <p role="alert" className="mb-6 text-red-600">{error}</p>}
        {activeOrder && (
          <section className="mb-10 rounded-lg border bg-gray-50 p-6">
            <div className="flex flex-wrap justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold text-blue-600">
                  Order {String(activeOrder._id)}
                </h2>
                <p className="text-gray-600">
                  {new Date(String(activeOrder.createdAt ?? "")).toLocaleString()}
                </p>
              </div>
              <p className="font-semibold text-blue-600">
                {activeOrder.isDelivered ? "Delivered" : activeOrder.isPaid ? "Paid" : "Processing"}
              </p>
            </div>
            <p className="mb-4 text-gray-700">
              Cash on Delivery · ${Number(activeOrder.totalOrderPrice ?? 0).toFixed(2)}
            </p>
            <p className="mb-5 text-gray-600">
              Ship to: {String(shippingAddress.details ?? "")}, {String(shippingAddress.city ?? "")}
            </p>
            <div className="space-y-3">
              {rawItems.map((value, index) => {
                const item = asRecord(value);
                const product = asRecord(item.product);
                const image =
                  typeof product.imageCover === "string"
                    ? product.imageCover
                    : "/placeholder.png";
                return (
                  <div key={String(item._id ?? index)} className="flex items-center gap-4 bg-white p-3 rounded-lg">
                    <Image
                      src={image}
                      alt={String(product.title ?? "Product")}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-blue-600">{String(product.title ?? "Product")}</p>
                      <p className="text-sm text-gray-500">Qty {Number(item.quantity ?? 0)}</p>
                    </div>
                    <p>${(Number(item.price ?? 0) * Number(item.quantity ?? 0)).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {orders.length ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = Array.isArray(order.cartItems) ? order.cartItems : [];
              const selected = String(order._id) === selectedOrderId;
              return (
                <Link
                  key={String(order._id)}
                  href={`/orders?id=${encodeURIComponent(String(order._id))}`}
                  aria-current={selected ? "page" : undefined}
                  className={`block rounded-lg border p-6 hover:shadow-md ${
                    selected ? "border-blue-600 bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-blue-600">#{String(order._id)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(String(order.createdAt ?? "")).toLocaleDateString()} · {items.length} item{items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${Number(order.totalOrderPrice ?? 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Cash on Delivery</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Processing"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : !error ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">No orders yet</h2>
            <Link href="/shop" className="text-blue-600 hover:underline">Browse products</Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
