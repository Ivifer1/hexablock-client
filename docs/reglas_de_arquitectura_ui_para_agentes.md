# Directivas de Arquitectura UI para Agentes de IA

Este documento establece las restricciones obligatorias para cualquier modelo o agente de IA (Antigravity, Copilot, Claude) que genere o modifique componentes de interfaz en este proyecto.

## 1. Prohibiciones Directas (Strict Constraints)
- **JAMÁS** importar componentes React, elementos del DOM o estilos CSS dentro de `src/domain/` o `src/application/`.
- **JAMÁS** escribir condicionales tipo `switch(mode)` o `if(mode === 'lines')` dentro de componentes de UI. La interfaz solo interpreta arreglos genéricos de `ViewModels` o `ModeDescriptors`.
- **JAMÁS** ejecutar reglas de juego (cálculo de daño, validez de movimiento, incremento de puntaje) dentro de los eventos de la vista (`onClick`, `onTouch`). La vista únicamente invoca métodos del `Controller`.

## 2. Inyección y Comunicación
- La UI recibe los datos mediante contratos de **ViewModels** (`GameViewModel`, `BoardView`, `CellView`).
- Las acciones de usuario se envían llamando métodos expuestos por el puerto de entrada (`IInputPort` / `GameController`).
- La instanciación de dependencias se realiza exclusivamente en el `CompositionRoot` (`src/infrastructure/di/CompositionRoot.ts`).

## 3. Guías de Estilo Visual
- Utilizar los tokens CSS definidos en `src/infrastructure/ui/styles/tokens.css` (variables `--color-*`, `--spacing-*`, `--font-*`).
- Todo elemento interactivo debe respetar el tamaño táctil mínimo `--touch-target-min: 44px`.