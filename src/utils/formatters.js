export const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

export const numberFormatter = new Intl.NumberFormat("es-CO");

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

export function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
