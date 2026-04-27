import { Plus, RefreshCcw, Search } from "lucide-react";
import { formatNumber } from "../utils/formatters.js";

export function Header({ filters, productCount, onFilterChange, onCreate, onReset }) {
  return (
    <header className="topbar" id="dashboard">
      <div className="page-title">
        <h1>Inventario</h1>
        <p>{formatNumber(productCount)} productos registrados</p>
      </div>

      <label className="search-box" htmlFor="searchInput">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Buscar</span>
        <input
          id="searchInput"
          type="search"
          value={filters.search}
          placeholder="Buscar por producto, SKU o proveedor"
          onChange={(event) => onFilterChange("search", event.target.value)}
        />
      </label>

      <div className="actions">
        <button className="button" type="button" onClick={onReset}>
          <RefreshCcw size={18} />
          Restablecer
        </button>
        <button className="button primary" type="button" onClick={onCreate}>
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>
    </header>
  );
}
