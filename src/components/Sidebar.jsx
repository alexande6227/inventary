import { AlertTriangle, Boxes, LayoutDashboard } from "lucide-react";
import { formatDate } from "../utils/formatters.js";

export function Sidebar({ latestUpdate }) {
  return (
    <aside className="sidebar" aria-label="Navegacion principal">
      <div className="brand">
        <div className="brand-mark">IN</div>
        <div>
          <strong>Inventary</strong>
          <span>Control de stock</span>
        </div>
      </div>

      <nav className="nav-group">
        <a className="nav-link is-active" href="#dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </a>
        <a className="nav-link" href="#inventario">
          <Boxes size={18} />
          Inventario
        </a>
        <a className="nav-link" href="#alertas">
          <AlertTriangle size={18} />
          Alertas
        </a>
      </nav>

      <div className="sidebar-footer">
        <span className="sync-row">
          <span className="sync-dot" />
          Datos sincronizados
        </span>
        <span>Ultima actualizacion: {formatDate(latestUpdate)}</span>
      </div>
    </aside>
  );
}
