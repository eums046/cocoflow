import { useState } from "react";
import { Plus, Pencil, Trash2, Search, AlertTriangle, X, Save, Package } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Product, ProductCategory } from "../../data/mockData";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const CATEGORIES: ProductCategory[] = [
  "Home & Living",
  "Garden & Agriculture",
  "Construction",
  "Handicrafts",
  "Industrial",
];

type FormProduct = Omit<Product, "id" | "sold" | "rating" | "reviews">;

const emptyForm: FormProduct = {
  name: "",
  category: "Home & Living",
  price: 0,
  stock: 0,
  description: "",
  image: "",
  tags: [],
  weight: "",
  dimensions: "",
};

function ProductModal({
  product,
  onSave,
  onClose,
}: {
  product: Partial<Product> | null;
  onSave: (p: FormProduct) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormProduct>(
    product
      ? {
          name: product.name || "",
          category: product.category || "Home & Living",
          price: product.price || 0,
          stock: product.stock || 0,
          description: product.description || "",
          image: product.image || "",
          tags: product.tags || [],
          weight: product.weight || "",
          dimensions: product.dimensions || "",
        }
      : { ...emptyForm }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (form.price <= 0) e.price = "Price must be greater than 0.";
    if (form.stock < 0) e.stock = "Stock cannot be negative.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.image.trim()) e.image = "Image URL is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(form);
  };

  const toggleTag = (tag: "new" | "trending" | "bestseller" | "sale") => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-extrabold text-stone-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? "border-red-400" : "border-stone-300"}`}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Price (₱) *</label>
              <input
                type="number"
                value={form.price}
                min={0}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.price ? "border-red-400" : "border-stone-300"}`}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Stock *</label>
              <input
                type="number"
                value={form.stock}
                min={0}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.stock ? "border-red-400" : "border-stone-300"}`}
              />
              {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${errors.description ? "border-red-400" : "border-stone-300"}`}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Image URL *</label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.image ? "border-red-400" : "border-stone-300"}`}
            />
            {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
            {form.image && (
              <div className="mt-2 w-20 h-16 rounded-lg overflow-hidden border border-stone-200">
                <ImageWithFallback src={form.image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Weight + Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Weight</label>
              <input
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="e.g. 1.5 kg"
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Dimensions</label>
              <input
                value={form.dimensions || ""}
                onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                placeholder="e.g. 60cm x 40cm"
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Product Tags</label>
            <div className="flex gap-2 flex-wrap">
              {(["new", "trending", "bestseller", "sale"] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border-2 transition-all ${
                    form.tags.includes(tag)
                      ? "bg-green-700 text-white border-green-700"
                      : "text-stone-500 border-stone-200 hover:border-green-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-stone-300 text-stone-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {product ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form: FormProduct) => {
    if (modal === "edit" && editingProduct) {
      updateProduct({
        ...editingProduct,
        ...form,
      });
    } else {
      addProduct({ ...form, sold: 0, rating: 4.5, reviews: 0 });
    }
    setModal(null);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-700" /> Inventory
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">{products.length} products total</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setModal("add"); }}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: products.length, color: "text-stone-800" },
          { label: "Inventory Value", value: `₱${totalValue.toLocaleString()}`, color: "text-green-700" },
          { label: "Out of Stock", value: outOfStock, color: "text-red-600" },
          { label: "Low Stock", value: lowStock, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 text-center">
            <div className={`font-extrabold text-xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Price</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Stock</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Sold</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-400 text-sm">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 text-xs">{p.name}</p>
                          <p className="text-xs text-stone-400">{p.weight}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">{p.category}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-700">₱{p.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-xs ${p.stock === 0 ? "text-red-600" : p.stock <= 10 ? "text-amber-600" : "text-stone-700"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-stone-500">{p.sold}</td>
                    <td className="px-4 py-3 text-center">
                      {p.stock === 0 ? (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">Out of Stock</span>
                      ) : p.stock <= 10 ? (
                        <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 justify-center">
                          <AlertTriangle className="w-3 h-3" /> Low
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">In Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditingProduct(p); setModal("edit"); }}
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(modal === "add" || modal === "edit") && (
        <ProductModal
          product={modal === "edit" ? editingProduct : null}
          onSave={handleSave}
          onClose={() => { setModal(null); setEditingProduct(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-stone-800 mb-2">Delete Product</h3>
            <p className="text-stone-500 text-sm mb-5">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-stone-300 text-stone-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
