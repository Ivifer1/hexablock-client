# Pantalla 04 — Registro

| Campo | Valor |
| --- | --- |
| Estado | Condicionada a P-18 (alcance) y P-20 (campos y reglas). Se puede diseñar; no implementar todavía |
| Requerimientos | INT-01, BCK-01 |
| Se llega desde | Login |
| Lleva a | Inicio con sesión (propuesta), Login |

## Propósito

Permite crear una cuenta nueva para poder sincronizar el progreso y aparecer en el ranking.

## Elementos

| ID | Elemento | Tipo | Obligatorio | Texto | Comportamiento |
| --- | --- | --- | --- | --- | --- |
| REG-01 | Encabezado con botón volver | Encabezado | Sí | `register.title`, `common.back` | Vuelve a Login |
| REG-02 | Campo de identificador | Campo de texto | Sí | `register.identifier` | Si P-20 pide usuario y correo, serán dos campos |
| REG-03 | Campo de contraseña | Campo de texto enmascarado | Sí | `register.password` | Enmascarado, con botón de mostrar u ocultar (`login.password_show`, `login.password_hide`) |
| REG-04 | Confirmación de contraseña | Campo de texto enmascarado | Sí | `register.confirm` | Debe coincidir con REG-03 |
| REG-05 | Ayuda sobre la contraseña | Texto bajo REG-03 | Sí | `register.password_hint` | Muestra la regla vigente. La regla real se decide en P-20; propuesta: mínimo 8 caracteres |
| REG-06 | Botón de crear cuenta | Botón primario | Sí | `register.submit`, `register.submitting` | Desactivado mientras haya campos vacíos. Al enviar, se desactiva y muestra el indicador de carga |
| REG-07 | Enlace a login | Botón de texto | Sí | `register.login_link` | Abre Login |
| REG-08 | Zona de mensajes de error | Texto junto al campo o sobre el botón | Sí | `common.error_empty`, `register.error_mismatch`, `register.error_short`, `register.error_exists`, `common.error_network`, `common.error_server` | Se muestra solo cuando hay error |

## Recibe

- Estado del envío: en reposo, enviando, o con error (y su tipo: datos inválidos, cuenta existente, red o servidor).

## Emite

| Evento | Cuándo | Datos |
| --- | --- | --- |
| Crear cuenta | Se toca REG-06 con todo válido | Identificador y contraseña |
| Ir a login | Se toca REG-07 | — |
| Volver | Se toca REG-01 | — |

## Estados

| Estado | Cuándo | Qué se ve |
| --- | --- | --- |
| Reposo | Al entrar | Campos vacíos y botón principal desactivado |
| Datos inválidos | Falla la validación local | Mensaje junto al campo: vacío, contraseñas distintas o contraseña corta |
| Enviando | Tras tocar crear cuenta | Botón desactivado con indicador y `register.submitting`. Campos bloqueados |
| Cuenta existente | El servidor rechaza un duplicado (BCK-01) | `register.error_exists` |
| Sin conexión | Falla la red | `common.error_network` |
| Error del servidor | Falla del servidor | `common.error_server` |
| Éxito | Se crea la cuenta | Propuesta: se inicia sesión y se vuelve a Inicio. Alternativa: volver a Login con `register.success` (P-20) |

## Validación en pantalla

Solo se valida el formato. La unicidad y cualquier otra regla las decide el servidor.

| Regla | Mensaje |
| --- | --- |
| Ningún campo vacío | `common.error_empty` |
| Contraseña y confirmación iguales | `register.error_mismatch` |
| Longitud mínima de contraseña (propuesta: 8) | `register.error_short` |

## Navegación

- "Atrás" del sistema: vuelve a Login.

## Criterios de aceptación

- No se puede enviar con campos vacíos, contraseñas distintas o contraseña corta.
- Un registro duplicado muestra su propio mensaje y no borra lo escrito.
- No se piden datos que el enunciado no necesite: no hay términos y condiciones ni campos extra.
- Durante el envío no se puede enviar dos veces.

## Preguntas abiertas

- P-20: campos exactos del registro, regla de contraseña y qué ocurre tras registrarse.
