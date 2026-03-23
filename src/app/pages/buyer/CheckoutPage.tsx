import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { CheckCircle, MapPin, CreditCard, Truck, Store, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", icon: "💚", desc: "Pay via GCash mobile wallet" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when your order arrives" },
  { id: "bank", label: "Bank Transfer", icon: "🏦", desc: "BDO / BPI / UnionBank" },
];

export function CheckoutPage() {
  const { cartItems, products, getCartTotal, currentUser, placeOrder } = useApp();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [step, setStep] = useState<"review" | "success">("review");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-stone-700 mb-3">Please log in to checkout</h2>
          <Link to="/login" className="bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700">Log In</Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 text-center max-w-sm w-full">
          <p className="text-stone-500 mb-4">Your cart is empty.</p>
          <Link to="/products" className="bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700">Browse Products</Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = deliveryType === "delivery" ? 50 : 0;
  const total = subtotal + shipping;

  const cartProducts = cartItems.map((item) => ({
    item,
    product: products.find((p) => p.id === item.productId)!,
  })).filter(({ product }) => product);

  const handlePlaceOrder = async () => {
    const errs: Record<string, string> = {};
    if (deliveryType === "delivery" && !address.trim()) {
      errs.address = "Delivery address is required.";
    }
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setLoading(true);
    const id = await placeOrder({
      paymentMethod: PAYMENT_METHODS.find((m) => m.id === paymentMethod)!.label,
      deliveryType,
      address: deliveryType === "delivery" ? address : "",
    });
    setOrderId(id);
    setStep("success");
    setLoading(false);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-green-900 mb-2">Order Placed!</h2>
          <p className="text-stone-500 mb-1">Thank you for your purchase, {currentUser.name.split(" ")[0]}!</p>
          <p className="text-stone-500 mb-5 text-sm">Your order ID is:</p>
          <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-3 inline-block mb-6">
            <span className="font-extrabold text-green-800 text-lg">{orderId}</span>
          </div>
          <p className="text-sm text-stone-400 mb-6">
            {deliveryType === "delivery"
              ? "Your order will be delivered within 3-5 business days."
              : "Your order is ready for pickup at our warehouse."}
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/transactions" className="bg-green-800 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 transition-colors">
              View Order History
            </Link>
            <Link to="/products" className="text-green-700 font-semibold text-sm hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="glass-section-dark text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-extrabold">Checkout</h1>
          <div className="flex items-center gap-2 text-green-300 text-sm mt-2">
            <Link to="/cart" className="hover:text-white">Cart</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Method */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-700" /> Delivery Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryType("delivery")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "delivery"
                      ? "border-green-600 bg-green-50"
                      : "border-stone-200 hover:border-green-300"
                  }`}
                >
                  <Truck className={`w-5 h-5 ${deliveryType === "delivery" ? "text-green-700" : "text-stone-400"}`} />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-stone-800">Home Delivery</div>
                    <div className="text-xs text-stone-400">₱50 shipping fee</div>
                  </div>
                </button>
                <button
                  onClick={() => setDeliveryType("pickup")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "pickup"
                      ? "border-green-600 bg-green-50"
                      : "border-stone-200 hover:border-green-300"
                  }`}
                >
                  <Store className={`w-5 h-5 ${deliveryType === "pickup" ? "text-green-700" : "text-stone-400"}`} />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-stone-800">Store Pickup</div>
                    <div className="text-xs text-stone-400">Free — Quezon City</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryType === "delivery" && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-700" /> Delivery Address
                </h2>
                <textarea
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors({}); }}
                  placeholder="House No., Street, Barangay, City/Municipality, Province, ZIP Code"
                  rows={3}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                    errors.address ? "border-red-400 bg-red-50" : "border-stone-200"
                  }`}
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                {currentUser.address && address !== currentUser.address && (
                  <button
                    onClick={() => setAddress(currentUser.address)}
                    className="mt-2 text-xs text-green-600 hover:underline"
                  >
                    Use saved address
                  </button>
                )}
              </div>
            )}

            {deliveryType === "pickup" && (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <h2 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                  <Store className="w-5 h-5 text-green-700" /> Pickup Location
                </h2>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="font-semibold text-green-800 text-sm">CocoFiber Philippines Warehouse</p>
                  <p className="text-stone-600 text-sm mt-1">📍 123 Coir Street, Barangay Eco, Quezon City, Metro Manila</p>
                  <p className="text-stone-500 text-xs mt-2">⏰ Open Mon–Sat, 8:00 AM – 5:00 PM</p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-700" /> Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === method.id
                        ? "border-green-600 bg-green-50"
                        : "border-stone-200 hover:border-green-300"
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-stone-800 text-sm">{method.label}</div>
                      <div className="text-xs text-stone-400">{method.desc}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === method.id ? "border-green-600" : "border-stone-300"
                    }`}>
                      {paymentMethod === method.id && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-20">
              <h2 className="font-extrabold text-stone-800 text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartProducts.map(({ item, product }) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-stone-700 font-medium truncate">{product.name}</p>
                      <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-stone-700">
                      ₱{(product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "FREE" : `₱${shipping}`}</span>
                </div>
              </div>

              <div className="border-t border-stone-200 mt-4 pt-4 flex justify-between">
                <span className="font-bold text-stone-800">Total</span>
                <span className="font-extrabold text-2xl text-green-800">₱{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-5 bg-green-800 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : <CheckCircle className="w-4 h-4" />}
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-xs text-stone-400 text-center mt-3">
                By placing an order you agree to our Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}