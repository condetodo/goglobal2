# Análisis Profundo: Plataforma de Dubbing Go Global

**Del Excel al Diseño de Base de Datos Normalizado**

Cliente: Go Global / Uanaknow  
Fecha: Diciembre 2025

---

## 📊 Resumen Ejecutivo

### Estado Actual
- ~1,000 proyectos en adaptación
- ~3,264 asignaciones granulares en producción (ESLA + PTBR)
- 239 vendors activos (98 adaptadores + 131 VTs + 10 editores)
- 27 solapas en Excel con fórmulas complejas y tablas dinámicas
- **Pain point crítico:** Generación manual de POs multiplicada (por order × show × mes × vendor)

### Problemas Identificados
1. ✗ Fórmulas frágiles que se rompen con cambios
2. ✗ Pagos duplicados difíciles de detectar
3. ✗ Cálculos de tarifas complejos (franjas + bonos + excepciones)
4. ✗ Solapas individuales por vendor (escalabilidad imposible)
5. ✗ Proceso manual de liquidación propenso a errores

---

## 🔍 Análisis de Estructura Actual del Excel

### 1. DASHBOARD
- **Dimensiones:** 37 proyectos × 16 columnas
- **Propósito:** Vista general de status
- **Insight clave:** Es una vista agregada. Los datos reales están en las solapas de asignación.

### 2. Tabla Tarifas
- **Dimensiones:** 14 roles × 13 columnas (franjas de tarifa)
- **Propósito:** Matriz de tarifas por rol y franjas de minutos

**Estructura del Dashboard:**
```
├── Customer (WosDub, Gobavo, DUb-Sub)
├── Order (O-45762, O-45751, etc.)
├── Content Title (nombre del show)
├── Episode (1-80, 1-77, etc.)
├── Type of show (Microdrama/Short, Soap Opera)
├── Language (ESLA, PTBR)
├── Status por fase:
│   ├── Status Adaptación + Deadline
│   ├── Status VTs + Deadline
│   ├── Status Sound Edt + Delivery
│   └── Delivery Client
└── Comments + Rework
```

**Estructura de Tarifas:**

| Rol | < 30 min | 30-60 min | 60-90 min | > 120 min |
|-----|----------|-----------|-----------|-----------|
| Preflight | 400/460 ARS | 400/460 | 400/460 | 400/460 |
| Adaptador | 800/1000 ARS | 800/1000 | 800/1000 | 800/1000 |
| Editor | 10k/10k ARS | 16k/16k | 18k/18k | 24k/24k |
| Ed. Sonido | 25/17 USD | 0.45/0.3 | 0.45/0.3 | 0.45/0.3 |
| Adaptador PTBR | 0.6/0.75 USD | 0.6/0.75 | 0.6/0.75 | 0.6/0.75 |
| Editores PTBR | 75/75 BRL | 75/75 | 200/200 | 200/200 |
| QAF PTBR | 50 BRL/hora | - | - | - |

**MONEDAS:** ARS, USD, BRL  
**TIPOS DE COBRO:** por minuto, flat, por hora

**Complejidad detectada:**
- ✓ Franjas no uniformes por rol
- ✓ Algunos roles cobran flat, otros por minuto, otros por hora
- ✓ Diferentes monedas según rol y mercado
- ✓ Bonos que duplican o modifican tarifa base
- ✓ Notas indican tarifas excepcionales por serie específica

### 3. Maestros de Vendors

#### 3.1 Adaptadores
- **Dimensiones:** 98 vendors × 14 columnas
- **Insight crítico:** Las tarifas excepcionales están en texto libre en NOTAS.
- → En BD: necesitamos tabla `vendor_exception_rates` relacionada con shows específicos.

#### 3.2 VTs (Voice Talent)
- **Dimensiones:** 131 vendors × 20 columnas

**Campos clave:**
```
├── ETAPA (PRE-FLIGHT, ADAPTADOR)
├── Prioridad (1-4)
├── Nombre del vendor
├── Idioma (ESLA, PTBR)
├── Estado actual (Activo, Inactivo)
├── Contacto (WPP, Mail)
├── CURRENCY + IMPORTE (tarifa estándar)
├── NOTAS (tarifas excepcionales)
│   Ejemplo: "500 ARS para series: Suno chanda, Rah e Junoon, Hum Dono, Fairy Tale"
├── TEST EN BM? (boolean)
├── QA (calidad: OK, BUENO, MISSING)
└── OTD (on-time delivery: BUENO, etc.)
```

