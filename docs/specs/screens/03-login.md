# Pantalla 03 — Inicio de sesión

| Campo | Valor |
| --- | --- |
| Estado | Condicionada a P-18 (alcance) y P-20 (campos). Se puede diseñar; no implementar todavía |
| Requerimientos | INT-01, INT-02, INT-07, BCK-02 |
| Se llega desde | Inicio, Ajustes, Registro |
| Lleva a | La pantalla de origen (Inicio o Ajustes), con o sin sesión; Registro |

## Propósito

Permite a un jugador entrar con su cuenta. Su otra función, igual de importante, es dejar claro que **se puede jugar sin cuenta** (INT-02).

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| LOG-01 | Encabezado con botón volver | Encabezado | Sí | `login.title`, `common.back` | Vuelve a la pantalla de origen (Inicio o Ajustes) |
| LOG-02 | Campo de identificador | Campo de texto | Sí | `login.identifier` | Sin autocorrección ni mayúscula automática. Etiqueta siempre visible (P-20) |
| LOG-03 | Campo de contraseña | Campo de texto enmascarado | Sí | `login.password` | Enmascarado por defecto. Compatible con gestores de contraseñas |
| LOG-04 | Mostrar u ocultar contraseña | Botón con icono dentro del campo | Sí | `login.password_show`, `login.password_hide` | Alterna la visibilidad |
| LOG-05 | Botón de iniciar sesión | Botón primario | Sí | `login.submit`, `login.submitting` | Desactivado mientras algún campo esté vacío. Al enviar, se desactiva y muestra el indicador de carga |
| LOG-06 | Enlace a registro | Botón de texto | Sí | `login.register_link` | Abre Registro |
| LOG-07 | Jugar sin cuenta | Botón secundario | Sí (INT-02) | `login.guest` | Vuelve a Inicio sin sesión. Siempre activo, incluso sin red |
| LOG-08 | Zona de mensajes de error | Texto junto al campo o sobre el botón | Sí | `common.error_empty`, `login.error_credentials`, `login.error_network`, `common.error_server` | Se muestra solo cuando hay error |

## Recibe

- Estado del envío: en reposo, enviando, o con error (y su tipo: credenciales, red o servidor).

## Emite

| Evento | Cuándo | Datos |
| --- | --- | --- |
| Enviar | Se toca LOG-05 con ambos campos llenos | Identificador y contraseña |
| Ir a registro | Se toca LOG-06 | — |
| Jugar sin cuenta | Se toca LOG-07 | — |
| Volver | Se toca LOG-01 | — |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Reposo | Al entrar | Campos vacíos y botón principal desactivado |
| Campo vacío | Se intenta enviar o se sale de un campo sin llenarlo | `common.error_empty` junto al campo |
| Enviando | Tras tocar iniciar sesión | Botón desactivado con indicador y `login.submitting`. Los campos no se pueden editar |
| Credenciales incorrectas | El servidor las rechaza | `login.error_credentials`. Un solo mensaje: no revela si falló el usuario o la contraseña |
| Sin conexión | Falla la red | `login.error_network`. "Jugar sin cuenta" sigue activo (INT-07) |
| Error del servidor | Falla del servidor | `common.error_server` |
| Éxito | Se acepta el inicio de sesión | Se vuelve a la pantalla de origen (Inicio o Ajustes) mostrando la sesión. No hay pantalla intermedia |

## Seguridad de la interfaz

- La contraseña no se muestra por defecto, no aparece en mensajes de error ni en registros.
- Los mensajes de error no revelan si una cuenta existe.
- La recuperación de contraseña no está en el enunciado: no se incluye.
- No hay casilla "mantener sesión": la sesión se conserva al reabrir la app (INT-01).

## Navegación

- "Atrás" del sistema y botón volver: vuelven a la pantalla de origen (Inicio o Ajustes).

## Criterios de aceptación

- Con campos vacíos el botón principal no envía y se explica por qué.
- Durante el envío no se puede enviar dos veces.
- Cada error muestra un mensaje distinto y ninguno bloquea "Jugar sin cuenta".
- La contraseña nunca aparece en claro salvo que el usuario lo pida.

## Preguntas abiertas

- P-18: ¿entra en el alcance mínimo?
- P-20: ¿el identificador es usuario, correo o ambos? ¿Cuánto dura el token y se renueva?
