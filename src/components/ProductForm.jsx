import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toProductPayload, validateProduct } from "../utils/inventory.js";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  supplier: "",
  stock: "0",
  minStock: "0",
  price: "0",
  status: "Activo"
};

function toFormState(product) {
  if (!product) return emptyForm;

  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    supplier: product.supplier,
    stock: String(product.stock),
    minStock: String(product.minStock),
    price: String(product.price),
    status: product.status
  };
}

export function ProductForm({
  categories,
  existingProducts,
  isOpen,
  product,
  onClose,
  onSave
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const categoryOptions = useMemo(() => categories, [categories]);

  useEffect(() => {
    if (!isOpen) return;
    setForm(toFormState(product));
    setErrors({});
  }, [isOpen, product]);

  if (!isOpen) return null;

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateProduct(form, existingProducts, product?.id);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      await onSave(toProductPayload(form));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="productFormTitle"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-header">
          <h2 id="productFormTitle">{product ? "Editar producto" : "Nuevo producto"}</h2>
          <button
            className="icon-button"
            type="button"
            data-tooltip="Cerrar"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <Field label="Producto" error={errors.name}>
              <input
                autoFocus
                value={form.name}
                maxLength={80}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </Field>

            <Field label="SKU" error={errors.sku}>
              <input
                value={form.sku}
                maxLength={24}
                onChange={(event) => updateField("sku", event.target.value)}
              />
            </Field>

            <Field label="Categoria" error={errors.category}>
              <input
                value={form.category}
                list="categoryOptions"
                maxLength={40}
                onChange={(event) => updateField("category", event.target.value)}
              />
              <datalist id="categoryOptions">
                {categoryOptions.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </Field>

            <Field label="Proveedor" error={errors.supplier}>
              <input
                value={form.supplier}
                maxLength={60}
                onChange={(event) => updateField("supplier", event.target.value)}
              />
            </Field>

            <Field label="Stock" error={errors.stock}>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
              />
            </Field>

            <Field label="Stock minimo" error={errors.minStock}>
              <input
                type="number"
                min="0"
                step="1"
                value={form.minStock}
                onChange={(event) => updateField("minStock", event.target.value)}
              />
            </Field>

            <Field label="Precio unitario" error={errors.price}>
              <input
                type="number"
                min="0"
                step="100"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
              />
            </Field>

            <Field label="Estado" error={errors.status}>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                <option value="Activo">Activo</option>
                <option value="Pausado">Pausado</option>
                <option value="Descontinuado">Descontinuado</option>
              </select>
            </Field>
          </div>

          <div className="dialog-actions">
            <button className="button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="button primary" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      <small className="field-error">{error || " "}</small>
    </label>
  );
}
