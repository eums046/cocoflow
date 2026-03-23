import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

// ── Types ──────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  tags: string[];
  sold: number;
  rating: number;
  reviews: number;
  weight: string;
  dimensions?: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  address: string;
  mobile: string;
  createdAt: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  deliveryType: string;
  address: string;
}

interface StorefrontConfig {
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  featuredProductIds: string[];
  newArrivalsIds: string[];
  trendingIds: string[];
  bestsellerIds: string[];
}

// ── Seed Data ──────────────────────────────────────────────────────────────
const SELLER_CREDENTIALS = { email: "seller@cocofiber.ph", password: "seller123" };

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "Natural Coir Doormat", category: "Home & Living", price: 450, stock: 85, description: "Premium natural coconut coir doormat. Highly absorbent and durable. Perfect for home entryways and offices. 100% eco-friendly and biodegradable.", image: "https://images.unsplash.com/photo-1673157057039-30024fb47ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["trending", "bestseller"], sold: 234, rating: 4.8, reviews: 56, weight: "1.5 kg", dimensions: "60cm x 40cm" },
  { id: "p2", name: "Coir Twisted Rope (10m)", category: "Industrial", price: 280, stock: 120, description: "Strong and durable twisted coir rope, 10 meters long. Suitable for tying, binding, nautical use, and decorative purposes.", image: "https://images.unsplash.com/photo-1661819705374-3859f7a686c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["bestseller"], sold: 412, rating: 4.6, reviews: 89, weight: "0.8 kg" },
  { id: "p3", name: "Coir Garden Pot Liner", category: "Garden & Agriculture", price: 180, stock: 200, description: "Natural coir liner for hanging baskets and garden pots. Retains moisture while providing excellent drainage for healthy plants.", image: "https://images.unsplash.com/photo-1770891290495-8747a7a87e89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["new", "trending"], sold: 178, rating: 4.7, reviews: 34, weight: "0.3 kg", dimensions: "30cm diameter" },
  { id: "p4", name: "Coir Geotextile Sheet", category: "Construction", price: 850, stock: 45, description: "Heavy-duty coir geotextile for soil erosion control, slope stabilization, and construction site management.", image: "https://images.unsplash.com/photo-1764926343896-2e38b28f7d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["bestseller"], sold: 89, rating: 4.9, reviews: 23, weight: "2.5 kg", dimensions: "2m x 1m" },
  { id: "p5", name: "Coir Mulch Mat", category: "Garden & Agriculture", price: 350, stock: 60, description: "Organic coir mulch mat for weed control and moisture retention in gardens, flower beds, and vegetable patches.", image: "https://images.unsplash.com/photo-1772581110463-30dc03456b90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["trending"], sold: 156, rating: 4.5, reviews: 41, weight: "1.2 kg", dimensions: "1m x 1m" },
  { id: "p6", name: "Coir Woven Basket Set", category: "Handicrafts", price: 620, stock: 30, description: "Handwoven coconut coir basket set (3 pieces). Perfect for storage, décor, and gifting. Made by Filipino artisans.", image: "https://images.unsplash.com/photo-1768102365643-2afa10b70f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["new", "trending"], sold: 67, rating: 4.9, reviews: 18, weight: "1.1 kg" },
  { id: "p7", name: "Raw Coir Fiber Bale", category: "Industrial", price: 1200, stock: 25, description: "High-quality raw coconut coir fiber bale for industrial use, composting, horticulture, and manufacturing applications.", image: "https://images.unsplash.com/photo-1681674300478-4a0d546c9829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["bestseller"], sold: 45, rating: 4.7, reviews: 12, weight: "10 kg" },
  { id: "p8", name: "Coir Decorative Planter", category: "Home & Living", price: 390, stock: 55, description: "Beautiful coconut coir decorative planter for indoor and outdoor plants. Sustainable, biodegradable, and stylish.", image: "https://images.unsplash.com/photo-1643171785612-163ed13cf1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["new"], sold: 123, rating: 4.6, reviews: 29, weight: "0.9 kg", dimensions: "25cm x 25cm" },
  { id: "p9", name: "Coir Erosion Control Blanket", category: "Construction", price: 950, stock: 20, description: "Biodegradable coir erosion control blanket for hillside slopes, riverbanks, and construction sites.", image: "https://images.unsplash.com/photo-1625535927032-dd38fdf54f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["bestseller"], sold: 34, rating: 4.8, reviews: 8, weight: "3.0 kg", dimensions: "3m x 1m" },
  { id: "p10", name: "Coir Seedling Tray", category: "Garden & Agriculture", price: 220, stock: 150, description: "Biodegradable coir seedling tray for nurseries and home gardens. Promotes healthy root growth and easy transplanting.", image: "https://images.unsplash.com/photo-1691232386478-3464676d9e9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600", tags: ["new", "trending"], sold: 289, rating: 4.4, reviews: 67, weight: "0.5 kg", dimensions: "50cm x 30cm" },
];

const INITIAL_STOREFRONT: StorefrontConfig = {
  heroTitle: "Eco-Friendly Products from the Heart of the Philippines",
  heroSubtitle: "Discover premium coconut coir products — sustainable, durable, and made with Filipino craftsmanship.",
  announcement: "🎉 Grand Opening Sale! Get 15% off your first order. Use code: COCOFIBER15",
  featuredProductIds: ["p1", "p4", "p6", "p9"],
  newArrivalsIds: ["p3", "p6", "p8", "p10"],
  trendingIds: ["p1", "p3", "p5", "p6", "p10"],
  bestsellerIds: ["p1", "p2", "p4", "p7", "p9"],
};

// ── KV Helpers ─────────────────────────────────────────────────────────────
async function getProducts(): Promise<Product[]> {
  try {
    const data = await kv.get("cf:products");
    if (!data) { await kv.set("cf:products", INITIAL_PRODUCTS); return INITIAL_PRODUCTS; }
    return data as Product[];
  } catch (e) { console.log("getProducts error:", e); return INITIAL_PRODUCTS; }
}

async function getUsers(): Promise<User[]> {
  try {
    const data = await kv.get("cf:users");
    if (!data) { await kv.set("cf:users", []); return []; }
    return data as User[];
  } catch (e) { console.log("getUsers error:", e); return []; }
}

async function getOrders(): Promise<Order[]> {
  try {
    const data = await kv.get("cf:orders");
    if (!data) { await kv.set("cf:orders", []); return []; }
    return data as Order[];
  } catch (e) { console.log("getOrders error:", e); return []; }
}

async function getStorefront(): Promise<StorefrontConfig> {
  try {
    const data = await kv.get("cf:storefront");
    if (!data) { await kv.set("cf:storefront", INITIAL_STOREFRONT); return INITIAL_STOREFRONT; }
    return data as StorefrontConfig;
  } catch (e) { console.log("getStorefront error:", e); return INITIAL_STOREFRONT; }
}

// ── App ────────────────────────────────────────────────────────────────────
const app = new Hono();

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// Health
app.get("/make-server-10539df9/health", (c) => c.json({ status: "ok" }));

// ── Auth ───────────────────────────────────────────────────────────────────
app.post("/make-server-10539df9/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, address, mobile } = body;
    if (!email || !password || !name || !address || !mobile) {
      return c.json({ success: false, message: "All fields are required." }, 400);
    }
    const users = await getUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return c.json({ success: false, message: "Email already registered." }, 400);
    const newUser: User = {
      id: `u${Date.now()}`,
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      address: address.trim(),
      mobile: mobile.trim(),
      createdAt: new Date().toISOString(),
    };
    await kv.set("cf:users", [...users, newUser]);
    return c.json({ success: true, user: newUser });
  } catch (e) {
    console.log("Register error:", e);
    return c.json({ success: false, message: `Registration error: ${e}` }, 500);
  }
});

app.post("/make-server-10539df9/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const users = await getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return c.json({ success: false, message: "Invalid email or password." }, 401);
    return c.json({ success: true, user });
  } catch (e) {
    console.log("Login error:", e);
    return c.json({ success: false, message: `Login error: ${e}` }, 500);
  }
});

app.post("/make-server-10539df9/auth/seller-login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (
      email === SELLER_CREDENTIALS.email &&
      password === SELLER_CREDENTIALS.password
    ) {
      return c.json({ success: true });
    }
    return c.json({ success: false, message: "Invalid seller credentials." }, 401);
  } catch (e) {
    console.log("Seller login error:", e);
    return c.json({ success: false, message: `Seller login error: ${e}` }, 500);
  }
});

