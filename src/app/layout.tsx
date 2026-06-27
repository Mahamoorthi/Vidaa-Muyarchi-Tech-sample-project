import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sweet Delights - Artisan Bakery & Online Cake Shop",
  description:
    "Order premium handcrafted cakes online. Birthday cakes, wedding cakes, cupcakes, and custom designs delivered fresh to your door.",
  keywords:
    "cakes, bakery, birthday cake, wedding cake, cupcakes, online cake delivery",
  openGraph: {
    title: "Sweet Delights - Artisan Bakery",
    description: "Handcrafted cakes for every occasion",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jwt = await getCurrentUser();

  let initialUser = null;

  if (jwt) {
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, jwt.sub));

    if (dbUser) {
      initialUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      };
    }
  }

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider initial={initialUser}>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#fff",
                    color: "#4a240a",
                    border: "1px solid #ffe4ec",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px -10px rgba(196, 61, 111, 0.25)",
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}