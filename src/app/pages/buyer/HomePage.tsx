import { Link } from "react-router";
import { ArrowRight, Leaf, Shield, Truck, Award, Sprout, Home, Wrench, Package2, Palette } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const HERO_IMAGE = "https://images.unsplash.com/photo-1691232386478-3464676d9e9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400";
const ECO_IMAGE = "https://images.unsplash.com/photo-1625535927032-dd38fdf54f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700";

const categories = [
  { label: "Home & Living", icon: Home, color: "bg-amber-500/15 text-amber-700 border-amber-300/40", path: "/products" },
  { label: "Garden & Agriculture", icon: Sprout, color: "bg-green-500/15 text-green-700 border-green-300/40", path: "/products" },
  { label: "Construction", icon: Wrench, color: "bg-stone-400/15 text-stone-700 border-stone-300/40", path: "/products" },
  { label: "Handicrafts", icon: Palette, color: "bg-rose-400/15 text-rose-700 border-rose-300/40", path: "/products" },
  { label: "Industrial", icon: Package2, color: "bg-blue-400/15 text-blue-700 border-blue-300/40", path: "/products" },
];

const whyUs = [
  { icon: Leaf, title: "100% Eco-Friendly", desc: "All our products are made from natural coconut coir — biodegradable and sustainable." },
  { icon: Shield, title: "Premium Quality", desc: "Rigorous quality checks ensure every product meets the highest standards." },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide delivery across the Philippines. Get your orders quickly and safely." },
  { icon: Award, title: "Filipino Made", desc: "Proudly produced and crafted by local Filipino workers and artisans." },
];

export function HomePage() {
  const { products } = useApp();
  const featured = products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <ImageWithFallback
          src={HERO_IMAGE}
          alt="Coconut Palm Philippines"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/92 via-green-900/72 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-xl">
            <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider shadow-lg shadow-amber-900/30">
              🌿 Eco-Friendly Products
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              Nature's Fiber,<br />
              <span className="text-amber-400">Philippines' Pride</span>
            </h1>
            <p className="text-lg text-green-100 mb-8 leading-relaxed">
              Discover premium coconut coir products — sustainable, durable, and crafted with Filipino craftsmanship. From doormats to geotextiles, we have it all.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/storefront"
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-amber-900/30"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-md border border-white/25 transition-all shadow-lg"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>

        {/* Glass stats bar */}
        <div className="absolute bottom-0 left-0 right-0 glass-hero-stat py-4">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-2xl font-extrabold text-amber-400">10+</div>
              <div className="text-xs text-green-200">Product Lines</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-400">1,500+</div>
              <div className="text-xs text-green-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-green-200">Eco-Friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Announcement Banner ── */}
      <div className="bg-amber-500 text-white text-center py-2.5 text-sm font-medium">
        🎉 Grand Opening Sale! Get 15% off your first order. Use code:{" "}
        <span className="font-bold bg-white text-amber-600 px-2 py-0.5 rounded ml-1">COCOFIBER15</span>
      </div>

      {/* ── Categories ── */}
      <section className="py-14 glass-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-green-900 mb-2">Shop by Category</h2>
            <p className="text-stone-500">Find the perfect coir product for your needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  to={cat.path}
                  className={`glass-card flex flex-col items-center gap-3 p-5 rounded-2xl border-2 ${cat.color} hover:scale-105 transition-all text-center`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="text-sm font-semibold">{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-14 glass-section-tinted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-green-900">Best Sellers</h2>
              <p className="text-stone-500 mt-1">Our most popular coconut coir products</p>
            </div>
            <Link to="/storefront" className="text-green-700 hover:text-green-800 font-semibold flex items-center gap-1 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <div key={product.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col">
                <div className="relative overflow-hidden h-44">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.tags.includes("bestseller") && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-stone-400 mb-1">{product.category}</p>
                  <h3 className="font-semibold text-stone-800 text-sm mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(product.rating))}</span>
                    <span className="text-xs text-stone-400">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-extrabold text-green-800">₱{product.price.toLocaleString()}</span>
                    <Link to="/products" className="bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Coconut Coir ── */}
      <section className="py-16 glass-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Why Coconut Coir?</span>
              <h2 className="text-3xl font-extrabold text-green-900 mt-2 mb-5">
                Nature's Most Versatile Fiber
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Coconut coir, derived from the outer husk of coconuts, is one of the Philippines' most valuable natural resources. It's tough, water-resistant, and biodegradable — making it the perfect material for a wide range of eco-friendly products.
              </p>
              <p className="text-stone-600 leading-relaxed mb-6">
                At CocoFiber Philippines, we're pioneering a growing industry that turns this natural fiber into high-quality products for construction, gardening, home use, and more — while supporting local Filipino farmers and craftspeople.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Biodegradable", "Water-Resistant", "Durable", "Locally Sourced"].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-sm text-green-700">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0 text-xs">✓</span>
                    {tag}
                  </div>
                ))}
              </div>
              <Link to="/products" className="mt-6 inline-flex items-center gap-2 bg-green-800 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20">
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={ECO_IMAGE}
                alt="Eco-friendly coconut products"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-14 glass-section-dark text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">Why Choose CocoFiber?</h2>
            <p className="text-green-300">We're committed to quality, sustainability, and Filipino excellence.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-dark-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-900/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-green-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 glass-section-amber border-y border-amber-200/50">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-extrabold text-green-900 mb-3">Ready to Go Green?</h2>
          <p className="text-stone-600 mb-6">Join thousands of Filipinos choosing sustainable coconut coir products.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="bg-green-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 transition-all hover:scale-105 shadow-lg shadow-green-900/20">
              Create Account
            </Link>
            <Link to="/products" className="glass-card text-green-800 font-bold px-8 py-3 rounded-xl border-2 border-green-200/60 hover:bg-green-50/80 transition-all">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
