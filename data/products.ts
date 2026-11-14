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
}

// Reviews interface
export interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}
