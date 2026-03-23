import { useState, useMemo } from "react";
import { Search, Filter, ShoppingCart, Star, SlidersHorizontal, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Product, ProductCategory } from "../../data/mockData";
import { useNavigate } from "react-router";

const CATEGORIES: ProductCategory[] = [
  "Home & Living",
  "Garden & Agriculture",
  "Construction",
  "Handicrafts",
  "Industrial",
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart, currentUser } = useApp();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!currentUser) { navigate("/login"); return; }
    addToCart(product.id);
  };

  const tagColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    trending: "bg-orange-100 text-orange-700",
    bestseller: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col" style={{background: "rgba(255,255,255,0.74)", backdropFilter: "blur(22px) saturate(160%)", border: "1px solid rgba(255,255,255,0.62)", boxShadow: "0 8px 32px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.75)"}}>
      <div className="relative overflow-hidden h-52">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {product.tags.slice(0, 1).map((tag) => (
            <span key={tag} className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${tagColors[tag] || ""}`}>
              {tag === "bestseller" ? "Best Seller" : tag.charAt(0).toUpperCase() + tag.slice(1)}
            </span>
          ))}
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-stone-700 font-bold text-sm px-4 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 10 && (
          <span className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs text-stone-400">{product.category}</span>
          {product.weight && <span className="text-xs text-stone-400">{product.weight}</span>}
        </div>
        <h3 className="font-semibold text-stone-800 mb-1.5 flex-1">{product.name}</h3>
        <p className="text-xs text-stone-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"}`} />
          ))}
          <span className="text-xs text-stone-500 ml-1">{product.rating} ({product.reviews} reviews)</span>
        </div>
        {product.dimensions && (
          <p className="text-xs text-stone-400 mb-3">📐 {product.dimensions}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-100">
          <span className="font-extrabold text-green-800 text-xl">₱{product.price.toLocaleString()}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-green-700 hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.stock === 0 ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductsPage() {
  const { products } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">("All");
  const [sort, setSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popular": result.sort((a, b) => b.sold - a.sold); break;
    }
    return result;
  }, [products, search, selectedCategory, sort, priceRange]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="glass-section-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-1">All Products</h1>
          <p className="text-green-300 text-sm">
            Showing {filtered.length} of {products.length} products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-white/60 bg-white/70 backdrop-blur-md rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-stone-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-white/60 bg-white/70 backdrop-blur-md rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              showFilters
                ? "bg-green-700 text-white border-green-700 shadow-lg shadow-green-900/20"
                : "bg-white/70 backdrop-blur-md text-stone-700 border-white/60 hover:border-green-500"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0">
              <div className="glass-card rounded-2xl p-5 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-800 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-green-700" /> Filters
                  </h3>
                  <button
                    onClick={() => { setSelectedCategory("All"); setPriceRange([0, 2000]); }}
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    Reset all
                  </button>
                </div>

                {/* Category filter */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-stone-700 mb-2">Category</h4>
                  <div className="space-y-1.5">
                    {(["All", ...CATEGORIES] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat as ProductCategory | "All")}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                          selectedCategory === cat
                            ? "bg-green-700 text-white font-semibold shadow-sm"
                            : "text-stone-600 hover:bg-green-50/80"
                        }`}
                      >
                        {cat}
                        <span className="float-right text-xs opacity-70">
                          {cat === "All" ? products.length : products.filter((p) => p.category === cat).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-700 mb-2">Max Price</h4>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-green-700"
                  />
                  <div className="flex justify-between text-xs text-stone-500 mt-1">
                    <span>₱0</span>
                    <span className="font-semibold text-green-700">up to ₱{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products grid */}
          <div className="flex-1">
            {/* Category pills (when filters hidden) */}
            {!showFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {(["All", ...CATEGORIES] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as ProductCategory | "All")}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-green-700 text-white shadow-sm"
                        : "bg-white/70 backdrop-blur-sm text-stone-600 border border-white/60 hover:border-green-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🌿</div>
                <p className="text-stone-500 font-medium">No products found matching your criteria.</p>
                <button onClick={() => { setSearch(""); setSelectedCategory("All"); }} className="mt-3 text-green-700 font-semibold text-sm hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}