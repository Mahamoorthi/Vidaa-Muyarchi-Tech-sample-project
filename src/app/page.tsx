import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Sparkles, Truck, Clock, Award, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CakeImage from "@/components/CakeImage";
import { SEED_CATEGORIES } from "@/lib/seed-data";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, allCats] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.createdAt))
      .limit(8),
    db.select().from(categories),
  ]);

  const testimonials = [
    { name: "Priya Sharma", text: "The wedding cake was absolutely stunning and tasted divine! Our guests couldn't stop complimenting it.", rating: 5, avatar: "👰" },
    { name: "Rahul Kumar", text: "Ordered a custom birthday cake for my daughter. It exceeded all expectations - beautiful and delicious!", rating: 5, avatar: "👨" },
    { name: "Anita Patel", text: "Best cupcakes in town! I order them every week for our office meetings. Always fresh and flavorful.", rating: 5, avatar: "👩" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-bakery-pattern">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating cake icons */}
          <div className="absolute top-20 left-10 animate-float opacity-20">
            <CakeImage seed="hero1" variant="birthday" className="w-32 h-32" />
          </div>
          <div className="absolute bottom-20 right-10 animate-float-slow opacity-20">
            <CakeImage seed="hero2" variant="chocolate" className="w-40 h-40" />
          </div>
          <div className="absolute top-1/2 right-1/4 animate-float opacity-15">
            <CakeImage seed="hero3" variant="cupcake" className="w-24 h-24" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush-100 text-blush-600 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Handcrafted with Love
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cocoa-600 leading-tight mb-6">
                Every Slice<br />
                <span className="text-gradient">Tells a Story</span>
              </h1>
              <p className="text-lg sm:text-xl text-cocoa-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Discover artisanal cakes crafted by master bakers. From birthdays to weddings, we make every celebration sweeter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake hover:shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                >
                  Order Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/products?category=custom"
                  className="px-8 py-4 rounded-full border-2 border-cocoa-400 text-cocoa-500 font-semibold hover:bg-cocoa-500 hover:text-white transition-all inline-flex items-center justify-center"
                >
                  Custom Design
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
                {[
                  { label: "Happy Customers", value: "10k+" },
                  { label: "Cakes Delivered", value: "25k+" },
                  { label: "Years Experience", value: "15+" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                    <div className="text-sm text-cocoa-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 animate-float">
                <Image
                  src="/cakes/hero-main.jpg"
                  alt="cake"
                  width={900}
                  height={600}
                  priority   // ✅ add this
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blush-200 to-blush-400 rounded-full blur-3xl opacity-30 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders above ₹999" },
              { icon: Clock, title: "Same Day", desc: "Order before 2 PM" },
              { icon: Award, title: "Premium Quality", desc: "Fresh ingredients daily" },
              { icon: Sparkles, title: "Custom Design", desc: "Your imagination, our creation" },
            ].map((feat) => (
              <div
                key={feat.title}
                className="glass rounded-2xl p-6 text-center hover:shadow-cake transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center">
                  <feat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-cocoa-500 mb-1">{feat.title}</h3>
                <p className="text-sm text-cocoa-300">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cocoa-600 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-cocoa-400">Find the perfect cake for every occasion</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SEED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-blush-100 to-cream-100 hover:shadow-cake transition-all hover:-translate-y-2"
              >
                <CakeImage
                  seed={cat.slug}
                  variant={cat.variant as any}
                  className="absolute inset-0 w-full h-full opacity-80 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-600/80 via-cocoa-600/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="font-display font-bold text-white text-sm lg:text-base">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-transparent to-blush-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-cocoa-600 mb-4">
                Featured Cakes
              </h2>
              <p className="text-lg text-cocoa-400">Our most loved creations</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-blush-600 font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-cocoa-600 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-cocoa-400">Real stories from sweet moments</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="glass rounded-3xl p-6 hover:shadow-cake transition-all hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-cocoa-400 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blush-200 to-blush-400 flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-cocoa-500">{t.name}</div>
                    <div className="text-xs text-cocoa-300">Verified Customer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
