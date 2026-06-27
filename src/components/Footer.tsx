import Link from "next/link";
import { Cake, MapPin, Phone, Mail, Heart, MessageCircle, Video, Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-cocoa-500 to-cocoa-600 text-cream-100 mt-20">
      {/* Newsletter */}
      <div className="border-b border-cocoa-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-dark rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
                Subscribe & Get 15% Off
              </h3>
              <p className="text-cream-200">
                Join our sweet family and get exclusive offers, new flavors, and special deals!
              </p>
            </div>
            <form className="flex-1 w-full max-w-md flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-cream-200 focus:outline-none focus:border-blush-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold hover:shadow-cake transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">Sweet Delights</span>
          </Link>
          <p className="text-cream-200 text-sm mb-4">
            Crafting moments of joy through artisanal cakes since 2010. Every slice tells a story.
          </p>
          <div className="flex gap-3">
            {[Camera, Heart, MessageCircle, Video].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-blush-500 flex items-center justify-center transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-white mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-cream-200">
            <li><Link href="/products?category=birthday" className="hover:text-blush-300 transition-colors">Birthday Cakes</Link></li>
            <li><Link href="/products?category=wedding" className="hover:text-blush-300 transition-colors">Wedding Cakes</Link></li>
            <li><Link href="/products?category=chocolate" className="hover:text-blush-300 transition-colors">Chocolate Cakes</Link></li>
            <li><Link href="/products?category=cupcake" className="hover:text-blush-300 transition-colors">Cupcakes</Link></li>
            <li><Link href="/products?category=custom" className="hover:text-blush-300 transition-colors">Custom Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-cream-200">
            <li><Link href="/about" className="hover:text-blush-300 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blush-300 transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-blush-300 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blush-300 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blush-300 transition-colors">FAQs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-white mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-cream-200">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blush-300" />
              <span>123 Baker Street, Sweet Town, ST 12345</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0 text-blush-300" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0 text-blush-300" />
              <span>hello@sweetdelights.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cocoa-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream-200">
            © 2026 Sweet Delights. Made with 💖 and flour.
          </p>
          <div className="flex gap-4 text-sm text-cream-200">
            <span>We accept:</span>
            <span className="font-semibold">Visa • Mastercard • UPI • COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
