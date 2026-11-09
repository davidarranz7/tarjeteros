# Decisiones técnicas · Plexus Backend Trainer (implementación Figma Make)

## Identidad visual: no rediseñar

La fuente de verdad visual es el prototipo Figma Make aprobado. Se ha conservado el CSS original y sus tokens en `src/styles/figma-original.css` (azul #2364d7, fondo #f5f7fa, tipografías DM Sans y JetBrains Mono, máximo 520px, tarjetas, barra inferior y modales). La arquitectura interna sí es distinta: Angular 21 standalone, zoneless/Signals y rutas lazy. Los pocos estilos extra están al final del mismo fichero e incorporan campos funcionales sin cambiar la estética de las pantallas originales.

## Qué se conserva y qué se adapta

- Vistas Inicio, Módulos, Temas, Estudio, Progreso y Ajustes.
- Iconos convertidos desde los trazados SVG originales de Figma a un componente Angular.
- El prototipo React tenía datos simulados, ocho tarjetas y módulos de ejemplo. Se reemplazan por el banco de 218 tarjetas y los 14 módulos exactos del PDF, dejando 2–14 pendientes.
- El usuario evalúa manualmente sus respuestas; no se inventa un corrector de IA.
- Las estadísticas usan eventos reales, no barras precargadas del prototipo.

## Núcleo de dominio

`core/models.ts` declara los tipos. `core/catalog.ts` concentra los módulos y el contenido. `ProgressService` mantiene las calificaciones e historial, y `StudyService` la cola de preguntas con pausa y repetición. `StudyLauncherService` gestiona filtros, tema y cantidad; `PreferencesService` guarda objetivo y preferencia de repaso. `src/data/module-01.json` contiene las 218 preguntas organizadas en 14 temas.

## Persistencia y módulos futuros

El progreso se guarda en `localStorage` bajo las claves **compatibles con la versión Angular anterior** `backend-lab:progress:v1` y `backend-lab:session:v1`; así una actualización en el mismo origen intenta conservar las estadísticas. Render/localhost son orígenes distintos y no comparten estos datos. Las tarjetas usan IDs estables (`M01-...`) y eventos etiquetados con `moduleId`.

## Criterio de dominio

Mal implica un repaso antes que Bien; Regular requiere seguir practicando. Bien se espacia con intervalos crecientes. La consolidación exige al menos tres repasos buenos consecutivos, pero **nunca se declara dominado un módulo automáticamente**. Las tarjetas avanzadas no se bloquean: el modo progresivo solo modifica prioridades.

## Seguridad y limitaciones

El resaltador escapa HTML del banco antes de añadir marcado propio. Un archivo de copia importado se valida y se limita a tarjetas conocidas. Solo se almacena información educativa en el navegador. No hay cuenta, base de datos ni sincronización automática. La primera publicación es un sitio estático Render con service worker PWA.

## Verificaciones realizadas

Validados los 218 registros, los 14 temas, 10 tests de lógica y el chequeo auxiliar de tipos. **No se ha podido ejecutar `ng build` en este contenedor** porque npm no resuelve `registry.npmjs.org`; la compilación Angular real debe ejecutarse en un entorno con dependencias. La acción CI incluida la realiza al subir a GitHub.
