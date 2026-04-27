import { AlertTriangle } from "lucide-react";
import { formatNumber } from "../utils/formatters.js";

export function SidePanels({ categories, lowStockProducts, products }) {
  const categoryData = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    const units = categoryProducts.reduce((sum, product) => sum + product.stock, 0);
    return { category, units, products: categoryProducts.length };
  });
  const maxUnits = Math.max(...categoryData.map((item) => item.units), 1);

  return (
    <aside className="side-panels">
      <section className="panel" id="alertas">
        <div className="panel-header">
          <div>
            <h2>Alertas de stock</h2>
            <span>{formatNumber(lowStockProducts.length)} productos</span>
          </div>
        </div>

        <div className="alerts-list">
          {lowStockProducts.length === 0 ? (
            <div className="empty-state compact">Stock estable.</div>
          ) : null}

          {lowStockProducts.slice(0, 5).map((product) => (
            <div className="alert-row" key={product.id}>
              <div className="alert-icon">
                <AlertTriangle size={19} />
              </div>
              <div>
                <strong>{product.name}</strong>
                <span className="muted">
                  {formatNumber(product.stock)} disponibles / minimo{" "}
                  {formatNumber(product.minStock)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Categorias</h2>
            <span>{formatNumber(categories.length)} grupos</span>
          </div>
        </div>

        <div className="category-list">
          {categoryData.length === 0 ? (
            <div className="empty-state compact">Sin categorias.</div>
          ) : null}

          {categoryData.map((item) => {
            const width = Math.max(6, Math.round((item.units / maxUnits) * 100));
            return (
              <div className="category-row" key={item.category}>
                <div>
                  <strong>{item.category}</strong>
                  <div className="bar" aria-hidden="true">
                    <span style={{ width: `${width}%` }} />
                  </div>
                </div>
                <span>{formatNumber(item.units)} uds.</span>
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
