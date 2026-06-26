"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, User, Menu, X, Search, Moon, Sun, Cake } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function Navbar() {
  const { count } = useCart();
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center shadow-cake"
            >
              <Cake className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display text-xl lg:text-2xl font-bold text-cocoa-500">
                Sweet Delights
              </span>
              <span className="text-xs text-cocoa-300 -mt-1 hidden sm:block">
                Artisan Bakery
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cocoa-400 hover:text-blush-600 font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blush-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-blush-100 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5 text-cocoa-400" /> : <Moon className="w-5 h-5 text-cocoa-400" />}
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-blush-100 transition-colors hidden sm:block"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-cocoa-400" />
            </button>

            <Link
              href="/wishlist"
              className="p-2 rounded-full hover:bg-blush-100 transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-cocoa-400" />
            </Link>

            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-blush-100 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-cocoa-400" />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blush-500 text-white text-xs flex items-center justify-center font-bold"
                >
                  {count}
                </motion.span>
              )}
            </Link>

            {user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/profile"}
                className="p-2 rounded-full hover:bg-blush-100 transition-colors"
                aria-label="Profile"
              >
                <User className="w-5 h-5 text-cocoa-400" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex px-4 py-2 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-medium hover:shadow-cake transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-blush-100 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6 text-cocoa-400" /> : <Menu className="w-6 h-6 text-cocoa-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-blush-100"
            >
              <nav className="py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-cocoa-400 hover:text-blush-600 font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="sm:hidden px-4 py-2 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 text-white font-medium text-center"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-blush-100 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form action="/products" method="GET" className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search for cakes..."
                  className="w-full px-4 py-3 pl-12 rounded-full border-2 border-blush-200 focus:border-blush-500 focus:outline-none transition-colors"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cocoa-300" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
