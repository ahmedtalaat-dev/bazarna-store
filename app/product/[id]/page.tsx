// Imports
import ProductPageContent from "@/components/pages/ProductPageContent";
import { getProductById } from "@/lib/api";
import type { Metadata } from "next";
import { cache } from "react";

// Props type
type Props = {
  params: Promise<{ id: string }>;
};

// Cache function
const getProduct = cache(async (id: string) => {
  return await getProductById(id);
});

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProduct(id);

    return {
      title: `${product.title} | Bazarna`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        url: `https://bazarna-store.vercel.app/product/${product.id}`,
        siteName: "Bazarna",
        images: [
          {
            url: product.thumbnail || product.images?.[0] || "/og/default.png",
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
        images: [product.thumbnail || product.images?.[0] || "/og/default.png"],
      },
    };
  } catch {
    return {
      title: "Product | Bazarna",
      description: "View product details",
    };
  }
}

// Product Page
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductPageContent id={product.id} />;
}
