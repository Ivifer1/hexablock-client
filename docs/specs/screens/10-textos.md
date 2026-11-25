# Textos de la interfaz (español e inglés)

Versión 0.1 · 2026-11-01 · Fuente única de textos para las pantallas 01 a 09.

## Reglas

1. Ningún texto se escribe dentro de una pantalla: se pide por su clave.
2. Los marcadores entre llaves (`{value}`, `{done}`, `{total}`, `{n}`, `{name}`, `{version}`) se llaman igual en ambos idiomas y se rellenan al mostrar el texto.
3. No se arman frases pegando textos sueltos: cada frase completa tiene su propia clave, porque el orden de las palabras cambia entre idiomas.
4. Los números se muestran según el idioma elegido (por ejemplo, 1 240 en español y 1,240 en inglés).
5. Tuteo en español y tono directo en inglés.
6. Los nombres de los juegos no se traducen.
7. Añadir un idioma es añadir una columna; no cambia ninguna pantalla.
8. Los textos marcados con (P-xx) dependen de una decisión pendiente.

## Comunes

| Clave | Español | English |
| --- | --- | --- |
| `common.back` | Volver | Back |
| `common.cancel` | Cancelar | Cancel |
| `common.confirm` | Confirmar | Confirm |
| `common.retry` | Reintentar | Retry |
| `common.home` | Inicio | Home |
| `common.levels` | Niveles | Levels |
| `common.level_n` | Nivel {n} | Level {n} |
| `common.levels_progress` | Niveles: {done} de {total} | Levels: {done} of {total} |
| `common.score` | Puntuación | Score |
| `common.best` | Récord | Best |
| `common.best_value` | Récord: {value} | Best: {value} |
| `common.best_none` | Sin récord aún | No best score yet |
| `common.new_best` | ¡Nuevo récord! | New best! |
| `common.moves` | Movimientos | Moves |
| `common.time` | Tiempo | Time |
| `common.goals_progress` | Metas: {done} de {total} | Goals: {done} of {total} |
| `common.sign_in` | Iniciar sesión | Sign in |
| `common.error_empty` | Completa este campo | Fill in this field |
| `common.error_network` | No se pudo conectar. Inténtalo de nuevo. | Couldn't connect. Please try again. |
| `common.error_server` | Algo salió mal en el servidor. Inténtalo de nuevo. | Something went wrong on the server. Please try again. |

## Juegos

| Clave | Español | English |
| --- | --- | --- |
| `game.lines.name` | Hexa Lines | Hexa Lines |
| `game.lines.short_name` | Lines | Lines |
| `game.lines.desc` | Conecta líneas completas y despeja el tablero. | Complete full hex lines to clear the board. |
| `game.fit.name` | Hexa Fit | Hexa Fit |
| `game.fit.short_name` | Fit | Fit |
| `game.fit.desc` | Encaja todas las piezas hasta llenar la figura. | Fit every piece cleanly into the hex shape. |
| `game.sort.name` | Hexa Sort | Hexa Sort |
| `game.sort.short_name` | Sort | Sort |
| `game.sort.desc` | Apila y ordena las fichas de un mismo color. | Stack and group matching tiles by color. |
| `game.merge.name` | Hexa Merge | Hexa Merge |
| `game.merge.short_name` | Merge | Merge |
| `game.merge.desc` | Desliza y fusiona fichas hasta llegar a la meta. | Slide and merge tiles to reach the target. |

## Inicio

| Clave | Español | English |
| --- | --- | --- |
| `app.title` | HexaBlock Suite | HexaBlock Suite |
| `home.settings` | Ajustes | Settings |
| `home.play` | Jugar | Play |
| `home.points` | Puntos | Points |
| `home.session_user` | Hola, {name} | Hi, {name} |
| `home.hero_title` | ¿A qué jugamos hoy? | What shall we play today? |
| `home.hero_subtitle` | Cuatro juegos. Una aventura mental. | Four games. One mental adventure. |
| `home.entry_direct` | Partida directa | Direct play |
| `home.entry_levels` | Por niveles | Level mode |
| `home.play_mode` | Jugar {name} | Play {name} |
| `home.play_now` | Jugar ahora | Play now |
| `home.prev_mode` | Juego anterior | Previous game |
| `home.next_mode` | Siguiente juego | Next game |
| `home.theme_toggle_light` | Cambiar a modo claro | Switch to light mode |
| `home.theme_toggle_dark` | Cambiar a modo oscuro | Switch to dark mode |
| `home.error_progress` | No se pudo cargar tu progreso | We couldn't load your progress |
| `home.empty` | No hay juegos disponibles | No games available |

## Ajustes

| Clave | Español | English |
| --- | --- | --- |
| `settings.title` | Ajustes | Settings |
| `settings.music` | Música | Music |
| `settings.sfx` | Efectos de sonido | Sound effects |
| `settings.language` | Idioma | Language |
| `settings.account` | Cuenta | Account |
| `settings.logout` | Cerrar sesión | Sign out |
| `settings.logout_confirm` | ¿Cerrar sesión? | Sign out? |
| `settings.version` | Versión {version} | Version {version} |
| `settings.error_save` | No se pudo guardar el cambio | The change couldn't be saved |
| `lang.es` | Español | Español |
| `lang.en` | English | English |

