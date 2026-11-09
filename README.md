# Plexus Backend Trainer · Figma → Angular

Tarjetero de formación backend, **mobile-first**, basado en el diseño original de Figma Make aprobado por el usuario. La estética mantiene la paleta, tipografía, composición, tarjetas, botones y navegación del prototipo original (en particular `src/styles/figma-original.css`).

**Contenido:** módulo 01 «Java moderno y Git», **218 preguntas** en **14 temas**. Los módulos 02–14 aparecen con los nombres reales del plan de Plexus y pendientes de contenido. El programa no desbloquea módulos automáticamente por acertar unas pocas preguntas.

## Ejecutar en Windows / PowerShell

Requisitos: Node.js 22 LTS, npm y conexión a Internet **solo para instalar dependencias**.

```powershell
cd "C:\ruta\a\plexus-backend-trainer"
npm install
npm start
```

Abre http://localhost:4200. Para ver el diseño móvil desde Chrome: `F12` → `Ctrl + Shift + M` → elegir un iPhone. Para acceder desde otro dispositivo de la misma Wi-Fi:

```powershell
npm start -- --host 0.0.0.0
ipconfig
```

Desde el móvil visita `http://IP_DEL_ORDENADOR:4200` (Windows Firewall debe permitir la red privada). No expongas el servidor de desarrollo a Internet.

## Comprobar el proyecto

```powershell
npm run check:cards
npm run test:logic
npm run build
```

La compilación debe producir `dist/plexus-backend-trainer/browser`. Los test de lógica ejecutan el algoritmo de repaso y las pruebas de recuperación de sesiones. `npm run check:types:offline` es una comprobación sintáctica auxiliar, **no sustituye** la compilación Angular real.

## Despliegue GitHub → Render

1. Sube **el contenido de esta carpeta** a un repositorio GitHub. No subas `node_modules` ni `dist`.
2. En Render, selecciona **New → Blueprint** para usar `render.yaml`. Como alternativa: **New → Static Site** y conecta el repositorio.
3. Build command: `npm install --no-audit --no-fund && npm run build`.
4. Publish directory: `dist/plexus-backend-trainer/browser`.
5. Configura una **Rewrite** `/*` → `/index.html` para las rutas de Angular.
6. Usa Node 22 o el `NODE_VERSION` definido en `render.yaml`.

Una vez desplegado por HTTPS, puedes instalar la PWA en iPhone desde Safari → Compartir → Añadir a pantalla de inicio. El service worker permite usar la app sin conexión tras cargarla y guardarla en caché por primera vez.

## Cómo funciona

- **Inicio**: sesión guardada, progreso del día y módulos.
- **Módulos**: elegir módulo concreto o todos los disponibles; por ahora solo existe contenido en el módulo 1.
- **Temas**: elegir uno o todos los temas.
- **Sesión**: 5, 10, 20 tarjetas o sin límite; modos general, progresivo, pendientes, débiles, nuevas y favoritas; dificultad opcional.
- **Tarjeta**: contexto, pregunta, fragmentos de código con formato y solución oculta; autoevaluación Mal, Regular o Bien. Escribir respuesta es opcional.
- **Pausar**: conserva tarjeta actual, solución mostrada y texto escrito, incluso al cerrar el navegador.
- **Progreso**: estadísticas reales por período y módulo; gráficos derivados de respuestas, no cifras inventadas.
- **Ajustes**: objetivo diario, repaso prioritario, tema claro/oscuro, exportar/importar y reiniciar.

El progreso se guarda **localmente en el navegador** mediante `localStorage`. No existe autenticación ni sincronización en la nube todavía. Si estudias en móvil y ordenador, sus datos son independientes; exporta/importa la copia JSON cuando cambies de dispositivo. **Haz una copia antes de limpiar los datos del navegador**.

## Estructura

```text
src/
  app/
    core/              catálogo, modelos, almacenamiento, algoritmo, sesiones, preferencias
    shared/            iconos originales, cabecera y visor de código
    features/
      home/            inicio
      modules/         14 módulos + todos
      topics/          temas del módulo
      study/           tarjeta, respuesta, calificación, pausa
      stats/           estadísticas históricas reales
      settings/        ajustes y exportación/importación
    app.routes.ts      rutas lazy
    app.component.*    navegación y selector de sesión
  data/module-01.json  banco de 218 tarjetas
  styles/figma-original.css  estilos del prototipo Figma Make (fuente de verdad visual)
public/                manifest e iconos PWA
ngsw-config.json       caché offline de la aplicación
render.yaml            despliegue Render
.github/workflows/ci.yml comprobaciones al hacer push
```

## Añadir el módulo 2 sin cambiar diseño

Crea `src/data/module-02.json` con `id: '02'`, `topics` y `cards`. Después añade su import y registro en `src/app/core/catalog.ts` y marca el módulo como disponible. Usa IDs globales únicos (`M02-001`, etc.) y `moduleId:'02'` en sus tarjetas. Las estadísticas permanecerán separadas por identificador de módulo. Consulta también `docs/ANADIR_MODULOS.md`.

## Decisiones y limitaciones

- El diseño viene **del Figma Make original**, pero el proyecto final es Angular 21 standalone, con Signals, rutas diferidas y PWA.
- El prototipo Figma llevaba ocho preguntas de demostración y nombres de módulos de ejemplo: se sustituyen por contenido real para no dar una impresión falsa del temario.
- La app **no corrige automáticamente texto libre**: tú eliges la autoevaluación después de revelar la solución, tal como se acordó.
- No necesitas backend, PostgreSQL ni servidor propio para la primera versión en Render. La arquitectura de datos está preparada para añadirlos después, sin rediseñar la UI.
- La copia original de estilos no implica que la versión Angular esté probada píxel por píxel en todos los dispositivos. Haz una revisión visual en Chrome DevTools y en iPhone.
