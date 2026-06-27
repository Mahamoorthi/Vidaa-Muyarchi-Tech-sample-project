import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, signToken, setAuthCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
  mode: z.enum(["login", "signup"]).default("login"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    if (data.mode === "signup") {
      if (!data.name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      const existing = await db.select().from(users).where(eq(users.email, data.email));
      if (existing.length > 0) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      const hash = await hashPassword(data.password);
      const [created] = await db
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          passwordHash: hash,
          role: "customer",
        })
        .returning();
      const token = await signToken({
        sub: created.id,
        email: created.email,
        role: created.role,
      });
      await setAuthCookie(token);
      return NextResponse.json({
        success: true,
        user: { id: created.id, name: created.name, email: created.email, role: created.role },
      });
    } else {
      const [user] = await db.select().from(users).where(eq(users.email, data.email));
      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      const ok = await comparePassword(data.password, user.passwordHash);
      if (!ok) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      const token = await signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      await setAuthCookie(token);
      return NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: err.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