// ── Users ──────────────────────────────────────────────────────────────────
app.get("/make-server-10539df9/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const users = await getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return c.json({ error: "User not found." }, 404);
    return c.json(user);
  } catch (e) {
    console.log("Get user error:", e);
    return c.json({ error: `Get user error: ${e}` }, 500);
  }
});

app.put("/make-server-10539df9/users/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const users = await getUsers();
    const updated = users.map((u) => (u.id === id ? { ...u, ...body } : u));
    await kv.set("cf:users", updated);
    const result = updated.find((u) => u.id === id);
    return c.json(result);
  } catch (e) {
    console.log("Update user error:", e);
    return c.json({ error: `Update user error: ${e}` }, 500);
  }
});

// ── Products ───────────────────────────────────────────────────────────────
app.get("/make-server-10539df9/products", async (c) => {
  try {
    return c.json(await getProducts());
  } catch (e) {
    console.log("Get products error:", e);
    return c.json({ error: `Get products error: ${e}` }, 500);
  }
});

app.post("/make-server-10539df9/products", async (c) => {
  try {
    const product = await c.req.json();
    const products = await getProducts();
    await kv.set("cf:products", [...products, product]);
    return c.json(product, 201);
  } catch (e) {
    console.log("Add product error:", e);
    return c.json({ error: `Add product error: ${e}` }, 500);
  }
});

