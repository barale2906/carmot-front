# 📁 Estructura de Vistas - Carmot Frontend

## 🗂️ **Organización por Módulos**

Las vistas están organizadas por módulos funcionales para facilitar el mantenimiento y desarrollo:

```
src/views/
├── auth/                    # 🔐 Módulo de Autenticación
│   └── Login.vue           # Página de inicio de sesión
├── dashboard/              # 📊 Módulo de Dashboard
│   └── Dashboard.vue       # Dashboard principal
├── kpi/                    # 📈 Módulo de KPIs
│   ├── KPIs.vue           # Lista de KPIs
│   ├── CreateKPI.vue      # Crear nuevo KPI
│   └── EditKPI.vue        # Editar KPI existente
└── common/                 # 🔧 Vistas Comunes
    └── NotFound.vue        # Página 404
```

## 📋 **Descripción de Módulos**

### **🔐 auth/ - Autenticación**
- **Propósito:** Manejo de autenticación y autorización
- **Vistas:**
  - `Login.vue` - Formulario de inicio de sesión
- **Características:**
  - Validación de formularios
  - Manejo de errores
  - Diseño responsivo
  - Integración con API

### **📊 dashboard/ - Dashboard**
- **Propósito:** Panel principal de control y visualización
- **Vistas:**
  - `Dashboard.vue` - Dashboard principal con estadísticas
- **Características:**
  - Información del usuario
  - Estadísticas generales
  - Navegación rápida
  - Acciones principales

### **📈 kpi/ - Indicadores de Rendimiento**
- **Propósito:** Gestión completa de KPIs
- **Vistas:**
  - `KPIs.vue` - Lista y gestión de KPIs
  - `CreateKPI.vue` - Constructor de nuevos KPIs
  - `EditKPI.vue` - Editor de KPIs existentes
- **Características:**
  - CRUD completo de KPIs
  - Constructor con wizard
  - Configuración de campos
  - Relaciones matemáticas

### **🔧 common/ - Vistas Comunes**
- **Propósito:** Vistas compartidas y de utilidad
- **Vistas:**
  - `NotFound.vue` - Página de error 404
- **Características:**
  - Manejo de errores
  - Navegación de respaldo
  - Diseño consistente

## 🚀 **Próximas Vistas**

### **En Desarrollo:**
- `dashboard/DashboardDetail.vue` - Dashboard específico
- `dashboard/DashboardSettings.vue` - Configuración de dashboard
- `kpi/KPIDetail.vue` - Detalle de KPI
- `kpi/KPIAnalytics.vue` - Análisis de KPI

### **Planificadas:**
- `reports/` - Módulo de reportes
- `settings/` - Configuración del sistema
- `users/` - Gestión de usuarios
- `profile/` - Perfil de usuario

## 🔧 **Configuración de Rutas**

Las rutas están configuradas en `src/router/index.js`:

```javascript
// Rutas de autenticación
'/login' → '@/views/auth/Login.vue'

// Rutas de dashboard
'/dashboard' → '@/views/dashboard/Dashboard.vue'

// Rutas de KPIs
'/kpis' → '@/views/kpi/KPIs.vue'
'/kpis/create' → '@/views/kpi/CreateKPI.vue'
'/kpis/:id/edit' → '@/views/kpi/EditKPI.vue'

// Rutas comunes
'/:pathMatch(.*)*' → '@/views/common/NotFound.vue'
```

## 📝 **Convenciones de Nomenclatura**

### **Archivos:**
- **PascalCase** para nombres de componentes Vue
- **Descriptivo** del propósito de la vista
- **Consistente** con el módulo correspondiente

### **Carpetas:**
- **lowercase** para nombres de módulos
- **Singular** para módulos principales
- **Descriptivo** del dominio funcional

## 🎯 **Beneficios de esta Estructura**

### **Para Desarrolladores:**
- ✅ **Fácil localización** de archivos
- ✅ **Separación clara** de responsabilidades
- ✅ **Escalabilidad** para nuevos módulos
- ✅ **Mantenimiento** simplificado

### **Para el Proyecto:**
- ✅ **Organización profesional**
- ✅ **Estructura estándar** de la industria
- ✅ **Facilita colaboración** en equipo
- ✅ **Preparado para crecimiento**

## 🔄 **Migración Completada**

### **Archivos Movidos:**
- ✅ `Login.vue` → `auth/Login.vue`
- ✅ `Dashboard.vue` → `dashboard/Dashboard.vue`
- ✅ `KPIs.vue` → `kpi/KPIs.vue`
- ✅ `CreateKPI.vue` → `kpi/CreateKPI.vue`
- ✅ `EditKPI.vue` → `kpi/EditKPI.vue`
- ✅ `NotFound.vue` → `common/NotFound.vue`

### **Rutas Actualizadas:**
- ✅ Router configurado con nuevas rutas
- ✅ Imports actualizados
- ✅ Navegación funcional

---

**Última actualización:** Octubre 2024  
**Versión:** 1.0.0
