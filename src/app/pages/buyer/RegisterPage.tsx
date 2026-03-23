import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Logo } from "../../components/Logo";

export function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^(09|\+639)\d{9}$/.test(form.mobile.replace(/\s/g, "")))
      e.mobile = "Enter a valid PH mobile number (e.g. 09171234567).";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      address: form.address,
      password: form.password,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } else {
      setErrors({ email: result.message });
    }
  };

  const inputClass = (key: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all backdrop-blur-sm placeholder-stone-400 ${
      errors[key]
        ? "border-red-400/60 bg-red-50/60"
        : "border-white/50 bg-white/60"
    }`;

  const field = (
    key: keyof typeof form,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={inputClass(key)}
      />
      {errors[key] && <p className="text-xs text-red-600 mt-1">{errors[key]}</p>}
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-green-900 mb-2">Registration Successful!</h2>
          <p className="text-stone-500 mb-4">Welcome to CocoFiber Philippines! Redirecting you to the homepage...</p>
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full bg-green-400/18 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-40px] w-96 h-96 rounded-full bg-amber-400/12 blur-3xl" />
      </div>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-12 relative z-10 overflow-hidden">
        <div className="absolute top-16 right-8 w-48 h-48 bg-green-300/12 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-16 left-8 w-56 h-56 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center text-white max-w-sm">
          <Logo size="lg" variant="light" />
          <p className="mt-6 text-green-200 leading-relaxed">
            Join the CocoFiber community and be part of the Philippines' growing eco-friendly industry.
          </p>
          <div className="mt-8 glass-auth-panel rounded-2xl p-5 text-left">
            <h4 className="font-semibold mb-3 text-sm text-white">Benefits of Registering:</h4>
            <ul className="space-y-2 text-sm text-green-200">
              {[
                "Order tracking and history",
                "Exclusive member discounts",
                "Fast checkout with saved addresses",
                "Priority customer support",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 overflow-y-auto">
        <div className="w-full max-w-lg py-6">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="glass-auth-panel p-4 rounded-2xl">
              <Logo size="md" variant="light" />
            </div>
          </div>

          {/* Glass form card */}
          <div className="glass-form rounded-2xl p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-green-900">Create Account</h1>
              <p className="text-stone-500 text-sm mt-1">Register to start shopping at CocoFiber Philippines</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {field("name", "Complete Name *", "text", "e.g. Juan dela Cruz")}
              {field("email", "Email Address *", "email", "you@example.com")}
              {field("mobile", "Mobile Number *", "tel", "e.g. 09171234567")}

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Complete Address *</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House No., Street, Barangay, City/Municipality, Province, ZIP Code"
                  rows={2}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none backdrop-blur-sm placeholder-stone-400 ${
                    errors.address ? "border-red-400/60 bg-red-50/60" : "border-white/50 bg-white/60"
                  }`}
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className={inputClass("password")}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                {form.password && (
                  <div className="mt-1.5 flex gap-1 items-center">
                    {[4, 6, 8].map((len) => (
                      <div key={len} className={`h-1 flex-1 rounded-full ${form.password.length >= len ? "bg-green-500" : "bg-white/30"}`} />
                    ))}
                    <span className="text-xs text-stone-400 ml-1">
                      {form.password.length < 4 ? "Weak" : form.password.length < 8 ? "Fair" : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    className={inputClass("confirmPassword")}
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-green-900/30"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-green-700 font-semibold hover:text-green-800">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}