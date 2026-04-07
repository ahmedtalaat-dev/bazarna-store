export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  reviews: Review[];
  description: string;
  brand?: string;
  stock?: number;
  sku?: string;
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
}

export interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}

export const categories = ['All', 'Electronics', 'Computers', 'Accessories', 'Furniture', 'Storage'];

export const testimonials = [
  {
    id: '1',
    author: 'Ahmed Ali',
    role: 'Product Designer',
    text: 'The quality and customer service are exceptional. I have become a loyal customer.',
    avatar: '/review 1.webp',
    rating: 5,
  },
  {
    id: '2',
    author: 'Omar Mohamed',
    role: 'Tech Entrepreneur',
    text: 'Best online shopping experience I have had. Fast shipping and great prices.',
    avatar: '/review 2.webp',
    rating: 5,
  },
  {
    id: '3',
    author: 'Abdullah Saad',
    role: 'Content Creator',
    text: 'High quality products at competitive prices. Highly recommended!',
    avatar: '/review 3.webp',
    rating: 4,
  },
];
