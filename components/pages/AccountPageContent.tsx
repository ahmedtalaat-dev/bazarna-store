"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  addAddress,
  getAddresses,
  getOrders,
  removeAddress,
  updateProfile,
  type ApiRecord,
} from "@/lib/api";

type AccountTab = "profile" | "orders" | "addresses";

export default function AccountPageContent() {
  const { user, isAuthenticated, loading, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [orders, setOrders] = useState<ApiRecord[]>([]);
  const [addresses, setAddresses] = useState<ApiRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({
    alias: "",
    details: "",
    phone: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: String(user.name ?? ""),
      email: String(user.email ?? ""),
      phone: String(user.phone ?? ""),
    });
    Promise.all([getOrders(), getAddresses()])
      .then(([ordersData, addressData]) => {
        setOrders(ordersData);
        setAddresses(addressData);
      })
      .catch((error: unknown) =>
        console.error("Could not load account information.", error),
      );
  }, [user]);

  const submitProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updates: ApiRecord = { name: profile.name, phone: profile.phone };
      if (profile.email !== String(user?.email ?? "")) {
        updates.email = profile.email;
      }
      await updateProfile(updates);
      await refreshUser();
      addToast("Profile updated.", "success");
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Could not update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const submitAddress = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await addAddress(address);
      setAddresses(await getAddresses());
      setAddress({ alias: "", details: "", phone: "", city: "", postalCode: "" });
      addToast("Address saved.", "success");
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Could not save address.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await removeAddress(id);
      setAddresses((items) => items.filter((item) => String(item._id) !== id));
      addToast("Address removed.", "info");
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Could not remove address.", "error");
    }
  };

  if (loading) {
    return <p className="min-h-screen flex items-center justify-center">Loading account...</p>;
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-blue-600">Sign in to your account</h1>
        <Link href="/login?next=%2Faccount" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Sign In
        </Link>
      </div>
    );
  }

  const tabs: { id: AccountTab; label: string }[] = [
    { id: "profile", label: "Profile Information" },
    { id: "orders", label: "Order History" },
    { id: "addresses", label: "Saved Addresses" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-blue-600">My Account</h1>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8 flex-col md:flex-row">
          <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <Link href="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              Profile Page
            </Link>
            <Link href="/orders" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              All Orders
            </Link>
          </aside>

          <div className="flex-1">
            {activeTab === "profile" && (
              <form onSubmit={submitProfile} className="bg-gray-50 rounded-lg p-8 space-y-5">
                <h2 className="text-2xl font-bold text-blue-600">Profile Information</h2>
                {(["name", "email", "phone"] as const).map((field) => (
                  <label key={field} className="block">
                    <span className="block text-sm text-gray-600 mb-2 capitalize">{field}</span>
                    <input
                      type={field === "email" ? "email" : "text"}
                      required={field !== "phone"}
                      value={profile[field]}
                      onChange={(event) =>
                        setProfile((previous) => ({
                          ...previous,
                          [field]: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </label>
                ))}
                <button disabled={saving} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                  {saving ? "Saving..." : "Save Profile"}
                </button>
                <p className="text-sm text-gray-600">
                  Signed in as {String(user?.role ?? "user")}.
                </p>
              </form>
            )}

            {activeTab === "orders" && (
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-blue-600">Order History</h2>
                  <Link href="/orders" className="text-blue-600 hover:underline">View all</Link>
                </div>
                {orders.length ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <Link
                        key={String(order._id)}
                        href={`/orders?id=${encodeURIComponent(String(order._id))}`}
                        className="bg-white rounded-lg p-6 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-semibold text-blue-600">{String(order._id)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(String(order.createdAt ?? "")).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">${Number(order.totalOrderPrice ?? 0).toFixed(2)}</p>
                          <span className="text-sm text-gray-600">
                            {order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Processing"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">You have no orders yet.</p>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Saved Addresses</h2>
                <form onSubmit={submitAddress} className="grid md:grid-cols-2 gap-3 mb-8">
                  {(["alias", "details", "phone", "city", "postalCode"] as const).map((field) => (
                    <input
                      key={field}
                      required
                      aria-label={field}
                      placeholder={field === "postalCode" ? "Postal code" : field[0].toUpperCase() + field.slice(1)}
                      value={address[field]}
                      onChange={(event) =>
                        setAddress((previous) => ({
                          ...previous,
                          [field]: event.target.value,
                        }))
                      }
                      className="rounded-lg border px-4 py-3"
                    />
                  ))}
                  <button disabled={saving} className="px-4 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                    Add Address
                  </button>
                </form>
                <div className="space-y-4">
                  {addresses.map((item) => (
                    <div key={String(item._id)} className="bg-white rounded-lg p-6 flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 mt-1 text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-600">{String(item.alias ?? "Address")}</p>
                          <p className="text-gray-600">{String(item.details ?? "")}</p>
                          <p className="text-gray-600">{String(item.city ?? "")} {String(item.postalCode ?? "")}</p>
                          <p className="text-gray-600">{String(item.phone ?? "")}</p>
                        </div>
                      </div>
                      <button onClick={() => void deleteAddress(String(item._id))} className="text-red-600">
                        Remove
                      </button>
                    </div>
                  ))}
                  {!addresses.length && <p className="text-gray-600">No saved addresses yet.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
