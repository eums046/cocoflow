import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Product,
  User,
  CartItem,
  Order,
  OrderItem,
  StorefrontConfig,
  INITIAL_PRODUCTS,
  INITIAL_STOREFRONT,
} from "../data/mockData";
import {
  apiLogin,
  apiRegister,
  apiSellerLogin,
  apiUpdateUser,
  apiGetProducts,
  apiAddProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetOrders,
  apiPlaceOrder,
  apiUpdateOrderStatus,
  apiGetStorefront,
  apiUpdateStorefront,
} from "../services/api";

// ── Context Type ────────────────────────────────────────────────────────────
interface AppContextType {
  // App state
  isAppLoading: boolean;

  // Auth
  currentUser: User | null;
  isSellerLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    address: string;
    mobile: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  sellerLogin: (email: string, password: string) => Promise<boolean>;
  sellerLogout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart (kept in localStorage — per-device session data)
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  orders: Order[];
  placeOrder: (data: {
    paymentMethod: string;
    deliveryType: "delivery" | "pickup";
    address: string;
  }) => Promise<string>;
  getUserOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: string) => void;

  // Storefront
  storefrontConfig: StorefrontConfig;
  updateStorefront: (config: StorefrontConfig) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── localStorage helpers ────────────────────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}
function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Session data — persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage("cf_user", null)
  );
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState<boolean>(() =>
    loadFromStorage("cf_seller", false)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage("cf_cart", [])
  );

  // Server-backed data — seeded from fallback until API responds
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage("cf_products", INITIAL_PRODUCTS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage<Order[]>("cf_orders", [])
  );
  const [storefrontConfig, setStorefrontConfig] = useState<StorefrontConfig>(
    () => loadFromStorage("cf_storefront", INITIAL_STOREFRONT)
  );

  // Persist cart in localStorage
  useEffect(() => { saveToStorage("cf_cart", cartItems); }, [cartItems]);

  // ── Initial server load ───────────────────────────────────────────────────
  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    // Clear stale demo-account data from localStorage (one-time migration)
    const cachedUser = loadFromStorage<{ id?: string } | null>("cf_user", null);
    if (cachedUser?.id === "u1") {
      localStorage.removeItem("cf_user");
      localStorage.removeItem("cf_orders");
      localStorage.removeItem("cf_cart");
      setCurrentUser(null);
      setOrders([]);
      setCartItems([]);
    }

    const load = async () => {
      try {
        const [serverProducts, serverStorefront, serverOrders] = await Promise.all([
          apiGetProducts().catch(() => null),
          apiGetStorefront().catch(() => null),
          apiGetOrders().catch(() => null),
        ]);

        if (serverProducts) {
          setProducts(serverProducts as Product[]);
          saveToStorage("cf_products", serverProducts);
        }
        if (serverStorefront) {
          setStorefrontConfig(serverStorefront as StorefrontConfig);
          saveToStorage("cf_storefront", serverStorefront);
        }
        if (serverOrders) {
          setOrders(serverOrders as Order[]);
          saveToStorage("cf_orders", serverOrders);
        }
      } catch (e) {
        console.log("Initial data load error — using cached fallback:", e);
      } finally {
        setIsAppLoading(false);
      }
    };

    load();
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await apiLogin(email, password);
      if (result.success && result.user) {
        const user = result.user as User;
        setCurrentUser(user);
        saveToStorage("cf_user", user);
        return true;
      }
      return false;
    } catch (e) {
      console.log("Login error:", e);
      return false;
    }
  }, []);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      address: string;
      mobile: string;
    }): Promise<{ success: boolean; message: string }> => {
      try {
        const result = await apiRegister(data);
        if (result.success && result.user) {
          const user = result.user as User;
          setCurrentUser(user);
          saveToStorage("cf_user", user);
          return { success: true, message: "Registration successful!" };
        }
        return { success: false, message: result.message || "Registration failed." };
      } catch (e: unknown) {
        console.log("Register error:", e);
        const msg = e instanceof Error ? e.message : "Registration failed. Please try again.";
        return { success: false, message: msg };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCartItems([]);
    saveToStorage("cf_user", null);
    saveToStorage("cf_cart", []);
  }, []);

  const sellerLogin = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const result = await apiSellerLogin(email, password);
        if (result.success) {
          setIsSellerLoggedIn(true);
          saveToStorage("cf_seller", true);
          return true;
        }
        return false;
      } catch (e) {
        console.log("Seller login error:", e);
        return false;
      }
    },
    []
  );

  const sellerLogout = useCallback(() => {
    setIsSellerLoggedIn(false);
    saveToStorage("cf_seller", false);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      saveToStorage("cf_user", updated);
      // Sync to server (fire-and-forget)
      apiUpdateUser(updated.id, data).catch((e) =>
        console.log("Profile sync error:", e)
      );
      return updated;
    });
  }, []);

  // ── Products ──────────────────────────────────────────────────────────────
  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newProduct: Product = { ...product, id: `p${Date.now()}` };
    setProducts((prev) => {
      const updated = [...prev, newProduct];
      saveToStorage("cf_products", updated);
      return updated;
    });
    apiAddProduct(newProduct).catch((e) => console.log("Add product sync error:", e));
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === product.id ? product : p));
      saveToStorage("cf_products", updated);
      return updated;
    });
    apiUpdateProduct(product.id, product).catch((e) =>
      console.log("Update product sync error:", e)
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage("cf_products", updated);
      return updated;
    });
    apiDeleteProduct(id).catch((e) => console.log("Delete product sync error:", e));
  }, []);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      return existing
        ? prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveToStorage("cf_cart", []);
  }, []);

  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [cartItems, products]);

  // ── Orders ────────────────────────────────────────────────────────────────
  const placeOrder = useCallback(
    async (data: {
      paymentMethod: string;
      deliveryType: "delivery" | "pickup";
      address: string;
    }): Promise<string> => {
      const year = new Date().getFullYear();
      const orderId = `ORD-${year}-${String(Date.now()).slice(-5)}`;

      // Snapshot current state
      const currentProducts = products;
      const currentCart = cartItems;

      const subtotal = currentCart.reduce((sum, item) => {
        const product = currentProducts.find((p) => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      const shipping = data.deliveryType === "delivery" ? 50 : 0;

      const items: OrderItem[] = currentCart.map((item) => {
        const product = currentProducts.find((p) => p.id === item.productId)!;
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
          image: product.image,
        };
      });

      const newOrder: Order = {
        id: orderId,
        userId: currentUser?.id || "guest",
        date: new Date().toISOString(),
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: "Pending",
        ...data,
      };

      // Optimistic update
      setOrders((prev) => {
        const updated = [...prev, newOrder];
        saveToStorage("cf_orders", updated);
        return updated;
      });

      // Update stock locally
      setProducts((prev) => {
        const updated = prev.map((p) => {
          const cartItem = currentCart.find((c) => c.productId === p.id);
          return cartItem
            ? {
                ...p,
                stock: Math.max(0, p.stock - cartItem.quantity),
                sold: p.sold + cartItem.quantity,
              }
            : p;
        });
        saveToStorage("cf_products", updated);
        return updated;
      });

      clearCart();

      // Sync to server
      try {
        await apiPlaceOrder(newOrder);
      } catch (e) {
        console.log("Order sync error (order saved locally):", e);
      }

      return orderId;
    },
    [cartItems, products, currentUser, clearCart]
  );

  const getUserOrders = useCallback((): Order[] => {
    if (!currentUser) return [];
    return orders.filter((o) => o.userId === currentUser.id);
  }, [orders, currentUser]);

  const updateOrderStatus = useCallback((orderId: string, status: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      saveToStorage("cf_orders", updated);
      return updated;
    });
    apiUpdateOrderStatus(orderId, status).catch((e) =>
      console.log("Order status sync error:", e)
    );
  }, []);

  // ── Storefront ────────────────────────────────────────────────────────────
  const updateStorefront = useCallback((config: StorefrontConfig) => {
    setStorefrontConfig(config);
    saveToStorage("cf_storefront", config);
    apiUpdateStorefront(config).catch((e) =>
      console.log("Storefront sync error:", e)
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAppLoading,
        currentUser,
        isSellerLoggedIn,
        login,
        register,
        logout,
        sellerLogin,
        sellerLogout,
        updateProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        orders,
        placeOrder,
        getUserOrders,
        updateOrderStatus,
        storefrontConfig,
        updateStorefront,
      }}
    >
      {isAppLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5">
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-green-400/20 blur-3xl" />
            <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />
          </div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/15 border border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🥥</span>
              </div>
              <div>
                <div className="text-white font-extrabold text-xl tracking-wide">CocoFiber</div>
                <div className="text-green-300 text-xs font-medium tracking-widest uppercase">Philippines</div>
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-full animate-spin mx-auto mb-3"
              style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
            />
            <p className="text-green-200 text-sm">Loading store data…</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}