"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import toast from "react-hot-toast";

export type CartItem = {
  id?: number;
  productId: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  weight: string;
  customMessage?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sd_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sd_cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    let toastMessage = "";

    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.weight === item.weight
      );

      if (existing) {
        toastMessage = "Updated quantity in cart";

        return prev.map((i) =>
          i.productId === item.productId &&
            i.weight === item.weight
            ? {
              ...i,
              quantity: i.quantity + item.quantity,
              customMessage:
                item.customMessage ?? i.customMessage,
            }
            : i
        );
      }

      toastMessage = "Added to cart 🎂";
      return [...prev, item];
    });

    setTimeout(() => {
      if (toastMessage) {
        toast.success(toastMessage);
      }
    }, 0);
  }, []);

  const updateQty = useCallback(
    (productId: number, qty: number) => {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.max(1, qty) }
            : i
        )
      );
    },
    []
  );

  const removeItem = useCallback((productId: number) => {
    setItems((prev) =>
      prev.filter((i) => i.productId !== productId)
    );

    setTimeout(() => {
      toast("Removed from cart", {
        icon: "🗑️",
      });
    }, 0);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        count,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}