# AGENTS.md — Kairo

> Punto de entrada para cualquier IA o colaborador que se incorpore al proyecto.
> Lee este archivo primero y luego sigue el orden de lectura indicado.

---

## ¿Qué es este proyecto?

Kairo es una aplicación de temporizador Pomodoro instalable para Windows.
Interfaz visual oscura, funcionamiento local, sin cuentas ni conexión a internet.

---

## Orden de lectura obligatorio

1. `docs/index.md` — mapa completo de la documentación
2. `docs/product.md` — qué es Kairo, alcance y terminología
3. `docs/requirements.md` — requisitos funcionales y no funcionales
4. `docs/design.md` — sistema visual (colores, tipografía, pantallas)
5. `docs/plan.md` — stack técnico y estructura *(disponible en Etapa 2)*
6. `docs/tasks.md` — tareas con estado y dependencias
7. `docs/decisions.md` — registro de decisiones importantes
8. `docs/handoff.md` — **lee este último**: estado actual, qué sigue, qué está bloqueado

---

## Flujo de trabajo para todas las IAs

1. Leer `AGENTS.md` y los documentos indicados arriba.
2. Revisar `docs/tasks.md` y `docs/handoff.md` para entender el estado actual.
3. Identificar la siguiente tarea disponible y verificar que sus dependencias estén completadas.
4. Implementar **solo** el alcance aprobado para esa tarea.
5. Ejecutar las comprobaciones posibles (automatizadas y manuales).
6. Registrar en `docs/tasks.md` qué se verificó y qué sigue pendiente.
7. Actualizar `docs/tasks.md`, `docs/decisions.md` y `docs/handoff.md` antes de finalizar.

**Ninguna decisión importante debe quedar únicamente en el chat.**

---

## Reglas críticas

- **No modifiques `docs/design.md`** sin aprobación explícita del responsable.
- No marques una tarea como `completada` sin haber realizado la verificación correspondiente.
- Si encuentras una contradicción entre documentos, regístrala en `docs/decisions.md`
  como pendiente y notifica al responsable antes de actuar.
- No añadas funciones fuera del alcance aprobado para la etapa actual.
- Si algo no está decidido, indícalo como **[PENDIENTE]** en el documento correspondiente.
  Nunca inventes una decisión.

---

## Etapa actual

**Proyecto completo** — todas las tareas del MVP y Pro/escritorio implementadas y verificadas.

Ver `docs/handoff.md` para el estado exacto y los próximos pasos.


