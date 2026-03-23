import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, Lock, UserPlus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Logo } from "../../components/Logo";

export function SellerRegisterPage() {
  const { sellerRegister } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password || !form.confirmPassword) { 
        setError("Please fill in all fields."); 
        return; 
    }
    if (form.password !== form.confirmPassword) { 
        setError("Passwords do not match."); 
        return; 
    }
    if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    setLoading(true);
    const result = await sellerRegister(form.email, form.password);
    setLoading(false);
    
    if (result.success) {
        navigate("/seller/dashboard");
    } else {
        setError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-100px] left-[-80px] w-96 h-96 rounded-full bg-green-400/18 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-60px] w-80 h-80 rounded-full bg-amber-500/14 blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-emerald-300/8 blur-2xl" />
      </div>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-400/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center text-white max-w-sm">
          <Logo size="lg" variant="light" />
          <div className="mt-6 glass-auth-panel rounded-2xl p-6">
            <UserPlus className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Join as a Seller</h2>
            <p className="text-green-300 text-sm leading-relaxed">
              Create your seller account today to start managing your products, tracking inventory, and growing your business with CocoFiber.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-green-300">
            {["Reach More Buyers", "Manage Inventory", "Secure Payments", "Detailed Reports"].map((f) => (
              <div key={f} className="glass-dark-card rounded-xl p-3">
                <span className="text-green-400 text-lg block mb-1">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Register form ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="glass-auth-panel p-4 rounded-2xl">
              <Logo size="md" variant="light" />
            </div>
          </div>

          {/* Glass form card */}
          <div className="glass-form rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-700/20 border border-green-300/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-7 h-7 text-green-700" />
              </div>
              <h1 className="text-2xl font-extrabold text-green-900">Seller Sign Up</h1>
              <p className="text-stone-500 text-sm mt-1">Create your CocoFiber seller account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seller@cocofiber.ph"
                  className="w-full border border-white/50 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-stone-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-white/50 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-stone-400"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-white/50 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-stone-400"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-300/40 rounded-xl p-3 text-sm text-red-700 backdrop-blur-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-green-900/30"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {loading ? "Creating Account..." : "Create Seller Account"}
              </button>
            </form>

            <p className="text-center text-xs text-stone-400 mt-5">
              Already have an account?{" "}
              <Link to="/seller/login" className="text-green-700 hover:text-green-800 font-medium">Log in to Seller Portal</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="absolute bottom-0 left-0 right-0 text-center py-3 z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/assets/codepals-logo.png" alt="CodePals" className="h-12 object-contain brightness-200" />
          <span className="font-bold text-white/70 text-lg tracking-wide">codePals</span>
        </div>
        <p className="text-xs text-green-300/60 italic">
          For educational purposes only, and no copyright infringement is intended.
        </p>
      </div>
    </div>
  );
}
