import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const jwt = await getCurrentUser();
  if (!jwt) return NextResponse.json({ user: null });
  const [user] = await db.select().from(users).where(eq(users.id, jwt.sub));
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