app.put("/make-server-10539df9/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await c.req.json();
    const products = await getProducts();
    const updated = products.map((p) => (p.id === id ? product : p));
    await kv.set("cf:products", updated);
    return c.json(product);
  } catch (e) {
    console.log("Update product error:", e);
    return c.json({ error: `Update product error: ${e}` }, 500);
  }
});

app.delete("/make-server-10539df9/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const products = await getProducts();
    await kv.set("cf:products", products.filter((p) => p.id !== id));
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete product error:", e);
    return c.json({ error: `Delete product error: ${e}` }, 500);
  }
});

// ── Orders ─────────────────────────────────────────────────────────────────
app.get("/make-server-10539df9/orders", async (c) => {
  try {
    return c.json(await getOrders());
  } catch (e) {
    console.log("Get orders error:", e);
    return c.json({ error: `Get orders error: ${e}` }, 500);
  }
});

app.get("/make-server-10539df9/orders/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const orders = await getOrders();
    return c.json(orders.filter((o) => o.userId === userId));
  } catch (e) {
    console.log("Get user orders error:", e);
    return c.json({ error: `Get user orders error: ${e}` }, 500);
  }
});

app.post("/make-server-10539df9/orders", async (c) => {
  try {
    const order = await c.req.json();
    const [orders, products] = await Promise.all([getOrders(), getProducts()]);

    // Update stock & sold counts
    const updatedProducts = products.map((p) => {
      const orderItem = (order.items as OrderItem[]).find((i) => i.productId === p.id);
      if (orderItem) {
        return {
          ...p,
          stock: Math.max(0, p.stock - orderItem.quantity),
          sold: p.sold + orderItem.quantity,
        };
      }
      return p;
    });

    await Promise.all([
      kv.set("cf:orders", [...orders, order]),
      kv.set("cf:products", updatedProducts),
    ]);

    return c.json(order, 201);
  } catch (e) {
    console.log("Place order error:", e);
    return c.json({ error: `Place order error: ${e}` }, 500);
  }
});

app.put("/make-server-10539df9/orders/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    const orders = await getOrders();
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    await kv.set("cf:orders", updated);
    return c.json({ success: true });
  } catch (e) {
    console.log("Update order status error:", e);
    return c.json({ error: `Update order status error: ${e}` }, 500);
  }
});

// ── Storefront ─────────────────────────────────────────────────────────────
app.get("/make-server-10539df9/storefront", async (c) => {
  try {
    return c.json(await getStorefront());
  } catch (e) {
    console.log("Get storefront error:", e);
    return c.json({ error: `Get storefront error: ${e}` }, 500);
  }
});

app.put("/make-server-10539df9/storefront", async (c) => {
  try {
    const config = await c.req.json();
    await kv.set("cf:storefront", config);
    return c.json(config);
  } catch (e) {
    console.log("Update storefront error:", e);
    return c.json({ error: `Update storefront error: ${e}` }, 500);
  }
});

Deno.serve(app.fetch);