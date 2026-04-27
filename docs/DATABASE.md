# Conexion a base de datos

El backend usa Spring Boot + Spring Data JPA. Por defecto corre con H2 en archivo local para que puedas probar sin instalar una base externa.

## Opcion 1: H2 local

No necesitas configurar nada. Ejecuta:

```bash
cd backend
mvn spring-boot:run
```

La base se guarda en:

```text
backend/data/inventary
```

Consola H2:

```text
http://localhost:8080/h2-console
```

Datos de conexion:

```text
JDBC URL: jdbc:h2:file:./data/inventary
User: sa
Password:
```

## Opcion 2: PostgreSQL

Crea la base:

```sql
CREATE DATABASE inventary;
CREATE USER inventary_user WITH PASSWORD 'inventary_password';
GRANT ALL PRIVILEGES ON DATABASE inventary TO inventary_user;
```

Ejecuta el backend con variables de entorno.

PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/inventary"
$env:SPRING_DATASOURCE_USERNAME="inventary_user"
$env:SPRING_DATASOURCE_PASSWORD="inventary_password"
$env:SPRING_JPA_HIBERNATE_DDL_AUTO="update"
mvn spring-boot:run
```

Bash:

```bash
SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/inventary" \
SPRING_DATASOURCE_USERNAME="inventary_user" \
SPRING_DATASOURCE_PASSWORD="inventary_password" \
SPRING_JPA_HIBERNATE_DDL_AUTO="update" \
mvn spring-boot:run
```

## Activar React con la API

En la raiz del proyecto crea `.env`:

```bash
VITE_STORAGE_DRIVER=api
VITE_API_URL=/api
```

Levanta ambos procesos:

```bash
cd backend
mvn spring-boot:run
```

En otra terminal:

```bash
npm run dev
```

## Tabla principal

JPA crea esta tabla automaticamente con `spring.jpa.hibernate.ddl-auto=update`.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  sku VARCHAR(24) NOT NULL UNIQUE,
  category VARCHAR(40) NOT NULL,
  stock INTEGER NOT NULL,
  min_stock INTEGER NOT NULL,
  price NUMERIC(14, 2) NOT NULL,
  supplier VARCHAR(60) NOT NULL,
  status VARCHAR(20) NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

## Recomendacion para produccion

Para produccion, cambia `ddl-auto=update` por migraciones versionadas con Flyway o Liquibase. El flujo recomendado es:

1. Crear migracion SQL inicial para `products`.
2. Usar variables de entorno para credenciales.
3. Configurar backups automaticos.
4. Mantener `VITE_STORAGE_DRIVER=api` en el frontend.
