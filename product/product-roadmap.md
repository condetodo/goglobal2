# Product Roadmap

## Sections

### 1. Orders
Gestión de órdenes (shows) y episodios: visualización de órdenes existentes, detalle de órdenes con información de vendors asignados a nivel de Order, gestión de episodios que heredan automáticamente las asignaciones de vendors y deadlines. Permite agregar nuevos episodios a órdenes existentes (que heredan automáticamente las asignaciones) y editar información básica de órdenes.

**Funcionalidad clave**: Visualización de vendors y deadlines asignados a nivel de Order que se aplican automáticamente a todos los episodios. Los episodios muestran claramente qué asignaciones heredan de la Order y pueden tener excepciones específicas.

### 2. Assignment
Formulario de creación de nuevas Orders (shows) con asignación completa de vendors, deadlines y minutos estimados para cada una de las 5 etapas del proceso de doblaje. Este es el punto de entrada principal para crear nuevos proyectos.

**Funcionalidad clave**: 
- Formulario multi-paso (Información básica → Asignación de vendors → Resumen)
- Asignación de múltiples vendors por etapa (especialmente para Voice Talents)
- Creación de nuevos vendors directamente desde el formulario
- Asignación de deadlines y minutos estimados por etapa
- Todas las asignaciones se aplican automáticamente a todos los episodios que se generen

**Proceso de Doblaje - 5 Etapas**:
1. PREPRODUCCIÓN - Adaptación de guion (Adaptador)
2. PRODUCCIÓN - Voice Talents (Actores de voz - múltiples)
3. POSTPRODUCCIÓN - Editor de sonido
4. POSTPRODUCCIÓN - Creación de subtítulos (Subtitulador)
5. POSTPRODUCCIÓN - QA final (Auditor de calidad)

### 3. Vendors
Gestión de vendors: registro y administración de proveedores (voice talents, adaptadores, editores, subtituladores, auditores) con información de contacto, especializaciones por etapa del proceso, configuración de pagos, estado activo/inactivo, y detalles técnicos.

### 4. Rates
Configuración de tarifas: tabla maestra de tarifas por fase/rol con franjas de minutos, bonos, excepciones por show, y soporte multi-moneda (ARS, USD, BRL). Permite calcular automáticamente los pagos basados en los minutos trabajados y las reglas de tarifas configuradas.

### 5. Settlement
Liquidación y pagos: cálculo automático de pagos basado en asignaciones de vendors, minutos trabajados y reglas de tarifas, detección de pagos duplicados, generación de POs consolidadas por vendor y mes, y exportación al ERP.

## Flujo Principal del Sistema

1. **Crear Order (Assignment)**: Usuario crea una nueva Order asignando vendors, deadlines y minutos estimados para las 5 etapas
2. **Visualizar Order (Orders)**: Usuario ve la Order creada con todas las asignaciones que se aplican a todos los episodios
3. **Gestionar Episodios (Orders)**: Los episodios heredan automáticamente las asignaciones, pero pueden tener excepciones específicas
4. **Configurar Vendors (Vendors)**: Administración de la base de vendors disponibles
5. **Configurar Tarifas (Rates)**: Definición de reglas de cálculo de pagos
6. **Liquidar Pagos (Settlement)**: Generación automática de POs y exportación al ERP

## Dashboard de Proyectos

El sistema incluye un dashboard que reemplaza la planilla Excel actual, proporcionando:
- Vista de shows en curso (demos o shows completos)
- Status por etapa (las 5 etapas del proceso de doblaje)
- Deadlines y alertas
- Client Dels (Entregables del cliente)
- Registro de Adaptación, Producción ESLA/PTBR, Subs + QAF
