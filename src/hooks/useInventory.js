import { useEffect, useMemo, useState } from "react";
import { createInventoryRepository } from "../services/inventoryRepository.js";

export function useInventory() {
  const repository = useMemo(() => createInventoryRepository(), []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function runOperation(operation) {
    setError("");
    try {
      return await operation();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrio un error inesperado.";
      setError(message);
      throw err;
    }
  }

  async function reloadProducts() {
    setLoading(true);
    await runOperation(async () => {
      const loadedProducts = await repository.listProducts();
      setProducts(loadedProducts);
    });
    setLoading(false);
  }

  useEffect(() => {
    reloadProducts().catch(() => setLoading(false));
  }, []);

  async function createProduct(payload) {
    const savedProduct = await runOperation(() => repository.createProduct(payload));
    setProducts((current) => [savedProduct, ...current]);
    return savedProduct;
  }

  async function updateProduct(id, payload) {
    const savedProduct = await runOperation(() => repository.updateProduct(id, payload));
    setProducts((current) =>
      current.map((product) => (product.id === id ? savedProduct : product))
    );
    return savedProduct;
  }

  async function deleteProduct(id) {
    await runOperation(() => repository.deleteProduct(id));
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  async function adjustStock(id, amount) {
    const product = products.find((item) => item.id === id);
    if (!product) return null;

    const nextStock = Math.max(0, product.stock + amount);
    return updateProduct(id, { ...product, stock: nextStock });
  }

  async function resetSampleProducts() {
    const seededProducts = await runOperation(() => repository.resetSampleProducts());
    setProducts(seededProducts);
  }

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    resetSampleProducts,
    reloadProducts
  };
}
