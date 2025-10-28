# Guía del Constructor de KPIs - Actualizada

## 🎯 **Tipos de Cálculo Disponibles**

El sistema ahora soporta dos tipos de cálculo para KPIs:

### **1. Automático (`predefined`)**
- **Descripción:** Conteos simples sin configuración adicional
- **Cuándo usar:** Para métricas básicas como "Total de grupos", "Total de usuarios"
- **Campos requeridos:** Solo información básica (nombre, código, unidad, modelo base)
- **Campos opcionales:** No requiere configuración de campos específicos

### **2. Personalizado (`custom_fields`)**
- **Descripción:** Con filtros y operaciones específicas
- **Cuándo usar:** Para KPIs complejos como "Grupos activos por sede", "Promedio de inscritos"
- **Campos requeridos:** Información básica + configuración de campos
- **Campos opcionales:** Relaciones matemáticas entre campos

---

## 📋 **Campos del Formulario**

### **Información Básica (Paso 1)**

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| **Nombre** | Texto | ✅ | Nombre descriptivo del KPI | "Total de Grupos Activos" |
| **Código** | Texto | ✅ | Identificador único (solo minúsculas, números, guiones bajos) | "total_grupos_activos" |
| **Descripción** | Texto | ❌ | Descripción detallada del KPI | "Conteo de grupos con estado activo" |
| **Unidad** | Texto | ✅ | Unidad de medida | "grupos", "estudiantes", "porcentaje" |
| **Tipo de Cálculo** | Select | ✅ | Automático o Personalizado | "predefined" o "custom_fields" |
| **Modelo Base** | Select | ✅ | Modelo de datos a utilizar | "Grupos", "Usuarios", "Módulos" |
| **Período por Defecto** | Select | ✅ | Frecuencia de cálculo | "monthly", "weekly", "daily" |

### **Configuración de Campos (Paso 2 - Solo para Personalizado)**

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| **Campo** | Select | ✅ | Campo del modelo a utilizar | "status", "inscritos", "sede_id" |
| **Nombre para Mostrar** | Texto | ✅ | Nombre amigable del campo | "Estado", "Inscritos", "Sede" |
| **Tipo de Campo** | Select | ✅ | Tipo de dato del campo | "numeric", "string", "date" |
| **Operación** | Select | ✅ | Operación a realizar | "count", "sum", "avg", "where" |
| **Operador** | Select | ❌ | Operador para filtros | "=", ">", "<", "LIKE" |
| **Valor** | Texto | ❌ | Valor para filtros | "1", "activo", "2024" |
| **Orden** | Número | ✅ | Orden de ejecución | 1, 2, 3... |

### **Relaciones Matemáticas (Paso 3 - Solo para Personalizado)**

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| **Campo 1** | Select | ✅ | Primer campo de la relación | Campo "inscritos" |
| **Operación** | Select | ✅ | Operación matemática | "+", "-", "*", "/", "%" |
| **Campo 2** | Select | ✅ | Segundo campo de la relación | Campo "capacidad" |
| **Orden** | Número | ✅ | Orden de ejecución | 1, 2, 3... |
| **Descripción** | Texto | ❌ | Descripción de la relación | "Suma de inscritos y capacidad" |

---

## 🎨 **Ejemplos de Uso**

### **Ejemplo 1: KPI Automático**
```javascript
// Configuración para "Total de Grupos"
{
  name: "Total de Grupos",
  code: "total_grupos",
  description: "Número total de grupos en el sistema",
  unit: "grupos",
  calculation_type: "predefined",
  base_model: 1, // ID del modelo Grupos
  default_period_type: "monthly",
  use_custom_time_range: false,
  is_active: true
}
```

**Resultado:** El sistema automáticamente contará todos los grupos del modelo especificado.

### **Ejemplo 2: KPI Personalizado - Conteo con Filtro**
```javascript
// Configuración para "Grupos Activos"
{
  name: "Grupos Activos",
  code: "grupos_activos",
  description: "Número de grupos con estado activo",
  unit: "grupos",
  calculation_type: "custom_fields",
  base_model: 1,
  default_period_type: "monthly",
  use_custom_time_range: false,
  is_active: true,
  kpi_fields: [
    {
      field_name: "status",
      display_name: "Estado",
      field_type: "numeric",
      operation: "where",
      operator: "=",
      value: "1", // 1 = activo
      is_required: true,
      order: 1
    },
    {
      field_name: "id",
      display_name: "ID",
      field_type: "numeric",
      operation: "count",
      is_required: true,
      order: 2
    }
  ]
}
```

**Resultado:** Contará solo los grupos que tengan `status = 1`.

### **Ejemplo 3: KPI Personalizado - Suma de Valores**
```javascript
// Configuración para "Total de Inscritos"
{
  name: "Total de Inscritos",
  code: "total_inscritos",
  description: "Suma total de inscritos en todos los grupos",
  unit: "estudiantes",
  calculation_type: "custom_fields",
  base_model: 1,
  default_period_type: "monthly",
  kpi_fields: [
    {
      field_name: "inscritos",
      display_name: "Inscritos",
      field_type: "numeric",
      operation: "sum",
      is_required: true,
      order: 1
    }
  ]
}
```

**Resultado:** Sumará todos los valores del campo `inscritos`.

