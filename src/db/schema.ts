import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 30 }),
  role: varchar("role", { length: 20 }).notNull().default("customer"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    weightOptions: jsonb("weight_options").$type<string[]>().notNull().default(["500g", "1kg", "2kg"]),
    isFeatured: boolean("is_featured").notNull().default(false),
    stock: integer("stock").notNull().default(25),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
    reviewCount: integer("review_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    categoryIdx: index("products_category_idx").on(t.categoryId),
    slugIdx: index("products_slug_idx").on(t.slug),
  }),
);

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 40 }).notNull().default("Home"),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: varchar("city", { length: 80 }).notNull(),
  state: varchar("state", { length: 80 }).notNull(),
  pincode: varchar("pincode", { length: 12 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  weight: varchar("weight", { length: 30 }).notNull().default("1kg"),
  customMessage: text("custom_message"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNo: varchar("order_no", { length: 30 }).notNull().unique(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 10, scale: 2 }).notNull().default("0"),
    deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    couponCode: varchar("coupon_code", { length: 40 }),
    status: varchar("status", { length: 30 }).notNull().default("Pending"),
    paymentMethod: varchar("payment_method", { length: 40 }).notNull(),
    paymentStatus: varchar("payment_status", { length: 30 }).notNull().default("Pending"),
    shippingAddress: jsonb("shipping_address").$type<Record<string, string>>().notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userOrderIdx: index("orders_user_idx").on(t.userId),
    orderNoIdx: index("orders_order_no_idx").on(t.orderNo),
  }),
);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  productName: varchar("product_name", { length: 160 }).notNull(),
  productImage: text("product_image"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  weight: varchar("weight", { length: 30 }).notNull().default("1kg"),
  customMessage: text("custom_message"),
});

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    productReviewIdx: index("reviews_product_idx").on(t.productId),
  }),
);

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  discountPercent: integer("discount_percent").notNull().default(0),
  minOrder: numeric("min_order", { precision: 10, scale: 2 }).notNull().default("0"),
  active: boolean("active").notNull().default(true),
});
