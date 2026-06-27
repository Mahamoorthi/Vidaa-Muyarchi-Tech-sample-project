"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, MapPin, Package, LogOut, Heart, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "addresses" | "orders" | "wishlist">("profile");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => {});
  }, [user, router]);

  if (!user) return null;

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
  ];

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa-600 mb-8">My Account</h1>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="glass rounded-3xl p-6 h-fit">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center text-3xl text-white font-bold shadow-cake mb-3">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-display font-bold text-cocoa-500">{user.name}</h3>
              <p className="text-sm text-cocoa-300">{user.email}</p>
            </div>
            <nav className="space-y-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                    tab === t.id
                      ? "bg-gradient-to-r from-blush-500 to-blush-600 text-white shadow-soft"
                      : "text-cocoa-400 hover:bg-blush-50"
                  }`}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="font-medium">{t.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="glass rounded-3xl p-8">
            {tab === "profile" && (
              <div>
                <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cocoa-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cocoa-400 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-3 rounded-2xl border-2 border-blush-100 bg-blush-50 text-cocoa-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cocoa-400 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="Add phone number"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none"
                    />
                  </div>
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {tab === "addresses" && (
              <div>
                <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-6">Saved Addresses</h2>
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-cocoa-300" />
                  <p className="text-cocoa-400 mb-4">No saved addresses yet</p>
                  <p className="text-sm text-cocoa-300">Addresses will be saved when you place an order</p>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div>
                <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-cocoa-300" />
                    <p className="text-cocoa-400">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 10).map((o) => (
                      <Link
                        key={o.id}
                        href={`/orders/${o.orderNo}`}
                        className="block p-4 rounded-2xl bg-white/60 hover:shadow-soft transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-cocoa-500">{o.orderNo}</div>
                            <div className="text-xs text-cocoa-300">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gradient">{formatPrice(o.total)}</div>
                            <div className="text-xs text-cocoa-300">{o.status}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "wishlist" && (
              <div>
                <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-6">My Wishlist</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-cocoa-300" />
                  <p className="text-cocoa-400 mb-4">Your wishlist is empty</p>
                  <Link
                    href="/products"
                    className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake"
                  >
                    Browse Cakes
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