#### 3.3 Ed Sonido
- **Dimensiones:** 10 vendors × 16 columnas
- Estructura similar pero roles de sound editing

### 4. Adaptación
- **Dimensiones:** 999 filas × 47 columnas
- **Propósito:** Tracking de fase de adaptación

**Modelo de datos implícito:**
```
┌─────────────────────────────────────────────────────┐
│ PROYECTO (cols 0-5)                                 │
│ ├── Customer, Order, Content Title, Episode         │
│ ├── Type of show, Language, Ready?                  │
│ └── Gross Duration, To be invoiced, Q minutes pf    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ PREFLIGHT (cols 6-11)                               │
│ ├── Preparación archivo inicial                     │
│ ├── Month Preparacion, Preflighter                  │
│ ├── Delivery Date PF, Status PF                     │
│ └── Bonus PF, Month PF                              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ ADAPTADOR (cols 12-21)                              │
│ ├── Adaptador (nombre)                              │
│ ├── Start Date AD, Delivery date AD, Month AD      │
│ ├── Status AD, Bonus AD, Excepción AD              │
│ └── MONEDA, TARIFA, IMPORTE A COBRAR AD PO         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ EDITOR (cols 22-30)                                 │
│ ├── Profesional EDT, Task EDT, Rate EDT            │
│ ├── Start Date EDT, Delivery Date EDT, Month EDT   │
│ ├── Status EDT, # Loops                            │
│ └── AVERAGE Loops per hour                         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ DUBBING + VT (cols 31-46)                           │
│ ├── Status DUBBING, Date Planned                   │
│ ├── RATE UNIT VT, SUBTOTAL VT, BONUS 1 VT          │
│ ├── CURRENCY VT, TOTAL 1 (PO) VT                   │
│ └── MONTH PAYMENT, FULL SHOW BONUS VT              │
└─────────────────────────────────────────────────────┘
```

**Notas:**
- 1 fila = 1 orden/episodio
- Cada orden pasa por múltiples fases (PF → Adaptación → Edición → VT)
- Cada fase tiene su propio vendor asignado
- Cálculos de tarifas inline (fórmulas en celdas)

### 5. Producción ESLA / PTBR
- **Dimensiones:** 1,663 (ESLA) + 1,601 (PTBR) = 3,264 filas × 36-39 columnas
- **Propósito:** Asignaciones granulares por Voice Talent

**Estructura por VT:**
```
┌─────────────────────────────────────────────────────┐
│ POR CADA VOICE TALENT EN CADA EPISODIO              │
├─────────────────────────────────────────────────────┤
│ Proyecto:                                           │
│ ├── Customer, Order No., Show, Episode              │
│ └── Type of show, Language                          │
├─────────────────────────────────────────────────────┤
│ Voice Talent:                                       │
│ ├── Voice Talent name                               │
│ ├── VT No. (código)                                 │
│ ├── Lines (cantidad de líneas grabadas)             │
│ ├── Delivery Date VT, Status VT                     │
│ ├── Quality Bonus (Yes/No)                          │
│ ├── Monthly Cont-Bonus (Yes/No)                     │
│ └── Excepción VT (tarifa especial si aplica)        │
├─────────────────────────────────────────────────────┤
│ Sound Editor:                                       │
│ ├── Sound Editor (nombre)                           │
│ ├── Gross duration, Q Minutes                       │
│ ├── M&E (WITH M&E / SIN M&E)                        │
│ ├── Delivery Date EDT, Status EDT                   │
│ └── Tarifa correspondiente EDT, A PAGAR EDT PO      │
├─────────────────────────────────────────────────────┤
│ QA:                                                 │
│ ├── QA (nombre)                                     │
│ ├── Status QA, Delivery to client                   │
├─────────────────────────────────────────────────────┤
│ Cálculos de Pago VT:                                │
│ ├── RATE UNIT VT (tarifa por línea)                 │
│ ├── SUBTOTAL VT (rate × lines)                      │
│ ├── BONUS 1 VT (15% si calidad)                     │
│ ├── TOTAL 1 (PO) VT                                 │
│ ├── FULL SHOW BONUS VT (bono mensual)               │
│ └── total a pagar                                   │
└─────────────────────────────────────────────────────┘
```

**Ejemplo real (fila 1):**
```
Customer: DUb-Sub
Order: 45386
Show: Can Borcu
Episode: trailer
VT: Fabio Balada (VT No. 010)
Lines: 12
RATE UNIT: 145 ARS
SUBTOTAL: 145 × 12 = 1,740 ARS
BONUS 1: 1,740 × 15% = 261 ARS
TOTAL 1 (PO): 2,001 ARS
FULL SHOW BONUS: 174 ARS
TOTAL A PAGAR: 2,175 ARS
```

