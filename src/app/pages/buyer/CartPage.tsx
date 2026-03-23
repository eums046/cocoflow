import { Link, useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function CartPage() {
  const { cartItems, products, updateCartQuantity, removeFromCart, getCartTotal, currentUser } =
    useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 text-center max-w-sm w-full">
          <ShoppingBag className="w-16 h-16 text-stone-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-stone-700 mb-2">Please log in to view your cart</h2>
          <p className="text-stone-500 mb-5">You need to be logged in to access your cart.</p>
          <Link to="/login" className="bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const cartProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { item, product };
  }).filter(({ product }) => product !== undefined);

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-form rounded-2xl p-10 text-center max-w-sm w-full">
          <ShoppingBag className="w-20 h-20 text-stone-400 mx-auto mb-5" />
          <h2 className="text-2xl font-extrabold text-stone-700 mb-2">Your cart is empty</h2>
          <p className="text-stone-500 mb-6">Looks like you haven't added any products yet.</p>
          <Link
            to="/products"
            className="bg-green-800 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="glass-section-dark text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-extrabold">My Cart</h1>
          <p className="text-green-300 text-sm mt-1">{cartItems.length} item(s) in your cart</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map(({ item, product }) => (
              <div key={item.productId} className="glass-card rounded-2xl p-4 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={product!.image}
                    alt={product!.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-400">{product!.category}</p>
                  <h3 className="font-semibold text-stone-800 truncate">{product!.name}</h3>
                  <p className="text-green-800 font-bold mt-1">₱{product!.price.toLocaleString()}</p>
                  {product!.stock <= item.quantity && (
                    <p className="text-xs text-orange-600 mt-0.5">⚠ Only {product!.stock} in stock</p>
                  )}
                </div>
                <div className="flex flex-col items-end justify-between">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white/80 shadow-sm flex items-center justify-center hover:bg-white text-stone-600 hover:text-green-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= product!.stock}
                      className="w-6 h-6 rounded-lg bg-white/80 shadow-sm flex items-center justify-center hover:bg-white text-stone-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-extrabold text-stone-800">
                      ₱{(product!.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/products" className="flex items-center gap-2 text-green-700 font-semibold text-sm hover:text-green-800 transition-colors mt-2">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-20">
              <h2 className="font-extrabold text-stone-800 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cartProducts.map(({ item, product }) => (
                  <div key={item.productId} className="flex justify-between text-sm text-stone-600">
                    <span className="truncate max-w-[160px]">{product!.name} × {item.quantity}</span>
                    <span className="font-medium">₱{(product!.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/50 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span className="text-amber-600">₱{shipping}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-400 italic">
                  <span>(Free for pickup)</span>
                </div>
              </div>

              <div className="border-t border-white/50 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-stone-800">Total</span>
                <span className="font-extrabold text-2xl text-green-800">₱{total.toLocaleString()}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-5 bg-green-800 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg shadow-green-900/20"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-stone-400">🔒 Secure checkout | 100% Safe & Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}