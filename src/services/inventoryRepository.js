import { sampleProducts } from "../data/sampleProducts.js";

const STORAGE_KEY = "inventary.products.v2";
const storageDriver = import.meta.env.VITE_STORAGE_DRIVER || "local";
const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

function cloneProducts(products) {
  return products.map((product) => ({ ...product }));
}

function createId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `product-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readLocalProducts() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const seededProducts = cloneProducts(sampleProducts);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seededProducts));
    return seededProducts;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : cloneProducts(sampleProducts);
  } catch {
    return cloneProducts(sampleProducts);
  }
}

function writeLocalProducts(products) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function createLocalRepository() {
  return {
    async listProducts() {
      return readLocalProducts();
    },

    async createProduct(payload) {
      const products = readLocalProducts();
      const product = {
        id: createId(),
        ...payload,
        updatedAt: new Date().toISOString()
      };
      const nextProducts = [product, ...products];
      writeLocalProducts(nextProducts);
      return product;
    },

    async updateProduct(id, payload) {
      const products = readLocalProducts();
      let updatedProduct = null;
      const nextProducts = products.map((product) => {
        if (product.id !== id) return product;
        updatedProduct = {
          ...product,
          ...payload,
          updatedAt: new Date().toISOString()
        };
        return updatedProduct;
      });
      writeLocalProducts(nextProducts);
      return updatedProduct;
    },

    async deleteProduct(id) {
      const products = readLocalProducts();
      writeLocalProducts(products.filter((product) => product.id !== id));
    },

    async resetSampleProducts() {
      const seededProducts = cloneProducts(sampleProducts);
      writeLocalProducts(seededProducts);
      return seededProducts;
    }
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    let message = "No se pudo completar la solicitud.";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function createApiRepository() {
  return {
    listProducts() {
      return request("/products");
    },

    createProduct(payload) {
      return request("/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },

    updateProduct(id, payload) {
      return request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    },

    deleteProduct(id) {
      return request(`/products/${id}`, { method: "DELETE" });
    },

    resetSampleProducts() {
      return request("/products/reset-sample", { method: "POST" });
    }
  };
}

export function createInventoryRepository() {
  return storageDriver === "api" ? createApiRepository() : createLocalRepository();
}
