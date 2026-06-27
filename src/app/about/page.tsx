import { Heart, Award, Users, Cake } from "lucide-react";
import CakeImage from "@/components/CakeImage";

export default function AboutPage() {
  const team = [
    { name: "Sarah Johnson", role: "Head Pastry Chef", emoji: "👩‍🍳" },
    { name: "Michael Chen", role: "Cake Designer", emoji: "👨‍🍳" },
    { name: "Emma Rodriguez", role: "Bakery Manager", emoji: "👩‍💼" },
    { name: "David Kim", role: "Delivery Coordinator", emoji: "👨‍💼" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-blush-100 to-cream-100 overflow-hidden">
        <div className="absolute top-10 right-10 animate-float opacity-30">
          <CakeImage seed="about-1" variant="wedding" className="w-48 h-48" />
        </div>
        <div className="absolute bottom-10 left-10 animate-float-slow opacity-30">
          <CakeImage seed="about-2" variant="chocolate" className="w-40 h-40" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-cocoa-600 mb-6">
            Our Sweet Story
          </h1>
          <p className="text-xl text-cocoa-400 leading-relaxed">
            Crafting moments of joy through artisanal cakes since 2010. Every slice tells a story of
            passion, quality, and love.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-cocoa-600 mb-6">
                From Humble Beginnings
              </h2>
              <div className="space-y-4 text-cocoa-400 leading-relaxed">
                <p>
                  Sweet Delights began in 2010 as a small home bakery with a big dream: to create
                  cakes that bring smiles to every celebration. Our founder, Sarah Johnson, started
                  baking in her kitchen with just a mixer, an oven, and an endless passion for
                  creating beautiful, delicious cakes.
                </p>
                <p>
                  What started as weekend orders for friends and family quickly grew into a beloved
                  local bakery. By 2015, we opened our first storefront, and today, we deliver
                  happiness across the city with our team of skilled bakers, designers, and delivery
                  partners.
                </p>
                <p>
                  Every cake we make is handcrafted with premium ingredients, attention to detail,
                  and a whole lot of love. We believe that cakes are more than just desserts—they're
                  centerpieces of celebration, symbols of love, and creators of memories.
                </p>
              </div>
            </div>
            <div className="relative">
              <CakeImage seed="about-main" variant="birthday" className="w-full max-w-md mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold text-cocoa-600 text-center mb-12">
            What Makes Us Special
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Made with Love",
                desc: "Every cake is handcrafted with passion and care by our expert bakers.",
              },
              {
                icon: Award,
                title: "Premium Quality",
                desc: "We use only the finest ingredients—Belgian chocolate, fresh cream, and organic flour.",
              },
              {
                icon: Users,
                title: "Customer First",
                desc: "Your satisfaction is our priority. We go the extra mile to make your day special.",
              },
            ].map((v) => (
              <div key={v.title} className="glass rounded-3xl p-8 text-center hover:shadow-cake transition-all hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center">
                  <v.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-cocoa-500 mb-3">{v.title}</h3>
                <p className="text-cocoa-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-bold text-cocoa-600 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="glass rounded-3xl p-6 text-center hover:shadow-cake transition-all hover:-translate-y-2"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blush-200 to-blush-400 flex items-center justify-center text-5xl">
                  {member.emoji}
                </div>
                <h3 className="font-display font-bold text-cocoa-500">{member.name}</h3>
                <p className="text-sm text-cocoa-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-cocoa-500 to-cocoa-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "15+", label: "Years of Experience" },
              { value: "25k+", label: "Cakes Delivered" },
              { value: "10k+", label: "Happy Customers" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-cream-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
