export type ProductCategory =
  | "Home & Living"
  | "Garden & Agriculture"
  | "Construction"
  | "Handicrafts"
  | "Industrial";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description: string;
  image: string;
  tags: ("new" | "trending" | "bestseller" | "sale")[];
  sold: number;
  rating: number;
  reviews: number;
  weight: string;
  dimensions?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  address: string;
  mobile: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  deliveryType: "delivery" | "pickup";
  address: string;
}

export interface StorefrontConfig {
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  featuredProductIds: string[];
  newArrivalsIds: string[];
  trendingIds: string[];
  bestsellerIds: string[];
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Natural Coir Doormat",
    category: "Home & Living",
    price: 450,
    stock: 85,
    description:
      "Premium natural coconut coir doormat. Highly absorbent and durable. Perfect for home entryways and offices. 100% eco-friendly and biodegradable.",
    image:
      "https://images.unsplash.com/photo-1673157057039-30024fb47ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["trending", "bestseller"],
    sold: 234,
    rating: 4.8,
    reviews: 56,
    weight: "1.5 kg",
    dimensions: "60cm x 40cm",
  },
  {
    id: "p2",
    name: "Coir Twisted Rope (10m)",
    category: "Industrial",
    price: 280,
    stock: 120,
    description:
      "Strong and durable twisted coir rope, 10 meters long. Suitable for tying, binding, nautical use, and decorative purposes.",
    image:
      "https://images.unsplash.com/photo-1661819705374-3859f7a686c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["bestseller"],
    sold: 412,
    rating: 4.6,
    reviews: 89,
    weight: "0.8 kg",
  },
  {
    id: "p3",
    name: "Coir Garden Pot Liner",
    category: "Garden & Agriculture",
    price: 180,
    stock: 200,
    description:
      "Natural coir liner for hanging baskets and garden pots. Retains moisture while providing excellent drainage for healthy plants.",
    image:
      "https://images.unsplash.com/photo-1770891290495-8747a7a87e89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["new", "trending"],
    sold: 178,
    rating: 4.7,
    reviews: 34,
    weight: "0.3 kg",
    dimensions: "30cm diameter",
  },
  {
    id: "p4",
    name: "Coir Geotextile Sheet",
    category: "Construction",
    price: 850,
    stock: 45,
    description:
      "Heavy-duty coir geotextile for soil erosion control, slope stabilization, and construction site management.",
    image:
      "https://images.unsplash.com/photo-1764926343896-2e38b28f7d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["bestseller"],
    sold: 89,
    rating: 4.9,
    reviews: 23,
    weight: "2.5 kg",
    dimensions: "2m x 1m",
  },
  {
    id: "p5",
    name: "Coir Mulch Mat",
    category: "Garden & Agriculture",
    price: 350,
    stock: 60,
    description:
      "Organic coir mulch mat for weed control and moisture retention in gardens, flower beds, and vegetable patches.",
    image:
      "https://images.unsplash.com/photo-1772581110463-30dc03456b90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["trending"],
    sold: 156,
    rating: 4.5,
    reviews: 41,
    weight: "1.2 kg",
    dimensions: "1m x 1m",
  },
  {
    id: "p6",
    name: "Coir Woven Basket Set",
    category: "Handicrafts",
    price: 620,
    stock: 30,
    description:
      "Handwoven coconut coir basket set (3 pieces). Perfect for storage, décor, and gifting. Made by Filipino artisans.",
    image:
      "https://images.unsplash.com/photo-1768102365643-2afa10b70f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["new", "trending"],
    sold: 67,
    rating: 4.9,
    reviews: 18,
    weight: "1.1 kg",
  },
  {
    id: "p7",
    name: "Raw Coir Fiber Bale",
    category: "Industrial",
    price: 1200,
    stock: 25,
    description:
      "High-quality raw coconut coir fiber bale for industrial use, composting, horticulture, and manufacturing applications.",
    image:
      "https://images.unsplash.com/photo-1681674300478-4a0d546c9829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["bestseller"],
    sold: 45,
    rating: 4.7,
    reviews: 12,
    weight: "10 kg",
  },
  {
    id: "p8",
    name: "Coir Decorative Planter",
    category: "Home & Living",
    price: 390,
    stock: 55,
    description:
      "Beautiful coconut coir decorative planter for indoor and outdoor plants. Sustainable, biodegradable, and stylish.",
    image:
      "https://images.unsplash.com/photo-1643171785612-163ed13cf1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["new"],
    sold: 123,
    rating: 4.6,
    reviews: 29,
    weight: "0.9 kg",
    dimensions: "25cm x 25cm",
  },
  {
    id: "p9",
    name: "Coir Erosion Control Blanket",
    category: "Construction",
    price: 950,
    stock: 20,
    description:
      "Biodegradable coir erosion control blanket for hillside slopes, riverbanks, and construction sites.",
    image:
      "https://images.unsplash.com/photo-1625535927032-dd38fdf54f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["bestseller"],
    sold: 34,
    rating: 4.8,
    reviews: 8,
    weight: "3.0 kg",
    dimensions: "3m x 1m",
  },
  {
    id: "p10",
    name: "Coir Seedling Tray",
    category: "Garden & Agriculture",
    price: 220,
    stock: 150,
    description:
      "Biodegradable coir seedling tray for nurseries and home gardens. Promotes healthy root growth and easy transplanting.",
    image:
      "https://images.unsplash.com/photo-1691232386478-3464676d9e9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["new", "trending"],
    sold: 289,
    rating: 4.4,
    reviews: 67,
    weight: "0.5 kg",
    dimensions: "50cm x 30cm",
  },
];