**Pain point visible:**
- 1 episodio puede tener 10+ VTs (uno por personaje)
- Cada VT genera 1 línea en esta tabla
- Un show de 80 episodios × 10 VTs = 800 filas solo para VTs
- Luego hay que agrupar por VT × mes para generar la PO
- Las fórmulas agrupan esto con tablas dinámicas (frágil)

### 6. POs y Liquidación

**Solapas de PO encontradas:**
- PO VTS (vacía)
- po ed son esla (vacía)
- po ed son ptbr (vacía)
- qaf esla (1 fila de totales)
- QA PTBR (vacía)
- VTs PO ptbr (vacía)
- PO VT Bono full Show (39 filas)
- ed son po esla (vacía)

**Observación:** La mayoría están vacías → las POs se generan bajo demanda filtrando las asignaciones con tablas dinámicas.

**PO VT Bono full Show:**
- 39 filas × 16 cols
- Contiene: VTs que trabajaron show completo → bono adicional

### 7. Datos Individuales por Vendor

**11 solapas encontradas:**
- Datos169-Ignacio Urbiztondo
- Datos168-Mati Joskowicz
- Datos167-Maximiliano Rodriguez
- ... (continúa)

**Propósito:** Track personalizado de cada vendor  
**Problema:** No escala → con 239 vendors, necesitarías 239 solapas

---

## 🎯 Modelo de Datos Propuesto

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────┐
│       CAPA 1: MAESTROS (Catálogos)      │
├─────────────────────────────────────────┤
│ • customers                             │
│ • vendors (todos los tipos)             │
│ • vendor_roles                          │
│ • rate_rules (matriz de tarifas)        │
│ • shows (catálogo de contenido)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  CAPA 2: TRANSACCIONAL (Asignaciones)   │
├─────────────────────────────────────────┤
│ • orders (números de ERP)               │
│ • order_episodes (granularidad)         │
│ • assignments (quien hace qué)          │
│ • work_items (granular: VT lines)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    CAPA 3: FINANCIERA (Liquidación)     │
├─────────────────────────────────────────┤
│ • calculated_payments (pre-PO)          │
│ • purchase_orders (POs consolidadas)    │
│ • po_line_items (detalle de PO)         │
│ • payments (control de pagos)           │
│ • duplicate_check (MD5 hash)            │
└─────────────────────────────────────────┘
```

---

## 📐 Diseño Detallado de Tablas

### CAPA 1: MAESTROS

#### 1.1 customers
```sql
customers
├── id UUID PRIMARY KEY
├── name VARCHAR(255) NOT NULL        -- 'WosDub', 'Gobavo', 'DUb-Sub'
├── company_legal_name VARCHAR(255)
├── tax_id VARCHAR(50)
├── email VARCHAR(255)
├── phone VARCHAR(20)
├── payment_terms VARCHAR(100)        -- '30 days', '50% upfront'
├── is_active BOOLEAN DEFAULT true
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ
```

#### 1.2 vendor_roles
```sql
vendor_roles
├── id UUID PRIMARY KEY
├── name VARCHAR(100) NOT NULL UNIQUE
│   -- 'Preflight', 'Adaptador', 'Editor', 'Sound Editor', 
│   -- 'Voice Talent', 'QA'
├── category VARCHAR(50)              -- 'adaptation', 'production', 'post_production'
├── description TEXT
└── created_at TIMESTAMPTZ

