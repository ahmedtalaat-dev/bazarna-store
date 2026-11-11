import type { Product, Review } from "@/data/products";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://bazarna-store-api.vercel.app/api/v1"
).replace(/\/$/, "");

const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_URL ||
  API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export type ApiRecord = Record<string, unknown>;

export interface ProductPage {
  products: Product[];
  page: number;
  limit: number;
  totalPages: number;
  count: number;
}

export interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export const getAuthToken = () =>
  typeof window === "undefined" ? null : window.localStorage.getItem("token");

const toRecord = (value: unknown): ApiRecord =>
  value && typeof value === "object" ? (value as ApiRecord) : {};

const assetUrl = (value: unknown) => {
  if (typeof value !== "string" || !value) return "/placeholder.png";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;
  return `${ASSET_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
};

const normalizeReview = (value: unknown, index: number): Review => {
  const review = toRecord(value);
  const user = toRecord(review.user);
  const createdAt =
    typeof review.createdAt === "string" ? review.createdAt : undefined;

  return {
    rating: Number(review.ratings ?? review.rating ?? 0),
    comment: String(review.comment ?? review.title ?? ""),
    reviewerName: String(
      user.name ?? review.reviewerName ?? `Customer ${index + 1}`,
    ),
    date: createdAt
      ? new Date(createdAt).toLocaleDateString()
      : String(review.date ?? ""),
  };
};

export const normalizeProduct = (value: unknown): Product => {
  const raw = toRecord(value);
  const category = toRecord(raw.category);
  const brand = toRecord(raw.brand);
  const rawReviews = Array.isArray(raw.reviews) ? raw.reviews : [];
  const reviews = rawReviews.map(normalizeReview);
  const originalPrice = Number(raw.price ?? 0);
  const salePrice = Number(raw.priceAfterDiscount ?? 0);
  const imageList = Array.isArray(raw.images)
    ? raw.images.map(assetUrl)
    : [];
  const rawCover = Array.isArray(raw.images) ? raw.images[0] : undefined;
  const cover = assetUrl(raw.imageCover ?? raw.imageCover ?? rawCover);
  const rawRating = Number(raw.ratingsAverage ?? raw.rating ?? 0);
  const reviewsRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length
    : 0;

  return {
    id: String(raw._id ?? raw.id ?? ""),
    title: String(raw.title ?? "Untitled product"),
    imageCover: cover,
    price: salePrice > 0 && salePrice < originalPrice ? salePrice : originalPrice,
    originalPrice:
      salePrice > 0 && salePrice < originalPrice ? originalPrice : undefined,
    images: [cover, ...imageList.filter((image) => image !== cover)],
    category: String(category.name ?? raw.category ?? "Uncategorized"),
    categoryId: String(category._id ?? raw.categoryId ?? ""),
    rating:
      Number.isFinite(rawRating) && rawRating > 0 ? rawRating : reviewsRating,
    reviews,
    description: String(raw.description ?? ""),
    brand: String(brand.name ?? raw.brand ?? ""),
    brandId: String(brand._id ?? raw.brandId ?? ""),
    stock: Number(raw.quantity ?? raw.stock ?? 0),
    colors: Array.isArray(raw.colors)
      ? raw.colors.map(String)
      : [],
    sizes: Array.isArray(raw.sizes) ? raw.sizes.map(String) : [],
    sku: typeof raw.sku === "string" ? raw.sku : undefined,
    shippingInformation:
      typeof raw.shippingInformation === "string"
        ? raw.shippingInformation
        : undefined,
    warrantyInformation:
      typeof raw.warrantyInformation === "string"
        ? raw.warrantyInformation
        : undefined,
    returnPolicy:
      typeof raw.returnPolicy === "string" ? raw.returnPolicy : undefined,
  };
};

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  const response = await fetch(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
    {
      ...options,
      headers,
      body,
      cache: "no-store",
    },
  );

  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const data = toRecord(payload);
    const validationErrors = Array.isArray(data.errors)
      ? data.errors
          .map((item) => String(toRecord(item).msg ?? ""))
          .filter(Boolean)
          .join(", ")
      : "";
    throw new Error(
      String(data.message ?? validationErrors ?? "") ||
        `Request failed (${response.status})`,
    );
  }
  return payload as T;
}

const queryString = (
  query: Record<string, string | number | undefined>,
) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
};

export async function getProductPage(
  query: Record<string, string | number | undefined> = {},
): Promise<ProductPage> {
  const qs = queryString(query);
  const payload = toRecord(
    await apiRequest(`/products${qs ? `?${qs}` : ""}`),
  );
  const pagination = toRecord(payload.paginationResult);
  const items = Array.isArray(payload.data) ? payload.data : [];
  return {
    products: items.map(normalizeProduct),
    page: Number(pagination.currentPage ?? query.page ?? 1),
    limit: Number(pagination.limit ?? query.limit ?? 12),
    totalPages: Number(pagination.numberOfPages ?? 0),
    count: Number(payload.totalResults ?? payload.results ?? 0),
  };
}

export async function getProducts(
  query: Record<string, string | number | undefined> = {},
) {
  return (await getProductPage(query)).products;
}

export async function getProductById(id: string) {
  const payload = toRecord(await apiRequest(`/products/${encodeURIComponent(id)}`));
  return normalizeProduct(payload.data ?? payload);
}

export async function getCategories(query = "") {
  const payload = toRecord(await apiRequest(`/categories${query}`));
  return Array.isArray(payload.data) ? payload.data.map(toRecord) : [];
}

export async function getBrands(query = "") {
  const payload = toRecord(await apiRequest(`/brands${query}`));
  return Array.isArray(payload.data) ? payload.data.map(toRecord) : [];
}

export async function getReviews(productId?: string) {
  const path = productId
    ? `/products/${encodeURIComponent(productId)}/reviews`
    : "/reviews";
  const payload = toRecord(await apiRequest(path));
  return Array.isArray(payload.data)
    ? payload.data.map(normalizeReview)
    : [];
}

export async function login(email: string, password: string) {
  return apiRequest<ApiRecord>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function signup(
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
) {
  return apiRequest<ApiRecord>("/auth/signup", {
    method: "POST",
    body: { name, email, password, passwordConfirm },
  });
}

export async function forgotPassword(email: string) {
  return apiRequest<ApiRecord>("/auth/forgotPassword", {
    method: "POST",
    body: { email },
  });
}

export async function verifyResetCode(resetCode: string) {
  return apiRequest<ApiRecord>("/auth/verifyResetCode", {
    method: "POST",
    body: { resetCode },
  });
}

export async function resetPassword(
  email: string,
  newPassword: string,
) {
  return apiRequest<ApiRecord>("/auth/resetPassword", {
    method: "PUT",
    body: { email, newPassword },
  });
}

export async function getProfile() {
  const payload = toRecord(await apiRequest("/users/getMe"));
  return toRecord(payload.data);
}

export async function updateProfile(body: ApiRecord) {
  return apiRequest<ApiRecord>("/users/updateMe", {
    method: "PUT",
    body,
  });
}

export async function getCart() {
  return apiRequest<ApiRecord>("/cart");
}

export async function addCartItem(
  productId: string,
  color?: string,
  quantity = 1,
) {
  return apiRequest<ApiRecord>("/cart", {
    method: "POST",
    body: { productId, color, quantity },
  });
}

export async function updateCartItem(itemId: string, quantity: number) {
  return apiRequest<ApiRecord>(`/cart/${encodeURIComponent(itemId)}`, {
    method: "PUT",
    body: { quantity },
  });
}

export async function removeCartItem(itemId: string) {
  return apiRequest<ApiRecord>(`/cart/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });
}

