# Pantalla 08 — Pausa

| Campo | Valor |
| --- | --- |
| Estado | Lista para diseñar |
| Requerimientos | SUI-09, SUI-10, SUI-08, FIT-08 |
| Se llega desde | Partida (botón de pausa, "atrás" del sistema, o app en segundo plano) |
| Lleva a | Partida (reanudar o reiniciar), Ajustes, Inicio |

## Propósito

Detiene la partida y permite reanudar, reiniciar o salir. Se muestra encima de la partida, como una capa, no como una pantalla completa.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| PAU-01 | Título y contexto | Texto | Sí | `pause.title`, `game.<id>.name`, `common.level_n` | Indica el juego y, si aplica, el nivel. Por ejemplo "Hexa Fit · Nivel 4" |
| PAU-02 | Reanudar | Botón primario | Sí (SUI-09) | `pause.resume` | Cierra la pausa y retoma la partida tal como estaba |
| PAU-03 | Reiniciar | Botón secundario | Sí (SUI-10) | `pause.restart` | Pide confirmación antes de reiniciar |
| PAU-04 | Ajustes | Botón secundario | Opcional | `pause.settings` | Abre Ajustes y al volver regresa a la pausa |
| PAU-05 | Salir al menú | Botón de texto | Sí (SUI-09) | `pause.exit` | Pide confirmación y lleva a Inicio |
| PAU-06 | Diálogo de confirmación | Diálogo | Sí | `pause.restart_confirm`, `pause.exit_confirm`, `common.cancel`, `common.confirm` | Se muestra al reiniciar o salir |

## Comportamiento

- Al abrir la pausa no corre el tiempo y no se aceptan movimientos (SUI-09). En Fit, el cronómetro se detiene.
- Al reanudar, el tablero, la puntuación y las piezas están exactamente igual.
- Se recomienda atenuar u ocultar el tablero mientras la pausa está abierta.
- Se recomienda abrir la pausa automáticamente si la app pasa a segundo plano.
- Los efectos y la música siguen las preferencias de Ajustes.

## Recibe

- Juego y, si aplica, número de nivel.
- Si se ofrece el acceso a Ajustes.

## Emite

| Evento | Cuándo |
| --- | --- |
| Reanudar | Se toca PAU-02 o "atrás" del sistema |
| Reiniciar | Se confirma el diálogo de reinicio |
| Abrir ajustes | Se toca PAU-04 |
| Salir | Se confirma el diálogo de salida |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Normal | Se abre la pausa | Capa con los botones |
| Confirmando reinicio | Se toca PAU-03 | Diálogo con `pause.restart_confirm` |
| Confirmando salida | Se toca PAU-05 | Diálogo con `pause.exit_confirm` |

## Navegación

- "Atrás" del sistema: reanuda la partida.
- Reiniciar vuelve a la Partida con el tablero y la puntuación en su estado inicial.

## Criterios de aceptación

- Durante la pausa, el tiempo no avanza y tocar el tablero no hace nada.
- Reanudar devuelve la partida sin ningún cambio.
- Reiniciar y salir no se ejecutan sin confirmación.
- El mismo diseño sirve a las cuatro variantes.

## Preguntas abiertas

- P-16: si se decide guardar la partida a medias, el texto de `pause.exit_confirm` ya no debe decir que se pierde el avance.
