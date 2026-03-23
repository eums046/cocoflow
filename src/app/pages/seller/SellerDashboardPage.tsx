import { TrendingUp, Package, ShoppingBag, AlertTriangle, Users, DollarSign } from "lucide-react";
import { useApp } from "../../context/AppContext";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl p-5" style={{background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px) saturate(150%)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 6px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.75)"}}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 mb-1">{title}</p>
          <p className="text-2xl font-extrabold text-stone-800">{value}</p>
          {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export function SellerDashboardPage() {
  const { products, orders } = useApp();

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.date).toDateString() === today
  );
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthOrders = orders.filter((o) => {
    const d = new Date(o.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthSales = monthOrders.reduce((sum, o) => sum + o.total, 0);

  const totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const lowStock = products.filter((p) => p.stock <= 10);
  const activeOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  );
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

  const uniqueCustomers = new Set(orders.map((o) => o.userId)).size;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-stone-800">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Sales"
          value={`₱${todaySales.toLocaleString()}`}
          subtitle={`${todayOrders.length} orders today`}
          icon={DollarSign}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          title="This Month"
          value={`₱${monthSales.toLocaleString()}`}
          subtitle={`${monthOrders.length} orders this month`}
          icon={TrendingUp}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${totalSales.toLocaleString()}`}
          subtitle={`${orders.length} total orders`}
          icon={ShoppingBag}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          title="Customers"
          value={String(uniqueCustomers)}
          subtitle={`${activeOrders.length} active orders`}
          icon={Users}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-stone-800 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-green-700" /> Recent Orders
              </h2>
              <span className="text-xs text-stone-400">{orders.length} total</span>
            </div>
            <div className="divide-y divide-stone-50">
              {recentOrders.length === 0 ? (
                <p className="text-center text-stone-400 py-8 text-sm">No orders yet.</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{order.id}</p>
                      <p className="text-xs text-stone-400">{formatDate(order.date)} · {order.items.length} item(s)</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status as OrderStatus]}`}>
                        {order.status}
                      </span>
                      <p className="text-sm font-bold text-stone-700 mt-0.5">₱{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alerts + Stock */}
        <div className="space-y-5">
          {/* Order Status Summary */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <h2 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-green-700" /> Order Status
            </h2>
            {(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              return (
                <div key={status} className="flex items-center justify-between py-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status]}`}>
                    {status}
                  </span>
                  <span className="font-bold text-stone-700 text-sm">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <h2 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Alerts
            </h2>
            {lowStock.length === 0 ? (
              <p className="text-sm text-green-600">✓ All products are well-stocked!</p>
            ) : (
              <div className="space-y-2">
                {lowStock.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-xs text-stone-700 truncate max-w-[140px]">{p.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.stock === 0 ? "Out" : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <h2 className="font-bold text-stone-800 mb-3">Top Sellers</h2>
            <div className="space-y-2">
              {[...products]
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 4)
                .map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-100 rounded-full text-xs font-bold text-green-700 flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs text-stone-700 flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-stone-500">{p.sold} sold</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}