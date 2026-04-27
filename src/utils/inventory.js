const statusOptions = ["Activo", "Pausado", "Descontinuado"];

export function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

export function getCategories(products) {
  return [...new Set(products.map((product) => product.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
}

export function getAvailability(product) {
  if (product.stock <= 0) {
    return { label: "Agotado", className: "empty" };
  }

  if (product.stock <= product.minStock) {
    return { label: "Bajo stock", className: "low" };
  }

  return { label: "Disponible", className: "available" };
}

export function getLowStockProducts(products) {
  return products
    .filter((product) => product.stock <= product.minStock)
    .sort((a, b) => a.stock - b.stock);
}

export function computeInventoryMetrics(products) {
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.stock * product.price,
    0
  );
  const alertCount = getLowStockProducts(products).length;
  const updates = products
    .map((product) => product.updatedAt)
    .filter(Boolean)
    .sort();

  return {
    totalProducts,
    totalUnits,
    totalValue,
    alertCount,
    latestUpdate: updates[updates.length - 1] || null
  };
}

export function filterProducts(products, filters) {
  const search = normalizeText(filters.search);

  return products
    .filter((product) => {
      const matchesSearch =
        !search ||
        [product.name, product.sku, product.supplier].some((value) =>
          normalizeText(value).includes(search)
        );
      const matchesCategory =
        filters.category === "all" || product.category === filters.category;
      const matchesStatus = filters.status === "all" || product.status === filters.status;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sort === "stock-asc") return a.stock - b.stock;
      if (filters.sort === "stock-desc") return b.stock - a.stock;
      if (filters.sort === "value-desc") return b.stock * b.price - a.stock * a.price;
      return a.name.localeCompare(b.name, "es");
    });
}

export function validateProduct(input, existingProducts, editingId) {
  const errors = {};
  const name = input.name.trim();
  const sku = input.sku.trim();
  const category = input.category.trim();
  const supplier = input.supplier.trim();
  const stock = Number(input.stock);
  const minStock = Number(input.minStock);
  const price = Number(input.price);

  if (!name) errors.name = "Escribe el nombre.";
  if (!sku) errors.sku = "Escribe el SKU.";
  if (!category) errors.category = "Escribe la categoria.";
  if (!supplier) errors.supplier = "Escribe el proveedor.";
  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock invalido.";
  if (!Number.isInteger(minStock) || minStock < 0) {
    errors.minStock = "Stock minimo invalido.";
  }
  if (!Number.isFinite(price) || price < 0) errors.price = "Precio invalido.";
  if (!statusOptions.includes(input.status)) errors.status = "Estado invalido.";

  const duplicateSku = existingProducts.some(
    (product) =>
      normalizeText(product.sku) === normalizeText(sku) && product.id !== editingId
  );

  if (duplicateSku) {
    errors.sku = "Ya existe un producto con este SKU.";
  }

  return errors;
}

export function toProductPayload(input) {
  return {
    name: input.name.trim(),
    sku: input.sku.trim().toUpperCase(),
    category: input.category.trim(),
    supplier: input.supplier.trim(),
    stock: Number(input.stock),
    minStock: Number(input.minStock),
    price: Number(input.price),
    status: input.status
  };
}
