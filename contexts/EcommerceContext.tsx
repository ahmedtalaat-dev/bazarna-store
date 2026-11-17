"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type Product } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";
import {
  addCartItem,
  addWishlistItem,
  applyCartCoupon,
  clearRemoteCart,
  getCart,
  getProductById,
  getWishlist,
  normalizeProduct,
  removeCartItem,
  removeWishlistItem,
  updateCartItem,
  type ApiRecord,
} from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  itemId?: string;
  unitPrice?: number;
}

export interface WishlistItem {
  product: Product;
}

interface EcommerceContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartId: string | null;
  cartDiscountedTotal: number | null;
  loading: boolean;
  syncError: string | null;
  addToCart: (
    product: Product,
    quantity: number,
    color?: string,
    size?: string,
  ) => Promise<void>;
  removeFromCart: (itemIdOrProductId: string) => Promise<void>;
  updateCartQuantity: (
    itemIdOrProductId: string,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCart: () => void;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (coupon: string) => Promise<void>;
  cartTotal: number;
  cartCount: number;
  refreshCommerce: () => Promise<void>;
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(
  undefined,
);

const record = (value: unknown): ApiRecord =>
  value && typeof value === "object" ? (value as ApiRecord) : {};

const responseData = (value: unknown) => record(record(value).data);

export function EcommerceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartDiscountedTotal, setCartDiscountedTotal] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const refreshRequest = useRef(0);
  const pendingCartUpdates = useRef(new Map<string, Promise<void>>());
  const [localDataLoaded, setLocalDataLoaded] = useState(false);

  const refreshCommerce = useCallback(async () => {
    const requestId = ++refreshRequest.current;
    if (!user) {
      setCartId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSyncError(null);
    try {
      const [cartResult, wishlistResult] = await Promise.allSettled([
        getCart(),
        getWishlist(),
      ]);

      if (cartResult.status === "fulfilled") {
        const cartData = responseData(cartResult.value);
        const rawItems = Array.isArray(cartData.cartItems)
          ? cartData.cartItems
          : [];
        const mappedItems = await Promise.all(
          rawItems.map(async (value) => {
            const item = record(value);
            const rawProduct = item.product;
            const productId =
              typeof rawProduct === "string"
                ? rawProduct
                : String(record(rawProduct)._id ?? record(rawProduct).id ?? "");
            const product =
              typeof rawProduct === "object" &&
              rawProduct &&
              record(rawProduct).title
                ? normalizeProduct(rawProduct)
                : await getProductById(productId);
            return {
              product,
              quantity: Number(item.quantity ?? 1),
              color: typeof item.color === "string" ? item.color : undefined,
              itemId: String(item._id ?? ""),
              unitPrice: Number(item.price ?? product.price),
            } satisfies CartItem;
          }),
        );
        if (requestId === refreshRequest.current) {
          setCart(mappedItems);
          setCartId(String(cartData._id ?? ""));
          setCartDiscountedTotal(
            Number.isFinite(Number(cartData.totalPriceAfterDiscount))
              ? Number(cartData.totalPriceAfterDiscount)
              : null,
          );
        }
      } else if (
        record(cartResult.reason).message &&
        String(record(cartResult.reason).message).includes("404")
      ) {
        if (requestId === refreshRequest.current) {
          setCart([]);
          setCartId(null);
          setCartDiscountedTotal(null);
        }
      } else {
        throw cartResult.reason;
      }

      if (wishlistResult.status === "fulfilled") {
        const products = await Promise.all(
          wishlistResult.value.map(async (value) => {
            const product = record(value);
            return {
              product:
                product._id && product.title
                  ? normalizeProduct(product)
                  : await getProductById(String(product)),
            };
          }),
        );
        if (requestId === refreshRequest.current) setWishlist(products);
      } else {
        throw wishlistResult.reason;
      }
    } catch (error) {
      if (requestId === refreshRequest.current) {
        const message =
          error instanceof Error ? error.message : "Could not sync your cart.";
        setSyncError(message);
        console.error(
          "Could not synchronize cart or wishlist with the API.",
          error,
        );
      }
    } finally {
      if (requestId === refreshRequest.current) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      void refreshCommerce();
      return;
    }

    refreshRequest.current += 1;
    try {
      const savedCart = localStorage.getItem("cart");
      const savedWishlist = localStorage.getItem("wishlist");
      const parsedCart: unknown = savedCart ? JSON.parse(savedCart) : [];
      const parsedWishlist: unknown = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
      setCart(
        Array.isArray(parsedCart)
          ? parsedCart.filter(
              (item): item is CartItem =>
                Boolean(
                  item &&
                    typeof item === "object" &&
                    (item as CartItem).product?.id,
                ),
            )
          : [],
      );
      setWishlist(
        Array.isArray(parsedWishlist)
          ? parsedWishlist.filter(
              (item): item is WishlistItem =>
                Boolean(
                  item &&
                    typeof item === "object" &&
                    (item as WishlistItem).product?.id,
                ),
            )
          : [],
      );
    } catch (error) {
      setSyncError("Could not load saved cart data from this browser.");
      console.error("Could not load saved cart data.", error);
    } finally {
      setLoading(false);
      setLocalDataLoaded(true);
    }
  }, [authLoading, user, refreshCommerce]);

  useEffect(() => {
    if (!authLoading && !user && localDataLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [authLoading, user, localDataLoaded, cart, wishlist]);

  const addToCart = useCallback(
    async (
      product: Product,
      quantity: number,
      color?: string,
      size?: string,
    ) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be a positive whole number.");
      }
      if (user) {
        setCart((items) => {
          const existing = items.find(
            (item) =>
              item.product.id === product.id &&
              item.color === color &&
              item.size === size,
          );
          return existing
            ? items.map((item) =>
                item === existing
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              )
            : [...items, { product, quantity, color, size }];
        });
        try {
          await addCartItem(product.id, color, quantity);
        } catch (error) {
          setCart((items) => {
            const existing = items.find(
              (item) =>
                item.product.id === product.id &&
                item.color === color &&
                item.size === size,
            );
            if (!existing) return items;
            const remainingQuantity = existing.quantity - quantity;
            return remainingQuantity > 0
              ? items.map((item) =>
                  item === existing
                    ? { ...item, quantity: remainingQuantity }
                    : item,
                )
              : items.filter((item) => item !== existing);
          });
          void refreshCommerce();
          throw error;
        }
        void refreshCommerce();
        return;
      }
      setCart((items) => {
        const existing = items.find(
          (item) =>
            item.product.id === product.id &&
            item.color === color &&
            item.size === size,
        );
        return existing
          ? items.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          : [...items, { product, quantity, color, size }];
      });
    },
    [user, refreshCommerce],
  );

  const removeFromCart = useCallback(
    async (itemIdOrProductId: string) => {
      if (user) {
        const line = cart.find(
          (item) =>
            item.itemId === itemIdOrProductId ||
            item.product.id === itemIdOrProductId,
        );
        if (line?.itemId) await removeCartItem(line.itemId);
        await refreshCommerce();
        return;
      }
      setCart((items) =>
        items.filter(
          (item) =>
            item.itemId !== itemIdOrProductId &&
            item.product.id !== itemIdOrProductId,
        ),
      );
    },
    [cart, user, refreshCommerce],
  );

  const updateCartQuantity = useCallback(
    async (itemIdOrProductId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(itemIdOrProductId);
        return;
      }
      if (!Number.isInteger(quantity)) {
        throw new Error("Quantity must be a positive whole number.");
      }
      if (user) {
        const line = cart.find(
          (item) =>
            item.itemId === itemIdOrProductId ||
            item.product.id === itemIdOrProductId,
        );
        if (!line?.itemId) throw new Error("Cart item was not found.");
        const itemId = line.itemId;
        const previousQuantity = line.quantity;
        const previousUpdate =
          pendingCartUpdates.current.get(itemId) ?? Promise.resolve();
        const updateRequest = previousUpdate
          .catch(() => undefined)
          .then(async () => {
            await updateCartItem(itemId, quantity);
          });
        pendingCartUpdates.current.set(itemId, updateRequest);
        setCart((items) =>
          items.map((item) =>
            item.itemId === itemId ? { ...item, quantity } : item,
          ),
        );
        setCartDiscountedTotal(null);
        try {
          await updateRequest;
        } catch (error) {
          if (pendingCartUpdates.current.get(itemId) === updateRequest) {
            pendingCartUpdates.current.delete(itemId);
            setCart((items) =>
              items.map((item) =>
                item.itemId === itemId
                  ? { ...item, quantity: previousQuantity }
                  : item,
              ),
            );
            void refreshCommerce();
          }
          throw error;
        }
        if (pendingCartUpdates.current.get(itemId) === updateRequest) {
          pendingCartUpdates.current.delete(itemId);
          void refreshCommerce();
        }
        return;
      }
      setCart((items) =>
        items.map((item) =>
          item.itemId === itemIdOrProductId ||
          item.product.id === itemIdOrProductId
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [cart, user, removeFromCart, refreshCommerce],
  );

  const resetCart = useCallback(() => {
    refreshRequest.current += 1;
    setCart([]);
    setCartId(null);
    setCartDiscountedTotal(null);
    setLoading(false);
    setSyncError(null);
  }, []);

  const clearCart = useCallback(async () => {
    if (user) await clearRemoteCart();
    resetCart();
  }, [user, resetCart]);

  const addToWishlist = useCallback(
    async (product: Product) => {
      if (user) {
        const wasInWishlist = wishlist.some(
          (item) => item.product.id === product.id,
        );
        setWishlist((items) =>
          items.some((item) => item.product.id === product.id)
            ? items
            : [...items, { product }],
        );
        try {
          await addWishlistItem(product.id);
        } catch (error) {
          if (!wasInWishlist) {
            setWishlist((items) =>
              items.filter((item) => item.product.id !== product.id),
            );
          }
          void refreshCommerce();
          throw error;
        }
        void refreshCommerce();
        return;
      }
      setWishlist((items) =>
        items.some((item) => item.product.id === product.id)
          ? items
          : [...items, { product }],
      );
    },
    [user, wishlist, refreshCommerce],
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (user) {
        await removeWishlistItem(productId);
        await refreshCommerce();
        return;
      }
      setWishlist((items) =>
        items.filter((item) => item.product.id !== productId),
      );
    },
    [user, refreshCommerce],
  );

  const applyCoupon = useCallback(
    async (coupon: string) => {
      if (!user) throw new Error("Sign in to apply a coupon.");
      const payload = await applyCartCoupon(coupon);
      const data = responseData(payload);
      setCartDiscountedTotal(Number(data.totalPriceAfterDiscount));
      await refreshCommerce();
    },
    [user, refreshCommerce],
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + (item.unitPrice ?? item.product.price) * item.quantity,
    0,
  );
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartId,
      cartDiscountedTotal,
      loading,
      syncError,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      resetCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist: (productId: string) =>
        wishlist.some((item) => item.product.id === productId),
      applyCoupon,
      cartTotal,
      cartCount,
      refreshCommerce,
    }),
    [
      cart,
      wishlist,
      cartId,
      cartDiscountedTotal,
      loading,
      syncError,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      resetCart,
      addToWishlist,
      removeFromWishlist,
      applyCoupon,
      cartTotal,
      cartCount,
      refreshCommerce,
    ],
  );

  return (
    <EcommerceContext.Provider value={value}>
      {children}
    </EcommerceContext.Provider>
  );
}

export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error("useEcommerce must be used within EcommerceProvider");
  }
  return context;
}
