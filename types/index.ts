import { LucideIcon } from "lucide-react";
import type { CartItem as CartLine } from "@/contexts/EcommerceContext";
import type { CartItem } from "@/contexts/EcommerceContext";
import { FormEvent } from "react";

// Product interface
export interface Product {
  id: string;
  title: string;
  imageCover: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryId?: string;
  brandId?: string;
  rating: number;
  reviews: Review[];
  description: string;
  brand?: string;
  stock?: number;
  colors?: string[];
  sizes?: string[];
  sku?: string;
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
  ratingsAverage: number;
  sold: number;
}

// Reviews interface
export interface Review {
  id?: string;
  userId?: string;
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}

// Features interface
export interface Feature {
  title: string;
  description: string;
  points: string[];
}

// Testimonial interface
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  text: string;
  rating: number;
}

// Values interface
export interface Values {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Cart Item interface
export interface CartItemProps {
  item: CartLine;
  handleQuantityChange: (productId: string, quantity: number) => void;
  handleRemove: (productId: string) => void;
}

// Checkout form data interface
export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

// Checkout Form Props interface
export interface CheckoutFormProps {
  formData: CheckoutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Order Summary Props interface
export interface OrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Order Placed Props interface
export interface OrderPlacedProps {
  orderId: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Order Summary Props interfaces
export interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Shipping Form interface
export interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

// Product Card Props interface
export interface ProductCardProps {
  product: Product;
  isQuickViewOpen?: boolean;
  onQuickView?: (product: Product) => void;
}

// Image Gallery interface
export interface ImageGalleryProps {
  images: string[];
  productName: string;
}

// Filter Options interface
export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  rating?: number;
  color?: string;
}

// Product Filters Props interface
export interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  onReset: () => void;
}

// Stat Props interface
export interface StatProps {
  value: number | string;
  suffix?: string;
  label: string;
}

// Pagination interface
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Search Toast interface
export interface SearchToastProps {
  open: boolean;
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
