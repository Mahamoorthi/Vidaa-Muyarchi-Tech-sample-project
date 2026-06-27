"use client";

import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import CakeImage from "./CakeImage";

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  rating: string | number;
  reviewCount: number;
  images: string[] | null;
};

export default function ProductCard({
  product,
}: {
  product: ProductCardData;
}) {
  const variant = (product.images?.[0] || "birthday") as
    | "birthday"
    | "wedding"
    | "chocolate"
    | "cupcake"
    | "anniversary"
    | "custom";

  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;

  const rating =
    typeof product.rating === "string"
      ? parseFloat(product.rating)
      : product.rating;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-cake transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blush-50 to-cream-100">
        <CakeImage
          seed={product.slug}
          variant={variant}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log("Added to wishlist");
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/90 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-cocoa-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-cocoa-500 text-base line-clamp-1 mb-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-cocoa-400">
            {rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gradient">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-cocoa-300 ml-1">
              onwards
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center text-white shadow-cake group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-soft">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-6 skeleton rounded w-1/2" />
      </div>
    </div>
  );
}