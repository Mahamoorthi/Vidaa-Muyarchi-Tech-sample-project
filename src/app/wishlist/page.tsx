import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md glass rounded-3xl p-8">
        <Heart className="w-16 h-16 mx-auto mb-4 text-blush-400" />
        <h1 className="font-display text-2xl font-bold text-cocoa-600 mb-4">Your Wishlist</h1>
        <p className="text-cocoa-400 mb-6">
          Your wishlist is empty. Browse our delicious cakes and save your favorites!
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake"
        >
          Browse Cakes
        </Link>
      </div>
    </div>
  );
}
