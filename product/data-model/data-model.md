# Data Model

## Entities

### Order
Una orden de doblaje que entra al sistema. Representa un proyecto completo de doblaje que puede contener múltiples episodios.

### Episode
Un episodio individual que pertenece a una orden. Cada episodio tiene una duración en minutos y puede ser asignado a múltiples vendors en diferentes fases del proceso.

### Show
Una serie o programa de televisión que agrupa episodios. Los shows pueden tener tarifas excepcionales configuradas que sobrescriben las tarifas estándar.

### Vendor
Un proveedor que realiza trabajo de doblaje. Los vendors pueden ser asignados a episodios en diferentes fases y tienen información de contacto y configuración de pagos.

### Assignment
Una asignación de trabajo que conecta un vendor con un episodio en una fase específica. Cada asignación representa el trabajo que un vendor debe realizar en una fase particular (preflight, adaptación, edición, voice recording, sound editing, QA).

### Rate
Reglas de tarifas que definen cómo se calculan los pagos. Incluye tarifas base por rol, franjas de minutos, bonos de calidad, bonos mensuales, y excepciones por show específico. Soporta múltiples monedas (ARS, USD, BRL).

### PurchaseOrder
Una orden de compra consolidada generada automáticamente para liquidar pagos a vendors. Agrupa todas las asignaciones de un vendor por mes y está lista para exportar al ERP.

### Payment
Un registro de pago calculado y procesado. Representa el monto que se debe pagar a un vendor por una asignación específica, calculado según las reglas de tarifas aplicables.

## Relationships

- Order has many Episodes
- Episode belongs to one Order
- Episode belongs to one Show
- Show has many Episodes
- Assignment belongs to one Episode
- Assignment belongs to one Vendor
- Vendor has many Assignments
- Assignment uses one Rate (determined by role, show, and other factors)
- Rate can apply to many Assignments
- PurchaseOrder belongs to one Vendor
- PurchaseOrder contains many Payments
- Payment belongs to one Assignment
- Payment belongs to one PurchaseOrder

