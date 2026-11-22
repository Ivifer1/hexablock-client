# Pantalla 05 — Selección de niveles (Hexa Fit y Hexa Sort)

| Campo | Valor |
| --- | --- |
| Estado | Lista para diseñar |
| Requerimientos | PRG-03, FIT-10, SRT-09, PRG-04, PRG-05, SUI-02 |
| Se llega desde | Inicio (Fit y Sort), Victoria, Derrota (Sort) |
| Lleva a | Partida (nivel elegido), Inicio |

## Propósito

Muestra los niveles de un juego por niveles, cuántos lleva completados el jugador y cuáles están bloqueados. Es **una sola pantalla** que sirve a Fit y a Sort: solo cambian los datos que recibe.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| NIV-01 | Encabezado con botón volver | Encabezado | Sí | `game.<id>.name`, `common.levels`, `common.back` | Muestra el nombre del juego. Volver lleva a Inicio |
| NIV-02 | Resumen de avance | Texto y barra de progreso | Sí (PRG-03) | `common.levels_progress` | Por ejemplo "Niveles: 7 de 15" |
| NIV-03 | Cuadrícula de niveles | Cuadrícula desplazable | Sí | — | Un elemento por nivel recibido. Se desplaza si no caben. No asume ningún número fijo de niveles |
| NIV-04 | Celda de nivel | Elemento tocable | Sí | `common.level_n`, `levels.locked`, `levels.completed`, `levels.stars` | Muestra número, estado y, si el juego usa estrellas, las estrellas. Ver estados de nivel |
| NIV-05 | Aviso de nivel bloqueado | Mensaje breve | Sí (FIT-10) | `levels.locked_hint` | Aparece al tocar un nivel bloqueado. No navega |
| NIV-06 | Acceso a ranking del nivel | Botón con icono | Reservado (P-18) | — | No diseñar todavía. Dejar espacio en la celda o en el encabezado |

### Estados de un nivel

| Estado | Cómo se ve | Al tocar |
| --- | --- | --- |
| Bloqueado | Icono de candado y texto `levels.locked`. Atenuado | Muestra NIV-05; no abre el nivel |
| Disponible | Resaltado: es el siguiente por jugar | Abre el nivel |
| Completado | Marca de completado. En Fit, hasta 3 estrellas rellenas y vacías (`levels.stars`). En Sort, solo la marca | Abre el nivel para repetirlo |

El estado nunca se indica solo con el color: siempre hay icono o texto.

## Recibe

- Identificador y nombre del juego.
- Si el juego usa estrellas (Fit) o no (Sort).
- Total de niveles y niveles completados.
- Por cada nivel: número, estado (bloqueado, disponible o completado), estrellas obtenidas (0 si no aplica) y, opcionalmente, mejor puntuación.

### Datos de ejemplo

| Juego | Total | Estados de ejemplo |
| --- | --- | --- |
| `fit` | 15 | Niveles 1 a 4 completados (3, 2, 3 y 1 estrellas), nivel 5 disponible, niveles 6 a 15 bloqueados |
| `sort` | 10 | Niveles 1 y 2 completados, nivel 3 disponible, niveles 4 a 10 bloqueados |

## Emite

| Evento | Cuándo | Datos |
| --- | --- | --- |
| Nivel elegido | Se toca un nivel disponible o completado | Identificador del juego y número del nivel |
| Reintentar carga | Se toca `common.retry` en el estado de error | — |
| Volver | Se toca NIV-01 | — |

## Estados de la pantalla

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Cargando | Se están leyendo los niveles | `levels.loading` con indicador. El encabezado ya es visible |
| Normal | Niveles disponibles | NIV-02 y NIV-03 completos |
| Error de carga | El archivo de niveles es inválido o falla la red (PRG-04, PRG-05) | `levels.error_load` y botón `common.retry`. No se cierra la app |
| Con niveles incluidos | No hay conexión y se usan los niveles que trae la app (INT-06) | La cuadrícula normal con un aviso discreto `levels.offline` |
| Sin niveles | La lista llega vacía (caso técnico) | `levels.empty` |

## Navegación

- Elegir un nivel → Partida de ese nivel.
- Al volver de una Victoria, esta pantalla muestra los estados actualizados: el nivel recién ganado como completado y el siguiente como disponible (FIT-10).
- "Atrás" del sistema: vuelve a Inicio.

## Criterios de aceptación

- Con los datos de ejemplo de Fit se ven 15 celdas y "Niveles: 4 de 15"; con los de Sort, 10 celdas y "Niveles: 2 de 10".
- Un nivel bloqueado no se puede abrir (FIT-10).
- Añadir niveles a los datos de ejemplo añade celdas sin rediseñar la pantalla.
- La misma pantalla muestra estrellas en Fit y no las muestra en Sort.
- Un error de carga no deja la pantalla en blanco y permite reintentar.

## Preguntas abiertas

- P-15: regla de desbloqueo. Se supone secuencial.
- P-05: número máximo de estrellas. Se supone 3.
- P-23: qué niveles mandan si los de la app y los del servidor difieren.