export async function clearRemoteCart() {
  return apiRequest("/cart", { method: "DELETE" });
}

export async function applyCartCoupon(coupon: string) {
  return apiRequest<ApiRecord>("/cart/applyCoupon", {
    method: "PUT",
    body: { coupon },
  });
}

export async function getWishlist() {
  const payload = toRecord(await apiRequest("/wishlist"));
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function addWishlistItem(productId: string) {
  return apiRequest("/wishlist", {
    method: "POST",
    body: { productId },
  });
}

export async function removeWishlistItem(productId: string) {
  return apiRequest(`/wishlist/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

export async function getOrders(query = "") {
  const payload = toRecord(await apiRequest(`/orders${query}`));
  return Array.isArray(payload.data) ? payload.data.map(toRecord) : [];
}

export async function getOrder(id: string) {
  const payload = toRecord(await apiRequest(`/orders/${encodeURIComponent(id)}`));
  return toRecord(payload.data);
}

export async function createCashOrder(
  cartId: string,
  shippingAddress: ApiRecord,
) {
  return apiRequest<ApiRecord>(`/orders/${encodeURIComponent(cartId)}`, {
    method: "POST",
    body: { shippingAddress },
  });
}

export async function getAddresses() {
  const payload = toRecord(await apiRequest("/addresses"));
  return Array.isArray(payload.data) ? payload.data.map(toRecord) : [];
}

export async function addAddress(body: ApiRecord) {
  return apiRequest("/addresses", { method: "POST", body });
}

export async function removeAddress(id: string) {
  return apiRequest(`/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
