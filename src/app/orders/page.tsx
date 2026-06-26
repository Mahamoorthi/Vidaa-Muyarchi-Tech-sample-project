"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Calendar, IndianRupee } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type Order = {
  id: number;
  orderNo: string;
  total: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center glass rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-4">Please login to view orders</h2>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa-600 mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton rounded-3xl h-32" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl">
            <Package className="w-16 h-16 mx-auto mb-4 text-cocoa-300" />
            <h3 className="font-display text-2xl font-bold text-cocoa-500 mb-2">No orders yet</h3>
            <p className="text-cocoa-400 mb-6">Start exploring our delicious cakes!</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/orders/${o.orderNo}`}
                className="block glass rounded-3xl p-6 hover:shadow-cake transition-all hover:-translate-y-1"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-cocoa-300 mb-1">Order Number</div>
                    <div className="font-display font-bold text-lg text-cocoa-500">{o.orderNo}</div>
                    <div className="flex items-center gap-1 text-xs text-cocoa-300 mt-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${
                        statusColors[o.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {o.status}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-cocoa-300">Total</div>
                      <div className="font-bold text-gradient text-lg">{formatPrice(o.total)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
