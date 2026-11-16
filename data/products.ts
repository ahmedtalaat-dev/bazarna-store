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