### **Ejemplo 4: KPI Personalizado - Promedio con Filtros**
```javascript
// Configuración para "Promedio de Inscritos por Grupo Activo"
{
  name: "Promedio de Inscritos por Grupo Activo",
  code: "promedio_inscritos_activos",
  description: "Promedio de inscritos en grupos activos",
  unit: "estudiantes",
  calculation_type: "custom_fields",
  base_model: 1,
  default_period_type: "monthly",
  kpi_fields: [
    {
      field_name: "status",
      display_name: "Estado",
      field_type: "numeric",
      operation: "where",
      operator: "=",
      value: "1", // Solo grupos activos
      is_required: true,
      order: 1
    },
    {
      field_name: "inscritos",
      display_name: "Inscritos",
      field_type: "numeric",
      operation: "avg",
      is_required: true,
      order: 2
    }
  ]
}
```

**Resultado:** Calculará el promedio de inscritos solo en grupos activos.

---

## 🔧 **Operaciones Disponibles**

### **Operaciones Principales**
| Operación | Descripción | Ejemplo de Uso |
|-----------|-------------|----------------|
| **`count`** | Contar registros | Total de grupos |
| **`sum`** | Sumar valores | Total de inscritos |
| **`avg`** | Promedio | Promedio de inscritos |
| **`min`** | Valor mínimo | Mínimo de inscritos |
| **`max`** | Valor máximo | Máximo de inscritos |

### **Operaciones de Filtro**
| Operación | Descripción | Ejemplo de Uso |
|-----------|-------------|----------------|
| **`where`** | Filtrar por condición | Solo grupos activos |
| **`group_by`** | Agrupar por campo | Agrupar por sede |

### **Operadores de Filtro**
| Operador | Descripción | Ejemplo |
|----------|-------------|---------|
| **`=`** | Igual a | `status = 1` |
| **`!=`** | Diferente de | `status != 0` |
| **`>`** | Mayor que | `inscritos > 10` |
| **`<`** | Menor que | `inscritos < 50` |
| **`>=`** | Mayor o igual que | `inscritos >= 20` |
| **`<=`** | Menor o igual que | `inscritos <= 30` |
| **`LIKE`** | Contiene | `nombre LIKE '%activo%'` |
| **`IN`** | En la lista | `sede_id IN (1,2,3)` |

---

## 🎯 **Flujo de Trabajo**

### **Para KPIs Automáticos:**
1. **Paso 1:** Completar información básica
2. **Paso 2:** Confirmar configuración automática
3. **Paso 3:** Revisar y crear

### **Para KPIs Personalizados:**
1. **Paso 1:** Completar información básica
2. **Paso 2:** Configurar campos y operaciones
3. **Paso 3:** Configurar relaciones matemáticas (opcional)
4. **Paso 4:** Revisar y crear

---

## ✅ **Validaciones**

### **Validaciones Básicas**
- **Nombre:** Obligatorio, mínimo 3 caracteres
- **Código:** Obligatorio, solo minúsculas, números y guiones bajos
- **Unidad:** Obligatorio
- **Tipo de Cálculo:** Obligatorio
- **Modelo Base:** Obligatorio
- **Período:** Obligatorio

### **Validaciones para Personalizado**
- **Campos:** Mínimo 1 campo requerido
- **Operación Principal:** Debe tener al menos una operación principal (count, sum, avg, min, max)
- **Filtros:** Si se usa `where`, debe especificar operador y valor

### **Validaciones de Relaciones**
- **Campos:** Deben existir campos configurados
- **Operación:** Debe ser una operación matemática válida
- **Orden:** Debe ser único para cada relación

---

## 🚀 **Mejoras Implementadas**

### **Nuevas Características:**
1. **Tipos de Cálculo:** Automático vs Personalizado
2. **Interfaz Adaptativa:** Se adapta según el tipo seleccionado
3. **Validación Inteligente:** Diferentes validaciones según el tipo
4. **Ejemplos Visuales:** Ayuda contextual en cada campo
5. **Flujo Optimizado:** Menos pasos para KPIs simples

### **Mejoras de UX:**
1. **Texto de Ayuda:** Explicaciones claras para cada campo
2. **Validación en Tiempo Real:** Errores mostrados inmediatamente
3. **Navegación Intuitiva:** Botones adaptativos según el contexto
4. **Información Contextual:** Detalles del KPI en cada paso

---

## 📝 **Notas Importantes**

1. **KPIs Automáticos:** No requieren configuración de campos, ideal para casos simples
2. **KPIs Personalizados:** Requieren al menos un campo con operación principal
3. **Relaciones:** Son opcionales, incluso con múltiples campos
4. **Validación:** El sistema valida automáticamente según el tipo seleccionado
5. **Compatibilidad:** Mantiene compatibilidad con KPIs existentes

---

## 🔍 **Troubleshooting**

### **Error: "El tipo de cálculo es obligatorio"**
- **Causa:** No se ha seleccionado un tipo de cálculo
- **Solución:** Seleccionar "Automático" o "Personalizado" en el Paso 1

### **Error: "Debe agregar al menos un campo"**
- **Causa:** Se seleccionó "Personalizado" pero no hay campos configurados
- **Solución:** Agregar al menos un campo en el Paso 2

### **Error: "Debe tener al menos una operación principal"**
- **Causa:** Los campos configurados solo tienen filtros, no operaciones principales
- **Solución:** Agregar un campo con operación count, sum, avg, min o max

### **Error: "El código solo puede contener letras minúsculas, números y guiones bajos"**
- **Causa:** El código contiene caracteres no permitidos
- **Solución:** Usar solo minúsculas, números y guiones bajos (ej: `total_grupos_activos`)
