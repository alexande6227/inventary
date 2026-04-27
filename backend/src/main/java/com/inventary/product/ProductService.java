package com.inventary.product;

import com.inventary.shared.DuplicateSkuException;
import com.inventary.shared.NotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {
  private final ProductRepository repository;

  public ProductService(ProductRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> findAll() {
    return repository.findAll(Sort.by("name").ascending()).stream()
        .map(ProductResponse::from)
        .toList();
  }

  public ProductResponse create(ProductRequest request) {
    ensureSkuAvailable(request.sku(), null);
    Product product = applyRequest(new Product(), request);
    return ProductResponse.from(repository.save(product));
  }

  public ProductResponse update(UUID id, ProductRequest request) {
    Product product =
        repository
            .findById(id)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado."));
    ensureSkuAvailable(request.sku(), id);
    return ProductResponse.from(repository.save(applyRequest(product, request)));
  }

  public void delete(UUID id) {
    if (!repository.existsById(id)) {
      throw new NotFoundException("Producto no encontrado.");
    }
    repository.deleteById(id);
  }

  public List<ProductResponse> resetSampleProducts() {
    repository.deleteAll();
    repository.saveAll(sampleProducts());
    return findAll();
  }

  private Product applyRequest(Product product, ProductRequest request) {
    product.setName(request.name().trim());
    product.setSku(request.sku().trim().toUpperCase());
    product.setCategory(request.category().trim());
    product.setStock(request.stock());
    product.setMinStock(request.minStock());
    product.setPrice(request.price());
    product.setSupplier(request.supplier().trim());
    product.setStatus(request.status());
    return product;
  }

  private void ensureSkuAvailable(String sku, UUID currentId) {
    String normalizedSku = sku.trim().toUpperCase();
    boolean exists =
        currentId == null
            ? repository.existsBySkuIgnoreCase(normalizedSku)
            : repository.existsBySkuIgnoreCaseAndIdNot(normalizedSku, currentId);

    if (exists) {
      throw new DuplicateSkuException("Ya existe un producto con ese SKU.");
    }
  }

  private List<Product> sampleProducts() {
    return List.of(
        product(
            "Monitor 24 pulgadas",
            "TEC-MON-024",
            "Tecnologia",
            18,
            6,
            "620000",
            "Andes Tech",
            ProductStatus.ACTIVO),
        product(
            "Teclado mecanico",
            "TEC-KEY-112",
            "Tecnologia",
            7,
            8,
            "180000",
            "Byte Norte",
            ProductStatus.ACTIVO),
        product(
            "Silla ergonomica",
            "OFI-SIL-300",
            "Oficina",
            12,
            4,
            "410000",
            "Mobiliario Central",
            ProductStatus.ACTIVO),
        product(
            "Caja organizadora",
            "ALM-BOX-045",
            "Almacen",
            31,
            10,
            "35000",
            "Logisur",
            ProductStatus.ACTIVO),
        product(
            "Kit limpieza",
            "MAN-KIT-009",
            "Mantenimiento",
            0,
            5,
            "72000",
            "ServiClean",
            ProductStatus.PAUSADO),
        product(
            "Etiquetas termicas",
            "VEN-ETQ-500",
            "Ventas",
            46,
            20,
            "26000",
            "Punto Pack",
            ProductStatus.ACTIVO));
  }

  private Product product(
      String name,
      String sku,
      String category,
      Integer stock,
      Integer minStock,
      String price,
      String supplier,
      ProductStatus status) {
    return new Product(
        name, sku, category, stock, minStock, new BigDecimal(price), supplier, status);
  }
}
