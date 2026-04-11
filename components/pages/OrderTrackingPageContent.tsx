"use client";

// Imports
import { useState } from "react";
import { Truck, Package, CheckCircle, Clock } from "lucide-react";

// Main Page
export default function OrderTrackingPageContent() {
  // States
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderFound, setOrderFound] = useState(false);

  // Mock data
  const mockOrders: Record<string, any> = {
    "ORD-001": {
      email: "ahmed@gmail.com",
      status: "delivered",
      date: "2024-02-15",
      estimatedDelivery: "2025-07-18",
      items: ["Premium Wireless Headphones"],
    },
    "ORD-002": {
      email: "omar@gmail.com",
      status: "shipped",
      date: "2024-02-18",
      estimatedDelivery: "2025-11-21",
      items: ["Ultra Slim Laptop"],
    },
    "ORD-003": {
      email: "ali@gmail.com",
      status: "processing",
      date: "2024-02-20",
      estimatedDelivery: "2025-12-24",
      items: ["Minimalist Watch", "USB-C Hub"],
    },
  };

  // Handle form submit (track order)
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();

    const order = mockOrders[orderId];

    // Check if order exists and email matches
    if (order && order.email === email) {
      setOrderFound(true);
      setSubmitted(true);
    } else {
      setOrderFound(false);
      setSubmitted(true);

      // Reset error after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  // Generate tracking steps based on order status
  const getStatusSteps = (status: string) => {
    // All possible steps
    const steps = [
      { name: "Processing", icon: Clock, status: "processing" },
      { name: "Shipped", icon: Truck, status: "shipped" },
      { name: "Out for Delivery", icon: Package, status: "out-for-delivery" },
      { name: "Delivered", icon: CheckCircle, status: "delivered" },
    ];

    // Map status to step index
    const statusMap = {
      processing: 0,
      shipped: 1,
      "out-for-delivery": 2,
      delivered: 3,
    };

    // Get current step index
    const currentStep = statusMap[status as keyof typeof statusMap] ?? 0;

    // Add completed/current flags
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStep,
      current: index === currentStep,
    }));
  };

  // Order is found
  if (submitted && orderFound) {
    const order = mockOrders[orderId];
    const statusSteps = getStatusSteps(order.status);

    return (
      <div className="min-h-screen bg-white">
        {/* Page header */}
        <section className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-blue-600">Order Tracking</h1>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Order summary */}
          <div className="bg-blue-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{orderId}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Order date */}
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-blue-600">{order.date}</p>
              </div>

              {/* Delivery date */}
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-semibold text-blue-600">
                  {order.estimatedDelivery}
                </p>
              </div>

              {/* Items count */}
              <div>
                <p className="text-sm text-gray-600">Items</p>
                <p className="font-semibold text-blue-600">
                  {order.items.length}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-blue-600 capitalize">
                  {order.status.replace("-", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-blue-600 mb-8">
              Delivery Status
            </h3>

            <div className="space-y-8">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex gap-6">
                  {/* Timeline icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.completed
                          ? step.current
                            ? "bg-blue-600 text-white"
                            : "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <step.icon aria-hidden="true" className="w-6 h-6" />
                    </div>

                    {/* Line between steps */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`w-1 flex-1 mt-2 ${
                          step.completed ? "bg-green-600" : "bg-gray-200"
                        }`}
                        style={{ minHeight: "80px" }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="pb-8 pt-2">
                    <h4
                      className={`text-lg font-semibold mb-1 ${
                        step.completed ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </h4>

                    <p className="text-gray-600">
                      {step.current && "Your order is on the way!"}
                      {step.completed && !step.current && "Completed"}
                      {!step.completed && "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items list */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-blue-600 mb-6">
              Items in This Order
            </h3>

            <div className="space-y-4">
              {order.items.map((item: string, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 flex items-center justify-between"
                >
                  <span className="font-medium text-blue-600">{item}</span>
                  <CheckCircle
                    aria-hidden="true"
                    className="w-5 h-5 text-green-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Page
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">Track Your Order</h1>
        </div>
      </section>

      {/* Form container */}
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 mb-8 text-center">
            Enter your order ID and email address to track your order.
          </p>

          {/* Tracking form */}
          <form onSubmit={handleTrack} className="space-y-6">
            {/* Order ID input */}
            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-semibold text-blue-600 mb-2"
              >
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="e.g., ORD-001"
                className="w-full px-4 py-3 rounded-lg outline-none ring-gray-500 ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-blue-600 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg outline-none ring-gray-500 ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Error message */}
            {submitted && !orderFound && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">
                  Order not found. Please check your data.
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Track Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
