# Checklist 1: Pre-Implementation Gate (Aprobación Obligatoria)

> **Regla de Oro:** NINGÚN agente ni desarrollador debe escribir o modificar código en `src/**` sin haber completado este checklist y recibido la aprobación explícita (`Status: APPROVED`) del equipo humano.

## 1. Verificación de Especificación (Spec First)
- [ ] ¿El comportamiento a implementar cuenta con un caso de uso (`UC-###`) o requisito (`FR/NFR/C-###`) aprobado en `docs/specs/`?
- [ ] ¿Están claras las precondiciones, flujo principal, flujos alternativos, flujos de error y reglas de negocio (`BR-###`)?
- [ ] Si hay ambigüedad o preguntas abiertas, ¿se consultaron con el equipo antes de asumir decisiones de diseño?

## 2. Propuesta de Diseño (Change Record)
- [ ] Se creó la rama de trabajo según el plan (`feat/engine-*`, `feat/domain-*`, `feat/frontend-*`).
- [ ] Se copió `docs/ai/change-records/TEMPLATE.md` a `docs/ai/change-records/<branch>.md` (con barras convertidas en `__`).
- [ ] El archivo tiene `Status: PROPOSED`.
- [ ] Se detalló la arquitectura por capas (**Clean Architecture**): archivos a tocar y confirmación de que ninguna dependencia apunta hacia afuera.
- [ ] Se justificaron los principios **SOLID** concretos involucrados (clases y roles).
- [ ] Se justificaron los **Patrones de Diseño (GoF)**: rol de cada clase, problema que resuelve y justificación frente a alternativas.
- [ ] Se demostró la **Extensibilidad**: cómo se agregaría una 5ta variante sin tocar el motor genérico (`GameEngine`).

## 3. Puerta de Aprobación Humana (STOP GATE)
- [ ] Se presentó la propuesta formal en español al equipo.
- [ ] **UN HUMANO cambió el estado a `Status: APPROVED`.**
- [ ] Los tests unitarios (`test/**`) pueden prepararse, pero `src/**` permanece bloqueado hasta el visto bueno explícito.
