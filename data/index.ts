import { Feature, Testimonial, Values } from "../types/index";
import { Award, Users, Zap, Shield } from "lucide-react";

// Home Page
export const features: Feature[] = [
  {
    title: "Quality Assurance",
    description:
      "Every product in our store is carefully selected and tested to meet our high quality standards. We work directly with manufacturers to ensure authenticity.",
    points: [
      "Verified supplier partnerships",
      "Rigorous quality checks",
      "Authentic product guarantee",
    ],
  },
  {
    title: "Customer-First Service",
    description:
      "Your satisfaction is our top priority. Our dedicated customer support team is here to help you 24/7 with any questions or concerns.",
    points: [
      "24/7 customer support",
      "Easy returns & exchanges",
      "100% satisfaction guarantee",
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "Ahmed Ali",
    role: "Product Designer",
    text: "The quality and customer service are exceptional. I have become a loyal customer.",
    rating: 5,
  },
  {
    id: "2",
    author: "Omar Mohamed",
    role: "Tech Entrepreneur",
    text: "Best online shopping experience I have had. Fast shipping and great prices.",
    rating: 5,
  },
  {
    id: "3",
    author: "Abdullah Saad",
    role: "Content Creator",
    text: "High quality products at competitive prices. Highly recommended!",
    rating: 4,
  },
];

// About Page
export const values: Values[] = [
  {
    icon: Award,
    title: "Quality",
    description:
      "We only offer products that meet our strict quality standards.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Your satisfaction is our top priority in everything we do.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We stay ahead with the latest products and technologies.",
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Secure transactions and reliable service you can depend on.",
  },
];

export const storyParagraphs = [
  "Bazarna was founded in 2024 with a simple vision: to make premium technology products accessible to everyone. We started as a small team of tech enthusiasts passionate about quality and customer service.",
  "Today, we've grown into a trusted online retailer serving thousands of customers worldwide. We work directly with manufacturers to ensure authenticity and the best prices for our customers.",
  "Our commitment to excellence, combined with our customer-first approach, has made us one of the most trusted e-commerce platforms in the tech industry.",
];

// FAQ Page
export const faqs = [
  {
    id: "shipping",
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 2-3 business days. Express shipping is available for next-day delivery in select areas.",
  },
  {
    id: "return",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day money-back guarantee on all products. If you are not satisfied, simply return the item for a full refund.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards, debit cards, and cash on delivery. All payments are processed securely.",
  },
  {
    id: "warranty",
    question: "Do products come with a warranty?",
    answer:
      "Most products come with the manufacturer warranty. Some items may have additional extended warranty options available.",
  },
  {
    id: "tracking",
    question: "Can I track my order?",
    answer:
      "Yes! You can track your order using your order ID on our Order Tracking page. You will also receive tracking updates via email.",
  },
  {
    id: "bulk",
    question: "Do you offer bulk discounts?",
    answer:
      "Yes, we offer special pricing for bulk orders. Please contact our sales team for more information.",
  },
  {
    id: "authentic",
    question: "Are all products authentic?",
    answer:
      "Absolutely! We only work with authorized manufacturers and suppliers to ensure 100% authenticity.",
  },
  {
    id: "support",
    question: "How can I contact customer support?",
    answer:
      "You can reach us via email at support@bazarna.com, phone at +20 1104894017, or through our contact form. We are available 24/7.",
  },
];

// Privacy Page
export const privacySections = [
  {
    title: "Introduction",
    content: [
      `Bazarna ("we," "our," or "us") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data.`,
    ],
  },
  {
    title: "Information Collection and Use",
    content: [
      "We collect different types of information to improve our service.",
    ],
    list: [
      "Personal Data: name, email, phone number, address.",
      "Usage Data: pages visited, time spent, interactions.",
      "Device Information: device type, OS, identifiers.",
    ],
  },
  {
    title: "Use of Data",
    content: ["We use your data for the following purposes:"],
    list: [
      "Provide and maintain the service",
      "Notify about updates",
      "Improve user experience",
      "Customer support",
      "Analyze usage",
      "Ensure security",
    ],
  },
  {
    title: "Security of Data",
    content: [
      "We try to protect your data, but no system is 100% secure.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    content: [
      "We may update this policy and will notify users on this page.",
    ],
  },
  {
    title: "Contact Us",
    content: ["You can contact us via:"],
    list: [
      "Email: privacy@Bazarna.com",
      "Phone: +20 1104894017",
      "Address: 123 Al Salam Street, Minya, Egypt",
    ],
  },
];

// Terms Page
  export const terms = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing and using this website, you accept and agree to be bound by the terms. If you do not agree, please do not use this service.",
    },
    {
      title: "Use License",
      content:
        "Permission is granted to temporarily download one copy of the materials on Bazarna's website for personal, non-commercial viewing only. You may not:",
      list: [
        "Modify or copy the materials",
        "Use the materials for any commercial purpose or public display",
        "Attempt to decompile or reverse engineer software",
        "Remove any copyright or proprietary notices",
        "Transfer or 'mirror' materials on another server",
      ],
    },
    {
      title: "Disclaimer",
      content:
        "Materials are provided 'as is'. Bazarna makes no warranties, expressed or implied.",
    },
    {
      title: "Limitations",
      content:
        "Bazarna or its suppliers are not liable for any damages from using the website.",
    },
    {
      title: "Accuracy of Materials",
      content:
        "Materials may include errors. Bazarna does not guarantee accuracy and may update content anytime.",
    },
    {
      title: "Links",
      content: "Bazarna is not responsible for content on linked websites.",
    },
    {
      title: "Modifications",
      content:
        "Bazarna can revise these terms anytime. Using the website means you accept updates.",
    },
    {
      title: "Contact Information",
      content: "If you have questions, contact us at:",
      list: [
        "Email: legal@Bazarna.com",
        "Phone: +20 1104894017",
        "Address: 123 Al Salam Street, Minya, Egypt",
      ],
    },
  ];

  // ===== FOOTER =====
  export const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Returns & Refunds", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
  ];

  export const quickLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ];

  // Quick Searches
  export const quickSearches = [
    "Digital Camera",
    "Mascara",
    "Swimming Goggles",
    "Bed",
    "Digital Sports Stopwatch",
    "Boxing Gloves",
    "Smart Watch",
    "Football",
    "Galaxy Watch Ultra",
    "iPad Air M2",
  ];
