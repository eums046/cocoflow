import { Link } from "react-router";
import { ShoppingCart, Star, ArrowRight, Sparkles, TrendingUp, Trophy, Tag } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Product } from "../../data/mockData";

const HERO_BG = "https://images.unsplash.com/photo-1681674300478-4a0d546c9829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400";

function ProductCard({ product }: { product: Product }) {
  const { addToCart, currentUser } = useApp();
  const tagColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    trending: "bg-orange-100 text-orange-700",
    bestseller: "bg-amber-100 text-amber-700",
    sale: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col" style={{background: "rgba(255,255,255,0.74)", backdropFilter: "blur(22px) saturate(160%)", border: "1px solid rgba(255,255,255,0.62)", boxShadow: "0 8px 32px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.75)"}}>
      <div className="relative overflow-hidden h-48">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${tagColors[tag] || "bg-stone-100 text-stone-600"}`}>
              {tag}
            </span>
          ))}
        </div>
        {product.stock <= 10 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            Low Stock
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-stone-400 mb-1">{product.category}</p>
        <h3 className="font-semibold text-stone-800 mb-1 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"}`}
            />
          ))}
          <span className="text-xs text-stone-400 ml-1">({product.reviews})</span>
          <span className="text-xs text-stone-400 ml-auto">{product.sold} sold</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-extrabold text-green-800 text-lg">₱{product.price.toLocaleString()}</span>
          <button
            onClick={() => {
              if (!currentUser) {
                window.location.href = "/login";
                return;
              }
              addToCart(product.id);
            }}
            className="bg-green-700 hover:bg-green-600 text-white text-sm px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-green-700/15 border border-green-300/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-700" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-green-900">{title}</h2>
        {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export function StorefrontPage() {
  const { products, storefrontConfig } = useApp();

  const featured = storefrontConfig.featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const newArrivals = storefrontConfig.newArrivalsIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const trending = storefrontConfig.trendingIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const bestsellers = storefrontConfig.bestsellerIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <ImageWithFallback
          src={HERO_BG}
          alt="CocoFiber Storefront"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 to-green-900/50" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 max-w-4xl mx-auto">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">Our Storefront</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            {storefrontConfig.heroTitle}
          </h1>
          <p className="text-green-200 text-sm md:text-base max-w-xl">
            {storefrontConfig.heroSubtitle}
          </p>
          <Link
            to="/products"
            className="mt-4 w-fit bg-amber-500 hover:bg-amber-400 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all"
          >
            Shop All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Announcement */}
      {storefrontConfig.announcement && (
        <div className="bg-amber-500 text-white text-center py-2.5 px-4">
          <p className="text-sm font-medium">{storefrontConfig.announcement}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-14">
        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <SectionHeader
              icon={Sparkles}
              title="Featured Products"
              subtitle="Hand-picked highlights from CocoFiber Philippines"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section>
            <SectionHeader
              icon={Tag}
              title="New Arrivals"
              subtitle="Fresh additions to our product lineup"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section>
            <SectionHeader
              icon={TrendingUp}
              title="Trending Now"
              subtitle="What customers are loving this week"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trending.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestsellers.length > 0 && (
          <section>
            <SectionHeader
              icon={Trophy}
              title="Best Sellers"
              subtitle="Our most popular products of all time"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {bestsellers.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* View all CTA */}
        <div className="text-center py-6">
          <p className="text-stone-500 mb-4">Looking for something specific?</p>
          <Link
            to="/products"
            className="bg-green-800 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}