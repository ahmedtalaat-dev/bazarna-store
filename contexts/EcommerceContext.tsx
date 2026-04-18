'use client';

// Imports
import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Product } from '@/data/products';

// CartItem interface
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

// WishlistItem interface
export interface WishlistItem {
  product: Product;
}

// Ecommerce interface
interface EcommerceContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

//Create Ecommerce Context
const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

// Ecommerce Provider
export function EcommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart items to ensure they have a valid product
        if (Array.isArray(parsedCart)) {
          const validCart = parsedCart.filter(item => item && item.product && typeof item.product.price === 'number');
          setCart(validCart);
        }
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }

    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          const validWishlist = parsedWishlist.filter(item => item && item.product);
          setWishlist(validWishlist);
        }
      } catch (e) {
        console.error('Failed to load wishlist:', e);
      }
    }

    setMounted(true);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const addToCart = (product: Product, quantity: number, color?: string, size?: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id && item.size === size);

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { product, quantity, size }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.product.id === product.id)) {
        return prevWishlist;
      }
      return [...prevWishlist, { product }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item?.product?.price ?? 0;
    const quantity = item?.quantity ?? 0;
    return total + price * quantity;
  }, 0);
  
  const cartCount = cart.reduce((count, item) => count + (item?.quantity ?? 0), 0);

  return (
    <EcommerceContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
}

// Main Page
export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error('useEcommerce must be used within EcommerceProvider');
  }
  return context;
}
