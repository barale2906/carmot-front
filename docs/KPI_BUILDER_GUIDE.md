# 🏗️ Constructor de KPIs - Carmot Frontend

## 📋 **Descripción General**

El Constructor de KPIs es un wizard paso a paso que permite crear indicadores clave de rendimiento de manera intuitiva y estructurada. Está diseñado para guiar al usuario a través del proceso completo de configuración de un KPI.

## 🎯 **Características Principales**

### **Wizard de 4 Pasos**
1. **Información Básica** - Datos principales del KPI
2. **Configuración de Campos** - Selección y configuración de campos de datos
3. **Relaciones Matemáticas** - Operaciones entre campos
4. **Revisar y Crear** - Confirmación final

### **Funcionalidades Avanzadas**
- ✅ **Validación en tiempo real** de formularios
- ✅ **Modales interactivos** para campos y relaciones
- ✅ **Vista previa** de fórmulas matemáticas
- ✅ **Navegación fluida** entre pasos
- ✅ **Diseño responsivo** para todos los dispositivos

## 🏗️ **Arquitectura del Constructor**

### **Componentes Principales**

#### **1. CreateKPI.vue**
- **Ubicación:** `src/views/kpi/CreateKPI.vue`
- **Propósito:** Vista principal del wizard
- **Responsabilidades:**
  - Gestión del estado del wizard
  - Navegación entre pasos
  - Validación de formularios
  - Integración con servicios

#### **2. FieldModal.vue**
- **Ubicación:** `src/components/kpi/FieldModal.vue`
- **Propósito:** Modal para agregar campos
- **Características:**
  - Selección de campos del modelo
  - Configuración de operaciones
  - Filtros y agrupaciones
  - Validación de datos

#### **3. RelationModal.vue**
- **Ubicación:** `src/components/kpi/RelationModal.vue`
- **Propósito:** Modal para agregar relaciones
- **Características:**
  - Selección de campos para relación
  - Operaciones matemáticas
  - Vista previa de fórmulas
  - Validación de orden

## 📊 **Flujo del Constructor**

### **Paso 1: Información Básica**
```javascript
// Datos requeridos
{
  name: "Ventas Mensuales",
  code: "VENTAS_MENSUALES", 
  description: "Total de ventas del mes",
  unit: "USD",
  base_model: 1,
  default_period_type: "monthly"
}
```

**Validaciones:**
- Nombre único y descriptivo
- Código único (formato: MAYUSCULAS_CON_GUIONES)
- Unidad de medida clara
- Modelo base seleccionado
- Período por defecto definido

### **Paso 2: Configuración de Campos**
```javascript
// Estructura de campo
{
  field_name: "amount",
  display_name: "Total de Ventas",
  operation: "sum",
  filter_condition: "status = 'completed'",
  group_by_field: "category",
  order: 1
}
```

**Operaciones Disponibles:**
- `sum` - Suma de valores
- `count` - Conteo de registros
- `avg` - Promedio de valores
- `min` - Valor mínimo
- `max` - Valor máximo
- `distinct` - Valores únicos

**Manejo de Campos:**
- El sistema maneja internamente el `name` del campo pero muestra el `display_name` en la interfaz
- Al seleccionar un campo, se auto-completa el `display_name` si está vacío
- Se envía al backend el `name` para la lógica de negocio

### **Paso 3: Relaciones Matemáticas (Opcional)**
```javascript
// Estructura de relación
{
  field1_id: 1,
  operation: "+",
  field2_id: 2,
  order: 1,
  description: "Suma de ventas y comisiones"
}
```

**Operaciones Matemáticas:**
- `+` - Suma
- `-` - Resta
- `*` - Multiplicación
- `/` - División
- `%` - Módulo

**Nota:** Las relaciones son opcionales. Si solo tienes un campo, puedes continuar sin agregar relaciones.

### **Paso 4: Revisar y Crear**
- Resumen completo de la configuración
- Validación final de datos
- Creación del KPI en el backend

## 🔧 **Implementación Técnica**

