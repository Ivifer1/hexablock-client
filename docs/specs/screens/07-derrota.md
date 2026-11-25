# Pantalla 07 — Derrota

| Campo | Valor |
| --- | --- |
| Estado | Lista para diseñar |
| Requerimientos | SUI-07, LIN-07, LIN-10, SRT-07, MRG-08, MRG-09 |
| Se llega desde | Partida, cuando se cumple la condición de derrota |
| Lleva a | Partida (reintentar), Selección de niveles (Sort), Inicio |

## Propósito

Muestra el resultado de una partida terminada sin ganar y ofrece reintentar (SUI-07). Es **una sola pantalla** con título, motivo y bloque de resultado variables.

Hexa Fit no tiene derrota: esta pantalla nunca se muestra para Fit.

En Hexa Lines esta es la pantalla final normal de la partida, porque no existe la victoria. Conviene que su tono sea "partida terminada" y destaque la puntuación, no el fracaso.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| DER-01 | Título | Texto grande | Sí | `defeat.title_lines`, `defeat.title_sort`, `defeat.title_merge` | Cambia según el juego |
| DER-02 | Motivo | Texto breve | Sí | `defeat.reason_lines`, `defeat.reason_sort`, `defeat.reason_merge` | Explica por qué terminó |
| DER-03 | Puntuación obtenida | Texto destacado | Sí | `common.score` | Siempre visible |
| DER-04 | Récord | Texto | Lines y Merge | `common.best_value` | Muestra el puntaje máximo guardado |
| DER-05 | Insignia de nuevo récord | Etiqueta | Cuando aplica | `common.new_best` | Solo si la puntuación supera el máximo anterior |
| DER-06 | Avance de metas | Texto | Solo Sort | `common.goals_progress` | Por ejemplo "Metas: 3 de 5" |
| DER-07 | Reintentar | Botón primario | Sí (SUI-07) | `defeat.retry` | Lines y Merge: empieza una partida nueva. Sort: reinicia el mismo nivel |
| DER-08 | Ir a niveles | Botón de texto | Solo Sort | `common.levels` | Abre Selección de niveles |
| DER-09 | Ir a inicio | Botón de texto | Sí | `common.home` | Abre Inicio |

### Contenido por juego

| Juego | Título | Motivo | Resultado |
| --- | --- | --- | --- |
| Hexa Lines | `defeat.title_lines` | `defeat.reason_lines` | Puntuación y récord |
| Hexa Sort | `defeat.title_sort` | `defeat.reason_sort` | Avance de metas y puntuación (P-10) |
| Hexa Merge | `defeat.title_merge` | `defeat.reason_merge` | Puntuación y récord |

## Recibe

- Juego y tipo.
- Puntuación obtenida.
- Récord guardado y si es nuevo récord (Lines y Merge).
- Metas cumplidas y total (Sort).

### Datos de ejemplo

| Juego | Ejemplo |
| --- | --- |
| Lines | 980 puntos, récord 1240, sin nuevo récord |
| Sort | 3 de 5 metas, 410 puntos |
| Merge | 12 600 puntos, nuevo récord |

## Emite

| Evento | Cuándo |
| --- | --- |
| Reintentar | Se toca DER-07 |
| Ir a niveles | Se toca DER-08 |
| Ir a inicio | Se toca DER-09 |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Normal | Derrota sin récord | Título, motivo, resultado y botones |
| Con récord | La puntuación supera el máximo | Añade DER-05 |

## Navegación

- "Atrás" del sistema: Selección de niveles (Sort) o Inicio (Lines y Merge).
- Reintentar no pasa por Inicio ni por Selección de niveles.

## Criterios de aceptación

- Siempre aparecen la puntuación y el botón de reintentar (SUI-07).
- El motivo coincide con la condición de derrota de cada juego: ninguna pieza cabe (Lines), tablero lleno (Sort), ningún movimiento cambia el tablero (Merge).
- Con Fit nunca se muestra esta pantalla.
- Reintentar empieza de cero sin conservar el tablero anterior.

## Preguntas abiertas

- P-10: puntuación de Sort.
- P-04: qué cuenta como "pieza disponible" en Lines, que determina cuándo aparece esta pantalla.
