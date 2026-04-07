"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // ✅ FIX: safe images
  const safeImages =
    images && images.length > 0 ? images : ["/placeholder.png"];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + safeImages.length) % safeImages.length
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative bg-gray-100 aspect-square rounded-lg overflow-hidden group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <Image
          src={safeImages[selectedImage] || "/placeholder.png"}
          alt={productName || "Product image"}
          width={600}
          height={600}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
        />

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-lg opacity-0 group-hover:opacity-100">
          <ZoomIn className="w-5 h-5 text-blue-600" />
        </div>

        {/* Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`border-2 rounded-lg overflow-hidden ${
                selectedImage === i
                  ? "border-blue-600"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={img || "/placeholder.png"}
                alt={`${productName} ${i}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}