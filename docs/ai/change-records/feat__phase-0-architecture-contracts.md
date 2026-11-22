# Change Record: Fase 0 — contratos de puertos de salida y DTOs

- **Branch:** `feat/phase-0-architecture-contracts`
- **Status:** PROPOSED
- **Fase:** 0 únicamente
- **Alcance:** puertos de salida de aplicación y DTOs de valor de aplicación; no implementación de casos de uso, adaptadores, vistas, dominio ni Composition Root

## Context and motivation

Congelar los contratos que traducen el resultado interno de la aplicación hacia las pantallas 05, 06, 07 y 09 sin acoplar `src/application` a React, Expo, DOM, almacenamiento o una variante concreta de juego.

La Fase 0 resuelve únicamente nombres, responsabilidades y formas de datos. Los contratos siguientes son mínimos y deliberadamente neutrales respecto a React, transporte y motor.

## Spec IDs satisfied

- **Pantallas:** `05-seleccion-niveles`, `06-victoria`, `07-derrota`, `09-partida-marco`.
- **Requisitos conocidos:** `PRG-03`, `FIT-10`, `SRT-09`, `PRG-04`, `PRG-05`, `SUI-02`, `SUI-06`, `FIT-06`, `FIT-07`, `SRT-06`, `MRG-07`, `PRG-08`, `SUI-07`, `LIN-07`, `LIN-10`, `SRT-07`, `MRG-08`, `MRG-09`, `TAB-01`, `TAB-03`, `TAB-04`, `TAB-10`, `TAB-11`, `SUI-09`.
- Los IDs concretos anteriores se toman de los documentos de pantallas. No existen en el checkout actual `docs/specs/requirements.md`, `docs/specs/entity-model.md` ni `docs/specs/use-cases/UC-*.md`; por tanto, no es posible afirmar IDs `UC-###` adicionales en esta propuesta.

## Proposed names and locations

### Puertos de salida

Ubicación: `src/application/ports/output/`

```ts
// src/application/ports/output/IGameHudOutputPort.ts
export interface IGameHudOutputPort {
  presentHud(view: GameHudDTO): void;
}

// src/application/ports/output/IGameControlsOutputPort.ts
export interface IGameControlsOutputPort {
  presentControls(view: GameControlsDTO): void;
}

// src/application/ports/output/ILevelSelectionOutputPort.ts
export interface ILevelSelectionOutputPort {
  presentLevelSelection(view: LevelSelectionViewDTO): void;
}

// src/application/ports/output/IVictoryOutputPort.ts
export interface IVictoryOutputPort {
  presentVictory(view: VictoryViewDTO): void;
}

// src/application/ports/output/IDefeatOutputPort.ts
export interface IDefeatOutputPort {
  presentDefeat(view: DefeatViewDTO): void;
}
```

El puerto se llama por intención de presentación, no por tecnología. Las operaciones reciben DTO planos y devuelven `void`; el caso de uso no conoce quién renderiza ni qué framework usa.

### DTOs de valor

Ubicación: `src/application/value-objects/`

```ts
export type ScreenLoadState = 'LOADING' | 'NORMAL' | 'EMPTY' | 'ERROR';

export type GameId = string;
export type LevelNumber = number;

export interface I18nKeyDTO {
  key: string;
  parameters?: Readonly<Record<string, string | number>>;
}

export interface GameHudDTO {
  readonly gameId: GameId;
  readonly title: I18nKeyDTO;
  readonly levelNumber: LevelNumber | null;
  readonly score: number | null;
  readonly bestScore: number | null;
  readonly moves: number | null;
  readonly elapsedSeconds: number | null;
  readonly goalsCompleted: number | null;
  readonly goalsTotal: number | null;
  readonly trayLabel: I18nKeyDTO | null;
}

export interface GameControlDTO {
  readonly action: 'PAUSE' | 'UNDO' | 'REDO' | 'ROTATE' | 'CHOOSE_DIRECTION';
  readonly enabled: boolean;
  readonly directionIndex: number | null;
  readonly label: I18nKeyDTO;
}

export interface GameControlsDTO {
  readonly controls: readonly GameControlDTO[];
}

export type LevelStatus = 'LOCKED' | 'AVAILABLE' | 'COMPLETED';

export interface LevelSelectionItemDTO {
  readonly levelNumber: LevelNumber;
  readonly status: LevelStatus;
  readonly stars: number | null;
  readonly bestScore: number | null;
}

export interface LevelSelectionViewDTO {
  readonly state: ScreenLoadState;
  readonly gameId: GameId;
  readonly title: I18nKeyDTO;
  readonly showsStars: boolean;
  readonly completedCount: number | null;
  readonly totalCount: number | null;
  readonly levels: readonly LevelSelectionItemDTO[];
  readonly isOffline: boolean;
}

export type VictoryResultVariant =
  | { readonly kind: 'FIT'; readonly stars: number; readonly moves: number; readonly elapsedSeconds: number }
  | { readonly kind: 'SORT'; readonly goalsCompleted: number; readonly goalsTotal: number; readonly score: number }
  | { readonly kind: 'MERGE'; readonly targetTileValue: number; readonly score: number }
  | { readonly kind: 'OTHER'; readonly score: number };

export interface VictoryViewDTO {
  readonly gameId: GameId;
  readonly score: number;
  readonly result: VictoryResultVariant;
  readonly isNewBest: boolean;
  readonly hasNextLevel: boolean;
  readonly canKeepPlaying: boolean;
  readonly availableActions:
    readonly ('NEXT_LEVEL' | 'REPLAY_LEVEL' | 'NEW_GAME' | 'KEEP_PLAYING' | 'GO_TO_LEVELS' | 'GO_HOME')[];
}

export type DefeatReason = 'LINES_NO_PIECE_FITS' | 'SORT_BOARD_FULL' | 'MERGE_NO_MOVE_CHANGES_BOARD';

export interface DefeatViewDTO {
  readonly gameId: GameId;
  readonly score: number;
  readonly reason: DefeatReason;
  readonly completedGoals: number | null;
  readonly totalGoals: number | null;
  readonly bestScore: number | null;
  readonly isNewBest: boolean;
  readonly availableActions: readonly ('RETRY' | 'GO_TO_LEVELS' | 'GO_HOME')[];
}
```

