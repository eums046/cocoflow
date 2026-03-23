import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Eye, EyeOff, LogIn, Leaf } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Logo } from "../../components/Logo";

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const success = await login(form.email, form.password);
    setLoading(false);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-green-400/20 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-emerald-300/10 blur-2xl" />
      </div>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative z-10 overflow-hidden">
        {/* Inner glow blobs */}
        <div className="absolute top-16 right-16 w-48 h-48 bg-green-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-16 left-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center text-white max-w-sm">
          <Logo size="lg" variant="light" />
          <p className="mt-6 text-green-200 text-lg leading-relaxed">
            Welcome back to the Philippines' premier coconut coir e-commerce platform.
          </p>
          <div className="mt-8 space-y-3">
            {["Premium eco-friendly products", "Nationwide delivery", "Secure checkout", "Track your orders"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-green-200 text-sm">
                <span className="w-5 h-5 bg-white/15 border border-white/25 rounded-full flex items-center justify-center text-green-300 flex-shrink-0 text-xs">✓</span>
                {item}
              </div>
            ))}
          </div>
          {/* Glass feature box */}
          <div className="mt-8 glass-auth-panel rounded-2xl p-5">
            <Leaf className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <p className="text-sm text-green-200 leading-relaxed">
              Sustainably crafted products made by skilled Filipino artisans, delivered to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel / form ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="glass-auth-panel p-4 rounded-2xl">
              <Logo size="md" variant="light" />
            </div>
          </div>

          {/* Glass form card */}
          <div className="glass-form rounded-2xl p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-green-900">Welcome Back!</h1>
              <p className="text-stone-500 text-sm mt-1">Sign in to your CocoFiber account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full border border-white/50 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-stone-400"
                />
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-white/50 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-300/40 rounded-xl p-3 text-sm text-red-700 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-green-900/30"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500 mt-5">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-700 font-semibold hover:text-green-800">
                Create one here
              </Link>
            </p>

            <p className="text-center text-xs text-stone-400 mt-4">
              Are you a seller?{" "}
              <Link to="/seller/login" className="text-amber-600 hover:text-amber-700">
                Seller Portal →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}