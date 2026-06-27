"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Package, ShoppingBag, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Order = { id: number; orderNo: string; total: string; status: string; createdAt: Date | string };
type Product = { id: number; name: string; slug: string; price: string; stock: number; isFeatured: boolean };
type Category = { id: number; name: string; slug: string };

export default function AdminClient({
  recentOrders,
  products,
  categories,
}: {
  recentOrders: Order[];
  products: Product[];
  categories: Category[];
}) {
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "users">("overview");
  const router = useRouter();

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "users", label: "Users", icon: Users },
  ];

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleUpdateStatus = async (orderNo: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderNo}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Status updated");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-colors ${
              tab === t.id
                ? "bg-gradient-to-r from-blush-500 to-blush-600 text-white shadow-cake"
                : "glass text-cocoa-400 hover:bg-blush-50"
            }`}
          >
            <t.icon className="inline w-4 h-4 mr-2" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="glass rounded-3xl p-6">
            <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.map((o) => (
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
          </div>

          {/* Top Products */}
          <div className="glass rounded-3xl p-6">
            <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4">Recent Products</h2>
            <div className="space-y-3">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/60">
                  <div>
                    <div className="font-semibold text-cocoa-500">{p.name}</div>
                    <div className="text-xs text-cocoa-300">Stock: {p.stock}</div>
                  </div>
                  <div className="font-bold text-gradient">{formatPrice(p.price)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-cocoa-600">All Products</h2>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush-100">
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Featured</th>
                  <th className="text-right py-3 px-4 font-semibold text-cocoa-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-blush-50 hover:bg-blush-50/50">
                    <td className="py-3 px-4">
                      <Link href={`/products/${p.slug}`} className="text-cocoa-500 hover:text-blush-600">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-semibold text-cocoa-500">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4 text-cocoa-400">{p.stock}</td>
                    <td className="py-3 px-4">
                      {p.isFeatured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Featured</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-2 hover:bg-blush-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-cocoa-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="glass rounded-3xl p-6">
          <h2 className="font-display text-xl font-bold text-cocoa-600 mb-6">All Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush-100">
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Order #</th>
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-cocoa-500">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-cocoa-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-blush-50 hover:bg-blush-50/50">
                    <td className="py-3 px-4">
                      <Link href={`/orders/${o.orderNo}`} className="text-cocoa-500 hover:text-blush-600 font-semibold">
                        {o.orderNo}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-cocoa-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-bold text-gradient">{formatPrice(o.total)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.orderNo, e.target.value)}
                        className="px-3 py-1 rounded-full border border-blush-200 text-sm"
                      >
                        {["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/orders/${o.orderNo}`} className="p-2 hover:bg-blush-100 rounded-lg inline-block">
                        <Eye className="w-4 h-4 text-cocoa-400" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="glass rounded-3xl p-6 text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-cocoa-300" />
          <p className="text-cocoa-400">User management coming soon</p>
        </div>
      )}
    </div>
  );
}
