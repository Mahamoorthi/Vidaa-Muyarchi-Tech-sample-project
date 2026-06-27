"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon. 🎂");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-cocoa-600 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-cocoa-400">We'd love to hear from you</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Form */}
          <div className="glass rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold text-cocoa-600 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none bg-white/70"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email Address"
                  className="px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none bg-white/70"
                />
              </div>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none bg-white/70"
              />
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message..."
                rows={6}
                className="w-full px-4 py-3 rounded-2xl border-2 border-blush-100 focus:border-blush-500 focus:outline-none bg-white/70 resize-none"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blush-500 to-blush-600 text-white font-semibold shadow-cake hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: MapPin, title: "Visit Us", lines: ["123 Baker Street", "Sweet Town, ST 12345"] },
              { icon: Phone, title: "Call Us", lines: ["+1 (555) 123-4567", "+1 (555) 987-6543"] },
              { icon: Mail, title: "Email Us", lines: ["hello@sweetdelights.com", "support@sweetdelights.com"] },
              { icon: Clock, title: "Opening Hours", lines: ["Mon-Sat: 9AM - 9PM", "Sunday: 10AM - 6PM"] },
            ].map((info) => (
              <div key={info.title} className="glass rounded-3xl p-6 hover:shadow-cake transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-cocoa-500 mb-1">{info.title}</h3>
                    {info.lines.map((line) => (
                      <div key={line} className="text-sm text-cocoa-400">{line}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="glass rounded-3xl p-2 overflow-hidden">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blush-100 to-cream-100 relative flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-blush-500" />
                  <p className="font-display font-bold text-cocoa-500">Our Location</p>
                  <p className="text-xs text-cocoa-300">123 Baker Street, Sweet Town</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
