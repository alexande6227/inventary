# API REST

Base URL local:

```text
http://localhost:8080/api
```

## Producto

```json
{
  "id": "0b87d6af-7a53-4f22-87c6-1a8adbe84776",
  "name": "Monitor 24 pulgadas",
  "sku": "TEC-MON-024",
  "category": "Tecnologia",
  "stock": 18,
  "minStock": 6,
  "price": 620000,
  "supplier": "Andes Tech",
  "status": "Activo",
  "updatedAt": "2026-04-26T22:00:00Z"
}
```

## Endpoints

### Listar productos

```http
GET /api/products
```

Respuesta: `200 OK`

```json
[
  {
    "id": "0b87d6af-7a53-4f22-87c6-1a8adbe84776",
    "name": "Monitor 24 pulgadas",
    "sku": "TEC-MON-024",
    "category": "Tecnologia",
    "stock": 18,
    "minStock": 6,
    "price": 620000,
    "supplier": "Andes Tech",
    "status": "Activo",
    "updatedAt": "2026-04-26T22:00:00Z"
  }
]
```

### Crear producto

```http
POST /api/products
Content-Type: application/json
```

```json
{
  "name": "Mouse inalambrico",
  "sku": "TEC-MOU-010",
  "category": "Tecnologia",
  "stock": 20,
  "minStock": 5,
  "price": 85000,
  "supplier": "Andes Tech",
  "status": "Activo"
}
```

Respuesta: `201 Created`

### Actualizar producto

```http
PUT /api/products/{id}
Content-Type: application/json
```

Usa el mismo cuerpo de `POST`.

Respuesta: `200 OK`

### Eliminar producto

```http
DELETE /api/products/{id}
```

Respuesta: `204 No Content`

### Restablecer datos de ejemplo

```http
POST /api/products/reset-sample
```

Respuesta: `200 OK`

## Errores

Formato:

```json
{
  "message": "Ya existe un producto con ese SKU."
}
```

Codigos usados:

- `400`: datos invalidos.
- `404`: producto no encontrado.
- `409`: SKU duplicado.
