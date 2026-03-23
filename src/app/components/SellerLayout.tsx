import { Outlet, Link, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart2,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Logo } from "./Logo";

const navItems = [
  { to: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seller/storefront", label: "Storefront", icon: Store },
  { to: "/seller/inventory", label: "Inventory", icon: Package },
  { to: "/seller/reports", label: "Reports", icon: BarChart2 },
];

export function SellerLayout() {
  const { isSellerLoggedIn, sellerLogout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSellerLoggedIn) navigate("/seller/login");
  }, [isSellerLoggedIn, navigate]);

  const handleLogout = () => {
    sellerLogout();
    navigate("/seller/login");
  };

  if (!isSellerLoggedIn) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Glass Top Bar ── */}
      <header className="glass-nav text-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo size="sm" variant="light" />
            <span className="hidden sm:inline text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold ml-1 shadow-lg shadow-amber-900/30">
              SELLER PORTAL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-green-200">
              seller@cocofiber.ph
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-green-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Glass Sidebar ── */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-60 glass-sidebar flex flex-col transform transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
          style={{ top: "57px" }}
        >
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-green-700/90 text-white shadow-md backdrop-blur-sm border border-green-600/50"
                      : "text-stone-600 hover:bg-green-50/80 hover:text-green-800"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-white/40">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs text-stone-400 hover:text-green-700 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              View Buyer Site
            </Link>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Frosted inner background */}
          <div className="min-h-full" style={{ background: "rgba(245,250,246,0.88)", backdropFilter: "blur(16px)" }}>
            <Outlet />
            {/* Footer */}
            <footer className="mt-auto px-6 py-4 border-t border-white/40 text-center text-xs text-stone-400" style={{ background: "rgba(255,255,255,0.6)" }}>
              <p>© 2025 CocoFiber Philippines | Seller Portal</p>
              <p className="italic mt-0.5">
                For educational purposes only, and no copyright infringement is intended.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
