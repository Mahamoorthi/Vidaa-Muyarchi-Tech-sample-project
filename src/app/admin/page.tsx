import { db } from "@/db";
import { users, products, orders, categories } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Package, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const jwt = await getCurrentUser();

  if (!jwt || jwt.role !== "admin") {
    redirect("/");
  }

  const [
    [totalProducts],
    [totalOrders],
    [totalUsers],
    [revenueResult],
    recentOrders,
    allProducts,
    allCategories,
    allUsers,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(products),

    db.select({ count: sql<number>`count(*)` }).from(orders),

    db.select({ count: sql<number>`count(*)` }).from(users),

    db
      .select({
        total: sql<string>`COALESCE(sum(${orders.total}::numeric), 0)`,
      })
      .from(orders)
      .where(eq(orders.status, "Delivered") as any),

    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),

    db.select().from(products).orderBy(desc(products.createdAt)).limit(10),

    db.select().from(categories),

    db.select().from(users),
  ]);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts.count.toString(),
      icon: Package,
      color: "from-blush-400 to-blush-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.count.toString(),
      icon: ShoppingBag,
      color: "from-cocoa-400 to-cocoa-600",
    },
    {
      label: "Total Users",
      value: totalUsers.count.toString(),
      icon: Users,
      color: "from-amber-400 to-amber-600",
    },
    {
      label: "Revenue",
      value: formatPrice(revenueResult.total || 0),
      icon: TrendingUp,
      color: "from-green-400 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa-600">
              Admin Dashboard
            </h1>
            <p className="text-cocoa-400 mt-1">
              Manage your bakery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-3xl p-6 hover:shadow-cake transition-all"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>

              <div className="text-sm text-cocoa-400 mb-1">
                {stat.label}
              </div>

              <div className="text-2xl font-bold text-cocoa-600">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <AdminClient
          recentOrders={recentOrders}
          products={allProducts}
          categories={allCategories}
          users={allUsers}
        />
      </div>
    </div>
  );
}