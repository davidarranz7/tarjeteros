# Añadir módulos 02–14 sin mezclar resultados

El menú de Módulos ya muestra los nombres correctos del PDF y permite seleccionar **Todos los módulos**. Solo el 01 está habilitado y tiene preguntas. No se generan preguntas ficticias para los demás.

1. Crea `src/data/module-02.json` con la misma estructura de `module-01.json`.
2. Cada pregunta debe tener `moduleId:'02'` e ID estable único `M02-001` y `topicId` único global `m02-maven`. Usa contexto explícito si el enunciado lo requiere.
3. Importa el catálogo JSON en `src/app/core/catalog.ts`, registra `topics` y `cards` para el módulo 02 y márcalo `available:true`. El selector general y las estadísticas lo incorporarán automáticamente.
4. Amplía `tools/validate_cards.py` y añade pruebas para el nuevo módulo.
5. Ejecuta `npm run check` (incluye el build) antes de subir a Render.

Formato de tarjeta:

```json
{
  "id": "M02-001",
  "moduleId": "02",
  "topicId": "m02-maven",
  "difficulty": "basic",
  "kind": "code",
  "origin": "plan",
  "context": "Estás revisando el ciclo de vida Maven de un proyecto Spring Boot.",
  "question": "¿Qué fases ejecutará Maven y por qué?",
  "questionCode": "./mvnw verify",
  "codeLanguage": "bash",
  "answer": "Ejecuta las fases hasta verify, incluidos los tests configurados en Surefire y Failsafe."
}
```

Los campos opcionales son `context`, `questionCode`, `answerCode`, `codeLanguage`, `focus` y `explanation`. El campo `origin` diferencia `plan`, `conversation` y `extension` como procedencia temática (no como cita textual). Las soluciones y el código se presentan separados.

Para añadir un backend futuro, mantén el catálogo como recurso de dominio y migra `ProgressService` a repositorio remoto con persistencia local de respaldo. Usa autenticación solo cuando sea necesaria y resuelve los conflictos de sincronización offline explícitamente.
