import { useState } from "react";
import { Link } from "react-router";
import { Package, ChevronDown, ChevronUp, ShoppingBag, MapPin, CreditCard, Truck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Order, OrderStatus } from "../../data/mockData";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<OrderStatus, string> = {
  Pending: "⏳",
  Processing: "⚙️",
  Shipped: "🚚",
  Delivered: "✅",
  Cancelled: "❌",
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-stone-800">{order.id}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${STATUS_STYLES[order.status]}`}>
                {STATUS_ICONS[order.status]} {order.status}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{formatDate(order.date)}</p>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-xl text-green-800">₱{order.total.toLocaleString()}</span>
            <p className="text-xs text-stone-400">{order.items.length} item(s)</p>
          </div>
        </div>

        {/* Quick preview */}
        <div className="flex gap-2 flex-wrap mb-4">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.productId} className="w-12 h-12 rounded-lg overflow-hidden border border-stone-100">
              <ImageWithFallback src={item.image} alt={item.productName} className="w-full h-full object-cover" />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-xs text-stone-500 font-semibold">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> {order.paymentMethod}
            </span>
            <span className="flex items-center gap-1">
              {order.deliveryType === "delivery" ? <Truck className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              {order.deliveryType === "delivery" ? "Delivery" : "Pickup"}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-green-700 font-semibold hover:text-green-800"
          >
            {expanded ? "Hide details" : "View details"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-stone-100 px-5 py-4 bg-stone-50">
          <h4 className="font-semibold text-stone-700 text-sm mb-3">Order Items</h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm truncate">{item.productName}</p>
                  <p className="text-xs text-stone-500">Qty: {item.quantity} × ₱{item.price.toLocaleString()}</p>
                </div>
                <span className="font-bold text-stone-700 text-sm">₱{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200">
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-stone-600">
              <div>
                <span className="font-semibold text-stone-700 block mb-1">Payment</span>
                {order.paymentMethod}
              </div>
              <div>
                <span className="font-semibold text-stone-700 block mb-1">Delivery</span>
                {order.deliveryType === "delivery"
                  ? `Home Delivery — ${order.address}`
                  : "Store Pickup — Quezon City Warehouse"}
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-4 text-xs text-stone-500">
              <span>Subtotal: ₱{order.subtotal.toLocaleString()}</span>
              <span>Shipping: ₱{order.shipping}</span>
              <span className="font-bold text-stone-800">Total: ₱{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TransactionsPage() {
  const { getUserOrders, currentUser } = useApp();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-stone-700 mb-3">Please log in to view your orders</h2>
          <Link to="/login" className="bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700">Log In</Link>
        </div>
      </div>
    );
  }

  const allOrders = getUserOrders().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const filtered = filter === "All" ? allOrders : allOrders.filter((o) => o.status === filter);

  const statusCounts: Record<string, number> = { All: allOrders.length };
  allOrders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  return (
    <div className="min-h-screen">
      <div className="glass-section-dark text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Package className="w-6 h-6" /> Order History
          </h1>
          <p className="text-green-300 text-sm mt-1">Track and manage all your orders</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                filter === s
                  ? "bg-green-700 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-green-400"
              }`}
            >
              {s} {statusCounts[s] ? `(${statusCounts[s]})` : "(0)"}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <ShoppingBag className="w-14 h-14 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 font-medium">
              {filter === "All" ? "You have no orders yet." : `No ${filter} orders found.`}
            </p>
            {filter === "All" && (
              <Link to="/products" className="mt-4 inline-block text-green-700 font-semibold hover:underline text-sm">
                Start Shopping →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}