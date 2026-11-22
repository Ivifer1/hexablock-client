# Pantalla 01 — Inicio y selector de juego

## Material relacionado

- Diseño propuesto: [proposed-design.md](../../ui-context/screens/01-inicio/proposed-design.md)
- Imagen de referencia: [proposed-design.png](../../ui-context/screens/01-inicio/proposed-design.png)
- Casos de prueba de diseño: [test-cases.md](../../ui-context/screens/01-inicio/test-cases.md)

| Campo | Valor |
| --- | --- |
| Estado | Lista para diseñar |
| Requerimientos | SUI-01, SUI-02, SUI-08, PRG-02, FR-029. Indicador de sesión y ranking: INT-01 e INT-02 |
| Se llega desde | Apertura de la app, "volver al menú" desde cualquier pantalla, login o registro exitosos |
| Lleva a | Partida (Lines, Merge), Selección de niveles (Fit, Sort), Ajustes, Login |

## Propósito

Es la primera pantalla. Presenta la suite y deja elegir una de las variantes. También es el destino de "volver al menú" desde cualquier otra pantalla.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| INI-01 | Nombre de la suite | Texto o logotipo | Sí (SUI-01) | `app.title` | Siempre visible |
| INI-02 | Acceso a ajustes | Botón con icono | Sí (SUI-01) | `home.settings` (etiqueta de accesibilidad) | Abre Ajustes. Siempre en la misma posición |
| INI-03 | Selector de juego | Rueda hexagonal rotatoria | Sí (SUI-01) | — | Rueda con estética hexagonal inspirada en dial mecánico/óptico. El modo seleccionado se ubica arriba (12:00), más grande y destacado. Girar la rueda o tocar un icono anima la rueda hasta ubicar el modo activo arriba. |
| INI-03a | Vista previa central | Panel visual dinámico | Sí | — | Carga una vista previa del modo seleccionado en el centro de la rueda. |
| INI-04 | Detalle del juego seleccionado | Panel/ficha con acción principal | Sí | `game.<id>.name`, `game.<id>.desc` | Muestra el nombre del modo seleccionado, etiqueta de tipo (`partida_directa` o `por_niveles`), descripción corta, chip de progreso (INI-05) y botón principal para jugar. |
| INI-05 | Resumen de progreso | Texto | Sí (PRG-02) | `common.best_value`, `common.best_none`, `common.levels_progress` | Según el tipo de juego, ver tabla siguiente |
| INI-06 | Indicador de sesión y ranking | Botón o etiqueta | Sí (P-18) | `common.sign_in`, `home.session_user` | Sin sesión: abre Login. Con sesión: muestra el nombre de usuario y permite acceder al ranking. |
| INI-07 | Vista previa central | Visual | Sí | `previewKey` del modo seleccionado | Carga el preview del modo activo en el centro de la rueda. |
| INI-08 | Navegación inferior | Barra de navegación | Sí | `home.points`, `home.play`, `home.settings` | Presenta Puntos a la izquierda, Jugar como acción principal central y Ajustes a la derecha. La acción seleccionada usa icono filled; las demás usan icono outline. |
| INI-08a | Acceso a puntos | Botón de navegación | Sí (FR-029) | `home.points` | Abre el ranking global. Sin sesión abre Login y al iniciar sesión continúa al ranking. |
| INI-08b | Acción principal Jugar | Botón de navegación | Sí (FR-001) | `home.play` | Abre la acción principal del modo seleccionado mediante el destino definido por su tipo de entrada. |
| INI-08c | Acceso a ajustes | Botón de navegación | Sí (SUI-01) | `home.settings` | Abre Ajustes. |

### Resumen de progreso por juego (PRG-02)

| Juego | Tipo | Qué muestra la tarjeta | Al tocar |
| --- | --- | --- | --- |
| Hexa Lines | Partida directa | Récord, o "sin récord aún" | Abre la Partida |
| Hexa Fit | Por niveles | "Niveles: 7 de 15". Si P-05 confirma estrellas, también el total obtenido | Abre Selección de niveles |
| Hexa Sort | Por niveles | "Niveles: 3 de 10" | Abre Selección de niveles |
| Hexa Merge | Partida directa | Récord, o "sin récord aún" | Abre la Partida |

## Recibe

- **Lista de juegos.** Por cada juego: identificador, nombre, descripción, imagen o icono, tipo (`partida_directa` o `por_niveles`) y resumen de progreso (valor y etiqueta).
- **Sesión.** Ninguna, o el nombre de usuario. Sin sesión se ofrece Login; con sesión se ofrece acceso a ranking.
- **Modo inicial.** Hexa Lines en el primer arranque. Después se conserva el último modo seleccionado.
- **Preview.** Cada modo proporciona una clave `previewKey` para una imagen estática local. La imagen se resuelve desde `assets/ui/home-previews/`; no se usa el nombre del modo para elegir componentes.

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
| Juego elegido | El usuario toca o gira hasta seleccionar un modo | Identificador y tipo del juego |
| Abrir ajustes | Toca INI-02 | — |
| Abrir login | Toca INI-06 sin sesión | — |
| Abrir ranking | Toca INI-06 con sesión | — |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Normal | Datos cargados | Lista completa con su progreso |
| Primera vez | No hay progreso guardado | Tarjetas con `common.best_none` o "Niveles: 0 de N" |
| Cargando progreso | Instante inicial | Tarjetas visibles con el progreso en marcador de posición. No se bloquea la elección |
| Error al leer progreso | Falla la lectura local | Tarjetas visibles sin resumen y el mensaje `home.error_progress`. No se bloquea la elección |
| Sin juegos | La lista llega vacía (caso técnico) | Mensaje `home.empty` |
| Selección persistida | El jugador regresa a Inicio | Se selecciona el último modo jugado o elegido |

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

- P-18 resuelto: se muestra el indicador de sesión y el acceso a ranking.
- P-17 pendiente: ajustar el diseño final de Ajustes no cambia el comportamiento obligatorio de Inicio.
