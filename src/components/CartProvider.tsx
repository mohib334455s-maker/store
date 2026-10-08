"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  sku: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => { ok: boolean; message: string };
  update: (sku: string, quantity: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "northlane-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw) as CartItem[]);
      }
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (item, quantity = 1) => {
      if (item.stock <= 0) {
        return { ok: false, message: "Out of Stock" };
      }
      let message = "Added to cart.";
      let ok = true;
      setItems((current) => {
        const existing = current.find((entry) => entry.sku === item.sku);
        const nextQty = (existing?.quantity ?? 0) + quantity;
        if (nextQty > item.stock) {
          ok = false;
          message = `Only ${item.stock} in stock.`;
          return current;
        }
        if (existing) {
          return current.map((entry) => (entry.sku === item.sku ? { ...entry, quantity: nextQty, stock: item.stock } : entry));
        }
        return [...current, { ...item, quantity }];
      });
      return { ok, message };
    };

    return {
      items,
      ready,
      add,
      update: (sku, quantity) => {
        setItems((current) =>
          current
            .map((item) => (item.sku === sku ? { ...item, quantity: Math.min(Math.max(quantity, 0), item.stock) } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      remove: (sku) => setItems((current) => current.filter((item) => item.sku !== sku)),
      clear: () => setItems([]),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
