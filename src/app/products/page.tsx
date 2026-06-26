import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and, ilike, sql, desc, asc, inArray } from "drizzle-orm";
import Link from "next/link";
import { Search, Filter, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  // Build where clause
  const conditions: any[] = [];
  if (params.q) conditions.push(ilike(products.name, `%${params.q}%`));
  if (params.category) {
    const [cat] = await db.select().from(categories).where(eq(categories.slug, params.category));
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }
  if (params.minPrice) conditions.push(sql`${products.price}::numeric >= ${parseFloat(params.minPrice)}`);
  if (params.maxPrice) conditions.push(sql`${products.price}::numeric <= ${parseFloat(params.maxPrice)}`);

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Sort
  const sortMap: Record<string, any> = {
    newest: desc(products.createdAt),
    price_low: asc(products.price),
    price_high: desc(products.price),
    rating: desc(products.rating),
    popular: desc(products.reviewCount),
  };
  const orderBy = sortMap[params.sort || "newest"] || sortMap.newest;

  const [allProducts, [countResult], allCats] = await Promise.all([
    db.select().from(products).where(where).orderBy(orderBy).limit(pageSize).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(products).where(where),
    db.select().from(categories),
  ]);

  const total = countResult.count;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blush-100 to-cream-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-cocoa-600 mb-4">
            Our Cakes
          </h1>
          <p className="text-lg text-cocoa-400 mb-8">Discover our handcrafted collection</p>

          {/* Search & Filters */}
          <form method="GET" className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cocoa-300" />
              <input
                type="text"
                name="q"
                defaultValue={params.q}
                placeholder="Search cakes..."
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-white bg-white/80 focus:border-blush-500 focus:outline-none"
              />
            </div>
            <select
              name="sort"
              defaultValue={params.sort || "newest"}
              className="px-5 py-3 rounded-full border-2 border-white bg-white/80 focus:border-blush-500 focus:outline-none font-medium text-cocoa-500"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-cocoa-500 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Categories
              </h3>
              <div className="space-y-2">
                <Link
                  href="/products"
                  className={`block px-4 py-2 rounded-lg transition-colors ${!params.category ? "bg-blush-500 text-white" : "text-cocoa-400 hover:bg-blush-50"
                    }`}
                >
                  All Cakes
                </Link>
                {allCats.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`block px-4 py-2 rounded-lg transition-colors ${params.category === cat.slug
                        ? "bg-blush-500 text-white"
                        : "text-cocoa-400 hover:bg-blush-50"
                      }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-cocoa-500 mb-4">Price Range</h3>
              <form method="GET" className="space-y-3">
                {params.category && <input type="hidden" name="category" value={params.category} />}
                {params.q && <input type="hidden" name="q" value={params.q} />}
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    defaultValue={params.minPrice}
                    className="w-full px-3 py-2 rounded-lg border border-blush-100 focus:border-blush-500 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    defaultValue={params.maxPrice}
                    className="w-full px-3 py-2 rounded-lg border border-blush-100 focus:border-blush-500 focus:outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-blush-500 text-white font-medium hover:bg-blush-600 transition-colors"
                >
                  Apply
                </button>
              </form>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-cocoa-400">
                Showing <span className="font-semibold text-cocoa-500">{allProducts.length}</span> of{" "}
                <span className="font-semibold text-cocoa-500">{total}</span> cakes
              </p>
            </div>

            {allProducts.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl">
                <p className="text-6xl mb-4">🎂</p>
                <h3 className="font-display text-2xl font-bold text-cocoa-500 mb-2">No cakes found</h3>
                <p className="text-cocoa-400">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/products?page=${p}${params.category ? `&category=${params.category}` : ""}${params.q ? `&q=${params.q}` : ""}`}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${p === page
                            ? "bg-gradient-to-r from-blush-500 to-blush-600 text-white shadow-cake"
                            : "glass text-cocoa-500 hover:bg-blush-50"
                          }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
