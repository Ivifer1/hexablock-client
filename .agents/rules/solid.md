# Reglas de Diseño e Implementación SOLID

Todo el código generado o refactorizado en este proyecto debe cumplir estrictamente con los 5 principios SOLID y la arquitectura limpia establecida.

## 1. Single Responsibility Principle (SRP)
- Cada clase, módulo o componente debe tener **una sola razón para cambiar**.
- **UI (Frameworks/Views):** Solo captura eventos e imprime ViewModels. Cero lógica de negocio o de transformación.
- **Presenters:** Solo transforman datos del dominio/casos de uso a ViewModels estáticos.
- **Controllers:** Solo traducen la entrada del usuario e invocan Casos de Uso.
- **Casos de Uso:** Solo ejecutan una regla de negocio o flujo específico.

## 2. Open/Closed Principle (OCP)
- El código debe estar **abierto a la extensión pero cerrado a la modificación**.
- Utiliza **Polimorfismo y Patrón Strategy** para variaciones de comportamiento (ej. modos de juego `IGameMode`, renderizadores de celdas `ICellPresenter`).
- Agregar una nueva funcionalidad (ej. un nuevo tipo de casilla) debe requerir **crear una nueva clase**, jamás modificar switches o `if/else` en controladores o vistas existentes.

## 3. Liskov Substitution Principle (LSP)
- Las subtipos e implementaciones deben ser **completamente intercambiables** por sus interfaces base sin alterar el comportamiento del sistema.
- Ninguna implementación de una interfaz debe lanzar excepciones tipo `NotImplementedException` ni anular comportamiento esperado de la abstracción.

## 4. Interface Segregation Principle (ISP)
- Diseña **interfaces pequeñas, cohesionadas y específicas** en lugar de interfaces monolíticas.
- Separa los Puertos de Entrada (`IInputPort`) de los Puertos de Salida (`IOutputPort`). La UI solo debe conocer las interfaces de las que realmente depende.

## 5. Dependency Inversion Principle (DIP)
- Los módulos de alto nivel (Dominio y Casos de Uso) **nunca deben depender** de los módulos de bajo nivel (UI, Canvas, HTTP, LocalStorage). Ambos deben depender de abstracciones (interfaces/puertos).
- Toda dependencia externa se inyecta por constructor mediante el `CompositionRoot`.