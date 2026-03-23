import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Logo } from "./Logo";

export function Layout() {
  const { currentUser, logout, cartCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/storefront", label: "Storefront" },
    { to: "/products", label: "Products" },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Glass Header ── */}
      <header className="glass-nav text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <Logo size="sm" variant="light" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-green-300 ${
                  isActive(link.to)
                    ? "text-amber-400 border-b-2 border-amber-400 pb-0.5"
                    : "text-green-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg text-sm text-green-100 hover:text-white transition-all backdrop-blur-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{currentUser.name.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-44 glass-dropdown rounded-xl overflow-hidden z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-green-50/80 transition-colors"
                    >
                      <User className="w-4 h-4 text-green-700" /> My Profile
                    </Link>
                    <Link
                      to="/transactions"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-green-50/80 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 text-green-700" /> My Orders
                    </Link>
                    <hr className="border-white/40" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm text-green-100 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-1.5 rounded-lg transition-all shadow-lg shadow-amber-900/30"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden glass-mobile-nav px-4 pb-4">
            <nav className="flex flex-col gap-1 mt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "text-amber-400 bg-white/10"
                      : "text-green-100 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {currentUser ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-green-100 hover:bg-white/10 rounded-lg">My Profile</Link>
                  <Link to="/transactions" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-green-100 hover:bg-white/10 rounded-lg">My Orders</Link>
                  <button onClick={handleLogout} className="px-3 py-2 text-sm text-red-400 text-left hover:bg-white/10 rounded-lg">Logout</button>
                </>
              ) : (
                <div className="flex gap-2 mt-1">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-3 py-2 text-sm text-green-100 border border-white/20 rounded-lg hover:bg-white/10">Log In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-3 py-2 text-sm bg-amber-500 text-white rounded-lg font-semibold">Sign Up</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Glass Footer ── */}
      <footer className="glass-section-dark text-green-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <Logo size="md" variant="light" />
              <p className="mt-3 text-sm text-green-300 leading-relaxed">
                Premium coconut coir products from the Philippines. Sustainable, eco-friendly, and made with care.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/storefront" className="hover:text-white transition-colors">Storefront</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              </ul>
            </div>
            {/* Account */}
            <div>
              <h4 className="font-semibold text-white mb-3">My Account</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/transactions" className="hover:text-white transition-colors">Order History</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-3">Contact Us</h4>
              <ul className="space-y-2 text-sm text-green-300">
                <li>📍 Quezon City, Metro Manila</li>
                <li>📞 +63 917 123 4567</li>
                <li>✉️ info@cocofiber.ph</li>
                <li className="pt-1">
                  <Link to="/seller/login" className="text-amber-400 hover:text-amber-300 text-xs font-medium">
                    Seller Portal →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-white/10 my-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-green-400">
            <p>© 2025 CocoFiber Philippines. All rights reserved.</p>
            <p className="text-center italic">
              For educational purposes only, and no copyright infringement is intended.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
