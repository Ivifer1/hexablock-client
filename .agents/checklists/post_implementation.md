# Checklist 2: Post-Implementation Gate (Verificación de Calidad y Arquitectura)

> **Regla de Oro:** Todo código implementado debe pasar este checklist antes de considerarse listo para revisión o commit.

## 1. Aislamiento e Invariantes de Clean Architecture
- [ ] `src/domain/` no importa NADA de capas externas (`application`, `adapters`, `infrastructure`, React, React Native, Expo, etc.).
- [ ] `src/application/` depende únicamente de `src/domain/` y de sus propios puertos de entrada/salida. Cero imports de UI o frameworks.
- [ ] `src/domain/` y `src/application/` no usan APIs de infraestructura directamente:
  - Sin `Math.random()` directo (usar puerto `IRandomSource` inyectable y determinista).
  - Sin `Date.now()` ni `new Date()` directo (usar puerto `IClock` o tiempo inyectado).
  - Cero `console.log` o `console.error` (usar aspecto de Logging/Trazabilidad).
  - Cero `fetch`, `XMLHttpRequest` ni almacenamiento local (`AsyncStorage`, `localStorage`).
- [ ] Los repositorios y adaptadores externos se encuentran en `infrastructure/` implementando interfaces de `application/` o `domain/`.

## 2. SOLID y Patrones GoF
- [ ] **SRP:** Cada clase tiene una sola razón de cambio.
- [ ] **OCP:** No existen condicionales `if/switch` basados en la variante (`gameId`, `mode === 'lines'`) dentro del motor ni de los casos de uso. Las diferencias se delegan a Estrategias (`IGameRules`).
- [ ] **LSP:** Toda implementación de `IGameRules` respeta el contrato sin excepciones ni métodos no soportados.
- [ ] **ISP:** Interfaces pequeñas y segregadas (ej. `IUndoable` separado de `IGameRules`).
- [ ] **DIP:** Los casos de uso dependen exclusivamente de interfaces/puertos, nunca de clases concretas.
- [ ] **AOP sin librerías:** Concerns transversales implementados mediante decoradores/proxies alrededor de los casos de uso.

## 3. Estándares de Testing
- [ ] Metodología AAA (`// Arrange`, `// Act`, `// Assert`) con una sola intención por test.
- [ ] Nomenclatura obligatoria: `should_<resultado_esperado>_when_<condicion>`.
- [ ] *State over Interaction*: Aserciones sobre estado devuelto y propiedades públicas; mocks reservados solo para verificar comportamiento de decoradores AOP.
- [ ] In-Memory Fakes: Uso de fakes basados en memoria (`Map`) para repositorios y gateways, sin dependencias de I/O.
- [ ] El motor genérico se prueba con una celda ficticia (`FakeCell`), demostrando independencia de las 4 variantes.
- [ ] Verificación de falla: Se comprobó que el test falla al romper la regla temporalmente.

## 4. Verificación Automatizada
- [ ] `npm run typecheck` pasa con 0 errores (TypeScript en modo estricto).
- [ ] `npm run lint` pasa con 0 warnings y 0 errores.
- [ ] `npm test` pasa al 100% (todas las suites en verde).
