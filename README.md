# Frontend – Árbol Genealógico (Vue 3 + Vite)

## 🌟 Descripción

Este es el **frontend** del proyecto *Árbol Genealógico*. Está construido con:

- **Vue 3** (Composition API)
- **Vite** como servidor de desarrollo y bundler
- **Pinia** para gestión de estado
- **Vitest** para tests unitarios e integración
- **TypeScript** para tipado seguro

La UI muestra un árbol genealógico interactivo, permite agregar personas, definir relaciones y visualizarlas en un layout responsivo con tarjetas.

---

## 📦 Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | 18+            |
| npm         | 9+             |
| Git         | cualquier versión reciente |

---

## 🚀 Instalación y ejecución

```bash
# 1️⃣ Clonar el repositorio (si aún no lo has hecho)

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Iniciar el servidor de desarrollo
npm run dev
```

Abre **http://localhost:5173** en tu navegador. Vite ofrece Hot Module Replacement (HMR), así que los cambios se reflejan al instante.

---

## 📂 Estructura del proyecto

```
frontend/
├── public/                  # Archivos estáticos (favicon, etc.)
├── src/
│   ├── assets/              # Imágenes, fuentes, estilos globales
│   ├── components/          # Componentes Vue reutilizables
│   │   └── PersonaCard.vue  # Tarjeta de persona
│   ├── stores/              # Pinia stores
│   │   ├── personas.store.ts
│   │   └── eventos.store.ts
│   ├── services/            # Servicios HTTP (api.service.ts)
│   ├── views/               # Vistas / páginas (router views)
│   ├── router/              # Configuración de Vue Router
│   ├── App.vue              # Componente raíz
│   └── main.ts              # Punto de entrada de la aplicación
├── __tests__/               # Tests con Vitest
│   ├── e2e/                 # Tests end-to-end
│   └── integration/         # Tests de integración
├── tsconfig.json            # Configuración TypeScript
├── tsconfig.node.json       # TS config para Vite (Node)
├── vite.config.ts           # Configuración de Vite
└── package.json             # Scripts y dependencias
```

---

## 🛠️ Scripts disponibles

| Script             | Descripción                                       |
|--------------------|---------------------------------------------------|
| `npm run dev`      | Inicia el servidor de desarrollo con HMR.         |
| `npm run build`    | Genera el bundle optimizado en `dist/`.            |
| `npm run preview`  | Sirve el build de producción localmente.           |
| `npm run test`     | Ejecuta Vitest en modo watch.                      |
| `npm run test:run` | Ejecuta los tests una sola vez (ideal para CI).    |
| `npm run lint`     | Ejecuta ESLint/Prettier (si está configurado).     |

---

## 🧪 Testing

El proyecto usa **Vitest** para tests unitarios e integración.

```bash
# Ejecutar todos los tests una vez
npm run test:run

# Ejecutar con reporte de cobertura
npm run test:run -- --coverage
```

La cobertura de branches está configurada al **70%**, que ya se cumple con la suite de tests existente.

### Tipos de tests incluidos

- **E2E** (`__tests__/e2e/`): Pruebas del flujo completo del árbol genealógico.
- **Integración** (`__tests__/integration/`): Pruebas de los stores de Pinia con mocks de la API.

---

## 📦 Build de producción

```bash
npm run build    # Genera ./dist con assets optimizados
npm run preview  # Preview local del build
```

Despliega el contenido de `dist/` en cualquier servicio de hosting estático (Netlify, Vercel, GitHub Pages, etc.).

---

## 🎨 Personalización

### Cambiar estilos
Edita los estilos globales en `src/assets/` y los estilos de cada componente dentro de sus bloques `<style>`.

### Añadir una nueva entidad
1. Crear el componente Vue en `src/components/`.
2. Crear el store en `src/stores/`.
3. Registrar la ruta en `src/router/index.ts`.
4. Actualizar `src/services/api.service.ts` con los nuevos endpoints.

---

## 🧹 Limpieza

```bash
# Eliminar archivos generados y caché
rm -rf node_modules/.vite
rm -rf dist

# Reinstalar dependencias desde cero
rm -rf node_modules
npm install
```

---

## 📖 Referencias

- [Vite](https://vitejs.dev/guide/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api/introduction.html)
- [Pinia](https://pinia.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

*Proyecto desarrollado para Programación II – UCB, 3er semestre.*
