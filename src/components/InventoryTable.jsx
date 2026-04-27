import { Edit3, Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency, formatNumber } from "../utils/formatters.js";
import { getAvailability } from "../utils/inventory.js";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function InventoryTable({
  categories,
  filters,
  loading,
  products,
  resultCount,
  visibleValue,
  onFilterChange,
  onEdit,
  onDelete,
  onAdjustStock
}) {
  return (
    <section className="panel inventory-panel" id="inventario">
      <div className="panel-header">
        <div>
          <h2>Productos</h2>
          <span>{formatNumber(resultCount)} resultados</span>
        </div>
        <span>{formatCurrency(visibleValue)} visibles</span>
      </div>

      <div className="toolbar" aria-label="Filtros de inventario">
        <label className="sr-only" htmlFor="categoryFilter">
          Categoria
        </label>
        <select
          id="categoryFilter"
          value={filters.category}
          onChange={(event) => onFilterChange("category", event.target.value)}
        >
          <option value="all">Todas las categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="statusFilter">
          Estado
        </label>
        <select
          id="statusFilter"
          value={filters.status}
          onChange={(event) => onFilterChange("status", event.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Pausado">Pausado</option>
          <option value="Descontinuado">Descontinuado</option>
        </select>

        <label className="sr-only" htmlFor="sortSelect">
          Orden
        </label>
        <select
          id="sortSelect"
          value={filters.sort}
          onChange={(event) => onFilterChange("sort", event.target.value)}
        >
          <option value="name">Ordenar por nombre</option>
          <option value="stock-asc">Stock: menor primero</option>
          <option value="stock-desc">Stock: mayor primero</option>
          <option value="value-desc">Valor: mayor primero</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Categoria</th>
              <th scope="col">Stock</th>
              <th scope="col">Precio</th>
              <th scope="col">Proveedor</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">Cargando inventario...</div>
                </td>
              </tr>
            ) : null}

            {!loading && products.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    No hay productos para los filtros seleccionados.
                  </div>
                </td>
              </tr>
            ) : null}

            {!loading &&
              products.map((product) => {
                const availability = getAvailability(product);
                const lifecycleClass = product.status === "Activo" ? "lifecycle" : "paused";

                return (
                  <tr key={product.id}>
                    <td data-label="Producto">
                      <div className="product-cell">
                        <div className="product-avatar">{getInitials(product.name)}</div>
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Categoria">{product.category}</td>
                    <td data-label="Stock">
                      <div className="stock-control" aria-label={`Stock de ${product.name}`}>
                        <button
                          type="button"
                          aria-label="Disminuir stock"
                          onClick={() => onAdjustStock(product.id, -1)}
                        >
                          <Minus size={15} />
                        </button>
                        <span>{formatNumber(product.stock)}</span>
                        <button
                          type="button"
                          aria-label="Aumentar stock"
                          onClick={() => onAdjustStock(product.id, 1)}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <div className="muted">Minimo {formatNumber(product.minStock)}</div>
                    </td>
                    <td data-label="Precio">
                      <strong>{formatCurrency(product.price)}</strong>
                      <div className="muted">{formatCurrency(product.stock * product.price)}</div>
                    </td>
                    <td data-label="Proveedor">{product.supplier}</td>
                    <td data-label="Estado">
                      <span className={`badge ${availability.className}`}>
                        {availability.label}
                      </span>
                      <span className={`badge ${lifecycleClass}`}>{product.status}</span>
                    </td>
                    <td data-label="Acciones">
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          type="button"
                          aria-label={`Editar ${product.name}`}
                          data-tooltip="Editar"
                          onClick={() => onEdit(product)}
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          className="icon-button danger"
                          type="button"
                          aria-label={`Eliminar ${product.name}`}
                          data-tooltip="Eliminar"
                          onClick={() => onDelete(product)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