### **Estado del Wizard**
```javascript
const currentStep = ref(0)
const steps = [
  { id: 'basic', title: 'Información Básica', description: 'Datos principales' },
  { id: 'fields', title: 'Configurar Campos', description: 'Seleccionar campos' },
  { id: 'relations', title: 'Relaciones', description: 'Operaciones matemáticas' },
  { id: 'review', title: 'Revisar', description: 'Confirmar configuración' }
]
```

### **Validación de Pasos**
```javascript
const isStepValid = (step) => {
  switch (step) {
    case 0: return kpiData.name && kpiData.code && kpiData.unit && kpiData.base_model
    case 1: return kpiFields.value.length > 0
    case 2: return kpiFields.value.length > 0 // Las relaciones son opcionales
    case 3: return true
    default: return false
  }
}
```

### **Gestión de Estado Temporal**
```javascript
// Campos temporales antes de crear el KPI
const addKPIField = async (kpiId, fieldData) => {
  if (!kpiId) {
    const tempField = {
      id: Date.now(),
      ...fieldData,
      created_at: new Date().toISOString()
    }
    kpiFields.value.push(tempField)
    return { success: true, data: tempField }
  }
  // ... resto de la lógica
}
```

## 🎨 **Diseño y UX**

### **Características de Diseño**
- **Wizard Visual:** Indicadores de progreso claros
- **Navegación Intuitiva:** Botones anterior/siguiente
- **Estados Visuales:** Pasos completados, activos y pendientes
- **Feedback Inmediato:** Validación en tiempo real
- **Responsive:** Adaptable a móviles y tablets

### **Estados del Wizard**
```css
.step.active .step-number {
  background: #667eea;
  color: white;
}

.step.completed .step-number {
  background: #48bb78;
  color: white;
}

.step.disabled .step-number {
  background: #e2e8f0;
  color: #a0aec0;
}
```

## 🔄 **Integración con Servicios**

### **Servicios Utilizados**
- **`kpiMetadataService`** - Metadatos de modelos y campos
- **`kpiService`** - CRUD de KPIs
- **`useKPIs`** - Composable para gestión de estado

### **Flujo de Datos**
```
CreateKPI.vue
    ↓
useKPIs composable
    ↓
kpiStore (Pinia)
    ↓
kpiService / kpiMetadataService
    ↓
API Backend
```

## 📱 **Responsive Design**

### **Breakpoints**
- **Desktop:** `> 768px` - Layout completo
- **Tablet:** `≤ 768px` - Wizard en columna
- **Mobile:** `≤ 480px` - Modales adaptados

### **Adaptaciones Móviles**
- Wizard steps en columna vertical
- Modales de pantalla completa
- Botones de acción apilados
- Formularios optimizados para touch

## 🧪 **Testing y Validación**

### **Casos de Prueba**
1. **Navegación del wizard** - Todos los pasos
2. **Validación de formularios** - Campos requeridos
3. **Modales** - Apertura y cierre
4. **Creación de KPI** - Flujo completo
5. **Responsive** - Diferentes dispositivos

### **Validaciones Implementadas**
- Campos requeridos en cada paso
- Unicidad de códigos de KPI
- Validación de operaciones matemáticas
- Verificación de campos en relaciones

## 🚀 **Próximas Mejoras**

### **Funcionalidades Planificadas**
- [ ] **Plantillas de KPIs** - KPIs predefinidos
- [ ] **Importar/Exportar** - Configuraciones
- [ ] **Validación avanzada** - Reglas de negocio
- [ ] **Historial de cambios** - Versionado
- [ ] **Colaboración** - Múltiples usuarios

### **Optimizaciones**
- [ ] **Lazy loading** - Carga bajo demanda
- [ ] **Caché inteligente** - Metadatos
- [ ] **Validación offline** - Sin conexión
- [ ] **Autoguardado** - Borrador automático

## 📚 **Documentación Relacionada**

- **[Guía de KPIs](docs/TESTING_GUIDE.md)** - Testing del sistema
- **[API Documentation](api_carmot.json)** - Endpoints disponibles
- **[Arquitectura](src/views/README.md)** - Estructura del proyecto

---

**Última actualización:** Octubre 2024  
**Versión:** 1.0.0
