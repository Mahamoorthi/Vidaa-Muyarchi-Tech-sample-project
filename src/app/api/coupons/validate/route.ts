import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  if (!code) return NextResponse.json({ valid: false, error: "Enter a coupon code" }, { status: 400 });

  const [coupon] = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.active, true)));

  if (!coupon) return NextResponse.json({ valid: false, error: "Invalid coupon" }, { status: 404 });

  const minOrder = parseFloat(coupon.minOrder || "0");
  if (subtotal < minOrder) {
    return NextResponse.json(
      { valid: false, error: `Minimum order of ₹${minOrder} required` },
      { status: 400 },
    );
  }

  return NextResponse.json({
    valid: true,
    discountPercent: coupon.discountPercent,
    code: coupon.code,
  });
}
