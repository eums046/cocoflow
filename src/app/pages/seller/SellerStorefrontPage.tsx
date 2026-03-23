import { useState } from "react";
import { Save, Eye, Megaphone, Image, Star, TrendingUp, Trophy, Sparkles, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { StorefrontConfig } from "../../data/mockData";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Link } from "react-router";

function ProductSelector({
  label,
  icon: Icon,
  selectedIds,
  onToggle,
  products,
}: {
  label: string;
  icon: React.ElementType;
  selectedIds: string[];
  onToggle: (id: string) => void;
  products: ReturnType<typeof useApp>["products"];
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
      <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
        <Icon className="w-4 h-4 text-green-700" /> {label}
        <span className="ml-auto text-xs text-stone-400">{selectedIds.length} selected</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {products.map((p) => {
          const selected = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={`relative flex flex-col rounded-xl overflow-hidden border-2 transition-all text-left ${
                selected ? "border-green-600 shadow-sm" : "border-stone-200 hover:border-green-300"
              }`}
            >
              <div className="h-20 overflow-hidden">
                <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-stone-700 line-clamp-1">{p.name}</p>
                <p className="text-xs text-green-700 font-bold">₱{p.price.toLocaleString()}</p>
              </div>
              {selected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SellerStorefrontPage() {
  const { storefrontConfig, updateStorefront, products } = useApp();
  const [config, setConfig] = useState<StorefrontConfig>({ ...storefrontConfig });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateStorefront(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleProduct = (section: keyof StorefrontConfig, id: string) => {
    const current = config[section] as string[];
    if (current.includes(id)) {
      setConfig({ ...config, [section]: current.filter((i) => i !== id) });
    } else {
      setConfig({ ...config, [section]: [...current, id] });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800">Storefront Editor</h1>
          <p className="text-stone-500 text-sm mt-0.5">Customize what customers see on your storefront</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/storefront"
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-green-700 border border-stone-200 px-3 py-2 rounded-xl hover:bg-green-50 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-sm text-white bg-green-700 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {saved && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-800 text-sm">
          <CheckCircle className="w-4 h-4 text-green-600" /> Storefront updated successfully!
        </div>
      )}

      <div className="space-y-5">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Image className="w-4 h-4 text-green-700" /> Hero Banner
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Hero Title</label>
              <input
                value={config.heroTitle}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Hero Subtitle</label>
              <textarea
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                rows={2}
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-green-700" /> Announcement Banner
          </h3>
          <input
            value={config.announcement}
            onChange={(e) => setConfig({ ...config, announcement: e.target.value })}
            placeholder="Enter an announcement to display to customers..."
            className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-stone-400 mt-1.5">Leave empty to hide the announcement banner.</p>
        </div>

        {/* Product Selections */}
        <ProductSelector
          label="Featured Products"
          icon={Sparkles}
          selectedIds={config.featuredProductIds}
          onToggle={(id) => toggleProduct("featuredProductIds", id)}
          products={products}
        />
        <ProductSelector
          label="New Arrivals"
          icon={Star}
          selectedIds={config.newArrivalsIds}
          onToggle={(id) => toggleProduct("newArrivalsIds", id)}
          products={products}
        />
        <ProductSelector
          label="Trending Products"
          icon={TrendingUp}
          selectedIds={config.trendingIds}
          onToggle={(id) => toggleProduct("trendingIds", id)}
          products={products}
        />
        <ProductSelector
          label="Best Sellers"
          icon={Trophy}
          selectedIds={config.bestsellerIds}
          onToggle={(id) => toggleProduct("bestsellerIds", id)}
          products={products}
        />

        {/* Preview card */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <h3 className="font-semibold text-green-800 mb-2 text-sm">Storefront Preview</h3>
          <div className="bg-green-900 rounded-xl p-4 text-white">
            <p className="text-xs text-green-300 mb-1 uppercase font-bold tracking-wider">Hero</p>
            <h4 className="font-bold text-sm">{config.heroTitle || "Your hero title here"}</h4>
            <p className="text-green-300 text-xs mt-1">{config.heroSubtitle || "Your subtitle here"}</p>
          </div>
          {config.announcement && (
            <div className="mt-2 bg-amber-500 rounded-lg px-4 py-2 text-white text-xs font-medium">
              {config.announcement}
            </div>
          )}
          <p className="text-xs text-green-600 mt-3 text-center">
            <Link to="/storefront" className="hover:underline font-medium">Click "Preview" to see the full storefront →</Link>
          </p>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 text-sm text-white bg-green-700 hover:bg-green-600 px-6 py-2.5 rounded-xl transition-colors shadow-sm font-semibold"
          >
            <Save className="w-4 h-4" /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}