-- Registros iniciales:
INSERT INTO vendor_roles (name, category) VALUES
('Preflight', 'adaptation'),
('Adaptador ESLA', 'adaptation'),
('Adaptador PTBR', 'adaptation'),
('Editor', 'adaptation'),
('Voice Talent', 'production'),
('Sound Editor', 'post_production'),
('QA ESLA', 'quality'),
('QA PTBR', 'quality');
```

#### 1.3 vendors
```sql
vendors
├── id UUID PRIMARY KEY
├── vendor_code VARCHAR(20) UNIQUE    -- 'VT-010', 'AD-025', etc.
├── first_name VARCHAR(100)
├── last_name VARCHAR(100)
├── full_name VARCHAR(255) NOT NULL
├── primary_role_id UUID REFERENCES vendor_roles(id)
├── email VARCHAR(255)
├── phone VARCHAR(20)
├── whatsapp VARCHAR(20)
├── language VARCHAR(10)              -- 'ESLA', 'PTBR', 'BOTH'
├── priority INTEGER                  -- 1-4 (menor = mayor prioridad)
├── status VARCHAR(20) DEFAULT 'active'  -- 'active', 'inactive', 'on_hold'
├── default_currency VARCHAR(3)       -- 'ARS', 'USD', 'BRL'
├── default_rate DECIMAL(10,2)
├── notes TEXT
├── test_completed BOOLEAN            -- TEST EN BM?
├── qa_rating VARCHAR(20)             -- 'BUENO', 'OK', 'MISSING'
├── otd_rating VARCHAR(20)            -- On-time delivery rating
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Índices
CREATE INDEX idx_vendors_role ON vendors(primary_role_id);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_language ON vendors(language);
```

#### 1.4 rate_rules (Matriz de tarifas)
```sql
rate_rules
├── id UUID PRIMARY KEY
├── role_id UUID REFERENCES vendor_roles(id)
├── language VARCHAR(10)              -- 'ESLA', 'PTBR', 'ANY'
├── minutes_from DECIMAL(6,2)         -- Inicio de franja (0, 30.1, 60, etc.)
├── minutes_to DECIMAL(6,2)           -- Fin de franja (30, 59.9, 89.9, etc.)
├── base_rate DECIMAL(10,2) NOT NULL
├── rate_with_quality_bonus DECIMAL(10,2)
├── rate_with_monthly_bonus DECIMAL(10,2)
├── rate_with_both_bonuses DECIMAL(10,2)
├── currency VARCHAR(3) NOT NULL
├── rate_type VARCHAR(20)             -- 'per_minute', 'flat', 'per_hour', 'per_line'
├── effective_from DATE
├── effective_to DATE
├── notes TEXT
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Constraint: no overlap de franjas
CREATE UNIQUE INDEX idx_rate_rules_no_overlap 
ON rate_rules(role_id, language, minutes_from, effective_from)
WHERE effective_to IS NULL;

-- Ejemplo de registros:
INSERT INTO rate_rules (role_id, language, minutes_from, minutes_to,
                        base_rate, rate_with_quality_bonus, currency, rate_type)
VALUES
('preflight_role_id', 'ESLA', 0, 30, 400, 460, 'ARS', 'per_minute'),
('preflight_role_id', 'ESLA', 30.1, 59.9, 400, 460, 'ARS', 'per_minute'),
('adaptador_role_id', 'ESLA', 0, 30, 800, 1000, 'ARS', 'per_minute'),
('editor_role_id', 'ESLA', 0, 30, 10000, 10000, 'ARS', 'flat'),
('editor_role_id', 'ESLA', 30.1, 59.9, 16000, 16000, 'ARS', 'flat');
```

#### 1.5 vendor_exception_rates (Tarifas excepcionales)
```sql
vendor_exception_rates
├── id UUID PRIMARY KEY
├── vendor_id UUID REFERENCES vendors(id)
├── show_id UUID REFERENCES shows(id) NULL  -- NULL = aplica a cualquier show
├── rate DECIMAL(10,2) NOT NULL
├── currency VARCHAR(3) NOT NULL
├── conditions TEXT                   -- Descripción de cuándo aplica
├── effective_from DATE
├── effective_to DATE
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Ejemplo: "500 ARS para series: Suno chanda, Rah e Junoon"
INSERT INTO vendor_exception_rates (vendor_id, rate, currency, conditions)
VALUES
('andrea_jimena_baca_id', 500, 'ARS', 'Series: Suno chanda, Rah e Junoon, Hum Dono, Fairy Tale');
```

#### 1.6 shows (Catálogo de contenido)
```sql
shows
├── id UUID PRIMARY KEY
├── title VARCHAR(255) NOT NULL
├── original_title VARCHAR(255)
├── type VARCHAR(50)                  -- 'Microdrama/Short', 'Soap Opera', 'Series', 'Film'
├── genre VARCHAR(100)
├── total_episodes INTEGER
├── average_duration INTERVAL
├── metadata JSONB                    -- Info flexible adicional
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Índice de búsqueda
CREATE INDEX idx_shows_title ON shows USING gin(to_tsvector('spanish', title));
```

### CAPA 2: TRANSACCIONAL

#### 2.1 orders (Órdenes del ERP)
```sql
orders
├── id UUID PRIMARY KEY
├── order_number VARCHAR(50) NOT NULL UNIQUE  -- 'O-45762'
├── customer_id UUID REFERENCES customers(id)
├── show_id UUID REFERENCES shows(id)
├── language VARCHAR(10) NOT NULL     -- 'ESLA', 'PTBR'
├── total_episodes INTEGER
├── status VARCHAR(50)
│   -- 'pending', 'in_adaptation', 'in_production', 
│   -- 'in_post', 'completed', 'delivered', 'cancelled'
├── start_date DATE
├── deadline_adaptation DATE
├── deadline_vts DATE
├── deadline_sound_edt DATE
├── delivery_client DATE
├── gross_duration INTERVAL
├── invoiceable_minutes DECIMAL(10,2)
├── comments TEXT
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Índices
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_show ON orders(show_id);
CREATE INDEX idx_orders_status ON orders(status);
```

#### 2.2 order_episodes (Granularidad por episodio)
```sql
order_episodes
├── id UUID PRIMARY KEY
├── order_id UUID REFERENCES orders(id)
├── episode_number VARCHAR(20)        -- '1', '2-60', 'Promo', 'Generic'
├── duration INTERVAL
├── minutes DECIMAL(10,2)
├── status VARCHAR(50)
├── ready BOOLEAN DEFAULT false
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

