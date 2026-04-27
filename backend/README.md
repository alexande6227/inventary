# Inventary API

Backend Java con Spring Boot para persistir productos del inventario.

## Requisitos

- Java 17+
- Maven 3.9+

## Ejecutar

```bash
mvn spring-boot:run
```

La API queda disponible en:

```text
http://localhost:8080/api/products
```

## Persistencia

Por defecto usa H2 en archivo:

```text
backend/data/inventary
```

Para conectar PostgreSQL, revisa:

```text
../docs/DATABASE.md
```

## Endpoints

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `POST /api/products/reset-sample`
