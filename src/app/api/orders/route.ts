import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateOrderNo } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const jwt = await getCurrentUser();
  if (!jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { items, address, paymentMethod } = body;

  if (!items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  if (!address?.fullName || !address?.phone || !address?.line1 || !address?.city || !address?.pincode) {
    return NextResponse.json({ error: "Please fill all address fields" }, { status: 400 });
  }

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal > 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  const orderNo = generateOrderNo();

  const [order] = await db
    .insert(orders)
    .values({
      orderNo,
      userId: jwt.sub,
      subtotal: subtotal.toString(),
      discount: "0",
      deliveryFee: deliveryFee.toString(),
      total: total.toString(),
      status: "Pending",
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
      shippingAddress: address,
    })
    .returning();

  // Fetch product details and insert items
  for (const item of items) {
    const [product] = await db.select().from(products).where(eq(products.id, item.productId));
    if (!product) continue;
    await db.insert(orderItems).values({
      orderId: order.id,
      productId: product.id,
      productName: product.name,
      productImage: product.images?.[0] || "birthday",
      unitPrice: item.price.toString(),
      quantity: item.quantity,
      weight: item.weight,
      customMessage: item.customMessage || null,
    });
  }

  return NextResponse.json({ success: true, orderNo: order.orderNo });
}

export async function GET() {
  const jwt = await getCurrentUser();
  if (!jwt) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, jwt.sub))
    .orderBy(orders.createdAt as any);

  return NextResponse.json({ orders: allOrders.reverse() });
}
