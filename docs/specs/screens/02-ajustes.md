# Pantalla 02 — Ajustes

| Campo | Valor |
| --- | --- |
| Estado | Lista para diseñar |
| Requerimientos | SUI-03, SUI-04, SUI-05. Cuenta: INT-01, condicionado a P-18 |
| Se llega desde | Inicio (obligatorio) y Pausa (opcional) |
| Lleva a | La pantalla de origen. Login, solo si P-18 lo confirma |

## Propósito

Permite silenciar música y efectos, cambiar de idioma y, si hay cuentas, gestionar la sesión.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| AJU-01 | Encabezado con botón volver | Encabezado | Sí | `settings.title`, `common.back` | Vuelve a la pantalla de origen |
| AJU-02 | Interruptor de música | Interruptor | Sí (SUI-03) | `settings.music` | Al apagarlo, la música se detiene al instante |
| AJU-03 | Interruptor de efectos de sonido | Interruptor | Sí (SUI-03) | `settings.sfx` | Al apagarlo, ningún efecto suena. Al encenderlo puede sonar un efecto breve de confirmación |
| AJU-03b | Interruptor de modo oscuro | Interruptor | Confirmado | `settings.appearance`, `settings.dark_mode` | Cambia el tema claro/oscuro de la aplicación al instante sin reiniciar |
| AJU-04 | Selector de idioma | Lista de opciones excluyentes | Sí (SUI-04) | `settings.language`, `lang.es`, `lang.en` | Cada idioma aparece con su propio nombre, sin traducir, y un icono vectorial plano (sin banderas ni emojis). El cambio se aplica al instante |
| AJU-05 | Sección de cuenta | Bloque | Confirmado (P-18) | `settings.account`, `common.sign_in`, `settings.logout` | Sin sesión: botón primario de Iniciar sesión coherente con Inicio para ir a Login. Con sesión: nombre de usuario y botón de cerrar sesión |
| AJU-06 | Versión de la app | Pie de pantalla | Opcional | `settings.version` | Solo informativo (`Versión {version}`) al pie de la pantalla de Ajustes |

**No incluir hasta decidir (P-17):** borrar progreso, créditos, y controles de volumen. Si se añade "Borrar progreso", necesita un diálogo de confirmación.

## Recibe

- Música activada (sí o no), efectos activados (sí o no).
- Idioma actual y lista de idiomas disponibles (código y nombre propio).
- Sesión: ninguna, o nombre de usuario (P-18).
- Versión de la app (opcional).

## Emite

| Evento | Cuándo | Datos |
| --- | --- | --- |
| Música cambiada | Se toca AJU-02 | Nuevo valor |
| Efectos cambiados | Se toca AJU-03 | Nuevo valor |
| Idioma cambiado | Se elige una opción en AJU-04 | Código del idioma |
| Cerrar sesión | Se confirma el diálogo | — |
| Ir a login | Se toca el botón de AJU-05 sin sesión | — |
| Volver | Se toca AJU-01 | — |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Normal | Preferencias cargadas | Controles con su valor actual |
| Sin sesión / con sesión | Según P-18 | AJU-05 cambia de contenido |
| Confirmar cierre de sesión | Se toca "cerrar sesión" | Diálogo con `settings.logout_confirm`, `common.cancel` y `common.confirm` |
| Error al guardar | Falla guardar un cambio | El control vuelve a su valor anterior y aparece `settings.error_save` |

## Navegación

- Desde Inicio: volver lleva a Inicio y se muestra el menú inferior con Ajustes activo. Desde Pausa: volver lleva a Pausa, con la partida intacta y el menú inferior oculto.
- "Atrás" del sistema: igual que el botón volver.

## Criterios de aceptación

- Con la música apagada no suena música; con los efectos apagados no suena ningún efecto (SUI-03).
- Cambiar el idioma cambia todos los textos de la pantalla de inmediato, sin reiniciar (SUI-04).
- Cerrar la app y volver a abrirla conserva música, efectos e idioma (SUI-05).
- Añadir un tercer idioma a la lista de idiomas muestra una tercera opción sin rediseñar la pantalla.
- Ningún control se queda en un valor distinto del real si falla el guardado.

## Preguntas abiertas

- P-17: ¿música y efectos por separado, como aquí, o un solo interruptor?
- P-18: ¿la sección de cuenta forma parte del alcance?
