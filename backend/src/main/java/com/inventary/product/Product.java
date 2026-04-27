package com.inventary.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 80)
  private String name;

  @Column(nullable = false, unique = true, length = 24)
  private String sku;

  @Column(nullable = false, length = 40)
  private String category;

  @Column(nullable = false)
  private Integer stock;

  @Column(nullable = false)
  private Integer minStock;

  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal price;

  @Column(nullable = false, length = 60)
  private String supplier;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ProductStatus status;

  @Column(nullable = false)
  private Instant updatedAt;

  public Product() {}

  public Product(
      String name,
      String sku,
      String category,
      Integer stock,
      Integer minStock,
      BigDecimal price,
      String supplier,
      ProductStatus status) {
    this.name = name;
    this.sku = sku;
    this.category = category;
    this.stock = stock;
    this.minStock = minStock;
    this.price = price;
    this.supplier = supplier;
    this.status = status;
  }

  @PrePersist
  @PreUpdate
  void touch() {
    updatedAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSku() {
    return sku;
  }

  public void setSku(String sku) {
    this.sku = sku;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public Integer getStock() {
    return stock;
  }

  public void setStock(Integer stock) {
    this.stock = stock;
  }

  public Integer getMinStock() {
    return minStock;
  }

  public void setMinStock(Integer minStock) {
    this.minStock = minStock;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public String getSupplier() {
    return supplier;
  }

  public void setSupplier(String supplier) {
    this.supplier = supplier;
  }

  public ProductStatus getStatus() {
    return status;
  }

  public void setStatus(ProductStatus status) {
    this.status = status;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
