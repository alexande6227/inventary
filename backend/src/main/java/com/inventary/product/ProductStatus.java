package com.inventary.product;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProductStatus {
  ACTIVO("Activo"),
  PAUSADO("Pausado"),
  DESCONTINUADO("Descontinuado");

  private final String label;

  ProductStatus(String label) {
    this.label = label;
  }

  @JsonValue
  public String getLabel() {
    return label;
  }

  @JsonCreator
  public static ProductStatus fromValue(String value) {
    for (ProductStatus status : values()) {
      if (status.label.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
        return status;
      }
    }
    throw new IllegalArgumentException("Estado de producto invalido: " + value);
  }
}
