"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  images: string[] | null;
  weightOptions: string[] | null;
  rating: string;
  reviewCount: number;
  stock: number;
};

export default function ProductDetailsClient({ product }: { product: Product }) {
  const [weight, setWeight] = useState(product.weightOptions?.[0] || "1kg");
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState("");

  const router = useRouter();
  const { addItem } = useCart();

  // 👉 REAL IMAGE ONLY
  const image = product.images?.[0] || "/cakes/cake.jpg";

  const price = parseFloat(product.price);
  const rating = parseFloat(product.rating);

  const priceMultiplier =
    weight === "500g" ? 0.6 :
      weight === "2kg" ? 1.8 :
        weight === "3kg" ? 2.5 :
          1;

  const finalPrice = Math.round(price * priceMultiplier);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: finalPrice,
      image: image,
      quantity,
      weight,
      customMessage: customMessage || undefined,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* IMAGE SECTION (FIXED) */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blush-50 to-cream-100 shadow-soft"
            >
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* DETAILS */}
          <div className="space-y-6">

            <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa-600">
              {product.name}
            </h1>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                    }`}
                />
              ))}
              <span className="ml-2 text-sm text-cocoa-400">
                {rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>

            <div className="text-4xl font-bold text-gradient">
              {formatPrice(finalPrice)}
            </div>

            <p className="text-cocoa-400">{product.description}</p>

            {/* WEIGHT */}
            <div>
              <h3 className="font-semibold">Select Weight</h3>
              <div className="flex gap-3 mt-2">
                {product.weightOptions?.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`px-4 py-2 rounded-xl border ${weight === w ? "bg-pink-200" : ""
                      }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* MESSAGE */}
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Custom message"
              className="w-full border p-2 rounded-xl"
            />

            {/* QUANTITY */}
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-pink-500 text-white py-3 rounded-xl"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white py-3 rounded-xl"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}