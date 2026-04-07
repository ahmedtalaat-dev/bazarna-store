import Link from "next/link";
import Image from "next/image";

interface Category {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
}

export function ShopByCategory() {
  // categories
  const categories: Category[] = [
  {
    title: "Beauty",
    description: "Explore our beauty products",
    href: "/shop?category=Beauty",
    imageSrc: "/categories/beauty.webp",
  },
  {
    title: "Fragrances",
    description: "Find your signature scent",
    href: "/shop?category=Fragrances",
    imageSrc: "/categories/fragrances.webp",
  },
  {
    title: "Furniture",
    description: "Upgrade your living space",
    href: "/shop?category=Furniture",
    imageSrc: "/categories/furniture.webp",
  },
];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <h2 className="text-4xl font-bold text-blue-600 mb-12 text-center">
        Shop by Category
      </h2>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            aria-label={`Shop ${category.title} category`}
            className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
          >
            {/* Category Image */}
            <Image
              src={category.imageSrc}
              alt={category.title}
              width={500}
              height={500}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-white/80">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}