## Login (P-18, P-20)

| Clave | Español | English |
| --- | --- | --- |
| `login.title` | Iniciar sesión | Sign in |
| `login.identifier` | Usuario o correo | Username or email |
| `login.password` | Contraseña | Password |
| `login.password_show` | Mostrar contraseña | Show password |
| `login.password_hide` | Ocultar contraseña | Hide password |
| `login.submit` | Iniciar sesión | Sign in |
| `login.submitting` | Entrando… | Signing in… |
| `login.register_link` | Crear cuenta | Create account |
| `login.guest` | Jugar sin cuenta | Play without an account |
| `login.error_credentials` | Usuario o contraseña incorrectos | Incorrect username or password |
| `login.error_network` | No se pudo conectar. Puedes jugar sin cuenta y volver a intentarlo más tarde. | Couldn't connect. You can play without an account and try again later. |

## Registro (P-18, P-20)

| Clave | Español | English |
| --- | --- | --- |
| `register.title` | Crear cuenta | Create account |
| `register.identifier` | Usuario o correo | Username or email |
| `register.password` | Contraseña | Password |
| `register.confirm` | Confirmar contraseña | Confirm password |
| `register.password_hint` | Mínimo 8 caracteres | At least 8 characters |
| `register.submit` | Crear cuenta | Create account |
| `register.submitting` | Creando cuenta… | Creating account… |
| `register.login_link` | Ya tengo una cuenta | I already have an account |
| `register.error_mismatch` | Las contraseñas no coinciden | Passwords don't match |
| `register.error_short` | La contraseña es demasiado corta | The password is too short |
| `register.error_exists` | Ya existe una cuenta con esos datos | An account with those details already exists |
| `register.success` | Cuenta creada | Account created |

## Selección de niveles

| Clave | Español | English |
| --- | --- | --- |
| `levels.locked` | Bloqueado | Locked |
| `levels.locked_hint` | Completa el nivel {n} para desbloquearlo | Complete level {n} to unlock it |
| `levels.completed` | Completado | Completed |
| `levels.stars` | {n} de 3 estrellas | {n} of 3 stars |
| `levels.loading` | Cargando niveles… | Loading levels… |
| `levels.error_load` | No se pudieron cargar los niveles | Levels couldn't be loaded |
| `levels.offline` | Mostrando los niveles incluidos en la app | Showing the levels included in the app |
| `levels.empty` | No hay niveles disponibles | No levels available |

## Victoria

| Clave | Español | English |
| --- | --- | --- |
| `victory.title_level` | ¡Nivel completado! | Level complete! |
| `victory.title_merge` | ¡Lo lograste! | You did it! |
| `victory.target_tile` | Ficha alcanzada: {value} | Tile reached: {value} |
| `victory.next_level` | Siguiente nivel | Next level |
| `victory.replay_level` | Repetir nivel | Replay level |
| `victory.new_game` | Nueva partida | New game |
| `victory.keep_playing` | Seguir jugando | Keep playing |
| `victory.all_done` | Has completado todos los niveles disponibles | You've completed all available levels |

## Derrota

| Clave | Español | English |
| --- | --- | --- |
| `defeat.title_lines` | Partida terminada | Game over |
| `defeat.reason_lines` | Ninguna pieza cabe en el tablero | No piece fits on the board |
| `defeat.title_sort` | Tablero lleno | Board full |
| `defeat.reason_sort` | No quedan movimientos posibles | No possible moves remain |
| `defeat.title_merge` | Sin movimientos | No moves left |
| `defeat.reason_merge` | Ninguna dirección cambia el tablero | No direction changes the board |
| `defeat.retry` | Reintentar | Try again |

## Pausa

| Clave | Español | English |
| --- | --- | --- |
| `pause.title` | Pausa | Paused |
| `pause.resume` | Reanudar | Resume |
| `pause.restart` | Reiniciar | Restart |
| `pause.settings` | Ajustes | Settings |
| `pause.exit` | Salir al menú | Exit to menu |
| `pause.restart_confirm` | ¿Reiniciar? Perderás el avance actual. | Restart? You'll lose your current progress. |
| `pause.exit_confirm` | ¿Salir al menú? Perderás el avance actual. | Exit to menu? You'll lose your current progress. |

Si se decide guardar la partida a medias (P-16), `pause.exit_confirm` deja de ser cierto y debe reescribirse.

## Partida (marco)

| Clave | Español | English |
| --- | --- | --- |
| `game.pause` | Pausa | Pause |
| `game.undo` | Deshacer | Undo |
| `game.redo` | Rehacer | Redo |
| `game.rotate` | Rotar | Rotate |
| `game.tray` | Bandeja de piezas | Piece tray |
| `game.board` | Tablero | Board |