export const DEMO_USER: User = {
  id: "u1",
  email: "juan@example.com",
  password: "password123",
  name: "Juan dela Cruz",
  address: "123 Mango Street, Barangay San Jose, Quezon City, Metro Manila 1100",
  mobile: "09171234567",
  createdAt: "2024-11-01",
};

export const SELLER_CREDENTIALS = {
  email: "seller@cocofiber.ph",
  password: "seller123",
};

export const INITIAL_STOREFRONT: StorefrontConfig = {
  heroTitle: "Eco-Friendly Products from the Heart of the Philippines",
  heroSubtitle:
    "Discover premium coconut coir products — sustainable, durable, and made with Filipino craftsmanship.",
  announcement:
    "🎉 Grand Opening Sale! Get 15% off your first order. Use code: COCOFIBER15",
  featuredProductIds: ["p1", "p4", "p6", "p9"],
  newArrivalsIds: ["p3", "p6", "p8", "p10"],
  trendingIds: ["p1", "p3", "p5", "p6", "p10"],
  bestsellerIds: ["p1", "p2", "p4", "p7", "p9"],
};

export const generateMockOrders = (userId: string): Order[] => [
  {
    id: "ORD-2024-001",
    userId,
    date: "2024-12-01T10:30:00",
    items: [
      {
        productId: "p1",
        productName: "Natural Coir Doormat",
        quantity: 2,
        price: 450,
        image:
          "https://images.unsplash.com/photo-1673157057039-30024fb47ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
      {
        productId: "p3",
        productName: "Coir Garden Pot Liner",
        quantity: 1,
        price: 180,
        image:
          "https://images.unsplash.com/photo-1770891290495-8747a7a87e89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 1080,
    shipping: 50,
    total: 1130,
    status: "Delivered",
    paymentMethod: "GCash",
    deliveryType: "delivery",
    address:
      "123 Mango Street, Barangay San Jose, Quezon City, Metro Manila 1100",
  },
  {
    id: "ORD-2024-002",
    userId,
    date: "2024-12-18T14:15:00",
    items: [
      {
        productId: "p2",
        productName: "Coir Twisted Rope (10m)",
        quantity: 3,
        price: 280,
        image:
          "https://images.unsplash.com/photo-1661819705374-3859f7a686c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 840,
    shipping: 50,
    total: 890,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    deliveryType: "delivery",
    address:
      "123 Mango Street, Barangay San Jose, Quezon City, Metro Manila 1100",
  },
  {
    id: "ORD-2025-001",
    userId,
    date: "2025-01-10T09:00:00",
    items: [
      {
        productId: "p6",
        productName: "Coir Woven Basket Set",
        quantity: 1,
        price: 620,
        image:
          "https://images.unsplash.com/photo-1768102365643-2afa10b70f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 620,
    shipping: 0,
    total: 620,
    status: "Delivered",
    paymentMethod: "Bank Transfer",
    deliveryType: "pickup",
    address: "",
  },
  {
    id: "ORD-2025-002",
    userId,
    date: "2025-03-20T11:45:00",
    items: [
      {
        productId: "p5",
        productName: "Coir Mulch Mat",
        quantity: 2,
        price: 350,
        image:
          "https://images.unsplash.com/photo-1772581110463-30dc03456b90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
      {
        productId: "p10",
        productName: "Coir Seedling Tray",
        quantity: 4,
        price: 220,
        image:
          "https://images.unsplash.com/photo-1691232386478-3464676d9e9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 1580,
    shipping: 50,
    total: 1630,
    status: "Shipped",
    paymentMethod: "GCash",
    deliveryType: "delivery",
    address:
      "123 Mango Street, Barangay San Jose, Quezon City, Metro Manila 1100",
  },
  {
    id: "ORD-2025-003",
    userId,
    date: "2025-03-22T16:00:00",
    items: [
      {
        productId: "p8",
        productName: "Coir Decorative Planter",
        quantity: 1,
        price: 390,
        image:
          "https://images.unsplash.com/photo-1643171785612-163ed13cf1b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 390,
    shipping: 50,
    total: 440,
    status: "Processing",
    paymentMethod: "GCash",
    deliveryType: "delivery",
    address:
      "123 Mango Street, Barangay San Jose, Quezon City, Metro Manila 1100",
  },
];

// Mock sales data for reports
export const DAILY_SALES_DATA = [
  { day: "Mon", sales: 3200 },
  { day: "Tue", sales: 5400 },
  { day: "Wed", sales: 4100 },
  { day: "Thu", sales: 7800 },
  { day: "Fri", sales: 9200 },
  { day: "Sat", sales: 11500 },
  { day: "Sun", sales: 6700 },
];

export const MONTHLY_SALES_DATA = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 61000 },
  { month: "Apr", sales: 48000 },
  { month: "May", sales: 59000 },
  { month: "Jun", sales: 73000 },
  { month: "Jul", sales: 68000 },
  { month: "Aug", sales: 82000 },
  { month: "Sep", sales: 77000 },
  { month: "Oct", sales: 91000 },
  { month: "Nov", sales: 108000 },
  { month: "Dec", sales: 125000 },
];
