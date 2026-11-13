"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { apiRequest, type ApiRecord } from "@/lib/api";

type Section =
  | "users"
  | "products"
  | "categories"
  | "brands"
  | "subcategories"
  | "orders"
  | "coupons";

const sectionLabels: Record<Section, string> = {
  users: "Users",
  products: "Products",
  categories: "Categories",
  brands: "Brands",
  subcategories: "Subcategories",
  orders: "Orders",
  coupons: "Coupons",
};

const record = (value: unknown): ApiRecord =>
  value && typeof value === "object" ? (value as ApiRecord) : {};

const toId = (value: unknown) => {
  if (typeof value === "string") return value;
  return String(record(value)._id ?? "");
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const isManager = user?.role === "admin" || user?.role === "manager";
  const isAdmin = user?.role === "admin";
  const [section, setSection] = useState<Section>("products");
  const canDelete = isAdmin || section === "users" || section === "coupons";
  const [items, setItems] = useState<ApiRecord[]>([]);
  const [categories, setCategories] = useState<ApiRecord[]>([]);
  const [brands, setBrands] = useState<ApiRecord[]>([]);
  const [subcategories, setSubcategories] = useState<ApiRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<ApiRecord | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSection = useCallback(async () => {
    if (!isManager) return;
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        sort: "-createdAt",
      });
      if (search.trim()) query.set("keyword", search.trim());
      const response = record(
        await apiRequest(`/${section}?${query.toString()}`),
      );
      setItems(Array.isArray(response.data) ? response.data.map(record) : []);
      const pagination = record(response.paginationResult);
      setTotalPages(Math.max(1, Number(pagination.numberOfPages ?? 1)));
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not load this section.";
      setError(message);
      console.error(`Could not load admin ${section}.`, cause);
    }
  }, [isManager, page, search, section]);

  useEffect(() => {
    if (!isManager) return;
    void loadSection();
    Promise.all([
      apiRequest("/categories?limit=100"),
      apiRequest("/brands?limit=100"),
      apiRequest("/subcategories?limit=100"),
    ])
      .then(([categoryResponse, brandResponse, subcategoryResponse]) => {
        setCategories(
          Array.isArray(record(categoryResponse).data)
            ? (record(categoryResponse).data as unknown[]).map(record)
            : [],
        );
        setBrands(
          Array.isArray(record(brandResponse).data)
            ? (record(brandResponse).data as unknown[]).map(record)
            : [],
        );
        setSubcategories(
          Array.isArray(record(subcategoryResponse).data)
            ? (record(subcategoryResponse).data as unknown[]).map(record)
            : [],
        );
      })
      .catch((cause: unknown) =>
        console.error("Could not load admin category and brand choices.", cause),
      );
  }, [isManager, loadSection]);

  const fields = useMemo(() => {
    switch (section) {
      case "users":
        return [
          "name",
          "email",
          "phone",
          "role",
          ...(selected ? [] : ["password", "passwordConfirm"]),
        ];
      case "products":
        return [
          "title",
          "description",
          "price",
          "priceAfterDiscount",
          "quantity",
          "colors",
          "category",
          "subcategories",
          "brand",
        ];
      case "categories":
      case "brands":
        return ["name"];
      case "subcategories":
        return ["name", "category"];
      case "coupons":
        return ["name", "discount", "expire"];
      default:
        return [];
    }
  }, [section, selected]);

  const startCreate = () => {
    setSelected(null);
    setForm({});
    setImage(null);
    setProductImages([]);
  };

  const startEdit = (item: ApiRecord) => {
    setSelected(item);
    const category = record(item.category);
    const values: Record<string, string> = {};
    for (const field of fields) {
      const value = item[field];
      if (field === "category") values[field] = toId(value);
      else if (field === "brand") values[field] = toId(value);
      else if (field === "subcategories" && Array.isArray(value)) {
        values[field] = value.map(toId).join(",");
      } else if (field === "expire" && value) {
        values[field] = new Date(String(value)).toISOString().slice(0, 10);
      } else {
        values[field] = value === undefined ? "" : String(value);
      }
    }
    if (!values.category && category._id) values.category = String(category._id);
    setForm(values);
    setImage(null);
    setProductImages([]);
  };

  const submitEntity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const path =
        section === "products"
          ? "/products"
          : section === "categories"
            ? "/categories"
            : section === "brands"
              ? "/brands"
              : section === "subcategories"
                ? "/subcategories"
                : section === "users"
                  ? "/users"
                  : "/coupons";
      const body: Record<string, string | number | string[]> = {};
      for (const field of fields) {
        const value = form[field]?.trim();
        if (!value) continue;
        if (["price", "priceAfterDiscount", "quantity", "discount"].includes(field)) {
          body[field] = Number(value);
        } else if (field === "colors" || field === "subcategories") {
          body[field] = value.split(",").map((part) => part.trim()).filter(Boolean);
        } else {
          body[field] = value;
        }
      }

      const uploads = ["products", "categories", "brands"].includes(section);
      let requestBody: BodyInit | Record<string, unknown> = body;
      if (uploads) {
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((entry) => formData.append(key, entry));
          } else {
            formData.append(key, String(value));
          }
        });
        if (image) {
          formData.append(section === "products" ? "imageCover" : "image", image);
        }
        productImages.forEach((file) => formData.append("images", file));
        requestBody = formData;
      }
      if (section === "products" && !selected && !image) {
        throw new Error("Choose a cover image before creating a product.");
      }

      const itemId = selected?._id ? `/${encodeURIComponent(String(selected._id))}` : "";
      await apiRequest(`${path}${itemId}`, {
        method: selected ? "PUT" : "POST",
        body: requestBody,
      });
      addToast(selected ? "Record updated." : "Record created.", "success");
      setSelected(null);
      setForm({});
      setImage(null);
      setProductImages([]);
      await loadSection();
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not save this record.";
      setError(message);
      addToast(message, "error");
    } finally {
      setBusy(false);
    }
  };

  const deleteEntity = async (item: ApiRecord) => {
    if (!canDelete || !window.confirm("Delete this record? This cannot be undone.")) {
      return;
    }
    try {
      await apiRequest(
        `/${section}/${encodeURIComponent(String(item._id ?? ""))}`,
        { method: "DELETE" },
      );
      addToast("Record deleted.", "success");
      await loadSection();
    } catch (cause) {
      addToast(
        cause instanceof Error ? cause.message : "Could not delete this record.",
        "error",
      );
    }
  };

  const updateOrder = async (order: ApiRecord, action: "pay" | "deliver") => {
    try {
      await apiRequest(`/orders/${encodeURIComponent(String(order._id))}/${action}`, {
        method: "PUT",
      });
      addToast(`Order marked ${action === "pay" ? "paid" : "delivered"}.`, "success");
      await loadSection();
    } catch (cause) {
      addToast(
        cause instanceof Error ? cause.message : "Could not update this order.",
        "error",
      );
    }
  };

  if (authLoading) {
    return <p className="min-h-[60vh] flex items-center justify-center">Checking administrator access...</p>;
  }
  if (!isManager) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-bold text-blue-600">Administrator access required</h1>
        <p className="text-gray-600">Sign in with an administrator or manager account to continue.</p>
        <Link href="/login?next=%2Fadmin" className="rounded-lg bg-blue-600 px-6 py-3 text-white">
          Sign In
        </Link>
      </main>
    );
  }

  const setField = (field: string, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage store data and order fulfillment.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(sectionLabels) as Section[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSection(key);
                setPage(1);
                setSearch("");
                setSearchInput("");
                startCreate();
              }}
              className={`px-4 py-2 rounded-lg border ${
                section === key ? "bg-blue-600 text-white border-blue-600" : "text-blue-600"
              }`}
            >
              {sectionLabels[key]}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="mb-5 text-red-600">{error}</p>}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <h2 className="text-2xl font-bold text-blue-600">{sectionLabels[section]}</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setPage(1);
                  setSearch(searchInput);
                }}
                className="flex gap-2"
              >
                <input
                  aria-label={`Search ${sectionLabels[section].toLowerCase()}`}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search..."
                  className="rounded-lg border border-gray-400 outline-blue-600 focus:border-blue-600 px-3 py-2"
                />
                <button className="rounded-lg border px-4 py-2 bg-blue-600 text-white">Search</button>
              </form>
            </div>

            {section !== "orders" && (
              <button onClick={startCreate} className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white">
                Create {sectionLabels[section].slice(0, -1)}
              </button>
            )}

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Record</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const title = String(
                      item.title ?? item.name ?? item.email ?? item._id ?? "Record",
                    );
                    const details =
                      section === "orders"
                        ? `$${Number(item.totalOrderPrice ?? 0).toFixed(2)} · ${
                            item.isDelivered ? "Delivered" : item.isPaid ? "Paid" : "Processing"
                          }`
                        : section === "products"
                          ? `$${Number(item.priceAfterDiscount ?? item.price ?? 0)} · stock ${Number(item.quantity ?? 0)}`
                          : section === "users"
                            ? `${String(item.email ?? "")} · ${String(item.role ?? "user")}`
                            : section === "coupons"
                              ? `${Number(item.discount ?? 0)}% · expires ${String(item.expire ?? "")}`
                              : `ID: ${String(item._id ?? "")}`;
                    return (
                      <tr key={String(item._id)} className="border-t">
                        <td className="px-4 py-3 font-medium text-blue-600">{title}</td>
                        <td className="px-4 py-3 text-gray-600">{details}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {section === "orders" ? (
                              <>
                                {!item.isPaid && (
                                  <button onClick={() => void updateOrder(item, "pay")} className="text-blue-600">Mark paid</button>
                                )}
                                {!item.isDelivered && (
                                  <button onClick={() => void updateOrder(item, "deliver")} className="text-blue-600">Mark delivered</button>
                                )}
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(item)} className="text-blue-600">Edit</button>
                                {canDelete && (
                                  <button onClick={() => void deleteEntity(item)} className="text-red-600">Delete</button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!items.length && (
                    <tr><td className="px-4 py-8 text-center text-gray-500" colSpan={3}>No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded border px-3 py-2 disabled:opacity-50">Previous</button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded border px-3 py-2 disabled:opacity-50">Next</button>
            </div>
          </section>

          {section !== "orders" && (
            <form onSubmit={submitEntity} className="h-fit space-y-4 rounded-lg border bg-gray-50 p-5">
              <h2 className="text-xl font-bold text-blue-600">
                {selected ? "Edit" : "Create"} {sectionLabels[section].slice(0, -1)}
              </h2>
              {fields.map((field) => {
                if (field === "role") {
                  return (
                    <label key={field} className="block">
                      <span className="block text-sm font-medium mb-1">Role</span>
                      <select
                        value={form.role ?? "user"}
                        onChange={(event) => setField(field, event.target.value)}
                        className="w-full rounded-lg border bg-white px-3 py-2"
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>
                  );
                }
                if (field === "category" || field === "brand") {
                  const options = field === "category" ? categories : brands;
                  return (
                    <label key={field} className="block">
                      <span className="block text-sm font-medium mb-1 capitalize">{field}</span>
                      <select
                        required={field === "category"}
                        value={form[field] ?? ""}
                        onChange={(event) => setField(field, event.target.value)}
                        className="w-full rounded-lg border bg-white px-3 py-2"
                      >
                        <option value="">Select {field}</option>
                        {options.map((option) => (
                          <option key={String(option._id)} value={String(option._id)}>
                            {String(option.name ?? option._id)}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }
                if (field === "subcategories") {
                  return (
                    <label key={field} className="block">
                      <span className="block text-sm font-medium mb-1">Subcategories</span>
                      <select
                        multiple
                        value={(form[field] ?? "").split(",").filter(Boolean)}
                        onChange={(event) =>
                          setField(
                            field,
                            Array.from(event.target.selectedOptions)
                              .map((option) => option.value)
                              .join(","),
                          )
                        }
                        className="w-full rounded-lg border bg-white px-3 py-2"
                      >
                        {subcategories
                          .filter(
                            (subcategory) =>
                              !form.category ||
                              toId(subcategory.category) === form.category,
                          )
                          .map((subcategory) => (
                            <option
                              key={String(subcategory._id)}
                              value={String(subcategory._id)}
                            >
                              {String(subcategory.name ?? subcategory._id)}
                            </option>
                          ))}
                      </select>
                    </label>
                  );
                }
                return (
                  <label key={field} className="block">
                    <span className="block text-sm font-medium mb-1">
                      {field === "colors" ? "Colors (comma-separated)" : field}
                    </span>
                    {field === "description" ? (
                      <textarea
                        required={!selected}
                        value={form[field] ?? ""}
                        onChange={(event) => setField(field, event.target.value)}
                        rows={4}
                        className="w-full rounded-lg border bg-white px-3 py-2"
                      />
                    ) : (
                      <input
                        required={
                          !["phone", "priceAfterDiscount", "colors", "password"].includes(field) ||
                          (field === "password" && !selected)
                        }
                        type={
                          field === "password"
                            ? "password"
                            : ["price", "priceAfterDiscount", "quantity", "discount"].includes(field)
                              ? "number"
                              : field === "expire"
                                ? "date"
                                : field === "email"
                                  ? "email"
                                  : "text"
                        }
                        min={["quantity", "price", "discount"].includes(field) ? 0 : undefined}
                        value={form[field] ?? ""}
                        onChange={(event) => setField(field, event.target.value)}
                        className="w-full rounded-lg border bg-white px-3 py-2"
                      />
                    )}
                  </label>
                );
              })}

              {["categories", "brands", "products"].includes(section) && (
                <label className="block">
                  <span className="block text-sm font-medium mb-1">
                    {section === "products" ? "Cover image" : "Image"} {selected ? "(optional)" : ""}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    required={section === "products" && !selected}
                    onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                    className="w-full text-sm"
                  />
                </label>
              )}
              {section === "products" && (
                <label className="block">
                  <span className="block text-sm font-medium mb-1">Additional product images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => setProductImages(Array.from(event.target.files ?? []).slice(0, 5))}
                    className="w-full text-sm"
                  />
                </label>
              )}
              {section === "users" && (
                <p className="text-xs text-gray-500">The API allows managers/admins to assign user roles. Account status is not exposed by the current API.</p>
              )}
              <button
                disabled={busy}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                {busy ? "Saving..." : selected ? "Save Changes" : "Create"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
