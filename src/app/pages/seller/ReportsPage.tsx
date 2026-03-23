import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart2, TrendingUp, Package, FileText } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DAILY_SALES_DATA, MONTHLY_SALES_DATA } from "../../data/mockData";

const PIE_COLORS = ["#166534", "#16a34a", "#4ade80", "#d97706", "#b45309"];

function formatPHP(value: number) {
  if (value >= 1000) return `₱${(value / 1000).toFixed(1)}k`;
  return `₱${value}`;
}

export function ReportsPage() {
  const { products, orders } = useApp();

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  // Today's sales
  const today = new Date().toDateString();
  const todayRevenue = orders
    .filter((o) => new Date(o.date).toDateString() === today)
    .reduce((sum, o) => sum + o.total, 0);

  // This month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthRevenue = orders
    .filter((o) => {
      const d = new Date(o.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, o) => sum + o.total, 0);

  // Category breakdown
  const categoryData = products.reduce<Record<string, { name: string; value: number; products: number }>>((acc, p) => {
    const key = p.category;
    if (!acc[key]) acc[key] = { name: key, value: 0, products: 0 };
    acc[key].value += p.sold * p.price;
    acc[key].products += 1;
    return acc;
  }, {});
  const categoryChartData = Object.values(categoryData).sort((a, b) => b.value - a.value);

  // Top selling products
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 10);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-stone-800 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-green-700" /> Sales Reports
        </h1>
        <p className="text-stone-500 text-sm mt-0.5">Business performance overview</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Sales", value: `₱${todayRevenue.toLocaleString()}`, sub: "Current day revenue", icon: "📅", color: "bg-blue-50 border-blue-100" },
          { label: "This Month", value: `₱${monthRevenue.toLocaleString()}`, sub: `${new Date().toLocaleString("en-PH", { month: "long" })} sales`, icon: "📆", color: "bg-green-50 border-green-100" },
          { label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, sub: `${totalOrders} total orders`, icon: "💰", color: "bg-amber-50 border-amber-100" },
          { label: "Avg. Order Value", value: `₱${avgOrderValue.toLocaleString()}`, sub: `${deliveredOrders} delivered`, icon: "📊", color: "bg-purple-50 border-purple-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border shadow-sm p-5 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-extrabold text-xl text-stone-800">{s.value}</div>
            <div className="text-xs font-semibold text-stone-600 mt-0.5">{s.label}</div>
            <div className="text-xs text-stone-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Sales Chart */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-700" /> Daily Sales (This Week)
            </h2>
            <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">
              ₱{DAILY_SALES_DATA.reduce((s, d) => s + d.sales, 0).toLocaleString()} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY_SALES_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatPHP} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Sales"]} />
              <Bar dataKey="sales" fill="#166534" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-800 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-green-700" /> Monthly Sales (2025)
            </h2>
            <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">
              ₱{MONTHLY_SALES_DATA.reduce((s, d) => s + d.sales, 0).toLocaleString()} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_SALES_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={formatPHP} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Sales"]} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#166534" strokeWidth={2.5} dot={{ r: 4, fill: "#166534" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-green-700" /> Sales by Category
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryChartData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Revenue"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {categoryChartData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-stone-600 truncate max-w-[120px]">{c.name}</span>
                </div>
                <span className="font-semibold text-stone-700">₱{c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Report */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-700" /> Inventory Report
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-3 py-2 font-semibold text-stone-500 uppercase">Product</th>
                  <th className="text-right px-3 py-2 font-semibold text-stone-500 uppercase">Price</th>
                  <th className="text-right px-3 py-2 font-semibold text-stone-500 uppercase">Stock</th>
                  <th className="text-right px-3 py-2 font-semibold text-stone-500 uppercase">Sold</th>
                  <th className="text-right px-3 py-2 font-semibold text-stone-500 uppercase">Revenue</th>
                  <th className="text-center px-3 py-2 font-semibold text-stone-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-stone-800 truncate max-w-[140px]">{p.name}</p>
                      <p className="text-stone-400 text-xs">{p.category}</p>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold text-stone-700">₱{p.price.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={p.stock === 0 ? "text-red-600 font-bold" : p.stock <= 10 ? "text-amber-600 font-bold" : "text-stone-700"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-stone-600">{p.sold}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-green-700">
                      ₱{(p.price * p.sold).toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {p.stock === 0 ? (
                        <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Out</span>
                      ) : p.stock <= 10 ? (
                        <span className="bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">Low</span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-stone-50 border-t-2 border-stone-200">
                <tr>
                  <td className="px-3 py-2.5 font-bold text-stone-800">Totals</td>
                  <td className="px-3 py-2.5" />
                  <td className="px-3 py-2.5 text-right font-bold text-stone-700">
                    {topProducts.reduce((s, p) => s + p.stock, 0)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-stone-700">
                    {topProducts.reduce((s, p) => s + p.sold, 0)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-green-800">
                    ₱{topProducts.reduce((s, p) => s + p.price * p.sold, 0).toLocaleString()}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
