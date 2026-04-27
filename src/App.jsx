import { useMemo, useState } from "react";
import { Header } from "./components/Header.jsx";
import { InventoryTable } from "./components/InventoryTable.jsx";
import { MetricCard } from "./components/MetricCard.jsx";
import { ProductForm } from "./components/ProductForm.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { SidePanels } from "./components/SidePanels.jsx";
import { Toast } from "./components/Toast.jsx";
import { useInventory } from "./hooks/useInventory.js";
import {
  computeInventoryMetrics,
  filterProducts,
  getCategories,
  getLowStockProducts
} from "./utils/inventory.js";
import { formatCurrency, formatNumber } from "./utils/formatters.js";
import { AlertTriangle, Boxes, DollarSign, Layers3 } from "lucide-react";

const initialFilters = {
  search: "",
  category: "all",
  status: "all",
  sort: "name"
};

export default function App() {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    resetSampleProducts
  } = useInventory();
  const [filters, setFilters] = useState(initialFilters);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState("");

  const metrics = useMemo(() => computeInventoryMetrics(products), [products]);
  const categories = useMemo(() => getCategories(products), [products]);
  const lowStockProducts = useMemo(() => getLowStockProducts(products), [products]);
  const visibleProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );
  const visibleValue = visibleProducts.reduce(
    (sum, product) => sum + product.stock * product.price,
    0
  );

  function showToast(message) {
    setToast(message);
  }

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function openCreateForm() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingProduct(null);
    setIsFormOpen(false);
  }

  async function handleSaveProduct(payload) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
      showToast("Producto actualizado.");
    } else {
      await createProduct(payload);
      showToast("Producto creado.");
    }
    closeForm();
  }

  async function handleDeleteProduct(product) {
    if (!window.confirm(`Eliminar "${product.name}" del inventario?`)) {
      return;
    }
    await deleteProduct(product.id);
    showToast("Producto eliminado.");
  }

  async function handleReset() {
    if (!window.confirm("Restablecer los datos de ejemplo?")) {
      return;
    }
    await resetSampleProducts();
    setFilters(initialFilters);
    showToast("Datos de ejemplo restablecidos.");
  }

  return (
    <div className="app-shell">
      <Sidebar latestUpdate={metrics.latestUpdate} />

      <main className="workspace">
        <Header
          filters={filters}
          productCount={products.length}
          onFilterChange={updateFilter}
          onCreate={openCreateForm}
          onReset={handleReset}
        />

        {error ? <div className="notice error">{error}</div> : null}

        <section className="metric-grid" aria-label="Resumen de inventario">
          <MetricCard
            icon={Boxes}
            label="Productos"
            value={formatNumber(metrics.totalProducts)}
            note="Referencias registradas"
            tone="teal"
          />
          <MetricCard
            icon={Layers3}
            label="Unidades"
            value={formatNumber(metrics.totalUnits)}
            note="Stock disponible total"
            tone="blue"
          />
          <MetricCard
            icon={DollarSign}
            label="Valor"
            value={formatCurrency(metrics.totalValue)}
            note="Estimado de inventario"
            tone="green"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Alertas"
            value={formatNumber(metrics.alertCount)}
            note="Bajo stock o agotado"
            tone="amber"
          />
        </section>

        <div className="content-grid">
          <InventoryTable
            categories={categories}
            filters={filters}
            loading={loading}
            products={visibleProducts}
            resultCount={visibleProducts.length}
            visibleValue={visibleValue}
            onFilterChange={updateFilter}
            onEdit={openEditForm}
            onDelete={handleDeleteProduct}
            onAdjustStock={adjustStock}
          />

          <SidePanels
            categories={categories}
            lowStockProducts={lowStockProducts}
            products={products}
          />
        </div>
      </main>

      <ProductForm
        categories={categories}
        existingProducts={products}
        isOpen={isFormOpen}
        product={editingProduct}
        onClose={closeForm}
        onSave={handleSaveProduct}
      />

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
