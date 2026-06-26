"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Banknote, MapPin, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const deliveryFee = subtotal > 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md glass rounded-3xl p-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="font-display text-2xl font-bold text-cocoa-600 mb-4">
            Please login to continue
          </h1>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="font-display text-2xl font-bold text-cocoa-600 mb-4">Your cart is empty</h1>
          <Link
            href="/products"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to place order");
        setLoading(false);
        return;
      }
      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push(`/orders/${data.orderNo}`);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { id: "CARD", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Rupay" },
    { id: "UPI", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
    { id: "COD", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
  ];

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa-600 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blush-500" /> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="Full Name"
                  className="px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                />
                <input
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="Phone Number"
                  className="px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                />
                <input
                  required
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="Address Line 1"
                  className="sm:col-span-2 px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                />
                <input
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  placeholder="Address Line 2 (Optional)"
                  className="sm:col-span-2 px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                />
                <input
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="City"
                  className="px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                />
                <input
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="State"
                  className="px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                />
                <input
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="sm:col-span-2 px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === opt.id
                        ? "border-blush-500 bg-blush-50"
                        : "border-blush-100 hover:border-blush-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        paymentMethod === opt.id
                          ? "bg-gradient-to-br from-blush-400 to-blush-600 text-white"
                          : "bg-blush-100 text-cocoa-400"
                      }`}
                    >
                      <opt.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-cocoa-500">{opt.label}</div>
                      <div className="text-sm text-cocoa-300">{opt.desc}</div>
                    </div>
                    {paymentMethod === opt.id && (
                      <CheckCircle2 className="w-6 h-6 text-blush-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.weight}`} className="flex gap-3 text-sm">
                    <div className="w-14 h-14 rounded-xl bg-blush-50 flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full">
                        <svg viewBox="0 0 300 300" className="w-full h-full">
                          <rect width="300" height="300" fill="#ffe4ec" />
                          <circle cx="150" cy="180" r="60" fill="#ff6fa3" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-cocoa-500 line-clamp-1">{item.name}</div>
                      <div className="text-xs text-cocoa-300">
                        {item.weight} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold text-cocoa-500">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-blush-100 pt-4 space-y-2">
                <div className="flex justify-between text-cocoa-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-cocoa-400">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="border-t border-blush-100 pt-3 flex justify-between text-xl font-bold">
                  <span className="text-cocoa-600">Total</span>
                  <span className="text-gradient">{formatPrice(total)}</span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake hover:shadow-xl transition-all disabled:opacity-70"
              >
                {loading ? "Placing Order..." : `Place Order • ${formatPrice(total)}`}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
