import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Package, CheckCircle2, Truck, Clock, Calendar, MapPin, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const STATUS_FLOW = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo));
  if (!order || order.userId !== user.sub) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  const currentStep = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-cocoa-600">
              Order {order.orderNo}
            </h1>
            <p className="text-cocoa-400 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Link
            href="/orders"
            className="text-blush-600 hover:text-blush-700 font-medium"
          >
            ← All Orders
          </Link>
        </div>

        {/* Status Tracker */}
        <div className="glass rounded-3xl p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-cocoa-600 mb-6">Order Status</h2>
          <div className="relative">
            <div className="flex items-center justify-between">
              {STATUS_FLOW.map((step, i) => {
                const isActive = i <= currentStep;
                const icons = [Clock, CheckCircle2, Package, Truck, CheckCircle2];
                const Icon = icons[i];
                return (
                  <div key={step} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-blush-400 to-blush-600 text-white shadow-cake"
                            : "bg-blush-100 text-cocoa-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div
                        className={`text-xs mt-2 font-semibold ${
                          isActive ? "text-cocoa-500" : "text-cocoa-300"
                        }`}
                      >
                        {step}
                      </div>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div
                        className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                          i < currentStep ? "bg-blush-500" : "bg-blush-100"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Items */}
          <div className="glass rounded-3xl p-6">
            <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white/60 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blush-100 to-cream-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-cocoa-500">{item.productName}</div>
                    <div className="text-sm text-cocoa-300">
                      {item.weight} × {item.quantity}
                    </div>
                    {item.customMessage && (
                      <div className="text-xs text-cocoa-300 italic mt-1">
                        Message: "{item.customMessage}"
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-gradient">{formatPrice(item.unitPrice)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Address */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cocoa-400">Subtotal</span>
                  <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-cocoa-400">Delivery</span>
                  <span className="font-semibold">{formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="border-t border-blush-100 pt-2 flex justify-between text-lg">
                  <span className="font-bold text-cocoa-600">Total</span>
                  <span className="font-bold text-gradient">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blush-500" /> Delivery Address
              </h2>
              <div className="text-sm text-cocoa-400 space-y-1">
                <div className="font-semibold text-cocoa-500">{order.shippingAddress.fullName}</div>
                <div>{order.shippingAddress.phone}</div>
                <div>{order.shippingAddress.line1}</div>
                {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-xl font-bold text-cocoa-600 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blush-500" /> Payment
              </h2>
              <div className="text-sm text-cocoa-400">
                <div className="font-semibold text-cocoa-500">{order.paymentMethod}</div>
                <div>{order.paymentStatus}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
