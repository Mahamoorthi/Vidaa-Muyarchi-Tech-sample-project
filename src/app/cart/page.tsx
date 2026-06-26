"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import CakeImage from "@/components/CakeImage";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const deliveryFee = subtotal > 999 ? 0 : 99;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount + deliveryFee;

  const applyCoupon = async () => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discountPercent);
        toast.success(`Coupon applied! ${data.discountPercent}% off`);
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to validate coupon");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="font-display text-3xl font-bold text-cocoa-600 mb-4">Your cart is empty</h1>
          <p className="text-cocoa-400 mb-8">
            Looks like you haven't added any cakes yet. Let's change that!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake hover:shadow-xl transition-all"
          >
            <ShoppingBag className="w-5 h-5" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa-600">Shopping Cart</h1>
          <button
            onClick={() => {
              clearCart();
              toast("Cart cleared", { icon: "🗑️" });
            }}
            className="text-sm text-cocoa-400 hover:text-blush-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.weight}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="glass rounded-3xl p-4 lg:p-6 flex gap-4 lg:gap-6"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blush-50 to-cream-100 flex-shrink-0"
                  >
                    <CakeImage seed={item.slug} variant={item.image as any} className="w-full h-full" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-display font-semibold text-cocoa-500 text-lg mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-cocoa-400 mb-2">Weight: {item.weight}</p>
                    {item.customMessage && (
                      <p className="text-xs text-cocoa-300 mb-2 italic">"{item.customMessage}"</p>
                    )}

                    <div className="flex items-center justify-between gap-4 mt-3">
                      <div className="inline-flex items-center gap-3 glass rounded-full px-3 py-1">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full hover:bg-blush-100 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-cocoa-500 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full hover:bg-blush-100 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gradient">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-cocoa-300">
                              {formatPrice(item.price)} each
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-9 h-9 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="glass rounded-3xl p-6 space-y-4">
              <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa-300" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-blush-100 focus:border-blush-500 focus:outline-none text-sm"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 rounded-full bg-blush-500 text-white text-sm font-medium hover:bg-blush-600 transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-cocoa-300">Try: WELCOME10, SWEET20, FIRST50</p>

              <div className="border-t border-blush-100 pt-4 space-y-3">
                <div className="flex justify-between text-cocoa-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-cocoa-400">
                  <span>Delivery</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="border-t border-blush-100 pt-3 flex justify-between text-xl">
                  <span className="font-display font-bold text-cocoa-600">Total</span>
                  <span className="font-bold text-gradient">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-4 rounded-2xl bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake hover:shadow-xl transition-all text-center mt-6"
              >
                Proceed to Checkout <ArrowRight className="inline w-4 h-4 ml-2" />
              </Link>

              <Link
                href="/products"
                className="block text-center text-sm text-cocoa-400 hover:text-blush-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
