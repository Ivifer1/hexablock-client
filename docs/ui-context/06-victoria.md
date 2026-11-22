# Pantalla 06 — Victoria

| Campo | Valor |
| --- | --- |
| Estado | Lista para diseñar |
| Requerimientos | SUI-06, FIT-06, FIT-07, SRT-06, MRG-07, PRG-08 |
| Se llega desde | Partida, cuando se cumple la condición de victoria |
| Lleva a | Partida (siguiente nivel, repetir, nueva partida), Selección de niveles, Inicio |

## Propósito

Muestra el resultado de una partida ganada y ofrece pasar al siguiente nivel o empezar una nueva partida (SUI-06). Es **una sola pantalla** con un bloque de resultado que cambia según el juego.

Hexa Lines no tiene victoria: su pantalla final es la de Derrota.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| VIC-01 | Título | Texto grande | Sí | `victory.title_level` (Fit y Sort), `victory.title_merge` (Merge) | Cambia según el juego |
| VIC-02 | Puntuación obtenida | Texto destacado | Sí (SUI-06) | `common.score` | En Fit, el resultado principal son las estrellas (ver VIC-03) |
| VIC-03 | Bloque de resultado | Bloque variable | Sí | Ver tabla siguiente | Varía según el juego |
| VIC-04 | Insignia de nuevo récord | Etiqueta | Cuando aplica (PRG-08) | `common.new_best` | Solo si el resultado supera el máximo guardado |
| VIC-05 | Siguiente nivel | Botón primario | Sí en Fit y Sort (SUI-06) | `victory.next_level` | Oculto si no hay siguiente nivel |
| VIC-06 | Repetir nivel | Botón secundario | Sí en Fit y Sort | `victory.replay_level` | Reinicia el mismo nivel, por ejemplo para mejorar las estrellas |
| VIC-07 | Nueva partida | Botón primario | Sí en Merge (SUI-06) | `victory.new_game` | Empieza una partida desde cero |
| VIC-08 | Seguir jugando | Botón secundario | Condicionado a P-12 | `victory.keep_playing` | Solo Merge. Continúa la partida tras alcanzar la ficha objetivo |
| VIC-09 | Ir a niveles | Botón de texto | Sí en Fit y Sort | `common.levels` | Abre Selección de niveles |
| VIC-10 | Ir a inicio | Botón de texto | Sí | `common.home` | Abre Inicio |
| VIC-11 | Aviso de último nivel | Mensaje | Cuando aplica | `victory.all_done` | Aparece si no hay siguiente nivel. Sustituye a VIC-05 |

### Bloque de resultado (VIC-03) por juego

| Juego | Qué muestra |
| --- | --- |
| Hexa Fit | Estrellas obtenidas (hasta 3), movimientos (`common.moves`) y tiempo (`common.time`) |
| Hexa Sort | Metas cumplidas (`common.goals_progress`, por ejemplo "5 de 5") y puntuación, según P-10 |
| Hexa Merge | Valor de la ficha objetivo alcanzada (`victory.target_tile`) y puntuación. Récord con `common.best_value` |
| Hexa Lines | No aplica |

### Botones disponibles por juego

| Botón | Fit | Sort | Merge |
| --- | --- | --- | --- |
| Siguiente nivel | Sí, si hay | Sí, si hay | No |
| Repetir nivel | Sí | Sí | No |
| Nueva partida | No | No | Sí |
| Seguir jugando | No | No | Condicionado a P-12 |
| Niveles | Sí | Sí | No |
| Inicio | Sí | Sí | Sí |

## Recibe

- Juego y tipo.
- Puntuación obtenida.
- Datos del bloque de resultado según el juego: estrellas, movimientos y tiempo (Fit); metas y total (Sort); valor de la ficha objetivo (Merge).
- Si es nuevo récord.
- Si existe un nivel siguiente.

### Datos de ejemplo

| Juego | Ejemplo |
| --- | --- |
| Fit | 3 estrellas, 18 movimientos, 1 min 32 s, hay siguiente nivel |
| Sort | 5 de 5 metas, 840 puntos, es el último nivel |
| Merge | Ficha 2048, 31 420 puntos, nuevo récord |

## Emite

| Evento | Cuándo |
| --- | --- |
| Siguiente nivel | Se toca VIC-05 |
| Repetir nivel | Se toca VIC-06 |
| Nueva partida | Se toca VIC-07 |
| Seguir jugando | Se toca VIC-08 |
| Ir a niveles | Se toca VIC-09 |
| Ir a inicio | Se toca VIC-10 |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Normal | Victoria sin récord | Título, resultado y botones del juego |
| Con récord | El resultado supera el máximo | Añade VIC-04 |
| Último nivel | No hay siguiente nivel | VIC-11 en lugar de VIC-05 |

## Navegación

- "Atrás" del sistema: Selección de niveles (Fit y Sort) o Inicio (Merge). Nunca regresa a la partida terminada.
- El sonido y la animación de victoria respetan el silencio de Ajustes (TAB-13).

## Criterios de aceptación

- Siempre aparece la puntuación obtenida (SUI-06).
- Fit y Sort ofrecen siguiente nivel o, si no existe, el aviso de último nivel. Merge ofrece nueva partida.
- El mismo diseño sirve a los tres juegos cambiando solo el bloque de resultado.
- Un resultado peor que el guardado no muestra la insignia de récord (PRG-08).

## Preguntas abiertas

- P-05: cómo se calculan las estrellas de Fit.
- P-10: de qué se compone la puntuación de Sort.
- P-12: si Merge permite seguir jugando tras ganar.
- P-23: qué pasa con "último nivel" cuando el servidor añade niveles.
