# Inventary

Sistema de inventario interactivo con frontend React y backend Java opcional.

El frontend funciona por defecto con `localStorage`, asi que puedes usarlo sin base de datos. Cuando quieras persistencia real, activa el modo API y ejecuta el backend Spring Boot incluido en `backend/`.

## Estructura

```text
Inventary/
  index.html
  package.json
  vite.config.js
  src/
    components/       Componentes React
    data/             Datos de ejemplo
    hooks/            Estado y operaciones de inventario
    services/         Repositorios localStorage/API
    styles/           CSS global
    utils/            Formateo, filtros y validaciones
  backend/            API Java Spring Boot
  docs/               Documentacion tecnica
```

## Frontend React

Instala dependencias y levanta Vite:

```bash
npm install
npm run dev
```

Abre:

```text
http://127.0.0.1:5173
```

Comandos disponibles:

```bash
npm run dev
npm run build
npm run preview
```

## Modos de datos

Por defecto el frontend usa `localStorage`.

Para usar el backend Java, crea un archivo `.env` en la raiz:

```bash
VITE_STORAGE_DRIVER=api
VITE_API_URL=/api
```

Luego ejecuta el backend:

```bash
cd backend
mvn spring-boot:run
```

Vite ya proxyfiquea `/api` hacia `http://localhost:8080`.

## Documentacion

- [Arquitectura](docs/ARCHITECTURE.md)
- [API REST](docs/API.md)
- [Conexion a base de datos](docs/DATABASE.md)
- [Backend Java](backend/README.md)
