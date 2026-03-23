import { useState } from "react";
import { Link } from "react-router";
import { User, Mail, Phone, MapPin, Edit2, Save, X, Package, ShoppingCart, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function ProfilePage() {
  const { currentUser, updateProfile, getUserOrders } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    mobile: currentUser?.mobile || "",
    address: currentUser?.address || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-stone-700 mb-3">Please log in to view your profile</h2>
          <Link to="/login" className="bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700">Log In</Link>
        </div>
      </div>
    );
  }

  const orders = getUserOrders();
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const pending = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const totalSpent = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^(09|\+639)\d{9}$/.test(form.mobile.replace(/\s/g, "")))
      e.mobile = "Enter a valid PH mobile number.";
    if (!form.address.trim()) e.address = "Address is required.";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({ name: currentUser.name, mobile: currentUser.mobile, address: currentUser.address });
    setErrors({});
    setEditing(false);
  };

  const memberSince = new Date(currentUser.createdAt).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen">
      <div className="glass-section-dark text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <User className="w-6 h-6" /> My Profile
          </h1>
          <p className="text-green-300 text-sm mt-1">Manage your account information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {saved && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-800 text-sm">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Profile updated successfully!
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 text-center">
              {/* Avatar */}
              <div className="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                {currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <h2 className="font-extrabold text-stone-800 text-lg">{currentUser.name}</h2>
              <p className="text-xs text-stone-400 mt-1">Member since {memberSince}</p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 rounded-xl px-3 py-2">
                  <Mail className="w-4 h-4 text-green-700 flex-shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 rounded-xl px-3 py-2">
                  <Phone className="w-4 h-4 text-green-700 flex-shrink-0" />
                  <span>{currentUser.mobile}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-3 text-center">
                <div className="font-extrabold text-xl text-green-800">{orders.length}</div>
                <div className="text-xs text-stone-400 mt-0.5">Orders</div>
              </div>
              <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-3 text-center">
                <div className="font-extrabold text-xl text-blue-700">{pending}</div>
                <div className="text-xs text-stone-400 mt-0.5">Active</div>
              </div>
              <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-3 text-center">
                <div className="font-extrabold text-xl text-amber-600">{delivered}</div>
                <div className="text-xs text-stone-400 mt-0.5">Done</div>
              </div>
            </div>

            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <div className="text-xs text-stone-500 mb-1">Total Spent</div>
              <div className="font-extrabold text-2xl text-green-800">₱{totalSpent.toLocaleString()}</div>
            </div>
          </div>

          {/* Profile details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-stone-800 text-lg">Personal Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-sm text-green-700 font-semibold hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1 text-sm text-white bg-green-700 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors">
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 mb-1.5">
                    <User className="w-3.5 h-3.5 text-green-700" /> Full Name
                  </label>
                  {editing ? (
                    <div>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? "border-red-400" : "border-stone-300"}`}
                      />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>
                  ) : (
                    <p className="text-stone-700 bg-stone-50 rounded-xl px-4 py-2.5 text-sm">{currentUser.name}</p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-green-700" /> Email Address
                  </label>
                  <p className="text-stone-500 bg-stone-50 rounded-xl px-4 py-2.5 text-sm flex items-center gap-2">
                    {currentUser.email}
                    <span className="text-xs bg-stone-200 text-stone-500 px-1.5 py-0.5 rounded">cannot change</span>
                  </p>
                </div>

                {/* Mobile */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-green-700" /> Mobile Number
                  </label>
                  {editing ? (
                    <div>
                      <input
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.mobile ? "border-red-400" : "border-stone-300"}`}
                      />
                      {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                    </div>
                  ) : (
                    <p className="text-stone-700 bg-stone-50 rounded-xl px-4 py-2.5 text-sm">{currentUser.mobile}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-green-700" /> Complete Address
                  </label>
                  {editing ? (
                    <div>
                      <textarea
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        rows={2}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${errors.address ? "border-red-400" : "border-stone-300"}`}
                      />
                      {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                    </div>
                  ) : (
                    <p className="text-stone-700 bg-stone-50 rounded-xl px-4 py-2.5 text-sm">{currentUser.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/transactions"
                className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3 hover:border-green-300 transition-all group"
              >
                <Package className="w-8 h-8 text-green-700 bg-green-50 p-1.5 rounded-lg" />
                <div>
                  <div className="font-semibold text-stone-800 text-sm">Order History</div>
                  <div className="text-xs text-stone-400">{orders.length} orders</div>
                </div>
              </Link>
              <Link
                to="/cart"
                className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3 hover:border-green-300 transition-all group"
              >
                <ShoppingCart className="w-8 h-8 text-green-700 bg-green-50 p-1.5 rounded-lg" />
                <div>
                  <div className="font-semibold text-stone-800 text-sm">My Cart</div>
                  <div className="text-xs text-stone-400">View items</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}