## Design decisions

- La selección de nivel usa un único `ScreenLoadState` para cargar, normal, vacío y error. Los datos permanecen opcionales mediante `null`, sin exponer excepciones ni objetos técnicos.
- Los bloques variables de victoria se representan mediante una variante discriminada por `kind`; esto permite que una quinta variante agregue un nuevo miembro sin cambiar el puerto.
- Las acciones disponibles son datos de intención. Los adaptadores de UI deciden cómo renderizarlos; no reciben nombres de clases ni componentes.
- Los textos son claves i18n y parámetros, nunca texto localizado dentro de la aplicación.
- El HUD separa indicadores (`IGameHudOutputPort`) de controles (`IGameControlsOutputPort`) para evitar forzar a una presentación que solo necesita uno de los dos.

## Generic parameters and constraints

- **Esta fase no declara `TCell`, `TMove` ni `TState` en puertos ni DTOs.** Esos contratos trabajan con DTO primitivos y variantes discriminadas; incorporar el modelo de dominio aquí violaría el aislamiento de presentación.
- `TCell`: no existe todavía en estos contratos. Cuando el motor los necesite, tendrá la forma `TCell` sin restricciones solo si el tablero no exige capacidades; un bound como `TCell extends { readonly key: string }` deberá justificarse por una operación real del dominio.
- `TMove`: no existe todavía. Cuando el motor o los comandos lo usen, deberá ser una estructura definida por el modo y un bound solo si necesita una capacidad común, por ejemplo `TMove extends { readonly type: string }`; no debe atarse a React.
- `TState`: no existe todavía. Fase 2 puede usarlo en casos de uso/motor con un bound mínimo `TState` o una interfaz de estado; no debe exponerse a los puertos de salida, que consumirán snapshots DTO independientes.

## SOLID

- **SRP:** `IGameHudOutputPort` cambia por indicadores de HUD; `IGameControlsOutputPort` por controles; los puertos de victoria, derrota y niveles tienen una pantalla/resultado cada uno. Los DTO solo transportan datos; no contienen reglas.
- **OCP:** una variante nueva añade un miembro a `VictoryResultVariant`, implementaciones concretas/registro y mapeo, sin `switch` obligatorio en los puertos existentes ni en las pantallas.
- **LSP:** no se añaden implementaciones abstractas en Fase 0. Toda implementación futura de un puerto deberá aceptar los DTO completos y producir el mismo observable, sin excepciones `NotImplemented`.
- **ISP:** se separan HUD y controles, y cada pantalla tiene un puerto propio. Una vista no necesita implementar métodos que no presenta.
- **DIP:** casos de uso y presentación interna dependerán de interfaces declaradas en `src/application`; React o Expo implementarán/adaptarán fuera de `src/application`.

## Patterns

- **Output Port / DIP:** participante abstracto: los cinco ports; participante presentador/adaptador: implementación futura en `src/adapters/presentation` o UI. Resuelve desacoplar casos de uso de vistas. Alternativa rechazada: que el caso de uso devuelva o llame clases React.
- **DTO/View Model plano:** participantes: DTOs de `src/application/value-objects/` y presentador futuro. Resuelve una frontera serializable, sin framework ni entidades. Alternativa rechazada: pasar entidades de dominio o componentes JSX.
- **Discriminated Union:** participante: `VictoryResultVariant`. Resuelve representar bloques variables sin inferir variantes por `gameId`. Alternativa rechazada: campos opcionales masivos o `switch` por nombre de juego en la vista.
- **State DTO:** participante: `ScreenLoadState` y los DTO de pantalla. Resuelve estados cargando, normal, vacío y error. Alternativa rechazada: excepciones técnicas como comunicación normal de estado.

## Dependency direction

