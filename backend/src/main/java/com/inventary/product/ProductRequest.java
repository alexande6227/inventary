package com.inventary.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequest(
    @NotBlank @Size(max = 80) String name,
    @NotBlank @Size(max = 24) String sku,
    @NotBlank @Size(max = 40) String category,
    @NotNull @Min(0) Integer stock,
    @NotNull @Min(0) Integer minStock,
    @NotNull @DecimalMin("0.0") BigDecimal price,
    @NotBlank @Size(max = 60) String supplier,
    @NotNull ProductStatus status) {}