CREATE INDEX idx_episodes_order ON order_episodes(order_id);
```

#### 2.3 assignments (Asignación de trabajo)
```sql
assignments
├── id UUID PRIMARY KEY
├── order_id UUID REFERENCES orders(id)
├── order_episode_id UUID REFERENCES order_episodes(id) NULL
├── vendor_id UUID REFERENCES vendors(id)
├── role_id UUID REFERENCES vendor_roles(id)
├── phase VARCHAR(50)
│   -- 'preflight', 'adaptation', 'editing', 'voice_recording', 
│   -- 'sound_editing', 'qa'
├── assigned_date DATE
├── start_date DATE
├── delivery_date DATE
├── actual_delivery_date DATE
├── status VARCHAR(50)
│   -- 'assigned', 'in_progress', 'delivered', 'approved', 'rejected'
├── assigned_minutes DECIMAL(10,2)
├── actual_minutes DECIMAL(10,2)
├── quality_bonus_eligible BOOLEAN DEFAULT false
├── monthly_bonus_eligible BOOLEAN DEFAULT false
├── has_exception_rate BOOLEAN DEFAULT false
├── exception_rate_id UUID REFERENCES vendor_exception_rates(id) NULL
├── payment_month VARCHAR(7)          -- 'YYYY-MM' (ej: '2025-09')
├── notes TEXT
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Índices
CREATE INDEX idx_assignments_order ON assignments(order_id);
CREATE INDEX idx_assignments_vendor ON assignments(vendor_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_payment_month ON assignments(payment_month);
CREATE INDEX idx_assignments_phase ON assignments(phase);

-- Constraint: no duplicar asignación
CREATE UNIQUE INDEX idx_assignments_unique 
ON assignments(order_episode_id, vendor_id, role_id, phase)
WHERE status NOT IN ('cancelled', 'rejected');
```

#### 2.4 work_items (Granularidad VT por líneas)
```sql
work_items
├── id UUID PRIMARY KEY
├── assignment_id UUID REFERENCES assignments(id)
├── order_episode_id UUID REFERENCES order_episodes(id)
├── vendor_id UUID REFERENCES vendors(id)  -- Denormalizado para queries
├── item_type VARCHAR(50)             -- 'voice_lines', 'sound_editing_loop', etc.
├── quantity INTEGER                  -- Ej: 12 líneas, 20 loops
├── unit_rate DECIMAL(10,2)
├── currency VARCHAR(3)
├── subtotal DECIMAL(12,2)
├── quality_bonus DECIMAL(12,2) DEFAULT 0
├── monthly_bonus DECIMAL(12,2) DEFAULT 0
├── full_show_bonus DECIMAL(12,2) DEFAULT 0
├── total DECIMAL(12,2)
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

CREATE INDEX idx_work_items_assignment ON work_items(assignment_id);
CREATE INDEX idx_work_items_vendor ON work_items(vendor_id);
```

### CAPA 3: FINANCIERA

#### 3.1 calculated_payments (Pre-PO, agregaciones)
```sql
calculated_payments
├── id UUID PRIMARY KEY
├── vendor_id UUID REFERENCES vendors(id)
├── payment_month VARCHAR(7)          -- 'YYYY-MM'
├── role_id UUID REFERENCES vendor_roles(id)
├── currency VARCHAR(3)
├── total_assignments INTEGER
├── total_minutes DECIMAL(10,2)
├── total_lines INTEGER               -- Para VTs
├── subtotal DECIMAL(14,2)
├── quality_bonus_total DECIMAL(14,2)
├── monthly_bonus_total DECIMAL(14,2)
├── full_show_bonus_total DECIMAL(14,2)
├── grand_total DECIMAL(14,2)
├── po_generated BOOLEAN DEFAULT false
├── po_id UUID REFERENCES purchase_orders(id) NULL
├── calculated_at TIMESTAMPTZ
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Índice único: un cálculo por vendor/mes/rol
CREATE UNIQUE INDEX idx_calc_payments_unique
ON calculated_payments(vendor_id, payment_month, role_id, currency);
```

#### 3.2 purchase_orders
```sql
purchase_orders
├── id UUID PRIMARY KEY
├── po_number VARCHAR(50) UNIQUE NOT NULL  -- 'PO-2025-09-001'
├── vendor_id UUID REFERENCES vendors(id)
├── payment_month VARCHAR(7)          -- 'YYYY-MM'
├── currency VARCHAR(3)
├── subtotal DECIMAL(14,2)
├── bonuses DECIMAL(14,2)
├── total DECIMAL(14,2)
├── status VARCHAR(50)
│   -- 'draft', 'pending_approval', 'approved', 'sent_to_erp', 
│   -- 'paid', 'cancelled'
├── generated_at TIMESTAMPTZ
├── approved_by UUID REFERENCES users(id) NULL
├── approved_at TIMESTAMPTZ
├── sent_to_erp_at TIMESTAMPTZ
├── paid_at TIMESTAMPTZ
├── pdf_url VARCHAR(500)
├── erp_reference VARCHAR(100)        -- ID en el ERP
├── notes TEXT
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_month ON purchase_orders(payment_month);
```

#### 3.3 po_line_items
```sql
po_line_items
├── id UUID PRIMARY KEY
├── po_id UUID REFERENCES purchase_orders(id)
├── assignment_id UUID REFERENCES assignments(id) NULL
├── work_item_id UUID REFERENCES work_items(id) NULL
├── description VARCHAR(500) NOT NULL
├── order_number VARCHAR(50)          -- Referencia al order
├── show_title VARCHAR(255)
├── episode VARCHAR(20)
├── quantity DECIMAL(10,2)            -- Minutos o líneas
├── unit VARCHAR(20)                  -- 'minutes', 'lines', 'flat', 'hours'
├── unit_price DECIMAL(10,2)
├── amount DECIMAL(12,2)
├── line_order INTEGER                -- Para ordenar líneas en PO
├── created_at TIMESTAMPTZ

CREATE INDEX idx_po_items_po ON po_line_items(po_id);
CREATE INDEX idx_po_items_assignment ON po_line_items(assignment_id);
```

#### 3.4 payments (Registro de pagos)
```sql
payments
├── id UUID PRIMARY KEY
├── po_id UUID REFERENCES purchase_orders(id)
├── vendor_id UUID REFERENCES vendors(id)  -- Denormalizado
├── amount DECIMAL(14,2)
├── currency VARCHAR(3)
├── payment_date DATE
├── payment_method VARCHAR(50)        -- 'bank_transfer', 'check', etc.
├── reference_number VARCHAR(100)
├── payment_hash VARCHAR(64)          -- MD5 para detectar duplicados
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

-- Constraint: detectar duplicados
CREATE INDEX idx_payments_hash ON payments(payment_hash);
```

#### 3.5 duplicate_detection (Vista materializada)
```sql
CREATE MATERIALIZED VIEW duplicate_payments AS
SELECT
    vendor_id,
    order_number,
    payment_month,
    COUNT(*) as payment_count,
    SUM(amount) as total_paid,
    ARRAY_AGG(po_id) as po_ids
FROM (
    SELECT
        pol.po_id,
        po.vendor_id,
        pol.order_number,
        po.payment_month,
        pol.amount
    FROM po_line_items pol
    JOIN purchase_orders po ON pol.po_id = po.id
) sub
GROUP BY vendor_id, order_number, payment_month
HAVING COUNT(*) > 1;

-- Refresh diario
CREATE INDEX idx_dup_payments ON duplicate_payments(vendor_id, order_number);
```

---

## ⚙️ Lógica de Negocio Clave

### Cálculo de Tarifas

```sql
CREATE OR REPLACE FUNCTION calculate_assignment_payment(
    p_assignment_id UUID
) RETURNS TABLE (
    subtotal DECIMAL(12,2),
    quality_bonus DECIMAL(12,2),
    monthly_bonus DECIMAL(12,2),
    total DECIMAL(12,2)
) AS $$
DECLARE
    v_vendor_id UUID;
    v_role_id UUID;
    v_minutes DECIMAL(10,2);
    v_has_exception BOOLEAN;
    v_exception_rate_id UUID;
    v_quality_eligible BOOLEAN;
    v_monthly_eligible BOOLEAN;
    v_base_rate DECIMAL(10,2);
    v_rate_with_quality DECIMAL(10,2);
    v_rate_with_monthly DECIMAL(10,2);
    v_currency VARCHAR(3);
BEGIN
    -- Obtener datos del assignment
    SELECT
        vendor_id, role_id, actual_minutes,
        has_exception_rate, exception_rate_id,
        quality_bonus_eligible, monthly_bonus_eligible
    INTO
        v_vendor_id, v_role_id, v_minutes,
        v_has_exception, v_exception_rate_id,
        v_quality_eligible, v_monthly_eligible
    FROM assignments
    WHERE id = p_assignment_id;
    
    -- Si tiene tarifa excepcional, usar esa
    IF v_has_exception THEN
        SELECT rate, currency 
        INTO v_base_rate, v_currency
        FROM vendor_exception_rates
        WHERE id = v_exception_rate_id;
        
        subtotal := v_base_rate * v_minutes;
        quality_bonus := 0;
        monthly_bonus := 0;
    ELSE
        -- Buscar tarifa en rate_rules según franjas
        SELECT
            base_rate,
            rate_with_quality_bonus,
            rate_with_monthly_bonus,
            currency
        INTO
            v_base_rate,
            v_rate_with_quality,
            v_rate_with_monthly,
            v_currency
        FROM rate_rules
        WHERE role_id = v_role_id
          AND v_minutes BETWEEN minutes_from AND minutes_to
          AND (effective_to IS NULL OR effective_to >= CURRENT_DATE);
        
        -- Calcular subtotal
        subtotal := v_base_rate * v_minutes;
        
        -- Calcular bonos
        IF v_quality_eligible THEN
            quality_bonus := (v_rate_with_quality - v_base_rate) * v_minutes;
        ELSE
            quality_bonus := 0;
        END IF;
        
        IF v_monthly_eligible THEN
            monthly_bonus := (v_rate_with_monthly - v_base_rate) * v_minutes;
        ELSE
            monthly_bonus := 0;
        END IF;
    END IF;
    
    -- Total
    total := subtotal + quality_bonus + monthly_bonus;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
```

### Detección de Duplicados

```sql
-- Query instantánea
SELECT * FROM duplicate_payments;

-- O con hash:
SELECT vendor_id, COUNT(*)
FROM payments 
WHERE payment_hash = MD5(vendor_id || order_number || amount)
GROUP BY vendor_id, payment_hash 
HAVING COUNT(*) > 1;
```

---

## 🚀 Ventajas del Nuevo Diseño

### 1. Eliminación de Fórmulas Frágiles
- ✓ Lógica en funciones SQL/stored procedures
- ✓ Testeable y versionable
- ✓ No se rompe con cambios

### 2. Detección de Pagos Duplicados
- ✓ Vista materializada automática
- ✓ Hash MD5 para comparación rápida
- ✓ Alertas proactivas

### 3. Escalabilidad
- ✓ No hay límite de vendors (vs. 239 solapas individuales)
- ✓ Queries optimizados con índices
- ✓ Agregaciones en vista materializada

### 4. Auditoría Completa
- ✓ `created_at`, `updated_at` en todas las tablas
- ✓ Soft deletes donde aplique
- ✓ Track de quién aprobó qué

### 5. Flexibilidad
- ✓ Tarifas excepcionales por show específico
- ✓ Múltiples monedas
- ✓ JSONB para metadata variable
- ✓ Fácil agregar nuevos roles

---

## 📊 Queries de Reporte

### Dashboard Principal
```sql
-- Vista de proyectos activos
SELECT
    o.order_number,
    c.name as customer,
    s.title as show,
    o.language,
    o.status,
    COUNT(DISTINCT a.id) FILTER (WHERE a.phase = 'adaptation') as adaptacion_count,
    MAX(a.delivery_date) FILTER (WHERE a.phase = 'adaptation') as deadline_adaptacion,
    COUNT(DISTINCT a.id) FILTER (WHERE a.phase = 'voice_recording') as vts_count,
    MAX(a.delivery_date) FILTER (WHERE a.phase = 'sound_editing') as deadline_sound
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN shows s ON o.show_id = s.id
LEFT JOIN assignments a ON o.id = a.order_id
WHERE o.status NOT IN ('completed', 'cancelled')
GROUP BY o.id, c.name, s.title, o.language, o.status;
```

### Liquidación Mensual por Vendor
```sql
-- Ver qué se le debe pagar a un vendor en un mes
SELECT
    v.full_name,
    a.payment_month,
    COUNT(*) as total_trabajos,
    SUM(a.actual_minutes) as total_minutos,
    SUM((calculate_assignment_payment(a.id)).subtotal) as subtotal,
    SUM((calculate_assignment_payment(a.id)).quality_bonus) as bono_calidad,
    SUM((calculate_assignment_payment(a.id)).monthly_bonus) as bono_mensual,
    SUM((calculate_assignment_payment(a.id)).total) as total_a_pagar
FROM assignments a
JOIN vendors v ON a.vendor_id = v.id
WHERE a.payment_month = '2025-09'
  AND a.status = 'delivered'
  AND v.id = <vendor_id>
GROUP BY v.full_name, a.payment_month;
```

### POs Pendientes de Aprobación
```sql
SELECT
    po.po_number,
    v.full_name as vendor,
    po.payment_month,
    po.total,
    po.currency,
    po.generated_at,
    COUNT(pol.id) as line_items_count
FROM purchase_orders po
JOIN vendors v ON po.vendor_id = v.id
LEFT JOIN po_line_items pol ON po.id = pol.po_id
WHERE po.status = 'pending_approval'
GROUP BY po.id, v.full_name;
```

---

## 🎯 Plan de Migración

### Fase 1: Carga de Maestros (1 semana)
1. Importar customers desde Dashboard
2. Importar vendors desde solapas Adaptadores/VTs/Ed Sonido
3. Crear vendor_roles
4. Mapear rate_rules desde "Tabla Tarifas"
5. Parsear y cargar vendor_exception_rates desde NOTAS

### Fase 2: Carga de Transacciones (2 semanas)
1. Importar orders desde Dashboard
2. Crear order_episodes desde Adaptación/Producción
3. Importar assignments desde Adaptación (fase adaptación)
4. Importar assignments desde Producción ESLA/PTBR (fases producción/post)
5. Importar work_items (líneas de VT) desde Producción

### Fase 3: Generación de POs (1 semana)
1. Calcular calculated_payments para mes actual
2. Generar purchase_orders con función
3. Validar contra Excel existente
4. Ajustar lógica de cálculo si necesario

### Fase 4: Interfaz Web (3-4 semanas)
1. Dashboard con status de órdenes
2. Asignación de trabajo (formularios)
3. Seguimiento de deliveries
4. Generación y aprobación de POs
5. Detección de duplicados

---

## 💡 Recomendaciones Adicionales

### Stack Tecnológico Sugerido
- **Backend:** Node.js + TypeScript + Express
- **ORM:** Prisma (excelente con PostgreSQL)
- **DB:** PostgreSQL 15+
- **Frontend:** React + TypeScript + Tailwind
- **Hosting:** Railway / Vercel (frontend) + Supabase (DB)

### Features Críticas MVP
- ✓ Asignación de trabajo (reemplazo de Excel)
- ✓ Cálculo automático de tarifas
- ✓ Generación de POs con un click
- ✓ Detección de duplicados
- ✓ Vista de vendor por mes (reemplazo de solapas individuales)

### Features Nice-to-Have
- Notificaciones por email a vendors
- Dashboard con KPIs (OTD, quality ratings)
- Integración directa con ERP
- App móvil para vendors (ver sus asignaciones)

---

## 🎬 Conclusión

El Excel actual es un héroe que llegó a su límite. Con 3,264+ asignaciones y necesidad de generar POs multiplicadas, el sistema de fórmulas y tablas dinámicas es insostenible.

**El diseño de BD propuesto:**
- ✅ Normaliza la data eliminando redundancia
- ✅ Automatiza cálculos complejos con funciones SQL
- ✅ Escala sin límite de vendors o proyectos
- ✅ Previene pagos duplicados con constraints y hashes
- ✅ Audita cada cambio con timestamps

**Siguiente paso:** Validar este diseño con el cliente y comenzar con MVP enfocado en:
1. Asignación
2. Seguimiento
3. Liquidación
4. Detección de duplicados

---

## ❓ Preguntas para Iterar

1. ¿Las tarifas excepcionales siempre son por show, o pueden ser por tipo de trabajo?
2. ¿El bono "full show" se paga cuando el vendor trabaja en TODOS los episodios?
3. ¿Necesitan multi-moneda en POs o se convierte todo a una moneda base?
4. ¿Hay aprobación workflow (PM aprueba → Finance aprueba → paga)?