- `src/application/ports/output` → solo DTOs de `src/application/value-objects` y tipos estándar de TypeScript.
- `src/application/value-objects` → ningún módulo interno o externo fuera de tipos estándar de TypeScript.
- Casos de uso futuros → ports declarados en `src/application/ports/output` (dependencia hacia adentro).
- Adaptadores/presentadores futuros → implementan estos ports e importan los DTO.
- UI/infraestructura → implementa o consume adaptadores/presentadores; no apunta hacia casos de uso internos desde sus modelos concretos.
- Ninguna flecha parte de dominio o aplicación hacia React, DOM, Expo, red o almacenamiento.

## Open/Closed proof

Agregar una quinta variante exigirá:

- Agregar su tipo concreto al registro de modos y su estrategia de presentación donde se ensamble.
- Si el resultado tiene una forma nueva, agregar un miembro a `VictoryResultVariant`; de lo contrario reutiliza `OTHER` solo si realmente comparte la semántica.
- Agregar DTO de datos específicos como solo sea necesario.

No se modifica `IGameHudOutputPort`, `IGameControlsOutputPort`, `ILevelSelectionOutputPort`, `IVictoryOutputPort`, `IDefeatOutputPort` ni sus DTO base para una variante cuyo resultado encaja en los tipos existentes. Tampoco se modifica una pantalla existente si esta usa datos neutrales y acciones disponibles.

Un cambio pequeño como añadir “puntos extra” al HUD se agrega a `GameHudDTO` y al mapper/presentador correspondiente; no exige cambiar los cuatro ports restantes ni las reglas del dominio.

## Infrastructure independence

Pueden cambiar React, Expo, DOM, Canvas, LocalStorage, almacenamiento remoto o HTTP sin tocar dominio ni puertos de salida, siempre que el adaptador/presentador implemente los contratos y convierta sus cambios técnicos a DTO.

Cambiar el catálogo i18n no cambia los puertos: solo cambia cómo se resuelve `I18nKeyDTO.key`. Cambiar el transporte de niveles no cambia `LevelSelectionViewDTO`; el adaptador convierte la fuente cargada a esos datos.

## Open questions

- **P-05:** cálculo exacto de estrellas de Fit. El DTO permite hasta un entero; no se fija 1–3 ni fórmula.
- **P-10:** composición exacta de la puntuación de Sort. El DTO incluye score y metas, pero no fórmula.
- **P-12:** si Merge permite “seguir jugando” tras ganar. El DTO deja `canKeepPlaying`, pero el valor concreto depende de esta decisión.
- **P-15:** regla de desbloqueo de niveles. La propuesta usa estados ya resueltos; no decide secuencialidad ni otra regla.
- **P-23:** diferencia entre niveles locales y remotos y qué dato vence.
- **P-04:** qué cuenta como pieza disponible en Lines para derivar derrota.
- **P-06:** cuántas pilas ofrece Sort.
- **P-14:** interacción táctil para las seis direcciones de Merge.
- **P-02:** si Lines permite rotar piezas.
- No están presentes los documentos oficiales `docs/specs/requirements.md`, `docs/specs/entity-model.md` ni `docs/specs/use-cases/UC-*.md`, por lo que no se asignan IDs `UC-###`.
- La pantalla 09 no concreta el formato de bandeja ni geometría; Fase 0 solo declara `trayLabel` y controles genéricos, no celdas ni tableros.

## Smallest viable change

La implementación posterior debe comenzar creando solamente estos cinco puertos y estos DTO. No debe crear casos de uso, presentadores, vistas, adaptadores, repositorios, registry, dominio ni Composition Root en esta fase. Cuando existan los casos de uso, podrán consumir los ports; el trabajo futuro debe sincronizar estos contratos en lugar de regenerar una arquitectura paralela.

## Implementation notes

Se implementaron los cinco puertos de salida y los DTO neutrales de pantalla en `src/application/ports/output/` y `src/application/value-objects/`.
Los títulos y motivos ya resueltos se representan con `I18nKeyDTO`, y la selección de niveles expone acciones disponibles como datos.
No se creó dominio, casos de uso, presentadores, adaptadores, vistas, registry ni Composition Root.

## Test plan

- Verificar que un fake implementa cada puerto sin importar React, DOM, Expo o storage.
- Verificar que un escenario de carga/normal/vacío/error de niveles produce `ScreenLoadState` y conserva el aviso offline.
- Verificar que los niveles bloqueados no producen acciones `AVAILABLE` ni navegación en el DTO.
- Verificar con Fit, Sort y Merge que el bloque de victoria usa el miembro discriminado correspondiente y conserva `availableActions`.
- Verificar que un resultado peor no activa `isNewBest`.
- Verificar Sort derrotado con metas parciales y Lines/Merge derrotados sin tablero ni reglas de UI.
- Verificar que el HUD refleja cambios inmediatos tras movimiento mediante el snapshot recibido.
- Verificar que controles ausentes no aparecen como elementos en `GameControlsDTO` y que deshacer/rehacer llevan `enabled: false` cuando corresponda.
- Derivar cualquier test futuro de los `UC-###` una vez existan; mientras tanto, vincular los casos directamente con los IDs de pantalla y requisito conocidos.

## Verification

- `git diff --check`: sin errores de formato.
- `npm run guard:edits`: debe ejecutarse antes de cualquier posterior modificación.
