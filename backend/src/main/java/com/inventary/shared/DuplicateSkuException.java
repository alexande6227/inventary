package com.inventary.shared;

public class DuplicateSkuException extends RuntimeException {
  public DuplicateSkuException(String message) {
    super(message);
  }
}
