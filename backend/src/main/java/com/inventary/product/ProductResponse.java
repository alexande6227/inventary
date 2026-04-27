package com.inventary.product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
    UUID id,
    String name,
    String sku,
    String category,
    Integer stock,
    Integer minStock,
    BigDecimal price,
    String supplier,
    ProductStatus status,
    Instant updatedAt) {
  public static ProductResponse from(Product product) {
    return new ProductResponse(
        product.getId(),
        product.getName(),
        product.getSku(),
        product.getCategory(),
        product.getStock(),
        product.getMinStock(),
        product.getPrice(),
        product.getSupplier(),
        product.getStatus(),
        product.getUpdatedAt());
  }
}
