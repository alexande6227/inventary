# Arquitectura

Inventary esta dividido en dos capas principales:

- Frontend React: interfaz, filtros, formularios, metricas y experiencia de usuario.
- Backend Java Spring Boot: API REST y persistencia con JPA.

## Frontend

Responsabilidades por carpeta:

- `src/components`: componentes visuales reutilizables.
- `src/hooks/useInventory.js`: orquesta carga, creacion, edicion, eliminacion y ajuste de stock.
- `src/services/inventoryRepository.js`: abstrae el origen de datos. Puede usar `localStorage` o API REST.
- `src/utils`: filtros, calculos, validaciones y formateo.
- `src/data/sampleProducts.js`: inventario inicial para demo o reseteo.

El cambio entre almacenamiento local y API se controla con:

```bash
VITE_STORAGE_DRIVER=local
VITE_STORAGE_DRIVER=api
```

## Backend

La API Java esta en `backend/src/main/java/com/inventary`.

Capas:

- `ProductController`: expone endpoints HTTP.
- `ProductService`: reglas de negocio y validacion de SKU unico.
- `ProductRepository`: acceso a datos con Spring Data JPA.
- `Product`: entidad JPA.
- `ProductRequest` y `ProductResponse`: contrato de entrada/salida.
- `shared`: errores y manejador global.

## Flujo de datos

```text
React UI
  -> useInventory
  -> inventoryRepository
  -> localStorage
```

o en modo API:

```text
React UI
  -> useInventory
  -> inventoryRepository
  -> /api/products
  -> Spring Boot
  -> JPA
  -> Base de datos
```

## Decisiones

- La UI no depende de una base de datos para funcionar.
- La persistencia real queda preparada con Spring Boot y JPA.
- El contrato JSON mantiene campos compatibles con la version local.
- Los estados visibles son `Activo`, `Pausado` y `Descontinuado`.
