# Go Global Dubbing Manager

## Description
Sistema para gestionar el ciclo completo de proyectos de doblaje: desde la entrada de una orden hasta el pago a cada vendor. Reemplaza una planilla de Excel con fórmulas frágiles y procesos manuales, automatizando la asignación de trabajo, el seguimiento del avance y la liquidación de pagos con reglas de tarifas complejas. 

El sistema permite asignar vendors a nivel de Order (show) una sola vez, y estas asignaciones se aplican automáticamente a todos los capítulos/episodios, eliminando la necesidad de configurar manualmente cada episodio individual. Esto acelera significativamente la configuración de nuevos proyectos y asegura consistencia en las asignaciones.

## Problems & Solutions

### Problem 1: Fórmulas frágiles que se rompen con cambios
El Excel actual tiene 27 solapas con fórmulas complejas y tablas dinámicas que se rompen cuando se modifican datos o estructura. El sistema centraliza la lógica de cálculo en funciones SQL versionables y testeables, eliminando la dependencia de fórmulas en celdas.

### Problem 2: Pagos duplicados difíciles de detectar
Con 3,264+ asignaciones granulares y múltiples POs generadas manualmente, es difícil detectar cuando se paga dos veces por el mismo trabajo. El sistema implementa detección automática de duplicados mediante hashes MD5 y vistas materializadas que alertan proactivamente sobre pagos duplicados.

### Problem 3: Cálculos de tarifas complejos (franjas + bonos + excepciones)
Las tarifas varían por rol, franjas de minutos, bonos de calidad, bonos mensuales, y excepciones por show específico, con múltiples monedas (ARS, USD, BRL). El sistema automatiza estos cálculos aplicando reglas de tarifas configuradas, incluyendo tarifas excepcionales por vendor y show.

### Problem 4: Solapas individuales por vendor (escalabilidad imposible)
El Excel actual requiere una solapa por cada vendor para tracking personalizado. Con 239 vendors activos, esto no escala. El sistema unifica el tracking de todos los vendors en una base de datos normalizada, permitiendo vistas personalizadas sin límite de vendors.

### Problem 5: Proceso manual de liquidación propenso a errores
La generación de POs se hace manualmente multiplicando order × show × mes × vendor, usando tablas dinámicas frágiles. El sistema genera POs automáticamente con un click, consolidando todas las asignaciones de un vendor por mes y exportando POs listas para cargar al ERP.

### Problem 6: Asignación manual repetitiva de vendors episodio por episodio
Al crear una Order con múltiples capítulos, actualmente se debe asignar cada vendor manualmente para cada episodio individual, repitiendo la misma información decenas o cientos de veces. El sistema permite asignar vendors una sola vez a nivel de Order, y estas asignaciones se propagan automáticamente a todos los capítulos/episodios, reduciendo significativamente el tiempo de configuración y eliminando errores por asignaciones inconsistentes entre episodios.

## Key Features
- **Asignación de vendors a nivel de Order**: Al crear una Order (show), se asignan los vendors una sola vez para cada etapa del proceso, y estas asignaciones se aplican automáticamente a todos los capítulos/episodios, eliminando la necesidad de asignar manualmente episodio por episodio
- Asignación de trabajo (order → episodios → vendors por fase)
- Cálculo automático de pagos con reglas de tarifas complejas
- Detección automática de pagos duplicados
- Seguimiento del avance por fase del proceso de doblaje (5 etapas principales)
- Generación automática de POs consolidadas por vendor y mes
- Exportación de POs para cargar al ERP
- Vista unificada de todos los vendors (reemplazo de solapas individuales)
- Soporte multi-moneda (ARS, USD, BRL)
- Tarifas excepcionales por show específico
- Dashboard de proyectos en curso con vista de shows (demos o completos), status de cada paso y deadlines

## Proceso de Doblaje - 5 Etapas Asignadas a Vendors

Cada proyecto de doblaje sigue un flujo de 5 etapas principales, cada una asignada a vendors externos especializados:

### 1. PREPRODUCCIÓN – Adaptación de guion
**Vendor: Adaptador**
- El adaptador convierte el guion original en un texto listo para doblaje
- Ajusta lipsync, intención actoral y estilo
- Entrega en formato SRT que se convierte a Excel con GPT
- A partir del detalle del guion (nombres de personajes, género y cantidad de líneas) se asignan los Voice Talents según su rango vocal y disponibilidad

### 2. PRODUCCIÓN – Voice Talents
**Vendor: Actores de voz**
- Los actores asignados graban sus líneas siguiendo el guion adaptado
- Se respetan rangos vocales, disponibilidad y estilo interpretativo
- La asignación se realiza según el análisis del guion adaptado

### 3. POSTPRODUCCIÓN – Editor de sonido
**Vendor: Editor de sonido**
- El editor ensambla y sincroniza las voces grabadas con el video original
- Trabaja con las pistas M&E (Music & Effects)
- Asegura limpieza y timing adecuados del audio

### 4. POSTPRODUCCIÓN – Creación de subtítulos
**Vendor: Subtitulador**
- Se generan los subtítulos finales en formato SRT
- Se siguen las normas específicas del cliente
- Se ajustan al contenido doblado

### 5. POSTPRODUCCIÓN – QA final
**Vendor: Auditor de calidad**
- Se realiza una auditoría de calidad final de todo el material entregado
- Se verifica audio, subtítulos y sincronización
- Validación antes de la entrega al cliente

## Dashboard de Proyectos

El sistema incluye un dashboard que reemplaza la planilla Excel actual, proporcionando:

- **Vista de shows en curso**: Visualización de todos los proyectos activos, indicando si son demos o shows completos
- **Status por etapa**: Seguimiento del estado de cada una de las 5 etapas del proceso para cada show
- **Deadlines**: Visualización y alertas de fechas límite por etapa y proyecto
- **Client Dels (Entregables del cliente)**: Detalle de qué pide cada cliente como entregable
- **Adaptación**: Registro del primer paso (Preproducción - Adaptación de guion)
- **Producción ESLA y PTBR**: Registro de los pasos 2 y 3 según idioma (Voice Talents y Editor de sonido)
- **Subs + QAF**: Registro de los pasos 4 y 5 (Creación de subtítulos y QA final)
