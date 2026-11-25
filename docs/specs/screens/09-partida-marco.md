# Pantalla 09 — Partida: marco y HUD (solo mockup)

| Campo | Valor |
| --- | --- |
| Estado | Solo mockup. No implementar el tablero todavía |
| Requerimientos | TAB-01, TAB-03, TAB-04, TAB-10, TAB-11, SUI-09 |
| Se llega desde | Inicio (Lines, Merge), Selección de niveles, Victoria y Derrota (reintentar), Pausa |
| Lleva a | Pausa, Victoria, Derrota |

## Propósito

Esta pantalla contiene el tablero y los controles de juego. El tablero, el arrastre y las animaciones dependen de cómo se modelen la geometría y el motor, así que quedan fuera de esta fase. Lo que sí se puede diseñar ya es el marco que lo rodea.

## Zonas de la pantalla

| Zona | Contenido |
| --- | --- |
| Barra superior (HUD) | Botón de pausa, nombre del juego o del nivel, y los indicadores de puntuación o progreso |
| Área del tablero | Reservada (etiqueta de accesibilidad `game.board`). Se dibuja con una cuadrícula hexagonal de ejemplo. Debe adaptarse a tres formas: radio 4 (61 celdas), radio 2 (19 celdas) y figura variable de Fit |
| Zona inferior | Bandeja de piezas o pilas, y los controles de la variante |

## Elementos por juego

| Elemento | Texto | Lines | Fit | Sort | Merge |
| --- | --- | --- | --- | --- | --- |
| Botón de pausa | `game.pause` | Sí | Sí | Sí | Sí |
| Nombre del juego o nivel | `game.<id>.name`, `common.level_n` | Juego | Nivel | Nivel | Juego |
| Puntuación actual | `common.score` | Sí | No | Sí (P-10) | Sí |
| Récord | `common.best` | Sí | No | No | Sí |
| Contador de movimientos | `common.moves` | No | Sí | No | No |
| Cronómetro | `common.time` | No | Sí | No | No |
| Avance de metas | `common.goals_progress` | No | No | Sí | No |
| Bandeja de piezas | `game.tray` | 3 piezas | Piezas del nivel | Pila o pilas ofrecidas | No |
| Deshacer | `game.undo` | No | Sí, sin límite | No | Sí, un movimiento |
| Rehacer | `game.redo` | No | Sí | No | No |
| Rotar pieza | `game.rotate` | No (P-02) | Sí, de 60° en 60° | No | No |
| Control de las 6 direcciones | — | No | No | No | Sí (P-14) |

## Reglas de los controles

- Deshacer y rehacer aparecen **solo** en los juegos que los permiten (TAB-11). En Lines y Sort no se muestran, no se deshabilitan.
- Deshacer está desactivado cuando no hay nada que deshacer. En Merge queda desactivado después de usarlo una vez.
- Rehacer está desactivado cuando no hay nada que rehacer.
- Los indicadores de la barra superior cambian al instante tras cada movimiento.

## Recibe

- Los valores de cada indicador del HUD.
- Qué controles se muestran y cuáles están activos.
- Contenido de la bandeja.

## Emite

| Evento | Cuándo |
| --- | --- |
| Pausar | Se toca el botón de pausa o "atrás" del sistema |
| Deshacer | Se toca deshacer |
| Rehacer | Se toca rehacer |
| Rotar | Se toca rotar (Fit) |
| Dirección elegida | Se elige una de las 6 direcciones (Merge) |

Los eventos de colocar o mover piezas sobre el tablero quedan para la fase del motor.

## Criterios de aceptación del mockup

- Hay un diseño para cada uno de los cuatro juegos que muestra solo los elementos que le corresponden.
- El área reservada para el tablero admite las tres formas descritas sin cambiar el resto de la pantalla.
- Se ve claramente qué controles están activos y cuáles no.

## Preguntas abiertas

- P-14: cómo se eligen las 6 direcciones de Merge en una pantalla táctil.
- P-06: cuántas pilas ofrece la bandeja de Sort.
- P-02: si las piezas de Lines se pueden rotar.
