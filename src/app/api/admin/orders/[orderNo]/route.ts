import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> },
) {
  const jwt = await getCurrentUser();
  if (!jwt || jwt.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNo } = await params;
  const body = await req.json();

  await db
    .update(orders)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(orders.orderNo, orderNo));

  return NextResponse.json({ success: true });
}
