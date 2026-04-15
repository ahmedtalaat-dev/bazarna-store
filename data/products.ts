// Product interface
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

// Reviews interface
export interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
}

// Testimonial interface
interface Testimonial {
  id: string;
  author: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

// Testimonials data
export const testimonials: Testimonial[] = [
  {
    id: '1',
    author: 'Ahmed Ali',
    role: 'Product Designer',
    text: 'The quality and customer service are exceptional. I have become a loyal customer.',
    avatar: '/reviews/review 1.webp',
    rating: 5,
  },
  {
    id: '2',
    author: 'Omar Mohamed',
    role: 'Tech Entrepreneur',
    text: 'Best online shopping experience I have had. Fast shipping and great prices.',
    avatar: '/reviews/review 2.webp',
    rating: 5,
  },
  {
    id: '3',
    author: 'Abdullah Saad',
    role: 'Content Creator',
    text: 'High quality products at competitive prices. Highly recommended!',
    avatar: '/reviews/review 3.webp',
    rating: 4,
  },
];
