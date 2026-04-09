"use client";

// Imports
import { MapPin } from "lucide-react";
import { useState } from "react";

// Interfaces
interface Address {
  type: string;
  street: string;
  city: string;
  default: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface UserInfo {
  label: string;
  value: string;
}

// Account Page
export default function AccountPageContent() {
  const [activeTab, setActiveTab] = useState("profile");

  // Addresses data
  const addresses: Address[] = [
    {
      type: "Home",
      street: "123 Main St, Apt 4B",
      city: "New York, NY 10001",
      default: true,
    },
    {
      type: "Office",
      street: "456 Business Ave",
      city: "San Francisco, CA 94105",
      default: false,
    },
  ];

  // Orders data
  const orders: Order[] = [
    {
      id: "ORD-001",
      date: "2026-02-15",
      total: 299.99,
      status: "Delivered",
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2026-02-10",
      total: 1299.0,
      status: "Delivered",
      items: 1,
    },
    {
      id: "ORD-003",
      date: "2026-01-28",
      total: 149.99,
      status: "Canceled",
      items: 1,
    },
  ];

  // User data
  const userInfo: UserInfo[] = [
    { label: "Full Name", value: "Ahmed Talaat" },
    { label: "Email Address", value: "ahmed@gmail.com" },
    { label: "Phone Number", value: "+20 1104894017" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">My Account</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="space-y-2">
              {/* Profile Information Tab Button */}
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Profile Information
              </button>
              {/* Order History Tab Button */}
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "orders"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Order History
              </button>
              {/* Saved Addresses Tab Button */}
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "addresses"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Saved Addresses
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-8">
                  Profile Information
                </h2>

                <div className="space-y-6 max-w-2xl">
                  {userInfo.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-6">
                      <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                      <p className="text-xl font-semibold text-blue-600">
                        {item.value}
                      </p>
                    </div>
                  ))}
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === "orders" && (
              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-8">
                  Order History
                </h2>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg p-6 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-blue-600 mb-1">
                          {order.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.date} • {order.items} item
                          {order.items > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600 mb-1">
                          ${order.total}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            order.status.toLowerCase() === "delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-blue-600">
                    Saved Addresses
                  </h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Add New Address
                  </button>
                </div>

                <div className="space-y-4 max-w-2xl">
                  {addresses.map((address, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded-lg p-6 border-l-4 ${
                        address.default ? "border-blue-600" : "border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <MapPin
                            className={`w-5 h-5 flex-shrink-0 mt-1 ${
                              address.default
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                          <div>
                            <p className="font-semibold text-blue-600 mb-1">
                              {address.type}
                            </p>
                            <p className="text-gray-600">{address.street}</p>
                            <p className="text-gray-600">{address.city}</p>
                          </div>
                        </div>
                        {address.default && (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <button aria-label="Edit address" className="text-blue-600 hover:text-blue-700 font-medium">
                          Edit
                        </button>
                        <button aria-label="Delete address" className="text-red-600 hover:text-red-700 font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
