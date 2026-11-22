# Pantalla 01 — Inicio y selector de juego

| Campo | Valor |
| --- | --- |
| Estado | Lista para diseñar |
| Requerimientos | SUI-01, SUI-02, SUI-08, PRG-02. Indicador de sesión: INT-01 e INT-02, condicionado a P-18 |
| Se llega desde | Apertura de la app, "volver al menú" desde cualquier pantalla, login o registro exitosos |
| Lleva a | Partida (Lines, Merge), Selección de niveles (Fit, Sort), Ajustes, Login |

## Propósito

Es la primera pantalla. Presenta la suite y deja elegir una de las variantes. También es el destino de "volver al menú" desde cualquier otra pantalla.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| INI-01 | Nombre de la suite | Texto o logotipo | Sí (SUI-01) | `app.title` | Siempre visible |
| INI-02 | Acceso a ajustes | Botón con icono | Sí (SUI-01) | `home.settings` (etiqueta de accesibilidad) | Abre Ajustes. Siempre en la misma posición |
| INI-03 | Selector de juego | Rueda hexagonal rotatoria | Sí (SUI-01) | — | Rueda con estética hexagonal inspirada en dial mecánico/óptico. El modo seleccionado se ubica arriba (12:00) más grande y destacado; los demás modos se ubican en la rueda sin escoger. Girar la rueda o tocar un icono rota el modo a la posición superior activa. |
| INI-04 | Detalle del juego seleccionado | Panel/ficha con acción principal | Sí | `game.<id>.name`, `game.<id>.desc` | Muestra el nombre del modo seleccionado, etiqueta de tipo (`partida_directa` o `por_niveles`), descripción corta, chip de progreso (INI-05) y botón principal para jugar. |
| INI-05 | Resumen de progreso | Texto | Sí (PRG-02) | `common.best_value`, `common.best_none`, `common.levels_progress` | Según el tipo de juego, ver tabla siguiente |
| INI-06 | Indicador de sesión | Botón o etiqueta | Condicionado a P-18 | `common.sign_in`, `home.session_user` | Sin sesión: abre Login. Con sesión: muestra el nombre de usuario |

### Resumen de progreso por juego (PRG-02)

| Juego | Tipo | Qué muestra la tarjeta | Al tocar |
| --- | --- | --- | --- |
| Hexa Lines | Partida directa | Récord, o "sin récord aún" | Abre la Partida |
| Hexa Fit | Por niveles | "Niveles: 7 de 15". Si P-05 confirma estrellas, también el total obtenido | Abre Selección de niveles |
| Hexa Sort | Por niveles | "Niveles: 3 de 10" | Abre Selección de niveles |
| Hexa Merge | Partida directa | Récord, o "sin récord aún" | Abre la Partida |

## Recibe

- **Lista de juegos.** Por cada juego: identificador, nombre, descripción, imagen o icono, tipo (`partida_directa` o `por_niveles`) y resumen de progreso (valor y etiqueta).
- **Sesión.** Ninguna, o el nombre de usuario. Solo si P-18 lo confirma.

### Datos de ejemplo

| Identificador | Tipo | Progreso de ejemplo |
| --- | --- | --- |
| `lines` | `partida_directa` | Récord 1240 |
| `fit` | `por_niveles` | 7 niveles de 15 |
| `sort` | `por_niveles` | 3 niveles de 10 |
| `merge` | `partida_directa` | Sin récord |

Para probar la extensibilidad, la pantalla debe mostrar una quinta tarjeta si se añade una quinta fila a esta tabla.

## Emite

| Evento | Cuándo | Datos |
| --- | --- | --- |
| Juego elegido | El usuario toca una tarjeta | Identificador y tipo del juego |
| Abrir ajustes | Toca INI-02 | — |
| Abrir login | Toca INI-06 sin sesión | — |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Normal | Datos cargados | Lista completa con su progreso |
| Primera vez | No hay progreso guardado | Tarjetas con `common.best_none` o "Niveles: 0 de N" |
| Cargando progreso | Instante inicial | Tarjetas visibles con el progreso en marcador de posición. No se bloquea la elección |
| Error al leer progreso | Falla la lectura local | Tarjetas visibles sin resumen y el mensaje `home.error_progress`. No se bloquea la elección |
| Sin juegos | La lista llega vacía (caso técnico) | Mensaje `home.empty` |

## Navegación

- Juego de tipo `partida_directa` → Partida. Juego de tipo `por_niveles` → Selección de niveles. El destino lo decide el tipo recibido.
- "Atrás" del sistema: sale de la app.

## Criterios de aceptación

- Con los datos de ejemplo se ven el nombre de la suite, el acceso a ajustes y cuatro tarjetas (SUI-01).
- Tocar Fit o Sort emite "juego elegido" con tipo `por_niveles`; tocar Lines o Merge, con tipo `partida_directa` (SUI-02).
- Añadir un quinto juego a los datos de ejemplo muestra una quinta tarjeta sin cambiar el diseño.
- Cambiar de idioma cambia todos los textos sin reiniciar (SUI-04).
- Con 360 px de ancho no se recorta ningún texto, ni en español ni en inglés.
- Sin sesión, todas las tarjetas funcionan igual (INT-02).

## Preguntas abiertas

- P-18: ¿se muestra el indicador de sesión y el acceso a ranking en esta pantalla?
