import "dotenv/config";
import { db } from "@/db";
import { categories, products, coupons } from "@/db/schema";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "@/lib/seed-data";
import { hashPassword } from "@/lib/auth";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  await db
    .insert(users)
    .values({
      name: "Admin User",
      email: "admin@sweetdelights.com",
      passwordHash: adminPassword,
      role: "admin",
    })
    .onConflictDoNothing();

  // Create demo customer
  const customerPassword = await hashPassword("demo123");
  await db
    .insert(users)
    .values({
      name: "Demo Customer",
      email: "demo@sweetdelights.com",
      passwordHash: customerPassword,
      role: "customer",
    })
    .onConflictDoNothing();

  // Insert categories
  const insertedCategories: Record<string, number> = {};
  for (const cat of SEED_CATEGORIES) {
    const [result] = await db
      .insert(categories)
      .values({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      })
      .onConflictDoNothing()
      .returning();
    if (result) {
      insertedCategories[cat.slug] = result.id;
    } else {
      // Fetch existing
      const [existing] = await db.select().from(categories).where(eq(categories.slug, cat.slug));
      if (existing) insertedCategories[cat.slug] = existing.id;
    }
  }

  // Insert products
  for (const prod of SEED_PRODUCTS) {
    const catId = insertedCategories[prod.category];
    if (!catId) continue;
    await db
      .insert(products)
      .values({
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price.toString(),
        categoryId: catId,
        weightOptions: prod.weightOptions,
        isFeatured: prod.isFeatured || false,
        rating: prod.rating.toString(),
        reviewCount: prod.reviewCount,
        stock: prod.stock,
        images: [prod.variant],
      })
      .onConflictDoNothing();
  }

  // Insert coupons
  await db
    .insert(coupons)
    .values([
      { code: "WELCOME10", discountPercent: 10, minOrder: "500", active: true },
      { code: "SWEET20", discountPercent: 20, minOrder: "1000", active: true },
      { code: "FIRST50", discountPercent: 50, minOrder: "2000", active: true },
    ])
    .onConflictDoNothing();

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
